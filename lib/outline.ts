export function headingId(title: string) {
  const slug = title
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\wก-๙-]/g, "");
  return slug || "section";
}

export function extractOutline(markdown: string) {
  return [...markdown.matchAll(/^##\s+(.+)$/gm)].map((match) => ({
    id: headingId(match[1]),
    title: match[1].trim(),
  }));
}

export function extractRubric(markdown: string) {
  const chunk = markdown.split(/##\s+เกณฑ์ผ่าน\s*/).at(1);
  if (!chunk) return [];
  const body = chunk.split(/^##\s+/m)[0];
  return [...body.matchAll(/^[-*]\s+(.+)$/gm)].map((match) =>
    match[1].replace(/\*\*/g, "").trim(),
  );
}

export function speakable(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^#+\s+/gm, "")
    .replace(/[*_`>#]/g, " ")
    .replace(/\[(.*?)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 4500);
}
