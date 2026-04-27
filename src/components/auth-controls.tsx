"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Sparkles, Star } from "lucide-react";
import {
  createSupabaseBrowserClient,
  hasSupabaseBrowserEnv,
} from "@/lib/supabase-browser";
import { Locale } from "@/lib/types";

type AuthControlsProps = {
  locale: Locale;
  labels: {
    favorites: string;
  };
};

export function AuthControls({ locale, labels }: AuthControlsProps) {
  const [email, setEmail] = useState<string | null>(null);
  const supabase = useMemo(() => {
    if (!hasSupabaseBrowserEnv) {
      return null;
    }

    return createSupabaseBrowserClient();
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) {
        setEmail(data.user?.email ?? null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/${locale}/favorites`,
      },
    });
  };

  const signOut = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
  };

  if (!hasSupabaseBrowserEnv) {
    return (
      <Link
        href={`/${locale}/favorites`}
        className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-[var(--color-muted)] hover:text-white"
      >
        <Star className="size-4" />
        {labels.favorites}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/${locale}/favorites`}
        className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-[var(--color-muted)] hover:text-white"
      >
        <Star className="size-4" />
        {labels.favorites}
      </Link>
      {email ? (
        <button
          type="button"
          onClick={signOut}
          className="glass-card rounded-full px-4 py-2 text-sm text-[var(--color-muted)] hover:text-white"
        >
          {email}
        </button>
      ) : (
        <button
          type="button"
          onClick={signIn}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-[#0c0f14]"
        >
          <Sparkles className="size-4" />
          Google
        </button>
      )}
    </div>
  );
}
