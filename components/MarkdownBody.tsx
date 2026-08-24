"use client";

import Link from "next/link";
import { Suspense } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { rewriteContentHref, type LessonStem } from "@/lib/links";
import { useTrackId } from "@/components/TrackSwitch";

function MarkdownLinks({ markdown, stems }: { markdown: string; stems: LessonStem[] }) {
  const track = useTrackId();

  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ href, children }) {
            const next = rewriteContentHref(href, stems);
            const external = next.startsWith("http");
            if (external) {
              return (
                <a href={next} target="_blank" rel="noreferrer">
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
  return (
    <Suspense fallback={<div className="prose" />}>
      <MarkdownLinks markdown={markdown} stems={stems} />
    </Suspense>
  );
}
