import { ContentMarkdown } from "@/components/ContentMarkdown";
import { glossaryMarkdown } from "@/lib/curriculum";

export default function GlossaryPage() {
  return (
    <>
      <header className="lesson-head">
        <p className="kicker">คำคงที่</p>
        <h1>อภิธานศัพท์</h1>
      </header>
      <ContentMarkdown markdown={glossaryMarkdown()} />
    </>
  );
}
