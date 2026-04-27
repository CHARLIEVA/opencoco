import { FavoriteCases } from "@/components/favorite-cases";
import { getCopy } from "@/lib/i18n";
import { Locale } from "@/lib/types";

type FavoritesPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function FavoritesPage({ params }: FavoritesPageProps) {
  const { locale } = await params;
  const t = getCopy(locale);

  return (
    <div className="px-4 pb-10 md:px-8">
      <section className="mx-auto max-w-6xl rounded-[36px] bg-white p-6 shadow-[0_18px_40px_rgba(114,79,92,0.08)] md:p-8">
        <h1 className="display-font text-4xl font-semibold">{t.favorites.title}</h1>
        <p className="mt-3 max-w-3xl text-[var(--color-muted)]">{t.favorites.body}</p>
      </section>
      <FavoriteCases locale={locale} />
    </div>
  );
}
