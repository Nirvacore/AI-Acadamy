import type { Metadata } from "next";
import { Suspense } from "react";
import { MediaHub } from "@/components/MediaLab";
import { ContentMarkdown } from "@/components/ContentMarkdown";
import { TrackLabel } from "@/components/TrackSwitch";
import { loadMediaCampaign, loadMediaPipeline, mediaHubMarkdown } from "@/lib/media-lab";
import { loadTracks } from "@/lib/curriculum";

export const metadata: Metadata = {
  title: "Nirva Media Lab",
  description: "เส้นทางเรียนสามตอนในบริบทงานสื่อ แทร็กเครื่องมือสี่ตัว ข้อมูลอยู่ที่เบราว์เซอร์นี้เท่านั้น",
};

export default function MediaPage() {
  const pipeline = loadMediaPipeline();
  const campaign = loadMediaCampaign();
  const tracks = loadTracks();

  return (
    <Suspense fallback={null}>
      <header className="lesson-head">
        <p className="kicker">
          แล็บประยุกต์ · สามตอน · ไม่ใช่แทร็กบริษัท · <TrackLabel tracks={tracks} />
        </p>
        <h1>Nirva Media Lab</h1>
        <p className="lede">
          Cursor Claude OpenAI Copilot คือมือ Media คือบริบทงาน ความคืบหน้าอยู่ที่เบราว์เซอร์นี้เท่านั้น
        </p>
      </header>
      <ContentMarkdown markdown={mediaHubMarkdown()} />
      <MediaHub pipeline={pipeline} campaign={campaign} tracks={tracks} />
    </Suspense>
  );
}
