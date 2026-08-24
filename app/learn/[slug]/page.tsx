import { Suspense } from "react";
import { Journal } from "@/components/Journal";
import { ContentMarkdown } from "@/components/ContentMarkdown";
import { AdapterPanel } from "@/components/Shell";
import { ProgressMark, TrackLabel, TrackedLink } from "@/components/TrackSwitch";
import {
  allLessons,
  getLesson,
  labSlugFromPath,
  lessonMarkdown,
  loadTracks,
  neighbors,
} from "@/lib/curriculum";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return allLessons().map((lesson) => ({ slug: lesson.slug }));
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const tracks = loadTracks();
  const { prev, next } = neighbors(slug);
  const labSlug = labSlugFromPath(lesson.lab);
  const scriptSlug = labSlugFromPath(lesson.script);

  return (
    <Suspense fallback={null}>
      <div className="lesson-layout">
        <article>
          <header className="lesson-head">
            <p className="kicker">
              {lesson.id} · <TrackLabel tracks={tracks} />
            </p>
            <h1>{lesson.title_th}</h1>
            {lesson.focus ? <p className="lede">{lesson.focus}</p> : null}
          </header>
          <ContentMarkdown markdown={lessonMarkdown(lesson)} />
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
        <AdapterPanel tracks={tracks} lesson={lesson} />
      </div>
    </Suspense>
  );
}
