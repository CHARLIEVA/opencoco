import { AdCard } from "@/components/ad-card";
import { CaseCard } from "@/components/case-card";
import { Locale, PromptCase } from "@/lib/types";
import { injectAdCards } from "@/lib/utils";

type FeedGridProps = {
  locale: Locale;
  items: PromptCase[];
};

export function FeedGrid({ locale, items }: FeedGridProps) {
  const feed = injectAdCards(items, 4);

  return (
    <div className="feed-grid">
      {feed.map((entry) =>
        entry.kind === "case" ? (
          <CaseCard key={entry.item.id} locale={locale} item={entry.item} />
        ) : (
          <AdCard key={entry.id} locale={locale} />
        ),
      )}
    </div>
  );
}
