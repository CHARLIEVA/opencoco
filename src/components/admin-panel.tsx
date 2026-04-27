"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Locale, PromptCase } from "@/lib/types";
import { getCopy } from "@/lib/i18n";

type AdminPanelProps = {
  locale: Locale;
  cases: PromptCase[];
};

const blankForm = {
  id: "",
  slug: "",
  model: "gpt-image-2",
  titleEn: "",
  titleZh: "",
  summaryEn: "",
  summaryZh: "",
  promptEn: "",
  promptZh: "",
  takeawaysEn: "",
  takeawaysZh: "",
  tags: "",
  sourceName: "",
  sourceUrl: "",
  author: "",
  featured: true,
  paletteFrom: "#24132d",
  paletteVia: "#7b3c83",
  paletteTo: "#f6a86b",
  paletteGlow: "rgba(255, 133, 113, 0.42)",
};

export function AdminPanel({ locale, cases }: AdminPanelProps) {
  const router = useRouter();
  const t = getCopy(locale);
  const [form, setForm] = useState(blankForm);
  const [submitting, setSubmitting] = useState(false);

  const sortedCases = useMemo(
    () => [...cases].sort((a, b) => a.title[locale].localeCompare(b.title[locale])),
    [cases, locale],
  );

  const hydrateForm = (item: PromptCase) => {
    setForm({
      id: item.id,
      slug: item.slug,
      model: item.model,
      titleEn: item.title.en,
      titleZh: item.title.zh,
      summaryEn: item.summary.en,
      summaryZh: item.summary.zh,
      promptEn: item.prompt.en,
      promptZh: item.prompt.zh,
      takeawaysEn: item.takeaways.en.join("\n"),
      takeawaysZh: item.takeaways.zh.join("\n"),
      tags: item.tags.join(", "),
      sourceName: item.sourceName,
      sourceUrl: item.sourceUrl,
      author: item.author,
      featured: item.featured,
      paletteFrom: item.palette.from,
      paletteVia: item.palette.via,
      paletteTo: item.palette.to,
      paletteGlow: item.palette.glow,
    });
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const response = await fetch("/api/admin/cases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setSubmitting(false);
    if (response.ok) {
      setForm(blankForm);
      router.refresh();
    }
  };

  const remove = async (id: string) => {
    const response = await fetch(`/api/admin/cases/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      if (form.id === id) {
        setForm(blankForm);
      }
      router.refresh();
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={submit} className="space-y-4 rounded-[32px] bg-white p-6 shadow-[0_18px_40px_rgba(114,79,92,0.08)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="display-font text-2xl font-semibold">
              {form.id ? `${t.admin.editing}: ${form.titleZh || form.titleEn}` : t.admin.create}
            </h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{t.admin.dashboardBody}</p>
          </div>
          <button
            type="button"
            onClick={() => setForm(blankForm)}
            className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm"
          >
            Reset
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input value={form.titleZh} onChange={(e) => setForm((s) => ({ ...s, titleZh: e.target.value }))} placeholder="标题（中文）" className="rounded-2xl border border-[var(--color-line)] px-4 py-3" />
          <input value={form.titleEn} onChange={(e) => setForm((s) => ({ ...s, titleEn: e.target.value }))} placeholder="Title (English)" className="rounded-2xl border border-[var(--color-line)] px-4 py-3" />
          <select value={form.model} onChange={(e) => setForm((s) => ({ ...s, model: e.target.value as PromptCase["model"] }))} className="rounded-2xl border border-[var(--color-line)] px-4 py-3">
            <option value="gpt-image-2">GPT image2</option>
            <option value="nano-banana">Nano Banana</option>
          </select>
          <input value={form.slug} onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))} placeholder="slug（可留空自动生成）" className="rounded-2xl border border-[var(--color-line)] px-4 py-3" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <textarea value={form.summaryZh} onChange={(e) => setForm((s) => ({ ...s, summaryZh: e.target.value }))} placeholder="案例简介（中文）" rows={4} className="rounded-2xl border border-[var(--color-line)] px-4 py-3" />
          <textarea value={form.summaryEn} onChange={(e) => setForm((s) => ({ ...s, summaryEn: e.target.value }))} placeholder="Summary (English)" rows={4} className="rounded-2xl border border-[var(--color-line)] px-4 py-3" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <textarea value={form.promptZh} onChange={(e) => setForm((s) => ({ ...s, promptZh: e.target.value }))} placeholder="提示词（中文）" rows={7} className="rounded-2xl border border-[var(--color-line)] px-4 py-3" />
          <textarea value={form.promptEn} onChange={(e) => setForm((s) => ({ ...s, promptEn: e.target.value }))} placeholder="Prompt (English)" rows={7} className="rounded-2xl border border-[var(--color-line)] px-4 py-3" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <textarea value={form.takeawaysZh} onChange={(e) => setForm((s) => ({ ...s, takeawaysZh: e.target.value }))} placeholder="为什么有效（中文，每行一条）" rows={5} className="rounded-2xl border border-[var(--color-line)] px-4 py-3" />
          <textarea value={form.takeawaysEn} onChange={(e) => setForm((s) => ({ ...s, takeawaysEn: e.target.value }))} placeholder="Why it works (English, one line each)" rows={5} className="rounded-2xl border border-[var(--color-line)] px-4 py-3" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input value={form.tags} onChange={(e) => setForm((s) => ({ ...s, tags: e.target.value }))} placeholder="tags，逗号分隔" className="rounded-2xl border border-[var(--color-line)] px-4 py-3" />
          <input value={form.author} onChange={(e) => setForm((s) => ({ ...s, author: e.target.value }))} placeholder="采集来源作者" className="rounded-2xl border border-[var(--color-line)] px-4 py-3" />
          <input value={form.sourceName} onChange={(e) => setForm((s) => ({ ...s, sourceName: e.target.value }))} placeholder="来源名" className="rounded-2xl border border-[var(--color-line)] px-4 py-3" />
          <input value={form.sourceUrl} onChange={(e) => setForm((s) => ({ ...s, sourceUrl: e.target.value }))} placeholder="来源链接" className="rounded-2xl border border-[var(--color-line)] px-4 py-3" />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <input value={form.paletteFrom} onChange={(e) => setForm((s) => ({ ...s, paletteFrom: e.target.value }))} placeholder="from" className="rounded-2xl border border-[var(--color-line)] px-4 py-3" />
          <input value={form.paletteVia} onChange={(e) => setForm((s) => ({ ...s, paletteVia: e.target.value }))} placeholder="via" className="rounded-2xl border border-[var(--color-line)] px-4 py-3" />
          <input value={form.paletteTo} onChange={(e) => setForm((s) => ({ ...s, paletteTo: e.target.value }))} placeholder="to" className="rounded-2xl border border-[var(--color-line)] px-4 py-3" />
          <input value={form.paletteGlow} onChange={(e) => setForm((s) => ({ ...s, paletteGlow: e.target.value }))} placeholder="glow rgba" className="rounded-2xl border border-[var(--color-line)] px-4 py-3" />
        </div>

        <label className="inline-flex items-center gap-3 text-sm text-[var(--color-muted)]">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((s) => ({ ...s, featured: e.target.checked }))}
          />
          Featured
        </label>

        <button type="submit" disabled={submitting} className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm text-white">
          {submitting ? "Saving..." : t.admin.save}
        </button>
      </form>

      <div className="rounded-[32px] bg-white p-6 shadow-[0_18px_40px_rgba(114,79,92,0.08)]">
        <h2 className="display-font text-2xl font-semibold">{t.admin.dashboard}</h2>
        <div className="mt-5 space-y-3">
          {sortedCases.map((item) => (
            <div key={item.id} className="rounded-[24px] border border-[var(--color-line)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{item.title[locale]}</div>
                  <div className="mt-1 text-sm text-[var(--color-muted)]">{item.model}</div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => hydrateForm(item)} className="rounded-full border border-[var(--color-line)] px-3 py-1.5 text-sm">
                    Edit
                  </button>
                  <button type="button" onClick={() => remove(item.id)} className="rounded-full bg-[#fff0ea] px-3 py-1.5 text-sm text-[#a64b27]">
                    {t.admin.delete}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
