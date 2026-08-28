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

const LESSON_IDS = [
  "media-brief-evidence",
  "media-script-storyboard",
  "media-review-publish",
];

const CHANNELS = ["line", "instagram", "youtube"];

const MIN_BRIEF = 24;
const MIN_EVIDENCE = 24;
const MIN_SCRIPT = 24;

const CHECKLISTS = {
  "media-brief-evidence": [
    { id: "goal", text: "ตั้งเป้าและผู้ชมด้วยมือตนเอง" },
    { id: "brief", text: "เขียน brief งานชิ้นนี้" },
    { id: "evidence", text: "วางหลักฐานที่เดินไปเปิดได้" },
    { id: "split", text: "แยกข้อเท็จจริงกับสมมติฐานบนกระดานหลักฐาน" },
  ],
  "media-script-storyboard": [
    { id: "scripts", text: "มีสคริปต์ครบ LINE Instagram YouTube" },
    { id: "storyboard", text: "กรอกสตอรี่บอร์ดสามจังหวะในแบบฝึกของ Academy" },
    { id: "not-runtime", text: "รู้ว่าสตอรี่บอร์ดนี้ไม่ใช่ฟีเจอร์ runtime ของ NirvaMedia" },
    { id: "assets", text: "ตรวจร่างสินทรัพย์ในเครื่องนี้ก่อนส่งตรวจ" },
  ],
  "media-review-publish": [
    { id: "rubric", text: "ติ๊กรูบริกคุณภาพและความเสี่ยงด้วยตาตนเอง" },
    { id: "human", text: "คนอ่านร่าง เธอไม่ได้กดอนุมัติแทน" },
    { id: "no-auto", text: "ไม่ให้เธอเผยแพร่อัตโนมัติ" },
    { id: "postmortem", text: "เขียน postmortem สั้นหลังคิวถูกบล็อก" },
  ],
};

const RUBRIC = [
  { id: "quality-claim", text: "ข้ออ้างในร่างมีหลักฐานรอง หรือถูกทำเครื่องหมายว่าสมมติฐาน" },
  { id: "quality-tone", text: "โทนตรง brief และไม่สัญญาสิ่งที่แล็บนี้ทำไม่ได้ เช่น โพสต์จริง" },
  { id: "risk-secret", text: "ไม่มี credential ข้อมูลลูกค้า หรือชื่อระบบภายในที่ไม่ได้เปิด" },
  { id: "risk-skip", text: "ไม่ได้ข้าม review ไป published" },
];

function emptyFrame(beat) {
  return { beat, visual: "", audio: "", note: "" };
}

function emptyPiece() {
  return {
    goal: "",
    audience: "",
    brief: "",
    evidence: "",
    facts: [{ claim: "", source: "" }],
    assumptions: [{ claim: "", why: "" }],
    scripts: { line: "", instagram: "", youtube: "" },
    storyboard: [emptyFrame("เปิด"), emptyFrame("ปัญหา"), emptyFrame("ทางออก")],
    storyboardSource: "academy-worksheet",
    assets: [],
    status: "draft",
    humanReviewed: false,
    rubric: [],
    postmortem: "",
    checklists: {
      "media-brief-evidence": [],
      "media-script-storyboard": [],
      "media-review-publish": [],
    },
    publishResult: null,
  };
}

