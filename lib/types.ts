export type CheckItem = {
  q: string;
  choices: string[];
  answer: number;
  why: string;
};

export type CatalogItem = {
  id: string;
  kind: "lesson" | "lab" | "script" | "page" | "term";
  title: string;
  href: string;
  hint: string;
};

export type GlossaryCard = {
  id: string;
  th: string;
  en: string;
  meaning: string;
};

export type LessonRefLite = {
  id: string;
  slug: string;
  title_th: string;
};

export type LessonMetaView = {
  moduleName: string;
  minutes: number;
  outcome: string;
  prereq?: LessonRefLite;
  labSlug?: string;
  scriptSlug?: string;
};
