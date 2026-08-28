const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const yaml = require("js-yaml");
const boundary = require("../lib/product-boundary");

const root = path.join(__dirname, "..");
const tracks = ["cursor", "claude", "openai", "copilot"];

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === "out") continue;
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function loadTrack(id) {
  return yaml.load(fs.readFileSync(path.join(root, `content/tracks/${id}.yaml`), "utf8"));
}

test("academy.openai.com เป็น vendor-academy ไม่ใช่เอกสารผลิตภัณฑ์", () => {
  assert.equal(boundary.classifyHref("https://academy.openai.com/"), "vendor-academy");
  assert.equal(boundary.classifyHref("https://academy.openai.com"), "vendor-academy");
  assert.equal(boundary.classifyHref("https://platform.openai.com/docs"), "product-docs");
  assert.equal(boundary.classifyHref("https://help.openai.com/en/articles/8238121"), "product-docs");
  assert.equal(boundary.classifyHref("https://cursor.com/learn/agents"), "vendor-academy");
  assert.equal(boundary.classifyHref("https://cursor.com/docs/models"), "product-docs");
  assert.equal(boundary.classifyHref("https://academy.claude.com"), "vendor-academy");
  assert.equal(boundary.classifyHref("https://learn.microsoft.com/training/paths/copilot"), "vendor-academy");
  assert.equal(boundary.classifyHref("/learn/how-models-work"), "internal");
  assert.equal(boundary.classifyHref("/tracks/openai"), "internal");
  assert.equal(boundary.isInternalRoute("/start"), true);
  assert.equal(boundary.isInternalRoute("https://academy.openai.com"), false);
});

test("แทร็กทั้งสี่: official_learn คือหลักสูตรบริษัทอื่น และ docsUrl แนวคิดห้ามเป็น vendor-academy", () => {
  for (const id of tracks) {
    const track = loadTrack(id);
    assert.equal(boundary.classifyHref(track.official_learn), "vendor-academy", id);
    assert.equal(boundary.classifyHref(track.official_docs), "product-docs", id);
    for (const concept of track.concepts) {
      const kind = boundary.classifyHref(concept.docsUrl);
      assert.notEqual(kind, "vendor-academy", `${id} ${concept.conceptId} ${concept.docsUrl}`);
      assert.notEqual(kind, "internal", `${id} ${concept.conceptId}`);
    }
  }
  const openai = loadTrack("openai");
  assert.equal(openai.internal_path, boundary.OPENAI_PATH_HREF);
  assert.equal(openai.official_learn, "https://academy.openai.com");
});

test("CTA หลักใน UI ชี้ใน Academy และห้ามป้ายเอกสารบริษัทอื่น", () => {
  const files = walk(path.join(root, "app"))
    .concat(walk(path.join(root, "components")))
    .filter((file) => /\.(tsx|ts|jsx|js)$/.test(file));
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    for (const label of boundary.FORBIDDEN_DOC_LABELS) {
      assert.equal(text.includes(label), false, `${file} มี ${label}`);
    }
    assert.equal(text.includes("เอกสาร {track.name}"), false, file);
    assert.equal(/<a[^>]+href=\{concept(\?\.docsUrl|\.docsUrl)/.test(text), false, file);
    const ctaBlocks = [
      ...text.matchAll(/<(?:TrackedLink|a)([^>]*)>([\s\S]*?)<\/(?:TrackedLink|a)>/g),
    ];
    for (const match of ctaBlocks) {
      const attrs = match[1];
      const inner = match[2].replace(/\s+/g, " ").trim();
      if (!boundary.isPrimaryCtaLabel(inner)) continue;
      const href = attrs.match(/href=\{?["'`]([^"'`]+)["'`]/);
      if (!href) continue;
      assert.equal(
        boundary.isInternalRoute(href[1]),
        true,
        `${file} CTA «${inner}» ชี้ ${href[1]}`,
      );
    }
  }
  const coach = fs.readFileSync(path.join(root, "components/OriginalSources.tsx"), "utf8");
  assert.equal(coach.includes("target=\"_blank\""), true);
  assert.equal(coach.includes(boundary.OPTIONAL_EN_LABEL) || coach.includes("OPTIONAL_EN_LABEL"), true);
});

test("เส้นทาง OpenAI ภายในมีแบบฝึก เกตคนตรวจ และขอบผลิตภัณฑ์", () => {
  const page = fs.readFileSync(path.join(root, "app/tracks/openai/page.tsx"), "utf8");
  const md = fs.readFileSync(path.join(root, "content/tracks/openai-path.md"), "utf8");
  const checks = yaml.load(fs.readFileSync(path.join(root, "content/checks.yaml"), "utf8"));
  const hub = fs.readFileSync(path.join(root, "content/media/hub.md"), "utf8");
  const mediaPage = fs.readFileSync(path.join(root, "app/media/page.tsx"), "utf8");
  assert.equal(page.includes('href="/start?track=openai"'), true);
  assert.equal(page.includes('href="/learn/how-models-work?track=openai"'), true);
  assert.equal(page.includes("CheckQuiz"), true);
  assert.equal(page.includes('lessonId="openai-path"'), true);
  assert.equal(md.includes("academy.openai.com"), true);
  assert.equal(md.includes("ไม่ต้องสมัคร"), true);
  assert.equal(md.includes("Nirva Academy"), true);
  assert.equal(md.includes("Nirva Media"), true);
  assert.equal(md.includes("Nirva AI"), true);
  assert.ok(checks.checks["openai-path"].length >= 3);
  assert.equal(hub.includes("Nirva Academy"), true);
  assert.equal(hub.includes("Nirva Media"), true);
  assert.equal(hub.includes("Nirva AI"), true);
  assert.equal(hub.includes("กรณีศึกษาของผลิตภัณฑ์อีกตัว"), true);
  const note = fs.readFileSync(path.join(root, "components/OriginalSources.tsx"), "utf8");
  assert.equal(note.includes("ไม่ได้ต่อเข้าเว็บนี้"), true);
  assert.equal(mediaPage.includes("ProductBoundaryNote"), true);
  assert.equal(fs.existsSync(path.join(root, "app/tracks/openai/page.tsx")), true);
});

test("route ภายในไม่ถูก rewrite ทิ้ง", () => {
  const links = fs.readFileSync(path.join(root, "lib/links.ts"), "utf8");
  assert.equal(links.includes('if (href.startsWith("/")) return href;'), true);
});
