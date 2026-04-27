import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { FavoriteButton } from "@/components/favorite-button";
import { PromptVisual } from "@/components/prompt-visual";
import { getCopy } from "@/lib/i18n";
import { Locale, PromptCase } from "@/lib/types";
import { formatDate, modelLabel } from "@/lib/utils";

type CaseCardProps = {
  locale: Locale;
  item: PromptCase;
};

export function CaseCard({ locale, item }: CaseCardProps) {
  const t = getCopy(locale);

  return (
    <article className="feed-item mb-3 overflow-hidden rounded-[28px] border border-black/8 bg-white p-2.5 shadow-[0_12px_28px_rgba(0,0,0,0.06)]">
      <PromptVisual item={item} compact />
      <div className="space-y-3 p-2.5 pb-2">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-black/8 bg-black/4 px-3 py-1 text-[11px] font-medium text-black/78">
            {modelLabel(item.model, locale)}
          </span>
          <span className="text-xs text-[var(--color-muted)]">{formatDate(item.createdAt, locale)}</span>
        </div>
        <div>
          <h3 className="display-font text-lg font-semibold leading-tight">{item.title[locale]}</h3>
          <p className="mt-1.5 text-sm leading-6 text-[var(--color-muted)]">{item.summary[locale]}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-black/7 bg-black/3 px-2.5 py-1 text-[11px] text-[var(--color-muted)]">
              #{tag}
            </span>
          ))}
        </div>
        <div className="rounded-[22px] border border-black/7 bg-[#fafaf8] p-3.5 text-sm leading-6 text-[var(--color-muted)]">
          <div className="mb-2 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-black/45">
            <Sparkles className="size-4" />
            Prompt
          </div>
          <p className="line-clamp-4">{item.prompt[locale]}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <FavoriteButton
            caseId={item.id}
            locale={locale}
            labels={{
              idle: t.cards.favorite,
              active: t.cards.saved,
              hint: t.detail.favoritesHint,
            }}
          />
          <Link
            href={`/${locale}/cases/${item.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm text-white"
          >
            {t.cards.viewCase}
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
