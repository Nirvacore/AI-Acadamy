import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Journal } from "@/components/Journal";
import { ContentMarkdown } from "@/components/ContentMarkdown";
import { ProgressMark, TrackLabel, TrackedLink } from "@/components/TrackSwitch";
import { getLab, listLabs, loadTracks } from "@/lib/curriculum";

export function generateStaticParams() {
  return listLabs().map((lab) => ({ slug: lab.slug }));
}

export default async function LabPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lab = getLab(slug);
  if (!lab) notFound();
  const tracks = loadTracks();

  return (
    <Suspense fallback={null}>
      <header className="lesson-head">
        <p className="kicker">
          แล็บ · <TrackLabel tracks={tracks} />
        </p>
        <h1>{lab.title}</h1>
      </header>
      <ContentMarkdown markdown={lab.markdown} />
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
