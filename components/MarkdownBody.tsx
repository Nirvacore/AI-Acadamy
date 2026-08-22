import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { rewriteContentHref } from "@/lib/curriculum";

export function MarkdownBody({ markdown, track }: { markdown: string; track: string }) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ href, children }) {
            const next = rewriteContentHref(href);
            const external = next.startsWith("http");
            const withTrack =
              !external && !next.startsWith("#")
                ? `${next}${next.includes("?") ? "&" : "?"}track=${track}`
                : next;
            return (
              <a href={withTrack} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
                {children}
              </a>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
