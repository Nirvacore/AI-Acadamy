import { MarkdownBody } from "@/components/MarkdownBody";
import { glossaryMarkdown } from "@/lib/curriculum";

export default async function GlossaryPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  const { track = "cursor" } = await searchParams;
  return (
    <>
      <header className="lesson-head">
        <p className="kicker">คำคงที่</p>
        <h1>อภิธานศัพท์</h1>
      </header>
      <MarkdownBody markdown={glossaryMarkdown()} track={track} />
    </>
  );
}
