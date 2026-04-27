import Link from "next/link";
import { ArrowRight, Sparkles, Wand2 } from "lucide-react";
import { FeedGrid } from "@/components/feed-grid";
import { listCases, listFeaturedCases } from "@/lib/case-store";
import { getCopy } from "@/lib/i18n";
import { Locale } from "@/lib/types";

type HomePageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const t = getCopy(locale);
  const [featured, allCases] = await Promise.all([listFeaturedCases(6), listCases()]);

  return (
    <div className="px-4 pb-10 md:px-8">
      <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.22fr_0.78fr]">
        <div className="glass-card rounded-[36px] p-6 md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/70">
            <Sparkles className="size-4" />
            {t.heroEyebrow}
          </div>
          <h1 className="display-font mt-6 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
            {t.heroTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-muted)] md:text-lg">
            {t.heroBody}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/cases`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm text-[#090b10]"
            >
              {t.heroPrimary}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={`/${locale}/admin`}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm text-white/88"
            >
              <Wand2 className="size-4" />
              {t.heroSecondary}
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {t.stats.map((item, index) => (
            <div
              key={item.label}
              className={`rounded-[32px] border border-white/8 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.24)] ${
                index === 0 ? "bg-[#111319]" : index === 1 ? "bg-[#131723]" : "bg-[#10141b]"
              }`}
            >
              <div className="text-sm text-[var(--color-muted)]">{item.label}</div>
              <div className="display-font mt-6 text-4xl font-semibold">{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-6xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="display-font text-2xl font-semibold">{t.sections.featured}</h2>
          <Link href={`/${locale}/cases`} className="text-sm text-[var(--color-muted)]">
            {t.heroPrimary}
          </Link>
        </div>
        <FeedGrid locale={locale} items={featured.length ? featured : allCases.slice(0, 6)} />
      </section>
    </div>
  );
}
