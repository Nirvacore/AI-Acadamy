import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Journal } from "@/components/Journal";
import { MarkdownBody } from "@/components/MarkdownBody";
import { ProgressMark, TrackedLink } from "@/components/TrackSwitch";
import { getLab, listLabs } from "@/lib/curriculum";

export function generateStaticParams() {
  return listLabs().map((lab) => ({ slug: lab.slug }));
}

export default async function LabPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ track?: string }>;
}) {
  const { slug } = await params;
  const { track = "cursor" } = await searchParams;
  const lab = getLab(slug);
  if (!lab) notFound();

  return (
    <Suspense fallback={null}>
      <header className="lesson-head">
        <p className="kicker">แล็บ · {track}</p>
        <h1>{lab.title}</h1>
      </header>
      <MarkdownBody markdown={lab.markdown} track={track} />
      <Journal
        id={`lab:${slug}`}
        prompts={["ฉันเห็นอะไรในตนเอง", "ฉันเข้าใจเธอตรงไหน และยังสับสนตรงไหน"]}
      />
      <ProgressMark id={`lab:${slug}`} />
      <p className="note">
        รันเทสร้านค้าในหน้า <TrackedLink href="/shop">ร้านค้าตัวอย่าง</TrackedLink> หรือใช้{" "}
        <code>npm run test:shop</code> · <TrackedLink href="/journal">เปิดสมุดทั้งหมด</TrackedLink>
      </p>
    </Suspense>
  );
}
