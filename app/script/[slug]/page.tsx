import { notFound } from "next/navigation";
import { ContentMarkdown } from "@/components/ContentMarkdown";
import { getScript, listScripts } from "@/lib/curriculum";

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
      </header>
      <ContentMarkdown markdown={script.markdown} />
    </>
  );
}
