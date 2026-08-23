import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Journal } from "@/components/Journal";
import { AdapterPanel } from "@/components/Shell";
import { MarkdownBody } from "@/components/MarkdownBody";
import { ProgressMark, TrackedLink } from "@/components/TrackSwitch";
import {
  allLessons,
  getConcept,
  getLesson,
  labSlugFromPath,
  lessonMarkdown,
  loadTrack,
  neighbors,
} from "@/lib/curriculum";

export function generateStaticParams() {
  return allLessons().map((lesson) => ({ slug: lesson.slug }));
}

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ track?: string }>;
}) {
  const { slug } = await params;
  const { track: trackId = "cursor" } = await searchParams;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const track = loadTrack(trackId);
  const concept = getConcept(track, lesson.id);
  const { prev, next } = neighbors(slug);
  const labSlug = labSlugFromPath(lesson.lab);
  const scriptSlug = labSlugFromPath(lesson.script);

  return (
    <Suspense fallback={null}>
      <div className="lesson-layout">
        <article>
          <header className="lesson-head">
            <p className="kicker">
              {lesson.id} · {track.name}
            </p>
            <h1>{lesson.title_th}</h1>
            {lesson.focus ? <p className="lede">{lesson.focus}</p> : null}
          </header>
          <MarkdownBody markdown={lessonMarkdown(lesson)} track={trackId} />
          <Journal
            id={lesson.id}
            prompts={["วันนี้จิตฉันเร็วหรือนิ่ง", "ขอบของเธอที่ฉันเห็นชัดขึ้น"]}
          />
          <ProgressMark id={lesson.id} />
          <nav className="pager">
            {prev ? (
              <TrackedLink href={`/learn/${prev.slug}`}>← {prev.title_th}</TrackedLink>
            ) : (
              <span />
            )}
            {next ? (
              <TrackedLink href={`/learn/${next.slug}`}>{next.title_th} →</TrackedLink>
            ) : labSlug ? (
              <TrackedLink href={`/lab/${labSlug}`}>ไปแล็บ →</TrackedLink>
            ) : (
              <span />
            )}
          </nav>
          {scriptSlug ? (
            <p className="note">
              สคริปต์วิดีโอ: <TrackedLink href={`/script/${scriptSlug}`}>เปิดบทพูดไทย</TrackedLink>
              {labSlug ? (
                <>
                  {" · "}
                  <TrackedLink href={`/lab/${labSlug}`}>เปิดแล็บ</TrackedLink>
                </>
              ) : null}
            </p>
          ) : null}
        </article>
        <AdapterPanel track={track} concept={concept} lesson={lesson} />
      </div>
    </Suspense>
  );
}
