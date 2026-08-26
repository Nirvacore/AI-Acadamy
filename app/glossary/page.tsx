import { ContentMarkdown } from "@/components/ContentMarkdown";
import { Flashcards } from "@/components/Flashcards";
import { glossaryMarkdown } from "@/lib/curriculum";
import { parseGlossary } from "@/lib/catalog";

export default function GlossaryPage() {
  return (
    <>
      <header className="lesson-head">
        <p className="kicker">คำคงที่ · retrieval practice</p>
        <h1>อภิธานศัพท์</h1>
      </header>
      <Flashcards cards={parseGlossary()} />
      <ContentMarkdown markdown={glossaryMarkdown()} />
    </>
  );
}
