from __future__ import annotations

import csv
import io
import os
from pathlib import Path
from typing import Dict
from urllib.parse import urlparse

import requests
import xlsxwriter
from PIL import Image


ROOT = Path("/Users/charlie/Desktop/codex project")
INPUT_CSV = ROOT / "data" / "opencoco_prompt_cases_seed.csv"
OUTPUT_XLSX = ROOT / "data" / "opencoco_prompt_cases_with_previews.xlsx"
IMAGE_DIR = ROOT / "data" / "images"


# Best-effort public preview mapping. These are currently available from
# public prompt mirror pages, not guaranteed to be the original X CDN assets.
PREVIEW_IMAGE_URLS: Dict[str, str] = {
    "AFG-001": "https://cdn.createvision.ai/templates/community/community-ultra-realistic-nighttime-car-portrait-with-flash-10766.jpg",
    "AFG-006": "https://cdn.createvision.ai/templates/community/community-high-fashion-magazine-cover-photoshoot-11200.jpg",
}


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def sanitize_ext(url: str) -> str:
    suffix = Path(urlparse(url).path).suffix.lower()
    if suffix in {".jpg", ".jpeg", ".png", ".webp"}:
        return suffix
    return ".jpg"


def fetch_preview(case_id: str, url: str) -> Path | None:
    ensure_dir(IMAGE_DIR)
    target = IMAGE_DIR / f"{case_id}{sanitize_ext(url)}"
    if target.exists():
        return target

    try:
        resp = requests.get(url, timeout=30, headers={"User-Agent": "Mozilla/5.0"})
        resp.raise_for_status()
        target.write_bytes(resp.content)
        return target
    except Exception:
        return None


def image_bytes_for_excel(path: Path) -> bytes | None:
    try:
        with Image.open(path) as img:
            # Convert WEBP and oversized assets into a more Excel-friendly PNG.
            img = img.convert("RGB")
            max_width = 220
            if img.width > max_width:
                ratio = max_width / float(img.width)
                img = img.resize((max_width, int(img.height * ratio)))
            buf = io.BytesIO()
            img.save(buf, format="PNG")
            return buf.getvalue()
    except Exception:
        return None


def main() -> None:
    rows = []
    with INPUT_CSV.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            case_id = row["case_id"]
            preview_url = PREVIEW_IMAGE_URLS.get(case_id, "")
            row["preview_image_url"] = preview_url
            row["preview_source"] = (
                "public prompt mirror"
                if preview_url
                else ""
            )
            rows.append(row)

    workbook = xlsxwriter.Workbook(OUTPUT_XLSX.as_posix())
    sheet = workbook.add_worksheet("prompt_cases")

    header_fmt = workbook.add_format(
        {"bold": True, "bg_color": "#E9EEF7", "border": 1, "text_wrap": True}
    )
    text_fmt = workbook.add_format({"text_wrap": True, "valign": "top", "border": 1})
    url_fmt = workbook.add_format(
        {"font_color": "blue", "underline": 1, "valign": "top", "border": 1}
    )
    note_fmt = workbook.add_format(
        {"italic": True, "font_color": "#666666", "text_wrap": True}
    )

    columns = list(rows[0].keys()) + ["preview_image"]
    for col_idx, name in enumerate(columns):
        sheet.write(0, col_idx, name, header_fmt)

    widths = {
        "source_account": 18,
        "case_id": 12,
        "content_type": 12,
        "character_or_subject": 24,
        "theme": 22,
        "scene": 28,
        "pose_motion": 34,
        "outfit": 32,
        "lighting_camera": 30,
        "negative_constraints": 34,
        "paraphrased_prompt_case": 48,
        "source_url": 36,
        "notes": 28,
        "preview_image_url": 42,
        "preview_source": 20,
        "preview_image": 24,
    }
    for col_idx, name in enumerate(columns):
        sheet.set_column(col_idx, col_idx, widths.get(name, 18))

    sheet.freeze_panes(1, 0)

    for row_idx, row in enumerate(rows, start=1):
        sheet.set_row(row_idx, 130)
        for col_idx, name in enumerate(columns):
            if name == "preview_image":
                preview_url = row.get("preview_image_url", "")
                case_id = row["case_id"]
                if preview_url:
                    downloaded = fetch_preview(case_id, preview_url)
                    if downloaded:
                        image_data = image_bytes_for_excel(downloaded)
                        if image_data:
                            sheet.insert_image(
                                row_idx,
                                col_idx,
                                downloaded.name,
                                {
                                    "image_data": io.BytesIO(image_data),
                                    "x_scale": 1,
                                    "y_scale": 1,
                                    "object_position": 1,
                                },
                            )
                            continue
                sheet.write(row_idx, col_idx, "", text_fmt)
                continue

            value = row.get(name, "")
            if value.startswith("http://") or value.startswith("https://"):
                sheet.write_url(row_idx, col_idx, value, url_fmt, string=value)
            else:
                sheet.write(row_idx, col_idx, value, text_fmt)

    sheet.write(
        len(rows) + 2,
        0,
        "Note: preview_image currently uses best-effort publicly accessible image mirrors where available. "
        "Some rows still need direct tweet URLs or screenshots to attach the exact tweet image.",
        note_fmt,
    )

    workbook.close()
    print(f"Wrote {OUTPUT_XLSX}")


if __name__ == "__main__":
    main()
