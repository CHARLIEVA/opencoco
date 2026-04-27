import Link from "next/link";
import { FeedGrid } from "@/components/feed-grid";
import { filterCases, listCases } from "@/lib/case-store";
import { getCopy } from "@/lib/i18n";
import { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

type CasesPageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ q?: string; model?: string }>;
};

export default async function CasesPage({
  params,
  searchParams,
}: CasesPageProps) {
  const { locale } = await params;
  const { q, model } = await searchParams;
  const t = getCopy(locale);
  const cases = filterCases(await listCases(), locale, q, model);

  const chips = [
    { key: "all", label: t.filters.all },
    { key: "gpt-image-2", label: t.filters.gpt },
    { key: "nano-banana", label: t.filters.nano },
  ];

  return (
    <div className="px-4 pb-10 md:px-8">
      <section className="mx-auto max-w-6xl rounded-[36px] bg-white p-6 shadow-[0_18px_40px_rgba(114,79,92,0.08)] md:p-8">
        <h1 className="display-font text-4xl font-semibold">{t.nav.cases}</h1>
        <p className="mt-3 max-w-3xl text-[var(--color-muted)]">{t.heroBody}</p>
        <form className="mt-6 flex flex-col gap-4 md:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder={t.filters.searchPlaceholder}
            className="min-w-0 flex-1 rounded-full border border-[var(--color-line)] px-5 py-3"
          />
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <Link
                key={chip.key}
                href={`/${locale}/cases?model=${chip.key}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className={cn(
                  "rounded-full px-4 py-3 text-sm",
                  (model ?? "all") === chip.key
                    ? "bg-[var(--color-ink)] text-white"
                    : "border border-[var(--color-line)] bg-white text-[var(--color-muted)]",
                )}
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </form>
      </section>

      <section className="mx-auto mt-8 max-w-6xl">
        <FeedGrid locale={locale} items={cases} />
      </section>
    </div>
  );
}
