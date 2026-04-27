import { clsx } from "clsx";
import { Locale, ModelKind, PromptCase } from "@/lib/types";

export const cn = (...values: Array<string | false | null | undefined>) =>
  clsx(values);

export const formatDate = (date: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));

export const modelLabel = (model: ModelKind, locale: Locale) => {
  if (model === "gpt-image-2") {
    return locale === "zh" ? "GPT image2" : "GPT image2";
  }

  return "Nano Banana";
};

export const slugify = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

export type FeedItem =
  | { kind: "case"; item: PromptCase }
  | { kind: "ad"; id: string };

export const injectAdCards = (cases: PromptCase[], step = 5): FeedItem[] => {
  const items: FeedItem[] = [];

  cases.forEach((item, index) => {
    items.push({ kind: "case", item });
    if ((index + 1) % step === 0) {
      items.push({ kind: "ad", id: `ad-${index}` });
    }
  });

  return items;
};

export const parseListText = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
