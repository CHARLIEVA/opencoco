export const locales = ["en", "zh"] as const;

export type Locale = (typeof locales)[number];

export type ModelKind = "gpt-image-2" | "nano-banana";

export type LocalizedText = Record<Locale, string>;

export type CoverPalette = {
  from: string;
  via: string;
  to: string;
  glow: string;
};

export type CaseImage = {
  src: string;
  alt: string;
};

export type PromptCase = {
  id: string;
  slug: string;
  model: ModelKind;
  title: LocalizedText;
  summary: LocalizedText;
  prompt: LocalizedText;
  takeaways: Record<Locale, string[]>;
  tags: string[];
  sourceName: string;
  sourceUrl: string;
  author: string;
  featured: boolean;
  createdAt: string;
  palette: CoverPalette;
  image?: CaseImage;
};

export type AdminCaseInput = {
  id?: string;
  slug?: string;
  model: ModelKind;
  titleEn: string;
  titleZh: string;
  summaryEn: string;
  summaryZh: string;
  promptEn: string;
  promptZh: string;
  takeawaysEn: string;
  takeawaysZh: string;
  tags: string;
  sourceName: string;
  sourceUrl: string;
  author: string;
  featured: boolean;
  paletteFrom: string;
  paletteVia: string;
  paletteTo: string;
  paletteGlow: string;
};
