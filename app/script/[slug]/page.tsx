import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/MarkdownBody";
import { getScript, listScripts } from "@/lib/curriculum";

export function generateStaticParams() {
  return listScripts().map((script) => ({ slug: script.slug }));
}

export default async function ScriptPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ track?: string }>;
}) {
  const { slug } = await params;
  const { track = "cursor" } = await searchParams;
  const script = getScript(slug);
  if (!script) notFound();

  return (
    <>
      <header className="lesson-head">
        <p className="kicker">สคริปต์วิดีโอ</p>
        <h1>{script.title}</h1>
      </header>
      <MarkdownBody markdown={script.markdown} track={track} />
    </>
  );
}
