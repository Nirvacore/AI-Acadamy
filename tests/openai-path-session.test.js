const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const yaml = require("js-yaml");
const boundary = require("../lib/product-boundary");

const root = path.join(__dirname, "..");

function openaiSheetBlock() {
  const src = fs.readFileSync(path.join(root, "lib/nowdo.ts"), "utf8");
  const start = src.indexOf('"openai-path":');
  const end = src.indexOf('"core-00":');
  assert.equal(start >= 0 && end > start, true, "ไม่มีชีต openai-path ใน nowdo");
  return src.slice(start, end);
}

test("นั่ง OpenAI มีหกขั้นลงมือ หลักฐาน และ CTA ใน Academy", () => {
  const sheet = openaiSheetBlock();
  const steps = [...sheet.matchAll(/text: "([^"]+)"/g)].map((match) => match[1]);
  assert.equal(sheet.includes("๑๐–๑๕"), true);
  assert.equal(steps.length, 6, steps.join(" | "));
  const texts = steps.join(" ");
  assert.equal(/เปิด ChatGPT/.test(texts), true);
  assert.equal(/UI ไม่แสดง/.test(texts), true);
  assert.equal(/โจทย์/.test(texts), true);
  assert.equal(/สองรอบ/.test(texts) && /สองโมเดล/.test(texts), true);
  assert.equal(/เวลา/.test(texts) && /ความชัด/.test(texts) && /หลักฐาน/.test(texts), true);
  assert.equal(/โมเดลทำงานอย่างไร/.test(texts), true);
  assert.equal(/ยืนยัน/.test(texts), true);
  assert.equal(texts.includes("Nirva Media"), false);
  assert.equal(texts.includes("Nirva AI"), false);

  const page = fs.readFileSync(path.join(root, "app/tracks/openai/page.tsx"), "utf8");
  assert.equal(page.includes("NowDo"), true);
  assert.equal(page.includes("CheckQuiz"), true);
  assert.equal(page.includes("Journal"), true);
  assert.equal(page.includes("ProgressMark"), true);
  assert.equal(page.includes("ProductBoundaryNote"), true);
  assert.equal(page.includes('href="#nowdo"'), true);
  assert.equal(page.includes('href="/learn/how-models-work?track=openai"'), true);
  assert.equal(page.includes('href="/start'), false);
  assert.equal(page.includes('href="/media'), false);
  assert.equal(boundary.isInternalRoute("#nowdo"), true);
  assert.equal(boundary.isInternalRoute("/learn/how-models-work?track=openai"), true);
  assert.equal(boundary.isPrimaryCtaLabel("เริ่มนั่งนี้"), true);

  const md = fs.readFileSync(path.join(root, "content/tracks/openai-path.md"), "utf8");
  assert.equal(md.includes("แผนและเวอร์ชัน"), true);
  assert.equal(md.includes("ห้ามแต่งภาพ"), true);
  assert.equal(md.includes("## อ่านต้นฉบับ"), true);
  const extra = md.slice(md.indexOf("## อ่านต้นฉบับ"));
  assert.equal(extra.includes("academy.openai.com"), true);
  assert.equal(extra.includes("help.openai.com"), true);
  const body = md.slice(0, md.indexOf("## อ่านต้นฉบับ"));
  assert.equal(body.includes("https://"), false);
  assert.equal(md.includes("/media"), false);
  assert.equal(md.includes("Nirva Media"), false);
  assert.equal(md.includes("Nirva AI"), false);

  const journal = page.slice(page.indexOf("<Journal"), page.indexOf("<ProgressMark"));
  assert.equal(journal.includes("UI ไม่แสดง"), true);
  assert.equal(journal.includes("เวลา"), true);
  assert.equal(journal.includes("how-models-work") || journal.includes("โมเดลทำงานอย่างไร"), true);

  const checks = yaml.load(fs.readFileSync(path.join(root, "content/checks.yaml"), "utf8"));
  const items = checks.checks["openai-path"];
  assert.ok(items.length >= 4);
  assert.equal(
    items.some((item) => item.q.includes("academy.openai.com") && item.answer === 1),
    true,
  );
  assert.equal(
    items.some((item) => item.q.includes("ยืนยัน") && /คนเรียนกดเอง/.test(item.choices[item.answer])),
    true,
  );
  assert.equal(
    items.some((item) => /เทียบ/.test(item.q) && /เวลา/.test(item.choices[item.answer]) && /ความชัด/.test(item.choices[item.answer])),
    true,
  );
  assert.equal(JSON.stringify(items).includes("Nirva Media"), false);
});
