"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface MarkdownViewerProps {
  content: string;
  repoOwner?: string;
  repoName?: string;
}

export function MarkdownViewer({ content, repoOwner, repoName }: MarkdownViewerProps) {
  const resolveUrl = (src?: string) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
      return src;
    }
    if (repoOwner && repoName) {
      const cleanPath = src.replace(/^\.?\//, "");
      return `https://raw.githubusercontent.com/${repoOwner}/${repoName}/HEAD/${cleanPath}`;
    }
    return src;
  };

  return (
    <div className="markdown-body text-xs sm:text-sm text-foreground/90 leading-relaxed space-y-3.5 break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ ...props }) => (
            <h1 className="text-lg sm:text-xl font-bold text-foreground border-b border-border pb-1.5 pt-3 first:pt-0" {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className="text-base sm:text-lg font-semibold text-foreground border-b border-border pb-1 pt-2.5" {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 className="text-sm sm:text-base font-semibold text-foreground pt-2" {...props} />
          ),
          p: ({ ...props }) => (
            <p className="leading-relaxed my-1.5" {...props} />
          ),
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground font-medium underline underline-offset-2 hover:opacity-75 transition-opacity"
              {...props}
            >
              {children}
            </a>
          ),
          ul: ({ ...props }) => (
            <ul className="list-disc list-outside pl-4 space-y-1 my-1.5" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className="list-decimal list-outside pl-4 space-y-1 my-1.5" {...props} />
          ),
          li: ({ ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),
          blockquote: ({ ...props }) => (
            <blockquote className="border-l-2 border-border pl-3 my-2 text-muted-foreground italic" {...props} />
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className && typeof children === "string" && !children.includes("\n");
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 rounded bg-secondary font-mono text-[11px] text-foreground border border-border/50" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <pre className="p-3 my-2 rounded-lg bg-secondary/80 border border-border font-mono text-xs overflow-x-auto text-foreground">
                <code {...props}>{children}</code>
              </pre>
            );
          },
          img: ({ src, alt, ...props }) => {
            const resolved = resolveUrl(typeof src === "string" ? src : "");
            return (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={resolved}
                alt={alt || "App image"}
                className="max-w-full h-auto rounded-lg inline-block my-1.5 shadow-xs"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
                {...props}
              />
            );
          },
          table: ({ ...props }) => (
            <div className="overflow-x-auto my-3 rounded-lg border border-border">
              <table className="w-full text-xs text-left" {...props} />
            </div>
          ),
          tr: ({ ...props }) => {
            const rest = { ...(props as React.HTMLAttributes<HTMLTableRowElement> & { vAlign?: string }) };
            delete rest.vAlign;
            return <tr {...rest} />;
          },
          th: ({ ...props }) => {
            const { vAlign, className = "", ...rest } = props as React.ThHTMLAttributes<HTMLTableCellElement> & { vAlign?: string };
            const alignClass = vAlign === "top" ? "align-top" : vAlign === "bottom" ? "align-bottom" : "";
            return (
              <th
                className={`p-2 border-b border-border bg-secondary/60 font-semibold text-foreground ${alignClass} ${className}`.trim()}
                {...rest}
              />
            );
          },
          td: ({ ...props }) => {
            const { vAlign, className = "", ...rest } = props as React.TdHTMLAttributes<HTMLTableCellElement> & { vAlign?: string };
            const alignClass = vAlign === "top" ? "align-top" : vAlign === "bottom" ? "align-bottom" : "";
            return (
              <td
                className={`p-2 border-b border-border/60 text-muted-foreground ${alignClass} ${className}`.trim()}
                {...rest}
              />
            );
          },
          hr: () => <hr className="my-4 border-border" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
