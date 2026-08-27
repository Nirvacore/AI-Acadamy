import { MarkdownBody } from "@/components/MarkdownBody";
import { lessonStems } from "@/lib/curriculum";

export function ContentMarkdown({ markdown }: { markdown: string }) {
  return <MarkdownBody markdown={markdown} stems={lessonStems()} />;
}
