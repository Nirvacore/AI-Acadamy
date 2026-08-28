import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckQuiz } from "@/components/CheckQuiz";
import { ContentMarkdown } from "@/components/ContentMarkdown";
import { Journal } from "@/components/Journal";
import { OriginalSources, ProductBoundaryNote } from "@/components/OriginalSources";
import { TrackedLink } from "@/components/TrackSwitch";
import { checksFor } from "@/lib/checks";
import { loadTrack } from "@/lib/curriculum";
import { OPENAI_PATH_HREF } from "@/lib/product-boundary";
import fs from "node:fs";
import path from "node:path";

export const metadata: Metadata = {
  title: "แทร็ก OpenAI ใน Nirva Academy",
  description: "เรียนแทร็ก OpenAI เป็นไทยใน Nirva Academy ไม่ต้องสมัคร academy.openai.com เพื่อจบบท",
};

function openaiPathMarkdown() {
  return fs.readFileSync(path.join(process.cwd(), "content/tracks/openai-path.md"), "utf8");
}

export default function OpenAITrackPage() {
  const track = loadTrack("openai");
  const items = checksFor("openai-path");

  return (
    <Suspense fallback={null}>
      <header className="lesson-head">
        <p className="kicker">Nirva Academy · แทร็ก OpenAI · เรียนจบในเว็บนี้</p>
        <h1>แทร็ก OpenAI เรียนเป็นไทยใน Nirva Academy</h1>
        <p className="lede">
          ทุกปุ่มเริ่มเรียนชี้บทในเว็บนี้ academy.openai.com เป็นต้นฉบับอังกฤษของบริษัทอื่น
          ไม่จำเป็นต่อการจบ และไม่ใช่เอกสารของคอร์สนี้
        </p>
      </header>
      <ProductBoundaryNote />
      <p className="actions">
        <TrackedLink className="btn huge primary" href="/start">
          เริ่มเรียนบทแรก
        </TrackedLink>
        <TrackedLink className="btn ghost" href="/learn/how-models-work">
          เปิดบทโมเดล
        </TrackedLink>
      </p>
      <ContentMarkdown markdown={openaiPathMarkdown()} />
      <CheckQuiz lessonId="openai-path" items={items} />
      <Journal
        id="openai-path"
        prompts={[
          "โมเดลที่ฉันเปิดใน ChatGPT ชื่ออะไร และฉันเปิดพาธบทไหนใน Nirva Academy",
          "ฉันเกือบสมัครเว็บบริษัทอื่นเพื่อจบบทนี้หรือไม่ แล้วฉันเลือกอย่างไร",
        ]}
      />
      <OriginalSources track={track} showPathLink={false} />
      <p className="note">
        เทียบปุ่มทุกบริษัทที่ <TrackedLink href="/tracks">เทียบแทร็ก</TrackedLink> · เส้นนี้คือ{" "}
        <code>{OPENAI_PATH_HREF}</code>
      </p>
    </Suspense>
  );
}