function migratePiece(raw) {
  const base = emptyPiece();
  if (!raw || typeof raw !== "object") return base;
  const merged = { ...base, ...raw };
  if (!merged.scripts || typeof merged.scripts !== "object") {
    const legacy = typeof raw.script === "string" ? raw.script : "";
    merged.scripts = { line: legacy, instagram: legacy, youtube: legacy };
  }
  if (!Array.isArray(merged.storyboard)) {
    const text = typeof raw.storyboard === "string" ? raw.storyboard : "";
    merged.storyboard = [emptyFrame("เปิด"), emptyFrame("ปัญหา"), emptyFrame("ทางออก")];
    if (text) merged.storyboard[0].visual = text;
  }
  merged.storyboardSource = "academy-worksheet";
  if (!merged.checklists || typeof merged.checklists !== "object") {
    merged.checklists = emptyPiece().checklists;
  }
  for (const id of LESSON_IDS) {
    if (!Array.isArray(merged.checklists[id])) merged.checklists[id] = [];
  }
  if (!Array.isArray(merged.facts) || merged.facts.length === 0) {
    merged.facts = [{ claim: "", source: merged.evidence || "" }];
  }
  if (!Array.isArray(merged.assumptions) || merged.assumptions.length === 0) {
    merged.assumptions = [{ claim: "", why: "" }];
  }
  if (!Array.isArray(merged.rubric)) merged.rubric = [];
  return merged;
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

function factAssumptionSplitOk(piece) {
  const facts = (piece?.facts || []).filter(
    (row) => row && briefOk(row.claim || "") && evidenceOk(row.source || ""),
  );
  const assumptions = (piece?.assumptions || []).filter(
    (row) => row && briefOk(row.claim || "") && (row.why || "").trim().length >= 12,
  );
  return facts.length >= 1 && assumptions.length >= 1;
}

function evidenceBoardOk(piece) {
  return evidenceOk(piece?.evidence) && factAssumptionSplitOk(piece);
}

function briefStageOk(piece) {
  return briefOk(piece?.goal) && briefOk(piece?.audience) && briefOk(piece?.brief) && evidenceBoardOk(piece);
}

function scriptsOk(scripts) {
  if (!scripts || typeof scripts !== "object") return false;
  return CHANNELS.every((channel) => (scripts[channel] || "").trim().length >= MIN_SCRIPT);
}

function storyboardOk(frames, source) {
  if (source !== "academy-worksheet") return false;
  if (!Array.isArray(frames)) return false;
  const filled = frames.filter((frame) => frame && (frame.visual || "").trim() && (frame.audio || "").trim());
  return filled.length >= 3;
}

function assetsOk(assets) {
  return (
    Array.isArray(assets) &&
    assets.length > 0 &&
    assets.every((item) => item && item.channel && item.body)
  );
}

function scriptStageOk(piece) {
  return scriptsOk(piece?.scripts) && storyboardOk(piece?.storyboard, piece?.storyboardSource) && assetsOk(piece?.assets);
}

function rubricOk(rubric) {
  if (!Array.isArray(rubric)) return false;
  return RUBRIC.every((item) => rubric.includes(item.id));
}

function checklistOk(piece, lessonId) {
  const items = CHECKLISTS[lessonId] || [];
  const done = piece?.checklists?.[lessonId] || [];
  return items.every((item) => done.includes(item.id));
}

function canEnterReview(piece) {
  return briefStageOk(piece) && scriptStageOk(piece);
}

function canApprove(piece) {
  return piece?.status === "review" && piece?.humanReviewed === true && canEnterReview(piece) && rubricOk(piece.rubric);
}

function isToolTrack(id) {
  return TOOL_TRACKS.includes(id);
}

function lessonIndex(id) {
  return LESSON_IDS.indexOf(id);
}

function canOpenLesson(id, completeIds) {
  const index = lessonIndex(id);
  if (index <= 0) return true;
  const prev = LESSON_IDS[index - 1];
  return Array.isArray(completeIds) && completeIds.includes(prev);
}

function stageComplete(piece, id) {
  if (id === "media-brief-evidence") return briefStageOk(piece) && checklistOk(piece, id);
  if (id === "media-script-storyboard") {
    return briefStageOk(piece) && scriptStageOk(piece) && checklistOk(piece, id);
  }
  if (id === "media-review-publish") {
    return (
      canApprove({ ...piece, status: "review" }) &&
      piece?.publishResult?.code === "blocked_auth" &&
      piece?.publishResult?.published === false &&
      briefOk(piece?.postmortem) &&
      checklistOk(piece, id)
    );
  }
  return false;
}

function nextLessonId(completeIds) {
  const done = Array.isArray(completeIds) ? completeIds : [];
  return LESSON_IDS.find((id) => !done.includes(id)) ?? LESSON_IDS[LESSON_IDS.length - 1];
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
  if (!rubricOk(piece.rubric)) {
    return {
      ok: false,
      published: false,
      code: "checklist_incomplete",
      status: piece.status,
      message: "ติ๊กรูบริกคุณภาพและความเสี่ยงให้ครบก่อนขอคิว",
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
      message: "ยังไม่ผ่านประตูหลักฐานหรือสคริปต์",
    };
  }
  return {
    ok: true,
    published: false,
    code: "blocked_auth",
    status: piece.status,
    message: "คิวจำลองถูกบล็อกที่ blocked_auth จนกว่าบัญชีจริงจะถูกเชื่อม — แล็บนี้ไม่เผยแพร่จริง",
  };
}

function attemptAutoPublish(piece) {
  return requestPublish({ ...piece, autoPublish: true });
}

function buildLocalDrafts(brief, scripts) {
  const seed = (brief || "").trim().slice(0, 120) || "brief ว่าง";
  return [
    {
      channel: "LINE OA",
      format: "Broadcast · Card",
      title: "ร่าง LINE จาก brief ในเครื่องนี้",
      body: (scripts?.line || seed).slice(0, 280),
    },
    {
      channel: "Instagram",
      format: "Carousel · 4:5",
      title: "ร่าง Instagram จาก brief ในเครื่องนี้",
      body: (scripts?.instagram || seed).slice(0, 280),
    },
    {
      channel: "YouTube",
      format: "Video outline · 16:9",
      title: "ร่าง YouTube จาก brief ในเครื่องนี้",
      body: (scripts?.youtube || seed).slice(0, 280),
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
  if (to === "approved" && (!piece.humanReviewed || !rubricOk(piece.rubric))) {
    return { ok: false, piece, error: "human_review_required" };
  }
  return { ok: true, piece: { ...piece, status: to, publishResult: null } };
}

function applySyntheticCampaign(campaign) {
  const piece = emptyPiece();
  if (!campaign || campaign.kind !== "synthetic") return piece;
  piece.goal = campaign.goal || "";
  piece.audience = campaign.audience || "";
  piece.brief = campaign.brief || "";
  piece.evidence = campaign.evidence || "";
  piece.facts = (campaign.facts || []).map((row) => ({ claim: row.claim || "", source: row.source || "" }));
  piece.assumptions = (campaign.assumptions || []).map((row) => ({
    claim: row.claim || "",
    why: row.why || "",
  }));
  piece.scripts = {
    line: campaign.scripts?.line || "",
    instagram: campaign.scripts?.instagram || "",
    youtube: campaign.scripts?.youtube || "",
  };
  piece.storyboard = (campaign.storyboard?.beats || piece.storyboard).map((beat, index) => ({
    beat: beat.beat || piece.storyboard[index]?.beat || `จังหวะ ${index + 1}`,
    visual: beat.visual || "",
    audio: beat.audio || "",
    note: beat.note || "",
  }));
  piece.storyboardSource = "academy-worksheet";
  piece.assets = buildLocalDrafts(piece.brief, piece.scripts);
  piece.postmortem = campaign.postmortem || "";
  return piece;
}

module.exports = {
  STATUS_FLOW,
  TOOL_TRACKS,
  LESSON_IDS,
  CHANNELS,
  MIN_BRIEF,
  MIN_EVIDENCE,
  MIN_SCRIPT,
  CHECKLISTS,
  RUBRIC,
  emptyPiece,
  migratePiece,
  canTransition,
  briefOk,
  evidenceOk,
  factAssumptionSplitOk,
  evidenceBoardOk,
  briefStageOk,
  scriptsOk,
  storyboardOk,
  assetsOk,
  scriptStageOk,
  rubricOk,
  checklistOk,
  canEnterReview,
  canApprove,
  isToolTrack,
  lessonIndex,
  canOpenLesson,
  stageComplete,
  nextLessonId,
  requestPublish,
  attemptAutoPublish,
  buildLocalDrafts,
  moveStatus,
  applySyntheticCampaign,
};
