import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { caseMedia } from "@/data/case-media";
import { AdminCaseInput, Locale, PromptCase } from "@/lib/types";
import {
  createSupabaseServiceRoleClient,
  hasSupabaseServerEnv,
} from "@/lib/supabase-server";
import { parseListText, slugify } from "@/lib/utils";

const localCasesPath = path.join(process.cwd(), "src/data/local-cases.json");

const sortCases = (items: PromptCase[]) =>
  [...items].sort((a, b) => {
    if (a.featured !== b.featured) {
      return Number(b.featured) - Number(a.featured);
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

const readLocalCases = async () => {
  const raw = await fs.readFile(localCasesPath, "utf8");
  const parsed = JSON.parse(raw) as PromptCase[];
  return sortCases(
    parsed.map((item) => ({
      ...item,
      image: caseMedia[item.id] ?? item.image,
    })),
  );
};

const writeLocalCases = async (items: PromptCase[]) => {
  await fs.writeFile(localCasesPath, `${JSON.stringify(sortCases(items), null, 2)}\n`);
};

const normalizeSupabaseRow = (row: Record<string, unknown>): PromptCase => ({
  id: String(row.id),
  slug: String(row.slug),
  model: row.model as PromptCase["model"],
  title: row.title as PromptCase["title"],
  summary: row.summary as PromptCase["summary"],
  prompt: row.prompt as PromptCase["prompt"],
  takeaways: row.takeaways as PromptCase["takeaways"],
  tags: row.tags as string[],
  sourceName: String(row.source_name),
  sourceUrl: String(row.source_url),
  author: String(row.author),
  featured: Boolean(row.featured),
  createdAt: String(row.created_at),
  palette: row.palette as PromptCase["palette"],
});

export const listCases = async () => {
  if (hasSupabaseServerEnv) {
    const client = createSupabaseServiceRoleClient();
    const { data, error } = await client.from("cases").select("*");
    if (error) {
      throw new Error(error.message);
    }
    return sortCases((data ?? []).map(normalizeSupabaseRow));
  }

  return readLocalCases();
};

export const listFeaturedCases = async (limit = 6) => {
  const items = await listCases();
  return items.filter((item) => item.featured).slice(0, limit);
};

export const getCaseBySlug = async (slug: string) => {
  const items = await listCases();
  return items.find((item) => item.slug === slug) ?? null;
};

export const listRelatedCases = async (target: PromptCase, limit = 3) => {
  const items = await listCases();
  return items
    .filter((item) => item.id !== target.id && item.model === target.model)
    .slice(0, limit);
};

export const filterCases = (
  items: PromptCase[],
  locale: Locale,
  query?: string,
  model?: string,
) => {
  const normalizedQuery = query?.trim().toLowerCase();
  return items.filter((item) => {
    const matchesModel = !model || model === "all" || item.model === model;

    if (!matchesModel) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const blob = [
      item.title[locale],
      item.summary[locale],
      item.prompt[locale],
      item.tags.join(" "),
      item.title.en,
      item.title.zh,
    ]
      .join(" ")
      .toLowerCase();

    return blob.includes(normalizedQuery);
  });
};

const buildCaseRecord = (input: AdminCaseInput): PromptCase => {
  const id = input.id || randomUUID();
  const baseSlug = input.slug?.trim() || slugify(input.titleEn || input.titleZh || id);

  return {
    id,
    slug: baseSlug,
    model: input.model,
    title: { en: input.titleEn.trim(), zh: input.titleZh.trim() },
    summary: { en: input.summaryEn.trim(), zh: input.summaryZh.trim() },
    prompt: { en: input.promptEn.trim(), zh: input.promptZh.trim() },
    takeaways: {
      en: parseListText(input.takeawaysEn),
      zh: parseListText(input.takeawaysZh),
    },
    tags: input.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    sourceName: input.sourceName.trim(),
    sourceUrl: input.sourceUrl.trim(),
    author: input.author.trim(),
    featured: input.featured,
    createdAt: new Date().toISOString(),
    palette: {
      from: input.paletteFrom,
      via: input.paletteVia,
      to: input.paletteTo,
      glow: input.paletteGlow,
    },
  };
};

export const upsertCase = async (input: AdminCaseInput) => {
  const record = buildCaseRecord(input);

  if (hasSupabaseServerEnv) {
    const client = createSupabaseServiceRoleClient();
    const { error } = await client.from("cases").upsert({
      id: record.id,
      slug: record.slug,
      model: record.model,
      title: record.title,
      summary: record.summary,
      prompt: record.prompt,
      takeaways: record.takeaways,
      tags: record.tags,
      source_name: record.sourceName,
      source_url: record.sourceUrl,
      author: record.author,
      featured: record.featured,
      created_at: record.createdAt,
      palette: record.palette,
    });

    if (error) {
      throw new Error(error.message);
    }

    return record;
  }

  const items = await readLocalCases();
  const existing = items.find((item) => item.id === record.id);
  const nextItems = existing
    ? items.map((item) =>
        item.id === record.id ? { ...record, createdAt: existing.createdAt } : item,
      )
    : [record, ...items];

  await writeLocalCases(nextItems);
  return record;
};

export const removeCase = async (id: string) => {
  if (hasSupabaseServerEnv) {
    const client = createSupabaseServiceRoleClient();
    const { error } = await client.from("cases").delete().eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
    return;
  }

  const items = await readLocalCases();
  await writeLocalCases(items.filter((item) => item.id !== id));
};
