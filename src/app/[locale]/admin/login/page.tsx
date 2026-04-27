import { getCopy } from "@/lib/i18n";
import { Locale } from "@/lib/types";

type AdminLoginProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function AdminLoginPage({ params }: AdminLoginProps) {
  const { locale } = await params;
  const t = getCopy(locale);

  return (
    <div className="px-4 pb-10 md:px-8">
      <section className="mx-auto max-w-xl rounded-[36px] bg-white p-8 shadow-[0_18px_40px_rgba(114,79,92,0.08)]">
        <h1 className="display-font text-4xl font-semibold">{t.admin.loginTitle}</h1>
        <p className="mt-3 text-[var(--color-muted)]">{t.admin.loginBody}</p>
        <form action="/api/admin/login" method="post" className="mt-6 space-y-4">
          <input type="hidden" name="locale" value={locale} />
          <input
            name="username"
            placeholder={t.admin.username}
            className="w-full rounded-2xl border border-[var(--color-line)] px-4 py-3"
          />
          <input
            name="password"
            type="password"
            placeholder={t.admin.password}
            className="w-full rounded-2xl border border-[var(--color-line)] px-4 py-3"
          />
          <button type="submit" className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm text-white">
            {t.admin.submit}
          </button>
        </form>
      </section>
    </div>
  );
}
