import { Megaphone } from "lucide-react";
import { getCopy } from "@/lib/i18n";
import { Locale } from "@/lib/types";

type AdCardProps = {
  locale: Locale;
};

export function AdCard({ locale }: AdCardProps) {
  const t = getCopy(locale);

  return (
    <aside className="feed-item mb-4 overflow-hidden rounded-[32px] border border-dashed border-white/14 bg-[linear-gradient(180deg,#12141a_0%,#0d0f14_100%)] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.26)]">
      <div className="flex items-center justify-between">
        <span className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs text-white/78">Ad</span>
        <Megaphone className="size-5 text-white/68" />
      </div>
      <div className="mt-5 space-y-3">
        <h3 className="display-font text-2xl font-semibold">{t.cards.adTitle}</h3>
        <p className="text-sm leading-7 text-[var(--color-muted)]">{t.cards.adBody}</p>
        <div className="rounded-[24px] border border-white/8 bg-white/5 p-4 text-sm text-[var(--color-muted)]">
          {t.cards.adCta}
        </div>
      </div>
    </aside>
  );
}
