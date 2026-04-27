import { Megaphone } from "lucide-react";
import { getCopy } from "@/lib/i18n";
import { Locale } from "@/lib/types";

type AdCardProps = {
  locale: Locale;
};

export function AdCard({ locale }: AdCardProps) {
  const t = getCopy(locale);

  return (
    <aside className="feed-item mb-4 overflow-hidden rounded-[32px] border border-dashed border-[var(--color-line)] bg-[linear-gradient(180deg,#fff9f6_0%,#ffe8e0_100%)] p-5 shadow-[0_18px_40px_rgba(114,79,92,0.06)]">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-white px-3 py-1 text-xs text-[#c45f3b]">Ad</span>
        <Megaphone className="size-5 text-[#c45f3b]" />
      </div>
      <div className="mt-5 space-y-3">
        <h3 className="display-font text-2xl font-semibold">{t.cards.adTitle}</h3>
        <p className="text-sm leading-7 text-[var(--color-muted)]">{t.cards.adBody}</p>
        <div className="rounded-[24px] bg-white/80 p-4 text-sm text-[var(--color-muted)]">
          {t.cards.adCta}
        </div>
      </div>
    </aside>
  );
}
