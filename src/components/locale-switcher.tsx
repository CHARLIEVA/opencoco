"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = {
  locale: Locale;
};

export function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
  const pathname = usePathname();

  const getTarget = (nextLocale: Locale) => {
    const segments = pathname.split("/");
    if (segments[1] === "en" || segments[1] === "zh") {
      segments[1] = nextLocale;
    }
    return segments.join("/");
  };

  return (
    <div className="glass-card flex items-center gap-1 rounded-full p-1 text-xs">
      {(["zh", "en"] as const).map((item) => (
        <Link
          key={item}
          href={getTarget(item)}
          className={cn(
            "rounded-full px-3 py-1.5 transition",
            item === locale
              ? "bg-[var(--color-ink)] text-white"
              : "text-[var(--color-muted)] hover:bg-white/70",
          )}
        >
          {item === "zh" ? "中" : "EN"}
        </Link>
      ))}
    </div>
  );
}
