import { notFound } from "next/navigation";
import { ContentMarkdown } from "@/components/ContentMarkdown";
import { ListenButton } from "@/components/ListenButton";
import { getScript, listScripts } from "@/lib/curriculum";
import { speakable } from "@/lib/outline";

export function generateStaticParams() {
  return listScripts().map((script) => ({ slug: script.slug }));
}

export default async function ScriptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const script = getScript(slug);
  if (!script) notFound();

  return (
    <>
      <header className="lesson-head">
        <p className="kicker">สคริปต์วิดีโอ</p>
        <h1>{script.title}</h1>
        <ListenButton text={speakable(script.markdown)} />
      </header>
      <ContentMarkdown markdown={script.markdown} />
    </>
  );
}
