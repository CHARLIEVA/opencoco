import { PromptCase } from "@/lib/types";
import { cn } from "@/lib/utils";

type PromptVisualProps = {
  item: PromptCase;
  compact?: boolean;
};

export function PromptVisual({ item, compact = false }: PromptVisualProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px]",
        compact ? "h-60" : "h-80 md:h-[26rem]",
      )}
      style={{
        background: `linear-gradient(135deg, ${item.palette.from}, ${item.palette.via}, ${item.palette.to})`,
      }}
    >
      <div
        className="absolute inset-x-8 top-8 h-40 rounded-full blur-3xl"
        style={{ background: item.palette.glow }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.38),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.18),transparent_28%)]" />
      <div className="relative flex h-full flex-col justify-between p-6 text-white">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/80">
          <span>{item.model === "gpt-image-2" ? "GPT image2" : "Nano Banana"}</span>
          <span>{item.tags[0]}</span>
        </div>
        <div className="space-y-3">
          <div className="max-w-[16rem] rounded-3xl bg-white/18 p-4 backdrop-blur">
            <div className="text-xs uppercase tracking-[0.18em] text-white/75">Prompt focus</div>
            <div className="mt-2 display-font text-2xl font-semibold leading-tight">
              {item.tags.slice(0, 2).join(" / ")}
            </div>
          </div>
          <div className="grid max-w-[18rem] grid-cols-2 gap-3">
            {item.tags.slice(0, 4).map((tag) => (
              <div key={tag} className="rounded-2xl bg-black/18 px-3 py-2 text-xs backdrop-blur">
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
