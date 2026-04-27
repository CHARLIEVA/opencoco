import Image from "next/image";
import { PromptCase } from "@/lib/types";
import { cn } from "@/lib/utils";

type PromptVisualProps = {
  item: PromptCase;
  compact?: boolean;
};

export function PromptVisual({ item, compact = false }: PromptVisualProps) {
  const hasImage = Boolean(item.image?.src);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px]",
        compact ? "h-60" : "h-80 md:h-[26rem]",
      )}
      style={
        hasImage
          ? undefined
          : {
              background: `linear-gradient(135deg, ${item.palette.from}, ${item.palette.via}, ${item.palette.to})`,
            }
      }
    >
      {item.image ? (
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          className="object-cover"
          sizes={compact ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 60vw"}
        />
      ) : null}
      {!hasImage ? (
        <>
          <div
            className="absolute inset-x-8 top-8 h-40 rounded-full blur-3xl"
            style={{ background: item.palette.glow }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_28%)]" />
          <div className="relative flex h-full items-end p-5 text-white">
            <div className="rounded-2xl bg-black/20 px-3 py-2 text-xs backdrop-blur-sm">
              {item.model === "gpt-image-2" ? "GPT image2" : "Nano Banana"}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
