"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart } from "lucide-react";
import {
  createSupabaseBrowserClient,
  hasSupabaseBrowserEnv,
} from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  caseId: string;
  locale: "en" | "zh";
  labels: {
    idle: string;
    active: string;
    hint: string;
  };
};

export function FavoriteButton({ caseId, labels }: FavoriteButtonProps) {
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(!hasSupabaseBrowserEnv);
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

    let mounted = true;
    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        if (mounted) {
          setReady(true);
        }
        return;
      }

      const response = await fetch("/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = (await response.json()) as { ids?: string[] };
      if (mounted) {
        setSaved(Boolean(json.ids?.includes(caseId)));
        setReady(true);
      }
    };

    bootstrap();
    return () => {
      mounted = false;
    };
  }, [caseId, supabase]);

  const toggleFavorite = async () => {
    if (!supabase) {
      window.alert(labels.hint);
      return;
    }

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (!token) {
      window.alert(labels.hint);
      return;
    }

    const response = await fetch("/api/favorites", {
      method: saved ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ caseId }),
    });

    if (response.ok) {
      setSaved((current) => !current);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      disabled={!ready}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition",
        saved
          ? "bg-[var(--color-ink)] text-white"
          : "border border-black/8 bg-white text-[var(--color-muted)] hover:bg-black/4 hover:text-black",
      )}
    >
      <Heart className={cn("size-4", saved && "fill-current")} />
      {saved ? labels.active : labels.idle}
    </button>
  );
}
