export type MediaStatus = "draft" | "review" | "approved" | "scheduled" | "published" | "archived";

export type MediaAsset = {
  channel: string;
  format: string;
  title: string;
  body: string;
};

export type MediaPiece = {
  brief: string;
  evidence: string;
  script: string;
  storyboard: string;
  assets: MediaAsset[];
  status: MediaStatus;
  humanReviewed: boolean;
  checklist: string[];
  publishResult: MediaPublishResult | null;
  autoPublish?: boolean;
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
export const MIN_BRIEF: number;
export const MIN_EVIDENCE: number;
export const MIN_SCRIPT: number;
export const CHECKLIST: MediaChecklistItem[];

export function emptyPiece(): MediaPiece;
export function canTransition(from: MediaStatus, to: MediaStatus): boolean;
export function briefOk(brief: string): boolean;
export function evidenceOk(evidence: string): boolean;
export function scriptOk(script: string, storyboard?: string): boolean;
export function assetsOk(assets: MediaAsset[]): boolean;
export function checklistOk(checklist: string[]): boolean;
export function canEnterReview(piece: Partial<MediaPiece>): boolean;
export function canApprove(piece: Partial<MediaPiece>): boolean;
export function isToolTrack(id: string): boolean;
export function requestPublish(piece: Partial<MediaPiece>): MediaPublishResult;
export function attemptAutoPublish(piece: Partial<MediaPiece>): MediaPublishResult;
export function buildLocalDrafts(brief: string): MediaAsset[];
export function moveStatus(
  piece: MediaPiece,
  to: MediaStatus,
): { ok: boolean; piece: MediaPiece; error?: string };
