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
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,14,0.08)_0%,rgba(8,10,14,0.18)_35%,rgba(8,10,14,0.78)_100%)]" />
      <div
        className={cn(
          "absolute inset-x-8 top-8 h-40 rounded-full blur-3xl",
          hasImage && "opacity-40",
        )}
        style={{ background: item.palette.glow }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_28%)]" />
      <div className="relative flex h-full flex-col justify-between p-6 text-white">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/80">
          <span>{item.model === "gpt-image-2" ? "GPT image2" : "Nano Banana"}</span>
          <span>{item.tags[0]}</span>
        </div>
        <div className="space-y-3">
          <div className="max-w-[18rem] rounded-3xl border border-white/15 bg-black/20 p-4 backdrop-blur-md">
            <div className="text-xs uppercase tracking-[0.18em] text-white/65">Prompt focus</div>
            <div className="mt-2 display-font text-2xl font-semibold leading-tight text-balance">
              {item.title.en}
            </div>
          </div>
          <div className="grid max-w-[18rem] grid-cols-2 gap-3">
            {item.tags.slice(0, 4).map((tag) => (
              <div
                key={tag}
                className="rounded-2xl border border-white/12 bg-black/24 px-3 py-2 text-xs text-white/86 backdrop-blur-md"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
