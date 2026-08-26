import { Suspense } from "react";
import { Journal } from "@/components/Journal";
import { ContentMarkdown } from "@/components/ContentMarkdown";
import { AdapterPanel } from "@/components/Shell";
import { CheckQuiz } from "@/components/CheckQuiz";
import { LessonBeacon } from "@/components/LessonBeacon";
import { ProgressMark, TrackLabel, TrackedLink } from "@/components/TrackSwitch";
import { lessonMeta } from "@/lib/catalog";
import { checksFor } from "@/lib/checks";
import {
  allLessons,
  getLesson,
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
  const meta = lessonMeta(slug);
  if (!lesson || !meta) notFound();

  const tracks = loadTracks();
  const { prev, next } = neighbors(slug);
  const items = checksFor(lesson.id);

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
            <LessonBeacon meta={meta} />
          </header>
          <ContentMarkdown markdown={lessonMarkdown(lesson)} />
          <CheckQuiz lessonId={lesson.id} items={items} />
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
            ) : meta.labSlug ? (
              <TrackedLink href={`/lab/${meta.labSlug}`}>ไปแล็บ →</TrackedLink>
            ) : (
              <span />
            )}
          </nav>
        </article>
        <AdapterPanel tracks={tracks} lesson={lesson} />
      </div>
    </Suspense>
  );
}
