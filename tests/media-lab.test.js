const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const yaml = require("js-yaml");
const gates = require("../lib/media-lab-gates");

const root = path.join(__dirname, "..");

function loadYaml(rel) {
  return yaml.load(fs.readFileSync(path.join(root, rel), "utf8"));
}

function samplePiece() {
  return {
    ...gates.emptyPiece(),
    goal: "ชวนครอบครัวสมมติมานั่งอ่านด้วยกันเย็นวันศุกร์โดยไม่สัญญาว่าจะโพสต์จริง",
    audience: "ผู้ปกครองสมมติในชุมชนวัดเหนือที่อ่าน LINE เป็นหลักทุกเย็น",
    brief: "ลานหนังสือวัดเหนือสังเคราะห์ชวนอ่านด้วยกัน โทนอบอุ่น ไม่ขายคอร์ส ไม่เก็บรหัสผ่าน",
    evidence: "เปิดแล้วที่ NirvaMedia/db/schema.ts ช่อง campaigns.brief และ STATUS_FLOW",
    facts: [
      {
        claim: "สตูดิโอจริงบังคับมี brief ก่อนสร้างร่างแคมเปญในเส้นทางนี้",
        source: "NirvaMedia/app/api/campaigns/route.ts ตรวจ brief ว่างแล้วตอบ 400",
      },
    ],
    assumptions: [
      {
        claim: "ครอบครัวในชุมชนนี้เปิด LINE ทุกเย็นศุกร์โดยไม่มีข้อยกเว้น",
        why: "ยังไม่มีแบบสำรวจ ใช้เป็นสมมติฐานของแคมเปญสมมติเท่านั้น",
      },
    ],
    scripts: {
      line: "เย็นศุกร์นี้ลานหนังสือวัดเหนือสังเคราะห์เปิดพรมให้นั่งอ่านด้วยกัน ไม่ขอรหัส",
      instagram: "สามภาพพรมว่าง ชั้นหนังสือสมมติ โคมไฟลาน คำบรรยายสั้นชวนมาอ่าน",
      youtube: "เปิดด้วยลานว่าง เล่าว่าทีมสมมติอยากมีที่อ่านที่ไม่เร่ง ปิดด้วยเวลาเย็นศุกร์",
    },
    storyboard: [
      { beat: "เปิด", visual: "ลานว่างมีพรม", audio: "เสียงลมสั้น", note: "ยังไม่โชว์ปุ่มโพสต์" },
      { beat: "ปัญหา", visual: "ปฏิทินครอบครัวที่แน่น", audio: "ยังไม่มีที่พักสายตา", note: "อย่าโทษผู้ชม" },
      { beat: "ทางออก", visual: "คนนั่งอ่านด้วยกัน", audio: "ชวนมาเย็นศุกร์", note: "ตัวอย่างเรียน" },
    ],
    storyboardSource: "academy-worksheet",
    assets: gates.buildLocalDrafts("ลานหนังสือวัดเหนือสังเคราะห์ชวนอ่านด้วยกัน โทนอบอุ่น ไม่ขายคอร์ส"),
  };
}

test("tool tracks มีสี่ตัว และ Media ไม่ใช่แทร็กบริษัท", () => {
  const schema = loadYaml("content/schema.yaml");
  const pipeline = loadYaml("content/media/pipeline.yaml");
  assert.equal(schema.tracks.available.length, 4);
  assert.deepEqual(schema.tracks.available, gates.TOOL_TRACKS);
  assert.equal(schema.tracks.available.includes("media"), false);
  assert.equal(pipeline.not_a_tool_track, true);
  assert.equal(gates.isToolTrack("media"), false);
});

test("ลำดับบท phase 3 ต่อกันสามตอน", () => {
  const schema = loadYaml("content/schema.yaml");
  const module = schema.modules.find((item) => item.id === "track-media");
  const ids = module.lessons.map((lesson) => lesson.id);
  assert.deepEqual(ids, gates.LESSON_IDS);
  assert.equal(module.phase, 3);
  assert.equal(gates.canOpenLesson("media-brief-evidence", []), true);
  assert.equal(gates.canOpenLesson("media-script-storyboard", []), false);
  assert.equal(gates.canOpenLesson("media-script-storyboard", ["media-brief-evidence"]), true);
  assert.equal(gates.canOpenLesson("media-review-publish", ["media-brief-evidence"]), false);
  assert.equal(
    gates.canOpenLesson("media-review-publish", ["media-brief-evidence", "media-script-storyboard"]),
    true,
  );
  assert.equal(gates.canOpenLesson("media-lab", []), false);
  assert.equal(
    gates.nextLessonId(["media-brief-evidence"]),
    "media-script-storyboard",
  );
  const briefReady = {
    ...samplePiece(),
    checklists: {
      ...gates.emptyPiece().checklists,
      "media-brief-evidence": gates.CHECKLISTS["media-brief-evidence"].map((item) => item.id),
    },
  };
  assert.equal(gates.stageComplete(briefReady, "media-brief-evidence"), true);
  assert.equal(gates.canOpenLesson("media-script-storyboard", [], briefReady), true);
  assert.equal(gates.canOpenLesson("media-review-publish", [], briefReady), false);
  assert.equal(gates.nextLessonId([], briefReady), "media-script-storyboard");
});

