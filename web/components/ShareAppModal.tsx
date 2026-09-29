"use client";

import React, { useState, useSyncExternalStore } from "react";
import { X, Check, Copy, Share2 } from "lucide-react";
import { AppItem } from "@/lib/types";

interface ShareAppModalProps {
  app: AppItem | null;
  isOpen: boolean;
  onClose: () => void;
}

type ShareFormat = "badge" | "markdown" | "url" | "html";

const subscribeEmpty = () => () => {};

export function ShareAppModal({ app, isOpen, onClose }: ShareAppModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ShareFormat>("badge");

  const origin = useSyncExternalStore(
    subscribeEmpty,
    () => window.location.origin,
    () => ""
  );

  if (!isOpen || !app) return null;

  const catalogUrl = origin ? `${origin}/apps/${app.slug}` : `/apps/${app.slug}`;
  const badgeImageUrl = "https://img.shields.io/badge/Get%20it%20on-ShizuStore-18181b?style=for-the-badge&logo=android&logoColor=white";

  const markdownBadgeSnippet = `[![Get it on ShizuStore](${badgeImageUrl})](${catalogUrl})`;
  const markdownLinkSnippet = `[Get it on ShizuStore - ${app.name}](${catalogUrl})`;
  const htmlSnippet = `<a href="${catalogUrl}" target="_blank" rel="noopener noreferrer"><img src="${badgeImageUrl}" alt="Get it on ShizuStore" /></a>`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5 text-foreground"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pr-6">
          <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-foreground shrink-0">
            <Share2 className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-foreground truncate">
              Get it on ShizuStore Badge
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {app.name}
            </p>
          </div>
        </div>

        {/* Live Badge Preview */}
        <div className="p-4 rounded-xl border border-border bg-secondary/30 flex flex-col items-center justify-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={badgeImageUrl}
            alt="Get it on ShizuStore"
            className="h-8 shadow-xs rounded"
          />
        </div>

        {/* Format Selector Pills */}
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-secondary/40 border border-border/60">
          <button
            type="button"
            onClick={() => setActiveTab("badge")}
            className={activeTab === "badge" ? "shadcn-pill-active justify-center text-center w-full" : "shadcn-pill justify-center text-center w-full border-transparent bg-transparent"}
          >
            <span>Badge</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("markdown")}
            className={activeTab === "markdown" ? "shadcn-pill-active justify-center text-center w-full" : "shadcn-pill justify-center text-center w-full border-transparent bg-transparent"}
          >
            <span>Markdown</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={activeTab === "url" ? "shadcn-pill-active justify-center text-center w-full" : "shadcn-pill justify-center text-center w-full border-transparent bg-transparent"}
          >
            <span>URL</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("html")}
            className={activeTab === "html" ? "shadcn-pill-active justify-center text-center w-full" : "shadcn-pill justify-center text-center w-full border-transparent bg-transparent"}
          >
            <span>HTML</span>
          </button>
        </div>

        {/* Code Content Container */}
        <div className="space-y-3">
          {activeTab === "badge" && (
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground font-medium block">
                Paste into your GitHub repository README.md:
              </span>
              <div className="relative">
                <pre className="p-3 rounded-lg bg-background border border-border text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap break-all pr-24">
                  {markdownBadgeSnippet}
                </pre>
                <button
                  type="button"
                  onClick={() => handleCopy(markdownBadgeSnippet, "badge")}
                  className="absolute top-2.5 right-2.5 h-7 px-2.5 rounded-md bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium flex items-center gap-1.5 transition-colors border border-border"
                >
                  {copiedKey === "badge" ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Badge</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === "markdown" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">
                  Standard Markdown text link:
                </span>
              </div>
              <div className="relative">
                <pre className="p-3 rounded-lg bg-background border border-border text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap break-all pr-24">
                  {markdownLinkSnippet}
                </pre>
                <button
                  type="button"
                  onClick={() => handleCopy(markdownLinkSnippet, "markdown")}
                  className="absolute top-2.5 right-2.5 h-7 px-2.5 rounded-md bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium flex items-center gap-1.5 transition-colors border border-border"
                >
                  {copiedKey === "markdown" ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === "url" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">
                  Direct web catalog URL:
                </span>
              </div>
              <div className="relative">
                <pre className="p-3 rounded-lg bg-background border border-border text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap break-all pr-24">
                  {catalogUrl}
                </pre>
                <button
                  type="button"
                  onClick={() => handleCopy(catalogUrl, "url")}
                  className="absolute top-2.5 right-2.5 h-7 px-2.5 rounded-md bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium flex items-center gap-1.5 transition-colors border border-border"
                >
                  {copiedKey === "url" ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === "html" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">
                  HTML snippet for websites or blogs:
                </span>
              </div>
              <div className="relative">
                <pre className="p-3 rounded-lg bg-background border border-border text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap break-all pr-24">
                  {htmlSnippet}
                </pre>
                <button
                  type="button"
                  onClick={() => handleCopy(htmlSnippet, "html")}
                  className="absolute top-2.5 right-2.5 h-7 px-2.5 rounded-md bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium flex items-center gap-1.5 transition-colors border border-border"
                >
                  {copiedKey === "html" ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy HTML</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-border flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            Target: <code className="font-mono text-foreground">{catalogUrl}</code>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 rounded-lg bg-secondary hover:bg-accent text-foreground text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
