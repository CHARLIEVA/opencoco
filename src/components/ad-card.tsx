import { Megaphone } from "lucide-react";
import { getCopy } from "@/lib/i18n";
import { Locale } from "@/lib/types";

type AdCardProps = {
  locale: Locale;
};

export function AdCard({ locale }: AdCardProps) {
  const t = getCopy(locale);

  return (
    <aside className="feed-item mb-3 overflow-hidden rounded-[28px] border border-dashed border-black/12 bg-[linear-gradient(180deg,#ffffff_0%,#f6f6f2_100%)] p-4 shadow-[0_12px_28px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between">
        <span className="rounded-full border border-black/10 bg-black/4 px-3 py-1 text-xs text-black/72">Ad</span>
        <Megaphone className="size-5 text-black/62" />
      </div>
      <div className="mt-5 space-y-3">
        <h3 className="display-font text-2xl font-semibold">{t.cards.adTitle}</h3>
        <p className="text-sm leading-7 text-[var(--color-muted)]">{t.cards.adBody}</p>
        <div className="rounded-[22px] border border-black/8 bg-[#fafaf8] p-4 text-sm text-[var(--color-muted)]">
          {t.cards.adCta}
        </div>
      </div>
    </aside>
  );
}