test("ทุกแทร็กเครื่องมือมี labDelta ของสามตอน Media", () => {
  for (const id of gates.TOOL_TRACKS) {
    const track = loadYaml(`content/tracks/${id}.yaml`);
    for (const lessonId of gates.LESSON_IDS) {
      const concept = track.concepts.find((item) => item.conceptId === lessonId);
      assert.ok(concept, `${id} ต้องมี ${lessonId}`);
      assert.ok(concept.labDelta && concept.labDelta.length > 12);
    }
    assert.equal(
      track.concepts.some((item) => item.conceptId === "media"),
      false,
    );
  }
});

test("ไฟล์บท แล็บ สคริปต์ ฮับ แคมเปญ และ route คงที่", () => {
  const schema = loadYaml("content/schema.yaml");
  const module = schema.modules.find((item) => item.id === "track-media");
  const slugs = schema.modules.flatMap((item) => item.lessons.map((lesson) => lesson.slug));
  assert.equal(slugs.includes("media-lab"), false);
  assert.deepEqual(
    module.lessons.map((lesson) => lesson.slug),
    gates.LESSON_IDS,
  );
  for (const lesson of module.lessons) {
    for (const rel of [lesson.content, lesson.lab, lesson.script]) {
      assert.equal(fs.existsSync(path.join(root, rel)), true, rel);
    }
  }
  for (const rel of [
    "app/media/page.tsx",
    "content/media/pipeline.yaml",
    "content/media/hub.md",
    "content/media/campaign-lan-nangsue.yaml",
    "content/core/media-brief-evidence.md",
    "content/core/media-script-storyboard.md",
    "content/core/media-review-publish.md",
  ]) {
    assert.equal(fs.existsSync(path.join(root, rel)), true, rel);
  }
  assert.equal(fs.existsSync(path.join(root, "content/labs/media-lab.md")), false);
  assert.equal(fs.existsSync(path.join(root, "content/scripts/th/media-lab.md")), false);
  const labs = fs.readdirSync(path.join(root, "content/labs")).filter((name) => name.endsWith(".md"));
  const scripts = fs.readdirSync(path.join(root, "content/scripts/th")).filter((name) => name.endsWith(".md"));
  assert.equal(labs.includes("media-lab.md"), false);
  assert.equal(scripts.includes("media-lab.md"), false);
  for (const id of gates.LESSON_IDS) {
    assert.equal(labs.includes(`${id}.md`), true, id);
    assert.equal(scripts.includes(`${id}.md`), true, id);
  }
  const campaign = loadYaml("content/media/campaign-lan-nangsue.yaml");
  assert.equal(campaign.kind, "synthetic");
  assert.equal(campaign.not_real_data, true);
  for (const id of gates.LESSON_IDS) {
    const lesson = fs.readFileSync(path.join(root, `content/core/${id}.md`), "utf8");
    for (const heading of ["## เป้าหมาย", "## แนวคิดแกน", "## กระจก", "## เดโมเครื่องมือ", "## แล็บ", "## กับดักที่พบบ่อย"]) {
      assert.equal(lesson.includes(heading), true, `${id} ${heading}`);
    }
    for (const tool of ["**Cursor**", "**Claude**", "**OpenAI**", "**Copilot**"]) {
      assert.equal(lesson.includes(tool), true, `${id} ${tool}`);
    }
    const lab = fs.readFileSync(path.join(root, `content/labs/${id}.md`), "utf8");
    assert.equal(lab.includes("## สะท้อนเข้าตัว"), true, id);
    assert.equal(lab.includes("## เกณฑ์ผ่าน"), true, id);
  }
});

test("STATUS_FLOW ตรงแผนที่ และห้ามข้ามไป published", () => {
  const pipeline = loadYaml("content/media/pipeline.yaml");
  assert.deepEqual(gates.STATUS_FLOW, pipeline.status_flow);
  assert.equal(gates.canTransition("draft", "review"), true);
  assert.equal(gates.canTransition("draft", "published"), false);
  const skipped = gates.moveStatus(gates.emptyPiece(), "published");
  assert.equal(skipped.ok, false);
  assert.equal(skipped.error, "ai_cannot_publish");
});

