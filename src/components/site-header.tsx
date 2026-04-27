import Link from "next/link";
import { getCopy } from "@/lib/i18n";
import { Locale } from "@/lib/types";
import { AuthControls } from "@/components/auth-controls";
import { LocaleSwitcher } from "@/components/locale-switcher";

type SiteHeaderProps = {
  locale: Locale;
};

export function SiteHeader({ locale }: SiteHeaderProps) {
  const t = getCopy(locale);

  return (
    <header className="sticky top-0 z-20 px-4 py-4 md:px-8">
      <div className="glass-card mx-auto flex max-w-6xl items-center justify-between rounded-[28px] px-4 py-3 md:px-6">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--color-ink)] text-sm font-semibold text-white">
            OC
          </div>
          <div>
            <div className="display-font text-lg font-semibold">{t.siteName}</div>
            <div className="text-xs text-[var(--color-muted)]">{t.tagline}</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-[var(--color-muted)] md:flex">
          <Link href={`/${locale}`}>{t.nav.home}</Link>
          <Link href={`/${locale}/cases`}>{t.nav.cases}</Link>
          <Link href={`/${locale}/favorites`}>{t.nav.favorites}</Link>
          <Link href={`/${locale}/admin`}>{t.nav.admin}</Link>
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitcher locale={locale} />
          <AuthControls locale={locale} labels={{ favorites: t.nav.favorites }} />
        </div>
      </div>
    </header>
  );
}
