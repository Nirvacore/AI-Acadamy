import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import type { LessonStem } from "@/lib/links";
import { rewriteContentHref as rewriteHref } from "@/lib/links";

const root = process.cwd();

export type Official = {
  cursor?: string;
  note?: string;
};

export type LessonRef = {
  id: string;
  slug: string;
  title_th: string;
  content: string;
  lab?: string;
  script?: string;
  official?: Official;
  focus?: string;
};

export type CourseModule = {
  id: string;
  name: string;
  phase: number;
  status?: string;
  lessons: LessonRef[];
};

export type Course = {
  id: string;
  name: string;
  language: string;
  tagline: string;
};

export type Schema = {
  course: Course;
  modules: CourseModule[];
  tracks: { default: string; available: string[] };
};

export type TrackConcept = {
  conceptId: string;
  uiLabel: string;
  shortcut: string | null;
  docsUrl: string;
  labDelta: string | null;
};

export type Track = {
  id: string;
  name: string;
  vendor: string;
  status: string;
  official_learn: string;
  official_docs: string;
  internal_path?: string;
  concepts: TrackConcept[];
};

export type LabFile = {
  slug: string;
  title: string;
  file: string;
  markdown: string;
};

function read(rel: string) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

export function loadSchema(): Schema {
  return yaml.load(read("content/schema.yaml")) as Schema;
}

export function loadTrack(id: string): Track {
  return yaml.load(read(`content/tracks/${id}.yaml`)) as Track;
}

export function loadTracks(): Track[] {
  const schema = loadSchema();
  return schema.tracks.available.map(loadTrack);
}

export function allLessons(): LessonRef[] {
  return loadSchema().modules.flatMap((module) => module.lessons);
}

export function lessonStems(): LessonStem[] {
  return allLessons().map((lesson) => ({
    stem: path.basename(lesson.content, ".md"),
    slug: lesson.slug,
  }));
}

export function getLesson(slug: string): LessonRef | undefined {
  return allLessons().find((lesson) => lesson.slug === slug);
}

export function lessonMarkdown(lesson: LessonRef): string {
  return read(lesson.content);
}

export function listLabs(): LabFile[] {
  const dir = path.join(root, "content/labs");
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    .map((name) => {
      const file = path.join("content/labs", name);
      const markdown = read(file);
      const title =
        markdown.match(/^#\s+(.+)$/m)?.[1] ?? name.replace(/\.md$/, "");
      return { slug: name.replace(/\.md$/, ""), title, file, markdown };
    });
}

export function getLab(slug: string): LabFile | undefined {
  return listLabs().find((lab) => lab.slug === slug);
}

export function listScripts(): { slug: string; markdown: string; title: string }[] {
  const dir = path.join(root, "content/scripts/th");
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    .map((name) => {
      const markdown = read(path.join("content/scripts/th", name));
      const title =
        markdown.match(/^#\s+(.+)$/m)?.[1] ?? name.replace(/\.md$/, "");
      return { slug: name.replace(/\.md$/, ""), markdown, title };
    });
}

export function getScript(slug: string) {
  return listScripts().find((script) => script.slug === slug);
}

export function glossaryMarkdown(): string {
  return read("content/glossary/th.md");
}

export function shopReadme(): string {
  return read("shop/README.md");
}

export function shopSource(name: "price.js" | "checkout-label.js" | "price.test.js") {
  return read(path.join("shop", name));
}

export function getConcept(track: Track, conceptId: string) {
  return track.concepts.find((concept) => concept.conceptId === conceptId);
}

export function neighbors(slug: string) {
  const lessons = allLessons();
  const index = lessons.findIndex((lesson) => lesson.slug === slug);
  return {
    prev: index > 0 ? lessons[index - 1] : undefined,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : undefined,
  };
}

export function labSlugFromPath(rel?: string) {
  if (!rel) return undefined;
  const base = path.basename(rel, ".md");
  return base;
}

export function rewriteContentHref(href: string | undefined): string {
  return rewriteHref(href, lessonStems());
}