test("ประตูหลักฐานต้องแยกข้อเท็จจริงกับสมมติฐาน", () => {
  const empty = gates.emptyPiece();
  assert.equal(gates.evidenceBoardOk(empty), false);
  assert.equal(gates.briefStageOk(empty), false);
  const ready = samplePiece();
  assert.equal(gates.evidenceOk(ready.evidence), true);
  assert.equal(gates.factAssumptionSplitOk(ready), true);
  assert.equal(gates.briefStageOk(ready), true);
  const mixed = {
    ...ready,
    facts: [{ claim: "ฟังแล้วเชื่อ", source: "ความมั่นใจของเธอ" }],
  };
  assert.equal(gates.factAssumptionSplitOk(mixed), false);
});

test("ตอนสคริปต์ต้องมีแบบฝึก Academy ไม่ใช่ runtime ว่าง", () => {
  const piece = samplePiece();
  assert.equal(gates.scriptStageOk(piece), true);
  assert.equal(gates.storyboardOk(piece.storyboard, "studio-runtime"), false);
  assert.equal(gates.canEnterReview(piece), true);
});

test("คนต้องรีวิวก่อนอนุมัติ และเธอห้ามเผยแพร่อัตโนมัติ", () => {
  const base = {
    ...samplePiece(),
    status: "review",
    humanReviewed: false,
    rubric: gates.RUBRIC.map((item) => item.id),
    checklists: {
      ...gates.emptyPiece().checklists,
      "media-review-publish": gates.CHECKLISTS["media-review-publish"].map((item) => item.id),
    },
  };
  assert.equal(gates.canApprove(base), false);
  assert.equal(gates.moveStatus(base, "approved").ok, false);

  const approved = { ...base, humanReviewed: true };
  assert.equal(gates.canApprove(approved), true);
  const moved = gates.moveStatus(approved, "approved");
  assert.equal(moved.ok, true);

  const ready = { ...moved.piece, humanReviewed: true, rubric: base.rubric };
  const queued = gates.requestPublish(ready);
  assert.equal(queued.ok, true);
  assert.equal(queued.published, false);
  assert.equal(queued.code, "blocked_auth");

  const auto = gates.attemptAutoPublish(ready);
  assert.equal(auto.ok, false);
  assert.equal(auto.published, false);
  assert.equal(auto.code, "ai_cannot_publish");
  assert.equal(gates.requestPublish({ ...ready, status: "published" }).published, false);
});

test("แบบฝึก Academy และของที่ยังไม่พบถูกบันทึกในแผนที่", () => {
  const pipeline = loadYaml("content/media/pipeline.yaml");
  assert.deepEqual(
    pipeline.academy_lessons.map((item) => item.id),
    gates.LESSON_IDS,
  );
  const authored = pipeline.academy_authored.map((item) => item.id);
  assert.deepEqual(authored, [
    "evidence-board",
    "storyboard-worksheet",
    "publish-simulation",
    "synthetic-campaign",
  ]);
  const missing = pipeline.missing_sources.map((item) => item.id);
  assert.ok(missing.includes("nirva-ai-live"));
  assert.ok(missing.includes("storyboard-module"));
  assert.ok(missing.includes("live-oauth-publish"));
});

test("แคมเปญสังเคราะห์เดินทั้งไพป์ไลน์ แต่ห้ามเผยแพร่", () => {
  const campaign = loadYaml("content/media/campaign-lan-nangsue.yaml");
  const piece = gates.applySyntheticCampaign(campaign);
  assert.equal(campaign.kind, "synthetic");
  assert.equal(campaign.not_real_data, true);
  assert.equal(piece.storyboardSource, "academy-worksheet");
  assert.equal(gates.briefStageOk(piece), true);
  assert.equal(gates.scriptStageOk(piece), true);
  assert.equal(gates.canEnterReview(piece), true);
  const skipped = gates.moveStatus(piece, "published");
  assert.equal(skipped.ok, false);
  assert.equal(skipped.error, "ai_cannot_publish");
  const reviewed = {
    ...piece,
    status: "approved",
    humanReviewed: true,
    rubric: gates.RUBRIC.map((item) => item.id),
  };
  const queued = gates.requestPublish(reviewed);
  assert.equal(queued.ok, true);
  assert.equal(queued.published, false);
  assert.equal(queued.code, "blocked_auth");
  const auto = gates.attemptAutoPublish(reviewed);
  assert.equal(auto.published, false);
  assert.equal(auto.code, "ai_cannot_publish");
});
