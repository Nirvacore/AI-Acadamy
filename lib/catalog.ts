import {
  allLessons,
  glossaryMarkdown,
  labSlugFromPath,
  lessonMarkdown,
  listLabs,
  listScripts,
  loadSchema,
  neighbors,
  type LessonRef,
} from "@/lib/curriculum";
import type { CatalogItem, GlossaryCard, LessonMetaView } from "@/lib/types";
import { checksFor } from "@/lib/checks";

function plain(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`\[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractGoal(markdown: string) {
  const match = markdown.match(/## เป้าหมาย\s+([^\n#]+)/);
  return match?.[1]?.trim() ?? "";
}

export function lessonMinutes(phase: number, id: string) {
  if (id === "core-00") return 35;
  if (id.startsWith("media-")) return 50;
  return phase === 1 ? 40 : 50;
}

export function phaseLabel(phase: number) {
  if (phase === 1) return "แทร็ก A · พื้นฐาน";
  if (phase === 2) return "แทร็ก B · เขียนโค้ด";
  return "แล็บประยุกต์ · Nirva Media";
}

export function lessonMeta(slug: string): (LessonMetaView & { lesson: LessonRef; moduleId: string; phase: number; checkCount: number }) | undefined {
  const schema = loadSchema();
  for (const module of schema.modules) {
    const lesson = module.lessons.find((item) => item.slug === slug);
    if (!lesson) continue;
    const { prev } = neighbors(slug);
    return {
      lesson,
      moduleId: module.id,
      moduleName: module.name,
      phase: module.phase,
      minutes: lessonMinutes(module.phase, lesson.id),
      outcome: extractGoal(lessonMarkdown(lesson)),
      prereq: prev,
      labSlug: labSlugFromPath(lesson.lab),
      scriptSlug: labSlugFromPath(lesson.script),
      checkCount: checksFor(lesson.id).length,
    };
  }
  return undefined;
}

export function courseHours() {
  const schema = loadSchema();
  let minutes = 0;
  for (const module of schema.modules) {
    for (const lesson of module.lessons) {
      minutes += lessonMinutes(module.phase, lesson.id);
    }
  }
  return Math.round((minutes / 60) * 10) / 10;
}

export function parseGlossary(): GlossaryCard[] {
  const lines = glossaryMarkdown().split("\n");
  const cards: GlossaryCard[] = [];
  for (const line of lines) {
    if (!line.startsWith("|")) continue;
    const cells = line.split("|").map((cell) => cell.trim()).filter(Boolean);
    if (cells.length < 3) continue;
    if (cells[0] === "ไทย" || /^-+$/.test(cells[0].replace(/:/g, ""))) continue;
    cards.push({
      id: cells[0],
      th: cells[0],
      en: cells[1],
      meaning: cells[2],
    });
  }
  return cards;
}

export function buildCatalog(): CatalogItem[] {
  const pages: CatalogItem[] = [
    { id: "home", kind: "page", title: "หน้าแรก · เริ่มเรียน", href: "/", hint: "ปุ่มเริ่มและลำดับบท" },
    { id: "start", kind: "page", title: "ชั่วโมงแรก", href: "/start", hint: "นั่งสิบห้านาที ล็อกว่าเธอคือเอเจนต์" },
    { id: "syllabus", kind: "page", title: "หลักสูตร", href: "/syllabus", hint: "ผลลัพธ์ ชั่วโมง เกณฑ์ประเมิน" },
    { id: "tracks", kind: "page", title: "เทียบแทร็กบริษัท", href: "/tracks", hint: "Cursor Claude OpenAI Copilot" },
    { id: "media", kind: "page", title: "Nirva Media Lab", href: "/media", hint: "เส้นทางสามตอนในบริบทงานสื่อ ไม่ใช่แทร็กบริษัทตัวที่ห้า" },
    { id: "shop", kind: "page", title: "ร้านค้าตัวอย่าง", href: "/shop", hint: "แล็บราคาและการทดสอบ" },
    { id: "journal", kind: "page", title: "สมุดสะท้อน", href: "/journal", hint: "เขียนเอง ห้ามให้เธอแต่ง" },
    { id: "glossary", kind: "page", title: "อภิธานศัพท์", href: "/glossary", hint: "คำคงที่และบัตรคำ" },
    { id: "progress", kind: "page", title: "ผลการเรียน", href: "/progress", hint: "เกรดบุ๊คประเมินตนเอง" },
    { id: "certificate", kind: "page", title: "เกียรติบัตร", href: "/certificate", hint: "เมื่อเรียนครบในเครื่องนี้" },
  ];

  const lessons = allLessons().map((lesson) => ({
    id: lesson.id,
    kind: "lesson" as const,
    title: lesson.title_th,
    href: `/learn/${lesson.slug}`,
    hint: extractGoal(lessonMarkdown(lesson)) || lesson.focus || lesson.id,
  }));

  const labs = listLabs().map((lab) => ({
    id: `lab:${lab.slug}`,
    kind: "lab" as const,
    title: lab.title,
    href: `/lab/${lab.slug}`,
    hint: plain(lab.markdown).slice(0, 120),
  }));

  const scripts = listScripts().map((script) => ({
    id: `script:${script.slug}`,
    kind: "script" as const,
    title: `สคริปต์ · ${script.title}`,
    href: `/script/${script.slug}`,
    hint: "บทพูดไทยสำหรับอัดคลิป",
  }));

  const terms = parseGlossary().map((card) => ({
    id: `term:${card.th}`,
    kind: "term" as const,
    title: `${card.th} · ${card.en}`,
    href: "/glossary",
    hint: card.meaning,
  }));

  return [...pages, ...lessons, ...labs, ...scripts, ...terms];
}

export function portalLessons() {
  const schema = loadSchema();
  return schema.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      id: lesson.id,
      slug: lesson.slug,
      title_th: lesson.title_th,
      moduleName: module.name,
      phase: module.phase,
      minutes: lessonMinutes(module.phase, lesson.id),
      outcome: extractGoal(lessonMarkdown(lesson)),
      labSlug: labSlugFromPath(lesson.lab),
    })),
  );
}
