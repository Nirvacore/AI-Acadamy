"use strict";

/** STATUS_FLOW จาก NirvaMedia `upstream/nirva-ai/shared/media.ts` — คัดลอกกฎ ไม่คัดลอก credential */
const STATUS_FLOW = {
  draft: ["review", "archived"],
  review: ["approved", "draft", "archived"],
  approved: ["scheduled", "published", "archived"],
  scheduled: ["published", "approved", "scheduled", "archived"],
  published: ["archived"],
  archived: [],
};

const TOOL_TRACKS = ["cursor", "claude", "openai", "copilot"];

const MIN_BRIEF = 24;
const MIN_EVIDENCE = 24;
const MIN_SCRIPT = 24;

const CHECKLIST = [
  { id: "brief", text: "เขียน brief งานชิ้นนี้ด้วยมือตนเอง" },
  { id: "evidence", text: "วางหลักฐานที่เดินไปเปิดได้ ไม่ใช่ความจำของเธอ" },
  { id: "script", text: "มีสคริปต์หรือสตอรี่บอร์ดก่อนสั่งสร้างสินทรัพย์" },
  { id: "assets", text: "ตรวจร่างสินทรัพย์ในเครื่องนี้ก่อนส่งตรวจ" },
  { id: "human", text: "คนอ่านร่างด้วยตาตนเอง เธอไม่ได้กดอนุมัติแทน" },
  { id: "no-auto", text: "ไม่ให้เธอเผยแพร่อัตโนมัติ" },
];

function emptyPiece() {
  return {
    brief: "",
    evidence: "",
    script: "",
    storyboard: "",
    assets: [],
    status: "draft",
    humanReviewed: false,
    checklist: [],
    publishResult: null,
  };
}

function canTransition(from, to) {
  return (STATUS_FLOW[from] || []).includes(to);
}

function briefOk(brief) {
  return typeof brief === "string" && brief.trim().length >= MIN_BRIEF;
}

function evidenceOk(evidence) {
  if (typeof evidence !== "string") return false;
  const text = evidence.trim();
  if (text.length < MIN_EVIDENCE) return false;
  return /(\/[A-Za-z0-9._-]+)+|https?:\/\/|[A-Za-z0-9._-]+\.(ts|tsx|js|md|yaml|yml)\b|shared\/media|campaigns\.brief|STATUS_FLOW/.test(
    text,
  );
}

function scriptOk(script, storyboard) {
  const text = `${script || ""}\n${storyboard || ""}`.trim();
  return text.length >= MIN_SCRIPT;
}

function assetsOk(assets) {
  return (
    Array.isArray(assets) &&
    assets.length > 0 &&
    assets.every((item) => item && item.channel && item.body)
  );
}

function checklistOk(checklist) {
  if (!Array.isArray(checklist)) return false;
  return CHECKLIST.every((item) => checklist.includes(item.id));
}

function canEnterReview(piece) {
  return (
    briefOk(piece?.brief) &&
    evidenceOk(piece?.evidence) &&
    scriptOk(piece?.script, piece?.storyboard) &&
    assetsOk(piece?.assets)
  );
}

function canApprove(piece) {
  return piece?.status === "review" && piece?.humanReviewed === true && canEnterReview(piece);
}

function isToolTrack(id) {
  return TOOL_TRACKS.includes(id);
}

function requestPublish(piece) {
  if (piece?.autoPublish === true) {
    return {
      ok: false,
      published: false,
      code: "ai_cannot_publish",
      status: piece.status,
      message: "เธอห้ามเผยแพร่อัตโนมัติ คนต้องรีวิวแล้วกดเอง และแล็บนี้ไม่ยิงระบบจริง",
    };
  }
  if (!piece?.humanReviewed) {
    return {
      ok: false,
      published: false,
      code: "human_review_required",
      status: piece?.status ?? "draft",
      message: "ต้องมีคนอ่านร่างก่อน เธออนุมัติแทนไม่ได้",
    };
  }
  if (!checklistOk(piece.checklist)) {
    return {
      ok: false,
      published: false,
      code: "checklist_incomplete",
      status: piece.status,
      message: "ติ๊กเช็คลิสต์ให้ครบก่อนขอคิวเผยแพร่",
    };
  }
  if (piece.status !== "approved" && piece.status !== "scheduled") {
    return {
      ok: false,
      published: false,
      code: "not_approved",
      status: piece.status,
      message: "STATUS_FLOW ห้ามข้ามไป published โดยไม่ผ่าน review และอนุมัติ",
    };
  }
  if (!canEnterReview(piece)) {
    return {
      ok: false,
      published: false,
      code: "evidence_gate",
      status: piece.status,
      message: "ยังไม่ผ่านประตูหลักฐาน",
    };
  }
  return {
    ok: true,
    published: false,
    code: "blocked_auth",
    status: piece.status,
    message:
      "คิวจำลองถูกบล็อกที่ blocked_auth จนกว่าบัญชีจริงจะถูกเชื่อม — แล็บนี้ไม่เผยแพร่จริง",
  };
}

function attemptAutoPublish(piece) {
  return requestPublish({ ...piece, autoPublish: true });
}

function buildLocalDrafts(brief) {
  const seed = (brief || "").trim().slice(0, 120) || "brief ว่าง";
  return [
    {
      channel: "LINE OA",
      format: "Broadcast · Card",
      title: "ร่าง LINE จาก brief ในเครื่องนี้",
      body: seed,
    },
    {
      channel: "Instagram",
      format: "Carousel · 4:5",
      title: "ร่าง Instagram จาก brief ในเครื่องนี้",
      body: seed,
    },
    {
      channel: "YouTube",
      format: "Video outline · 16:9",
      title: "ร่าง YouTube จาก brief ในเครื่องนี้",
      body: seed,
    },
  ];
}

function moveStatus(piece, to) {
  if (to === "published") {
    return { ok: false, piece, error: "ai_cannot_publish" };
  }
  if (!canTransition(piece.status, to)) {
    return { ok: false, piece, error: `cannot transition from ${piece.status} to ${to}` };
  }
  if (to === "review" && !canEnterReview(piece)) {
    return { ok: false, piece, error: "evidence_gate" };
  }
  if (to === "approved" && !piece.humanReviewed) {
    return { ok: false, piece, error: "human_review_required" };
  }
  return { ok: true, piece: { ...piece, status: to, publishResult: null } };
}

module.exports = {
  STATUS_FLOW,
  TOOL_TRACKS,
  MIN_BRIEF,
  MIN_EVIDENCE,
  MIN_SCRIPT,
  CHECKLIST,
  emptyPiece,
  canTransition,
  briefOk,
  evidenceOk,
  scriptOk,
  assetsOk,
  checklistOk,
  canEnterReview,
  canApprove,
  isToolTrack,
  requestPublish,
  attemptAutoPublish,
  buildLocalDrafts,
  moveStatus,
};
