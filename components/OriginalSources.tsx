"use client";

import type { Track, TrackConcept } from "@/lib/curriculum";
import { TrackedLink } from "@/components/TrackSwitch";
import {
  classifyHref,
  OPTIONAL_EN_LABEL,
  OPENAI_PATH_HREF,
} from "@/lib/product-boundary";

export function OriginalSources({
  track,
  concept,
  lessonHref,
  labHref,
  showPathLink = true,
}: {
  track: Track;
  concept?: TrackConcept;
  lessonHref?: string;
  labHref?: string;
  showPathLink?: boolean;
}) {
  const productUrl = concept?.docsUrl ?? track.official_docs;
  const vendorUrl = track.official_learn;
  const productKind = classifyHref(productUrl);
  const vendorKind = classifyHref(vendorUrl);
  const showProduct = Boolean(productUrl) && productKind === "product-docs";
  const showVendor = Boolean(vendorUrl) && vendorKind === "vendor-academy";
  const extraVendor =
    Boolean(productUrl) &&
    productKind === "vendor-academy" &&
    productUrl !== vendorUrl;

  return (
    <div className="original-sources">
      {lessonHref ? (
        <p className="docs">
          <TrackedLink href={lessonHref}>เรียนบทนี้ใน Nirva Academy</TrackedLink>
        </p>
      ) : null}
      {labHref ? (
        <p className="docs">
          <TrackedLink href={labHref}>เปิดแล็บของบทนี้</TrackedLink>
        </p>
      ) : null}
      {showPathLink && track.id === "openai" ? (
        <p className="docs">
          <TrackedLink href={OPENAI_PATH_HREF}>เส้นทาง OpenAI ใน Nirva Academy</TrackedLink>
        </p>
      ) : null}
      <details className="source-fold">
        <summary>{OPTIONAL_EN_LABEL}</summary>
        <p>
          จบบทได้ใน Nirva Academy โดยไม่ต้องสมัครเว็บบริษัทอื่น ลิงก์ข้างใต้ไม่ใช่เอกสารของคอร์สนี้
        </p>
        {showProduct ? (
          <p>
            <a href={productUrl} target="_blank" rel="noreferrer">
              คู่มือผลิตภัณฑ์ {track.name} (อังกฤษ)
            </a>
          </p>
        ) : null}
        {showVendor ? (
          <p>
            <a href={vendorUrl} target="_blank" rel="noreferrer">
              หลักสูตรภาษาอังกฤษของบริษัท {track.name} — ไม่ใช่ Nirva Academy
            </a>
          </p>
        ) : null}
        {extraVendor ? (
          <p>
            <a href={productUrl} target="_blank" rel="noreferrer">
              หลักสูตรภาษาอังกฤษของบริษัท {track.name} — ไม่ใช่ Nirva Academy
            </a>
          </p>
        ) : null}
      </details>
    </div>
  );
}

export function ProductBoundaryNote() {
  return (
    <p className="media-local" role="note">
      เว็บนี้คือ <strong>Nirva Academy</strong> · <strong>Nirva Media</strong> เป็นผลิตภัณฑ์อีกตัว
      ใช้เป็นกรณีศึกษาเท่านั้น ไม่ใช่โมดูลใน Academy · <strong>Nirva AI</strong> เป็นระบบต้นทางอีกตัว
      ที่อ้างจากสแนปช็อต ไม่ได้ต่อเข้าเว็บนี้
    </p>
  );
}
