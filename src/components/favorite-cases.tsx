"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createSupabaseBrowserClient,
  hasSupabaseBrowserEnv,
} from "@/lib/supabase-browser";
import { Locale, PromptCase } from "@/lib/types";
import { getCopy } from "@/lib/i18n";
import { CaseCard } from "@/components/case-card";

type FavoriteCasesProps = {
  locale: Locale;
};

export function FavoriteCases({ locale }: FavoriteCasesProps) {
  const [cases, setCases] = useState<PromptCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const t = getCopy(locale);

  const supabase = useMemo(() => {
    if (!hasSupabaseBrowserEnv) {
      return null;
    }
    return createSupabaseBrowserClient();
  }, []);

  useEffect(() => {
    const run = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        setLoading(false);
        return;
      }

      setSignedIn(true);
      const response = await fetch("/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = (await response.json()) as { cases?: PromptCase[] };
      setCases(json.cases ?? []);
      setLoading(false);
    };

    run();
  }, [supabase]);

  if (loading) {
    return <div className="mx-auto mt-8 max-w-6xl text-sm text-[var(--color-muted)]">Loading...</div>;
  }

  if (!hasSupabaseBrowserEnv) {
    return <div className="mx-auto mt-8 max-w-6xl text-sm text-[var(--color-muted)]">{t.favorites.missingConfig}</div>;
  }

  if (!signedIn) {
    return <div className="mx-auto mt-8 max-w-6xl text-sm text-[var(--color-muted)]">{t.favorites.signIn}</div>;
  }

  if (!cases.length) {
    return <div className="mx-auto mt-8 max-w-6xl text-sm text-[var(--color-muted)]">{t.favorites.empty}</div>;
  }

  return (
    <section className="mx-auto mt-8 max-w-6xl">
      <div className="grid gap-4 lg:grid-cols-3">
        {cases.map((item) => (
          <CaseCard key={item.id} locale={locale} item={item} />
        ))}
      </div>
    </section>
  );
}
