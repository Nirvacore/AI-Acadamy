"use client";

import Link from "next/link";
import { Children, Suspense, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { rewriteContentHref, type LessonStem } from "@/lib/links";
import { headingId } from "@/lib/outline";
import { useTrackId } from "@/components/TrackSwitch";

function flatten(children: ReactNode) {
  return Children.toArray(children)
    .map((child) => (typeof child === "string" || typeof child === "number" ? String(child) : ""))
    .join("");
}

function MarkdownLinks({ markdown, stems }: { markdown: string; stems: LessonStem[] }) {
  const track = useTrackId();

  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2({ children }) {
            const title = flatten(children);
            return <h2 id={headingId(title)}>{children}</h2>;
          },
          a({ href, children }) {
            const next = rewriteContentHref(href, stems);
            const external = next.startsWith("http");
            if (external) {
              return (
                <a href={next} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              );
            }
            const withTrack = !next.startsWith("#")
              ? `${next}${next.includes("?") ? "&" : "?"}track=${track}`
              : next;
            return <Link href={withTrack}>{children}</Link>;
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

export function MarkdownBody({ markdown, stems }: { markdown: string; stems: LessonStem[] }) {
  const split = markdown.search(/\n## (อ่านต้นฉบับ|อ่านคู่กัน)\s*\n/);
  const body = split >= 0 ? markdown.slice(0, split) : markdown;
  const extra = split >= 0 ? markdown.slice(split).replace(/^## [^\n]+\n/, "").trim() : "";

  return (
    <Suspense fallback={<div className="prose" />}>
      <MarkdownLinks markdown={body} stems={stems} />
      {extra ? (
        <details className="source-fold">
          <summary>อ่านเพิ่ม (ไม่จำเป็นต่อการจบบท)</summary>
          <p>
            ส่วนท้ายบทมีทั้งลิงก์ใน Nirva Academy และต้นฉบับอังกฤษของบริษัทอื่น ไม่ต้องอ่านเพื่อจบบท
            ต้นฉบับอังกฤษเปิดแท็บใหม่
          </p>
          <MarkdownLinks markdown={extra} stems={stems} />
        </details>
      ) : null}
    </Suspense>
  );
}
