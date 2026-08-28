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

test("Media ไม่ใช่แทร็กบริษัทตัวที่ห้า", () => {
  const schema = loadYaml("content/schema.yaml");
  const pipeline = loadYaml("content/media/pipeline.yaml");
  assert.deepEqual(schema.tracks.available, ["cursor", "claude", "openai", "copilot"]);
  assert.equal(schema.tracks.available.includes("media"), false);
  assert.equal(pipeline.not_a_tool_track, true);
  assert.deepEqual(pipeline.tool_tracks, gates.TOOL_TRACKS);
  assert.equal(gates.isToolTrack("media"), false);
  assert.equal(gates.isToolTrack("cursor"), true);
});

test("ทุกแทร็กเครื่องมือมี media-lab เป็น labDelta ไม่ใช่แทร็กใหม่", () => {
  for (const id of gates.TOOL_TRACKS) {
    const track = loadYaml(`content/tracks/${id}.yaml`);
    const concept = track.concepts.find((item) => item.conceptId === "media-lab");
    assert.ok(concept, `${id} ต้องมี conceptId media-lab`);
    assert.ok(concept.labDelta && concept.labDelta.length > 12);
    assert.equal(track.id, id);
  }
});

test("schema มีโมดูลแล็บประยุกต์และไฟล์บทจริง", () => {
  const schema = loadYaml("content/schema.yaml");
  const module = schema.modules.find((item) => item.id === "track-media");
  assert.equal(module.phase, 3);
  assert.equal(module.lessons[0].id, "media-lab");
  for (const rel of [
    module.lessons[0].content,
    module.lessons[0].lab,
    module.lessons[0].script,
    "app/media/page.tsx",
    "content/media/pipeline.yaml",
  ]) {
    assert.equal(fs.existsSync(path.join(root, rel)), true, rel);
  }
});

test("STATUS_FLOW ในเกตตรงกับแผนที่ Media และห้ามข้าม review", () => {
  const pipeline = loadYaml("content/media/pipeline.yaml");
  assert.deepEqual(gates.STATUS_FLOW, pipeline.status_flow);
  assert.equal(gates.canTransition("draft", "review"), true);
  assert.equal(gates.canTransition("draft", "published"), false);
  assert.equal(gates.canTransition("review", "approved"), true);
  assert.equal(gates.canTransition("approved", "published"), true);
  const skipped = gates.moveStatus(gates.emptyPiece(), "published");
  assert.equal(skipped.ok, false);
  assert.equal(skipped.error, "ai_cannot_publish");
});

test("ประตูหลักฐานต้องมีพาธหรือไฟล์ต้นทาง", () => {
  assert.equal(gates.evidenceOk("ยังไม่พอ"), false);
  assert.equal(gates.evidenceOk("ฉันเชื่อเธอเพราะประโยคคล่องมากเลยนะ"), false);
  assert.equal(
    gates.evidenceOk("เปิดแล้วที่ upstream/nirva-ai/shared/media.ts บรรทัด STATUS_FLOW"),
    true,
  );
  assert.equal(
    gates.evidenceOk("อ่าน https://github.com/Nirvacore/NirvaMedia README แล้วจด brief"),
    true,
  );
});

test("ส่งตรวจได้เมื่อ brief หลักฐาน สคริปต์ และร่างครบ", () => {
  const piece = {
    ...gates.emptyPiece(),
    brief: "เปิดตัวคอร์สไทยให้ทีมการตลาดเห็นวงจร brief ถึงคิวโพสต์",
    evidence: "เปิด NirvaMedia/db/schema.ts ช่อง campaigns.brief แล้ว",
    script: "ตะขอ ปัญหา ทางออก ในสามจังหวะสำหรับ LINE OA",
    storyboard: "1 โลโก้ 2 ปัญหาทีม 3 คิว blocked_auth",
    assets: gates.buildLocalDrafts("เปิดตัวคอร์สไทยให้ทีมการตลาดเห็นวงจร brief ถึงคิวโพสต์"),
  };
  assert.equal(gates.canEnterReview(piece), true);
  const sent = gates.moveStatus(piece, "review");
  assert.equal(sent.ok, true);
  assert.equal(sent.piece.status, "review");
});

test("คนต้องรีวิวก่อนอนุมัติ และเธอห้ามเผยแพร่อัตโนมัติ", () => {
  const base = {
    ...gates.emptyPiece(),
    brief: "เปิดตัวคอร์สไทยให้ทีมการตลาดเห็นวงจร brief ถึงคิวโพสต์",
    evidence: "เปิด NirvaMedia/app/api/publish-jobs/route.ts แล้วเห็น blocked_auth",
    script: "ตะขอ ปัญหา ทางออก ในสามจังหวะสำหรับ LINE OA",
    assets: gates.buildLocalDrafts("เปิดตัวคอร์สไทย"),
    status: "review",
    humanReviewed: false,
    checklist: gates.CHECKLIST.map((item) => item.id),
  };
  assert.equal(gates.canApprove(base), false);
  assert.equal(gates.moveStatus(base, "approved").ok, false);
  const approved = { ...base, humanReviewed: true, status: "review" };
  assert.equal(gates.canApprove(approved), true);
  const moved = gates.moveStatus(approved, "approved");
  assert.equal(moved.ok, true);

  const ready = { ...moved.piece, humanReviewed: true, checklist: base.checklist };
  const queued = gates.requestPublish(ready);
  assert.equal(queued.ok, true);
  assert.equal(queued.published, false);
  assert.equal(queued.code, "blocked_auth");

  const auto = gates.attemptAutoPublish(ready);
  assert.equal(auto.ok, false);
  assert.equal(auto.published, false);
  assert.equal(auto.code, "ai_cannot_publish");
});

test("แผนที่ reuse อ้างไฟล์และของที่ยังไม่พบ", () => {
  const pipeline = loadYaml("content/media/pipeline.yaml");
  const ids = pipeline.reuse.map((stage) => stage.id);
  assert.deepEqual(ids, ["brief", "research", "script", "assets", "review", "publish_qa"]);
  assert.ok(pipeline.reuse.every((stage) => stage.files.length > 0));
  const missing = pipeline.missing_sources.map((item) => item.id);
  assert.ok(missing.includes("nirva-ai-live"));
  assert.ok(missing.includes("storyboard-module"));
  assert.ok(missing.includes("live-oauth-publish"));
});
