/** ขอบผลิตภัณฑ์และลิงก์: Nirva Academy ≠ Nirva Media ≠ Nirva AI */

const VENDOR_ACADEMY_PATTERNS = [
  /^https?:\/\/academy\.openai\.com(?:\/|$)/i,
  /^https?:\/\/academy\.claude\.com(?:\/|$)/i,
  /^https?:\/\/(?:www\.)?cursor\.com\/learn(?:\/|$|\?)/i,
  /^https?:\/\/(?:www\.)?anthropic\.com\/learn(?:\/|$|\?)/i,
  /^https?:\/\/learn\.microsoft\.com\//i,
];

const PRODUCT_DOC_PATTERNS = [
  /^https?:\/\/(?:www\.)?cursor\.com\/docs(?:\/|$|\?)/i,
  /^https?:\/\/docs\.claude\.com(?:\/|$)/i,
  /^https?:\/\/platform\.openai\.com(?:\/|$)/i,
  /^https?:\/\/help\.openai\.com(?:\/|$)/i,
  /^https?:\/\/docs\.github\.com(?:\/|$)/i,
];

const SOURCE_REPO_PATTERNS = [
  /^https?:\/\/github\.com\/Nirvacore\/NirvaMedia/i,
  /^https?:\/\/github\.com\/Nirvacore\/nirva-AI/i,
];

const PRIMARY_CTA_RE =
  /เริ่มเรียน|เริ่มนั่งนี้|เริ่มตอน|เรียนตอนนี้|เรียนต่อ|ทบทวนเส้นทาง|ทบทวนตอนนี้|บทถัดไป|เริ่มบท|เปิดแล็บ|เรียนบทนี้ใน Nirva Academy/;

const FORBIDDEN_DOC_LABELS = [
  "เอกสาร OpenAI",
  "เอกสาร Claude",
  "เอกสาร Cursor",
  "เอกสาร Copilot",
  "เอกสาร GitHub",
];

const OPTIONAL_EN_LABEL = "ต้นฉบับภาษาอังกฤษ (ไม่จำเป็นต่อการจบบท)";

const MEDIA_CASE_LABEL = "กรณีศึกษาสื่อ";
const MEDIA_CASE_HREF = "/media";
const OPENAI_PATH_HREF = "/tracks/openai";

const PRODUCTS = {
  academy: "Nirva Academy",
  media: "Nirva Media",
  nirvaAi: "Nirva AI",
};

function isInternalRoute(href) {
  if (!href || typeof href !== "string") return false;
  const trimmed = href.trim();
  if (!trimmed) return false;
  if (/^(mailto:|tel:|javascript:)/i.test(trimmed)) return false;
  if (trimmed.startsWith("//")) return false;
  if (/^https?:\/\//i.test(trimmed)) return false;
  return trimmed.startsWith("/") || trimmed.startsWith("#") || trimmed.startsWith("?");
}

function classifyHref(href) {
  if (!href || typeof href !== "string") return "empty";
  if (isInternalRoute(href)) return "internal";
  if (VENDOR_ACADEMY_PATTERNS.some((re) => re.test(href))) return "vendor-academy";
  if (PRODUCT_DOC_PATTERNS.some((re) => re.test(href))) return "product-docs";
  if (SOURCE_REPO_PATTERNS.some((re) => re.test(href))) return "source-repo";
  if (/^https?:\/\//i.test(href)) return "external-other";
  return "unknown";
}

function isVendorAcademy(href) {
  return classifyHref(href) === "vendor-academy";
}

function isPrimaryCtaLabel(text) {
  return PRIMARY_CTA_RE.test(String(text || ""));
}

module.exports = {
  VENDOR_ACADEMY_PATTERNS,
  PRODUCT_DOC_PATTERNS,
  PRIMARY_CTA_RE,
  FORBIDDEN_DOC_LABELS,
  OPTIONAL_EN_LABEL,
  MEDIA_CASE_LABEL,
  MEDIA_CASE_HREF,
  OPENAI_PATH_HREF,
  PRODUCTS,
  isInternalRoute,
  classifyHref,
  isVendorAcademy,
  isPrimaryCtaLabel,
};
