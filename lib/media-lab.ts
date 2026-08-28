import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import {
  CHECKLISTS,
  LESSON_IDS,
  RUBRIC,
  STATUS_FLOW,
  TOOL_TRACKS,
  applySyntheticCampaign,
  attemptAutoPublish,
  briefStageOk,
  canApprove,
  canEnterReview,
  canOpenLesson,
  canTransition,
  emptyPiece,
  evidenceBoardOk,
  migratePiece,
  moveStatus,
  nextLessonId,
  requestPublish,
  scriptStageOk,
  stageComplete,
} from "@/lib/media-lab-gates";

export type MediaStage = {
  id: string;
  title_th: string;
  academy_action: string;
  files: string[];
};

export type MediaLessonMap = {
  id: string;
  maps: string[];
  title_th: string;
};

export type MediaPipeline = {
  id: string;
  role: string;
  not_a_tool_track: boolean;
  tool_tracks: string[];
  product: { repository: string; default_branch: string; inspected: string };
  missing_sources: { id: string; asked: string; note: string }[];
  reuse: MediaStage[];
  academy_rules: string[];
  academy_lessons: MediaLessonMap[];
  academy_authored: { id: string; note: string; file?: string }[];
};

export type MediaCampaign = {
  id: string;
  kind: "synthetic";
  not_real_data: boolean;
  title_th: string;
  warning: string;
  goal: string;
  audience: string;
  brief: string;
  evidence: string;
  facts: { claim: string; source: string }[];
  assumptions: { claim: string; why: string }[];
  scripts: { line: string; instagram: string; youtube: string };
  storyboard: {
    source: string;
    note: string;
    beats: { beat: string; visual: string; audio: string; note: string }[];
  };
  postmortem: string;
};

export const MEDIA_JOURNAL: Record<string, string[]> = {
  "media-brief-evidence": [
    "ฉันยึดคำเดาของผู้ชมจากเธอเร็วเกินไปหรือไม่",
    "ข้อไหนบนกระดานที่ฉันอยากให้เป็นความจริง ทั้งที่ยังไม่มีแหล่ง",
  ],
  "media-script-storyboard": [
    "ฉันยัดสมมติฐานลงแคปชันโดยไม่ติดป้ายหรือไม่",
    "ฉันอยากได้ภาพจากเธอแทนการเขียนจังหวะเองหรือไม่",
  ],
  "media-review-publish": [
    "ตอนไหนที่ฉันอยากให้เธอกดโพสต์แทน เพราะเหนื่อย",
    "ฉันจะอธิบายได้อย่างไรว่าคิวถูกบล็อกไม่ใช่บั๊กของแล็บ",
  ],
};

export {
  CHECKLISTS,
  LESSON_IDS,
  RUBRIC,
  STATUS_FLOW,
  TOOL_TRACKS,
  applySyntheticCampaign,
  attemptAutoPublish,
  briefStageOk,
  canApprove,
  canEnterReview,
  canOpenLesson,
  canTransition,
  emptyPiece,
  evidenceBoardOk,
  migratePiece,
  moveStatus,
  nextLessonId,
  requestPublish,
  scriptStageOk,
  stageComplete,
};

export function loadMediaPipeline(): MediaPipeline {
  const raw = fs.readFileSync(path.join(process.cwd(), "content/media/pipeline.yaml"), "utf8");
  return yaml.load(raw) as MediaPipeline;
}

export function loadMediaCampaign(): MediaCampaign {
  const raw = fs.readFileSync(path.join(process.cwd(), "content/media/campaign-lan-nangsue.yaml"), "utf8");
  return yaml.load(raw) as MediaCampaign;
}

export function mediaHubMarkdown(): string {
  return fs.readFileSync(path.join(process.cwd(), "content/media/hub.md"), "utf8");
}

export function stageById(pipeline: MediaPipeline, id: string) {
  return pipeline.reuse.find((stage) => stage.id === id);
}

export function isMediaLesson(id: string) {
  return LESSON_IDS.includes(id);
}
