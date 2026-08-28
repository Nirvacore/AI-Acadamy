import type { Metadata } from "next";
import { Suspense } from "react";
import { MediaLab } from "@/components/MediaLab";
import { Journal } from "@/components/Journal";
import { NowDo } from "@/components/NowDo";
import { ProgressMark, TrackLabel } from "@/components/TrackSwitch";
import { loadMediaPipeline } from "@/lib/media-lab";
import { loadTracks } from "@/lib/curriculum";
import { sheetForLesson } from "@/lib/nowdo";

export const metadata: Metadata = {
  title: "Nirva Media Lab",
  description: "แล็บประยุกต์พาชิ้นงานสื่อครบวงจร โดยคงแทร็กเครื่องมือเดิม และห้ามให้เธอเผยแพร่แทนคน",
};

export default function MediaPage() {
  const pipeline = loadMediaPipeline();
  const tracks = loadTracks();

  return (
    <Suspense fallback={null}>
      <header className="lesson-head">
        <p className="kicker">
          แล็บประยุกต์ · ไม่ใช่แทร็กบริษัท · <TrackLabel tracks={tracks} />
        </p>
        <h1>Nirva Media Lab</h1>
        <p className="lede">
          ทำชิ้นงานสื่อหนึ่งชิ้นในเบราว์เซอร์นี้ Cursor Claude OpenAI Copilot คือมือ
          Media คือบริบทงาน เธอช่วยร่างได้ แต่ห้ามกดเผยแพร่แทนคน
        </p>
      </header>
      <NowDo id="media-lab" sheet={sheetForLesson("media-lab")} />
      <MediaLab pipeline={pipeline} tracks={tracks} />
      <Journal
        id="media-lab"
        prompts={[
          "ตอนไหนที่ฉันอยากให้เธอกดโพสต์แทน เพราะเหนื่อย",
          "หลักฐานที่ฉันวางเปิดตามได้จริง หรือยังเป็นความจำของโมเดล",
        ]}
      />
      <ProgressMark id="media-lab" />
    </Suspense>
  );
}
