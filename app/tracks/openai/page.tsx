import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckQuiz } from "@/components/CheckQuiz";
import { ContentMarkdown } from "@/components/ContentMarkdown";
import { Journal } from "@/components/Journal";
import { NowDo } from "@/components/NowDo";
import { OriginalSources, ProductBoundaryNote } from "@/components/OriginalSources";
import { ForceTrack, ProgressMark, TrackedLink } from "@/components/TrackSwitch";
import { checksFor } from "@/lib/checks";
import { loadTrack } from "@/lib/curriculum";
import { sheetForLesson } from "@/lib/nowdo";
import { OPENAI_PATH_HREF } from "@/lib/product-boundary";
import fs from "node:fs";
import path from "node:path";

export const metadata: Metadata = {
  title: "แทร็ก OpenAI ใน Nirva Academy",
  description: "นั่ง ๑๐–๑๕ นาที เปิด ChatGPT จดหลักฐาน แล้วจบแทร็ก OpenAI เป็นไทยใน Nirva Academy",
};

function openaiPathMarkdown() {
  return fs.readFileSync(path.join(process.cwd(), "content/tracks/openai-path.md"), "utf8");
}

export default function OpenAITrackPage() {
  const track = loadTrack("openai");
  const items = checksFor("openai-path");
  const sheet = sheetForLesson("openai-path");

  return (
    <Suspense fallback={null}>
      <ForceTrack id="openai" />
      <header className="lesson-head">
        <p className="kicker">Nirva Academy · แทร็ก OpenAI · นั่ง ๑๐–๑๕ นาที</p>
        <h1>แทร็ก OpenAI เรียนเป็นไทยใน Nirva Academy</h1>
        <p className="lede">
          นั่งนี้เปิด ChatGPT จดสิ่งที่หน้าจอมีจริง เทียบสองรอบ แล้วตอบในเว็บนี้
          academy.openai.com เป็นต้นฉบับอังกฤษของบริษัทอื่น ไม่จำเป็นต่อการจบ
        </p>
      </header>
      <ProductBoundaryNote />
      <p className="actions">
        <TrackedLink className="btn huge primary" href="#nowdo">
          เริ่มนั่งนี้
        </TrackedLink>
        <TrackedLink className="btn ghost" href="/learn/how-models-work?track=openai">
          เปิดบทโมเดล
        </TrackedLink>
      </p>
      <NowDo id="openai-path" sheet={sheet} />
      <ContentMarkdown markdown={openaiPathMarkdown()} />
      <CheckQuiz lessonId="openai-path" items={items} />
      <Journal
        id="openai-path"
        prompts={[
          "โมเดลที่ฉันเห็นใน ChatGPT ชื่ออะไร หรือฉันจดว่า UI ไม่แสดง เพราะอะไร",
          "โจทย์ที่ตรวจได้ที่ฉันตั้งคืออะไร รอบสองต่างจากรอบหนึ่งตรงเวลา ความชัด และหลักฐานอย่างไร",
          "ฉันเปิดบทโมเดลทำงานอย่างไรใน Nirva Academy แล้วตอบข้อสอบเองหรือไม่",
        ]}
      />
      <ProgressMark id="openai-path" />
      <OriginalSources track={track} showPathLink={false} />
      <p className="note">
        เทียบปุ่มทุกบริษัทที่ <TrackedLink href="/tracks">เทียบแทร็ก</TrackedLink> · เส้นนี้คือ{" "}
        <code>{OPENAI_PATH_HREF}</code>
      </p>
    </Suspense>
  );
}
