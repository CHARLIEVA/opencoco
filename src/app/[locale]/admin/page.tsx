import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminPanel } from "@/components/admin-panel";
import { getAdminSession } from "@/lib/admin-auth";
import { listCases } from "@/lib/case-store";
import { getCopy } from "@/lib/i18n";
import { Locale } from "@/lib/types";

type AdminPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;
  const session = await getAdminSession();

  if (!session) {
    redirect(`/${locale}/admin/login`);
  }

  const t = getCopy(locale);
  const cases = await listCases();

  return (
    <div className="px-4 pb-10 md:px-8">
      <section className="mx-auto mb-6 flex max-w-6xl items-center justify-between rounded-[36px] bg-white p-6 shadow-[0_18px_40px_rgba(114,79,92,0.08)]">
        <div>
          <h1 className="display-font text-4xl font-semibold">{t.admin.dashboard}</h1>
          <p className="mt-3 text-[var(--color-muted)]">{t.admin.dashboardBody}</p>
        </div>
        <form action="/api/admin/logout" method="post">
          <input type="hidden" name="locale" value={locale} />
          <button type="submit" className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm">
            {t.admin.logout}
          </button>
        </form>
      </section>
      <section className="mx-auto max-w-6xl">
        <AdminPanel locale={locale} cases={cases} />
        <div className="mt-4 text-sm text-[var(--color-muted)]">
          <Link href={`/${locale}/cases`}>Preview public feed</Link>
        </div>
      </section>
    </div>
  );
}
