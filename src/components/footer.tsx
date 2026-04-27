import { getCopy } from "@/lib/i18n";
import { Locale } from "@/lib/types";

export function Footer({ locale }: { locale: Locale }) {
  const t = getCopy(locale);

  return (
    <footer className="px-4 pb-10 pt-4 md:px-8">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-[var(--color-line)] bg-white/70 px-6 py-6 text-sm leading-7 text-[var(--color-muted)]">
        {t.footer}
      </div>
    </footer>
  );
}
