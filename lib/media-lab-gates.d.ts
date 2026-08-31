export type MediaStatus = "draft" | "review" | "approved" | "scheduled" | "published" | "archived";

export type MediaAsset = {
  channel: string;
  format: string;
  title: string;
  body: string;
};

export type MediaFact = { claim: string; source: string };
export type MediaAssumption = { claim: string; why: string };
export type MediaStoryFrame = { beat: string; visual: string; audio: string; note: string };
export type MediaScripts = { line: string; instagram: string; youtube: string };

export type MediaPiece = {
  goal: string;
  audience: string;
  brief: string;
  evidence: string;
  facts: MediaFact[];
  assumptions: MediaAssumption[];
  scripts: MediaScripts;
  storyboard: MediaStoryFrame[];
  storyboardSource: "academy-worksheet";
  assets: MediaAsset[];
  status: MediaStatus;
  humanReviewed: boolean;
  rubric: string[];
  postmortem: string;
  checklists: Record<string, string[]>;
  publishResult: MediaPublishResult | null;
  autoPublish?: boolean;
  script?: string;
};

export type MediaPublishResult = {
  ok: boolean;
  published: boolean;
  code: string;
  status: MediaStatus;
  message: string;
};

export type MediaChecklistItem = { id: string; text: string };

export const STATUS_FLOW: Record<MediaStatus, MediaStatus[]>;
export const TOOL_TRACKS: string[];
export const LESSON_IDS: string[];
export const CHANNELS: string[];
export const MIN_BRIEF: number;
export const MIN_EVIDENCE: number;
export const MIN_SCRIPT: number;
export const CHECKLISTS: Record<string, MediaChecklistItem[]>;
export const RUBRIC: MediaChecklistItem[];

export function emptyPiece(): MediaPiece;
export function migratePiece(raw: unknown): MediaPiece;
export function canTransition(from: MediaStatus, to: MediaStatus): boolean;
export function briefOk(brief: string): boolean;
export function evidenceOk(evidence: string): boolean;
export function factAssumptionSplitOk(piece: Partial<MediaPiece>): boolean;
export function evidenceBoardOk(piece: Partial<MediaPiece>): boolean;
export function briefStageOk(piece: Partial<MediaPiece>): boolean;
export function scriptsOk(scripts: MediaScripts | undefined): boolean;
export function storyboardOk(frames: MediaStoryFrame[] | undefined, source: string | undefined): boolean;
export function assetsOk(assets: MediaAsset[] | undefined): boolean;
export function scriptStageOk(piece: Partial<MediaPiece>): boolean;
export function rubricOk(rubric: string[] | undefined): boolean;
export function checklistOk(piece: Partial<MediaPiece>, lessonId: string): boolean;
export function canEnterReview(piece: Partial<MediaPiece>): boolean;
export function canApprove(piece: Partial<MediaPiece>): boolean;
export function isToolTrack(id: string): boolean;
export function lessonIndex(id: string): number;
export function canOpenLesson(id: string, completeIds: string[], piece?: Partial<MediaPiece>): boolean;
export function completedLessonIds(completeIds: string[], piece?: Partial<MediaPiece>): string[];
export function stageComplete(piece: Partial<MediaPiece>, id: string): boolean;
export function nextLessonId(completeIds: string[], piece?: Partial<MediaPiece>): string;
export function requestPublish(piece: Partial<MediaPiece>): MediaPublishResult;
export function attemptAutoPublish(piece: Partial<MediaPiece>): MediaPublishResult;
export function buildLocalDrafts(brief: string, scripts?: MediaScripts): MediaAsset[];
export function moveStatus(
  piece: MediaPiece,
  to: MediaStatus,
): { ok: boolean; piece: MediaPiece; error?: string };
export function applySyntheticCampaign(campaign: unknown): MediaPiece;
