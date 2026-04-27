import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { CaseCard } from "@/components/case-card";
import { FavoriteButton } from "@/components/favorite-button";
import { PromptVisual } from "@/components/prompt-visual";
import { getCaseBySlug, listRelatedCases } from "@/lib/case-store";
import { getCopy } from "@/lib/i18n";
import { Locale } from "@/lib/types";
import { formatDate, modelLabel } from "@/lib/utils";

type CaseDetailProps = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export async function generateMetadata({
  params,
}: CaseDetailProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getCaseBySlug(slug);

  if (!item) {
    return {};
  }

  return {
    title: item.title[locale],
    description: item.summary[locale],
  };
}

export default async function CaseDetailPage({ params }: CaseDetailProps) {
  const { locale, slug } = await params;
  const item = await getCaseBySlug(slug);

  if (!item) {
    notFound();
  }

  const t = getCopy(locale);
  const related = await listRelatedCases(item, 3);

  return (
    <div className="px-4 pb-10 md:px-8">
      <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_0.92fr]">
        <div className="space-y-6">
          <PromptVisual item={item} />
          <div className="rounded-[32px] bg-white p-6 shadow-[0_18px_40px_rgba(114,79,92,0.08)]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-medium text-[#9d4329]">
                {modelLabel(item.model, locale)}
              </span>
              {item.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-[#f8f1ec] px-3 py-1 text-xs text-[var(--color-muted)]">
                  #{tag}
                </span>
              ))}
            </div>
            <h1 className="display-font mt-5 text-4xl font-semibold leading-tight">
              {item.title[locale]}
            </h1>
            <p className="mt-4 text-lg leading-8 text-[var(--color-muted)]">{item.summary[locale]}</p>
            <div className="mt-6">
              <FavoriteButton
                caseId={item.id}
                locale={locale}
                labels={{
                  idle: t.cards.favorite,
                  active: t.cards.saved,
                  hint: t.detail.favoritesHint,
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_40px_rgba(114,79,92,0.08)]">
            <h2 className="display-font text-2xl font-semibold">{t.detail.prompt}</h2>
            <p className="mt-4 whitespace-pre-wrap rounded-[24px] bg-[#fff8f4] p-5 text-sm leading-8 text-[var(--color-muted)]">
              {item.prompt[locale]}
            </p>
          </section>

          <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_40px_rgba(114,79,92,0.08)]">
            <h2 className="display-font text-2xl font-semibold">{t.detail.takeaways}</h2>
            <div className="mt-4 space-y-3">
              {item.takeaways[locale].map((note) => (
                <div key={note} className="rounded-[22px] bg-[#fff8f4] p-4 text-sm leading-7 text-[var(--color-muted)]">
                  {note}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_40px_rgba(114,79,92,0.08)]">
            <h2 className="display-font text-2xl font-semibold">{t.detail.metadata}</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--color-muted)]">
              <div>
                <div className="text-xs uppercase tracking-[0.16em]">{t.detail.model}</div>
                <div>{modelLabel(item.model, locale)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.16em]">{t.detail.author}</div>
                <div>{item.author}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.16em]">{t.detail.source}</div>
                <Link href={item.sourceUrl} target="_blank" className="inline-flex items-center gap-2 text-[var(--color-ink)]">
                  {item.sourceName}
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.16em]">Date</div>
                <div>{formatDate(item.createdAt, locale)}</div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-6xl">
        <h2 className="display-font mb-4 text-2xl font-semibold">{t.sections.related}</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {related.map((relatedItem) => (
            <CaseCard key={relatedItem.id} locale={locale} item={relatedItem} />
          ))}
        </div>
      </section>
    </div>
  );
}
