import type { Metadata } from "next";
import { Suspense } from "react";
import { MediaHub } from "@/components/MediaLab";
import { ContentMarkdown } from "@/components/ContentMarkdown";
import { TrackLabel } from "@/components/TrackSwitch";
import { ProductBoundaryNote } from "@/components/OriginalSources";
import { loadMediaCampaign, loadMediaPipeline, mediaHubMarkdown } from "@/lib/media-lab";
import { loadTracks } from "@/lib/curriculum";

export const metadata: Metadata = {
  title: "กรณีศึกษางานสื่อ",
  description: "กรณีศึกษา Nirva Media ใน Nirva Academy สามตอน แทร็กเครื่องมือสี่ตัว ไม่ใช่โมดูลผลิตภัณฑ์",
};

export default function MediaPage() {
  const pipeline = loadMediaPipeline();
  const campaign = loadMediaCampaign();
  const tracks = loadTracks();

  return (
    <Suspense fallback={null}>
      <div className="media-stack">
        <header className="lesson-head">
          <p className="kicker">
            Nirva Academy · กรณีศึกษา ไม่ใช่โมดูลผลิตภัณฑ์ · <TrackLabel tracks={tracks} />
          </p>
          <h1>กรณีศึกษางานสื่อ</h1>
          <p className="lede">
            มือคือ Cursor Claude OpenAI Copilot งานสื่อเป็นกรณีศึกษาจากผลิตภัณฑ์ Nirva Media
            ความคืบหน้าอยู่ที่เบราว์เซอร์นี้เท่านั้น
          </p>
        </header>
        <ProductBoundaryNote />
        <div className="media-intro">
          <ContentMarkdown markdown={mediaHubMarkdown()} />
        </div>
        <MediaHub pipeline={pipeline} campaign={campaign} tracks={tracks} />
      </div>
    </Suspense>
  );
}
