import type { Metadata } from "next";
import { Suspense } from "react";
import { Journal } from "@/components/Journal";
import { ContentMarkdown } from "@/components/ContentMarkdown";
import { MediaStage } from "@/components/MediaLab";
import { AdapterPanel } from "@/components/Shell";
import { CheckQuiz } from "@/components/CheckQuiz";
import { LessonBeacon } from "@/components/LessonBeacon";
import { LessonKeys } from "@/components/LessonKeys";
import { LessonOutline } from "@/components/LessonOutline";
import { NowDo } from "@/components/NowDo";
import { MediaLessonMark, ProgressMark, TrackLabel, TrackedLink } from "@/components/TrackSwitch";
import { lessonMeta } from "@/lib/catalog";
import { MEDIA_JOURNAL, isMediaLesson, loadMediaCampaign } from "@/lib/media-lab";
import { sheetForLesson } from "@/lib/nowdo";
import { checksFor } from "@/lib/checks";
import { extractOutline } from "@/lib/outline";
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  return { title: lesson?.title_th ?? "บทเรียน" };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  const meta = lessonMeta(slug);
  if (!lesson || !meta) notFound();

  const tracks = loadTracks();
  const { prev, next } = neighbors(slug);
  const items = checksFor(lesson.id);
  const markdown = lessonMarkdown(lesson);
  const outline = extractOutline(markdown);
  const campaign = isMediaLesson(lesson.id) ? loadMediaCampaign() : undefined;

  return (
    <Suspense fallback={null}>
      <LessonKeys
        prev={prev ? `/learn/${prev.slug}` : undefined}
        next={next ? `/learn/${next.slug}` : meta.labSlug ? `/lab/${meta.labSlug}` : undefined}
      />
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
          <NowDo id={lesson.id} sheet={sheetForLesson(lesson.id)} />
          <LessonOutline items={outline} />
          <ContentMarkdown markdown={markdown} />
          {isMediaLesson(lesson.id) ? (
            <MediaStage lessonId={lesson.id} tracks={tracks} campaign={campaign} />
          ) : null}
          <CheckQuiz lessonId={lesson.id} items={items} />
          <Journal
            id={lesson.id}
            prompts={MEDIA_JOURNAL[lesson.id] ?? ["วันนี้จิตฉันเร็วหรือนิ่ง", "ขอบของเธอที่ฉันเห็นชัดขึ้น"]}
          />
          {isMediaLesson(lesson.id) ? <MediaLessonMark id={lesson.id} /> : <ProgressMark id={lesson.id} />}
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
