import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import {
  CHECKLIST,
  STATUS_FLOW,
  TOOL_TRACKS,
  attemptAutoPublish,
  buildLocalDrafts,
  canApprove,
  canEnterReview,
  canTransition,
  emptyPiece,
  evidenceOk,
  moveStatus,
  requestPublish,
} from "@/lib/media-lab-gates";

export type MediaStage = {
  id: string;
  title_th: string;
  academy_action: string;
  files: string[];
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
};

export {
  CHECKLIST,
  STATUS_FLOW,
  TOOL_TRACKS,
  attemptAutoPublish,
  buildLocalDrafts,
  canApprove,
  canEnterReview,
  canTransition,
  emptyPiece,
  evidenceOk,
  moveStatus,
  requestPublish,
};

export function loadMediaPipeline(): MediaPipeline {
  const raw = fs.readFileSync(path.join(process.cwd(), "content/media/pipeline.yaml"), "utf8");
  return yaml.load(raw) as MediaPipeline;
}

export function stageById(pipeline: MediaPipeline, id: string) {
  return pipeline.reuse.find((stage) => stage.id === id);
}
