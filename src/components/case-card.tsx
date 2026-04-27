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
    <article className="feed-item mb-4 overflow-hidden rounded-[32px] bg-white p-3 shadow-[0_18px_40px_rgba(114,79,92,0.08)]">
      <PromptVisual item={item} compact />
      <div className="space-y-4 p-3 pb-2">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-medium text-[#9d4329]">
            {modelLabel(item.model, locale)}
          </span>
          <span className="text-xs text-[var(--color-muted)]">{formatDate(item.createdAt, locale)}</span>
        </div>
        <div>
          <h3 className="display-font text-xl font-semibold leading-tight">{item.title[locale]}</h3>
          <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{item.summary[locale]}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-[#f8f1ec] px-3 py-1 text-xs text-[var(--color-muted)]">
              #{tag}
            </span>
          ))}
        </div>
        <div className="rounded-[24px] bg-[#fff7f2] p-4 text-sm leading-7 text-[var(--color-muted)]">
          <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#c2714e]">
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
