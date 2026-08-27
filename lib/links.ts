export type LessonStem = { stem: string; slug: string };

function basename(path: string) {
  const name = path.split("/").pop() ?? path;
  return name.replace(/\.md$/, "");
}

export function rewriteContentHref(href: string | undefined, lessons: LessonStem[]): string {
  if (!href) return "";
  if (/^https?:\/\//.test(href)) return href;
  if (href.startsWith("#")) return href;

  const cleaned = href.split("#")[0].replace(/\\/g, "/");
  const hash = href.includes("#") ? `#${href.split("#")[1]}` : "";

  if (cleaned.includes("glossary")) return `/glossary${hash}`;
  if (cleaned.includes("shop/")) return `/shop${hash}`;
  if (cleaned.includes("scripts/th/")) {
    return `/script/${basename(cleaned)}${hash}`;
  }
  if (cleaned.includes("/labs/") || cleaned.startsWith("labs/")) {
    return `/lab/${basename(cleaned)}${hash}`;
  }
  if (cleaned.includes("/tracks/")) return `/${hash}`;

  const stem = basename(cleaned);
  const lesson = lessons.find((item) => item.stem === stem);
  if (lesson) return `/learn/${lesson.slug}${hash}`;
  if (stem === "00-mirror") return `/learn/mirror${hash}`;

  return href;
}
