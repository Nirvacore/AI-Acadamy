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
    else if (/\.(html|js)$/.test(name)) acc.push({ file: full, text: fs.readFileSync(full, "utf8") });
  }
  return acc;
}

function pageTitle(html) {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  assert.equal(Boolean(match), true, "static HTML ไม่มี <title>");
  return match[1];
}

test("static /tracks/openai: title และ CTA ล็อกแทร็ก openai ในโดเมน", () => {
  const page = readFile("tracks/openai/index.html");
  const title = pageTitle(page);
  assert.equal(title.includes("แทร็ก OpenAI"), true, title);
  assert.equal(title.includes("Nirva Academy"), true, title);
  assert.equal(page.includes("แทร็ก OpenAI เรียนเป็นไทยใน Nirva Academy"), true);
  assert.equal(page.includes("#nowdo"), true);
  assert.equal(page.includes("เริ่มนั่งนี้"), true);
  assert.equal(page.includes("/learn/how-models-work?track=openai"), true);
  assert.equal(page.includes("เปิด ChatGPT"), true);
  assert.equal(page.includes("UI ไม่แสดง"), true);
  assert.equal(boundary.isInternalRoute("#nowdo"), true);
  assert.equal(page.includes("เอกสาร OpenAI"), false);
  assert.equal(page.includes("Nirva Academy"), true);
  assert.equal(page.includes("Nirva Media"), true);
  assert.equal(page.includes("Nirva AI"), true);
});

test("static /media: กรณีศึกษา แยกชื่อผลิตภัณฑ์ และลิงก์แทร็ก OpenAI", () => {
  const page = readFile("media/index.html");
  const title = pageTitle(page);
  assert.equal(title.includes("กรณีศึกษางานสื่อ"), true, title);
  assert.equal(page.includes("กรณีศึกษางานสื่อ"), true);
  assert.equal(page.includes("/learn/media-brief-evidence"), true);
  assert.equal(page.includes("/tracks/openai"), true);
  assert.equal(page.includes("เอกสาร OpenAI"), false);
  assert.equal(page.includes("Nirva Academy"), true);
  assert.equal(page.includes("Nirva Media"), true);
  assert.equal(page.includes("Nirva AI"), true);
});

test("static /: เป็นศูนย์การเรียนรู้สี่ฮับและเริ่มเรียนภายใน Academy", () => {
  const page = readFile("index.html");
  const title = pageTitle(page);
  assert.equal(title.includes("Nirva Academy"), true, title);
  for (const label of [
    "ศูนย์การเรียนรู้",
    "เส้นทางเรียน",
    "ฝึกปฏิบัติ",
    "สำรวจความรู้",
    "ความก้าวหน้า",
  ]) {
    assert.equal(page.includes(label), true, `หน้าแรกไม่มี «${label}»`);
  }
  for (const href of ["/start", "/lab/00-mirror-journal", "/syllabus", "/progress"]) {
    assert.equal(page.includes(`href="${href}/"`) || page.includes(`href="${href}"`), true, href);
    assert.equal(boundary.isInternalRoute(href), true, href);
  }
  assert.equal(page.includes("Nirva Media เป็นกรณีศึกษา"), true);
  assert.equal(page.includes("Nirva AI เป็นระบบอีกผลิตภัณฑ์หนึ่ง"), true);
});

test("static /learn/how-models-work: บทไทย แล็บภายใน และทางไปแทร็ก OpenAI", () => {
  const page = readFile("learn/how-models-work/index.html");
  const title = pageTitle(page);
  assert.equal(title.includes("โมเดลทำงานอย่างไร"), true, title);
  assert.equal(page.includes("โมเดลทำงานอย่างไร"), true);
  assert.equal(page.includes("เอกสาร OpenAI"), false);
  assert.equal(page.includes("/tracks/openai"), true);
  assert.equal(page.includes('href="/lab/01-fast-vs-smart/'), true);
  assert.equal(page.includes('href="/learn/hallucinations/'), true);
});

test("static chunks: เมนูหาแทร็กได้ details ปิด และลิงก์บริษัทเปิดแท็บใหม่", () => {
  const files = walkExport(path.join(out, "_next/static/chunks"));
  const blob = files.map((item) => item.text).join("\n");
  assert.equal(blob.includes("เริ่มเรียน"), true);
  assert.equal(blob.includes('href:"/tracks/openai"'), true);
  assert.equal(blob.includes("แทร็ก OpenAI"), true);
  assert.equal(blob.includes("เริ่มตอนที่"), true);
  assert.equal(blob.includes("source-fold"), true);
  assert.equal(blob.includes("ต้นฉบับภาษาอังกฤษ (ไม่จำเป็นต่อการจบบท)"), true);
  assert.equal(blob.includes('target:"_blank"'), true);
  assert.equal(blob.includes('rel:"noopener noreferrer"'), true);
  assert.equal(blob.includes('className:"source-fold"'), true);
  assert.equal(/className:"source-fold",open:/.test(blob), false);
  assert.equal(blob.includes('children:"เอกสาร OpenAI"'), false);
});
