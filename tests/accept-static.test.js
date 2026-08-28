const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const boundary = require("../lib/product-boundary");

const root = path.join(__dirname, "..");
const out = path.join(root, "out");

function readFile(rel) {
  const file = path.join(out, rel);
  assert.equal(fs.existsSync(file), true, `missing ${rel} — รัน npm run build ก่อน`);
  return fs.readFileSync(file, "utf8");
}

function walkExport(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walkExport(full, acc);
    else if (/\.(html|js)$/.test(name)) acc.push(fs.readFileSync(full, "utf8"));
  }
  return acc;
}

function pageTitle(html) {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  assert.equal(Boolean(match), true, "static HTML ไม่มี <title>");
  return match[1];
}

function assertInternalCta(html, hrefPart, label) {
  assert.equal(html.includes(hrefPart), true, `ไม่มี ${hrefPart}`);
  assert.equal(html.includes(label), true, `ไม่มีป้าย ${label}`);
  assert.equal(boundary.isInternalRoute(hrefPart.split("&")[0]), true, `${hrefPart} ต้องเป็นเส้นใน Academy`);
}

function assertThreeNames(html, where) {
  assert.equal(html.includes("Nirva Academy"), true, `${where} ไม่มี Nirva Academy`);
  assert.equal(html.includes("Nirva Media"), true, `${where} ไม่มี Nirva Media`);
  assert.equal(html.includes("Nirva AI"), true, `${where} ไม่มี Nirva AI`);
  assert.equal(html.includes("เอกสาร OpenAI"), false, `${where} ยังมีป้ายเอกสาร OpenAI`);
}

test("static /tracks/openai: title CTA ล็อกแทร็ก และหาได้จากเมนู", () => {
  const page = readFile("tracks/openai/index.html");
  const title = pageTitle(page);
  assert.equal(title.includes("แทร็ก OpenAI"), true, title);
  assert.equal(title.includes("Nirva Academy"), true, title);
  assert.equal(page.includes("แทร็ก OpenAI เรียนเป็นไทยใน Nirva Academy"), true);
  assertInternalCta(page, "/start?track=openai", "เริ่มเรียนบทแรก");
  assertInternalCta(page, "/learn/how-models-work?track=openai", "เปิดบทโมเดล");
  assert.equal(page.includes("เริ่มที่นี่"), true);
  assert.equal(page.includes("แทร็ก OpenAI"), true);
  assert.equal(page.includes('href="/tracks/openai"') || page.includes("/tracks/openai"), true);
  assertThreeNames(page, "/tracks/openai");
});

test("static /media: กรณีศึกษา แยกชื่อผลิตภัณฑ์ CTA ในโดเมน และลิงก์แทร็ก", () => {
  const page = readFile("media/index.html");
  const title = pageTitle(page);
  assert.equal(title.includes("กรณีศึกษางานสื่อ"), true, title);
  assert.equal(page.includes("กรณีศึกษางานสื่อ"), true);
  assert.equal(page.includes("เริ่มตอนที่"), true);
  assert.equal(page.includes("/learn/media-brief-evidence"), true);
  assert.equal(page.includes("/tracks/openai"), true);
  assert.equal(page.includes("แทร็ก OpenAI"), true);
  assertThreeNames(page, "/media");
});

test("static /learn/how-models-work: บทไทย แล็บ/บทถัดไปภายใน และทางไปแทร็ก", () => {
  const page = readFile("learn/how-models-work/index.html");
  const title = pageTitle(page);
  assert.equal(title.includes("โมเดลทำงานอย่างไร"), true, title);
  assert.equal(page.includes("โมเดลทำงานอย่างไร"), true);
  assert.equal(page.includes("/tracks/openai"), true);
  assert.equal(page.includes("แทร็ก OpenAI"), true);
  assert.equal(page.includes('href="/lab/01-fast-vs-smart/'), true);
  assert.equal(page.includes('href="/learn/hallucinations/'), true);
  assert.equal(page.includes("เอกสาร OpenAI"), false);
});

test("static chunks: details ต้นฉบับปิดโดยค่าเริ่มต้น และลิงก์บริษัทเปิดแท็บใหม่", () => {
  const blob = walkExport(path.join(out, "_next/static/chunks")).join("\n");
  assert.equal(blob.includes("source-fold"), true);
  assert.equal(blob.includes("ต้นฉบับภาษาอังกฤษ (ไม่จำเป็นต่อการจบบท)"), true);
  assert.equal(blob.includes("_blank"), true);
  assert.equal(blob.includes("noopener noreferrer"), true);
  assert.equal(blob.includes("เอกสาร OpenAI"), false);
  assert.equal(blob.includes("เริ่มตอนที่"), true);
  assert.equal(blob.includes("แทร็ก OpenAI"), true);
  assert.equal(blob.includes('open:true') && /source-fold[\s\S]{0,80}open:true/.test(blob), false);
});
