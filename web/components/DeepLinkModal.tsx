"use client";

import React, { useState } from "react";
import { Download, X, Smartphone, Check, Copy, ExternalLink, Code2, Globe } from "lucide-react";
import { AppItem } from "@/lib/types";

import { getShizuStoreDeepLink } from "@/lib/deeplink";

interface DeepLinkModalProps {
  app: AppItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeepLinkModal({ app, isOpen, onClose }: DeepLinkModalProps) {
  const [copiedKey, setCopiedKey] = useState<"package" | "deeplink" | null>(null);

  if (!isOpen || !app) return null;

  const searchQuery = app.packageName || app.name;
  const deepLink = app.shizuStoreDeepLink || getShizuStoreDeepLink(app.slug, app.packageName);

  const handleCopy = (text: string, key: "package" | "deeplink") => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5 text-foreground"
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

        {/* App Header */}
        <div className="flex items-center gap-3.5 pr-6">
          <div className="w-12 h-12 rounded-xl bg-secondary p-1 flex items-center justify-center overflow-hidden shrink-0">
            {app.iconUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={app.iconUrl}
                alt={app.name}
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <span className="text-base font-semibold text-muted-foreground">
                {app.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-foreground truncate">
              Install {app.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {app.authorName ? `by ${app.authorName}` : "Shizuku-compatible application"}
              {app.versionName && ` • v${app.versionName}`}
            </p>
          </div>
        </div>

        {/* ShizuStore Guide Box */}
        <div className="p-4 rounded-xl border border-border bg-secondary/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-foreground shrink-0" />
              <span className="text-xs font-semibold text-foreground">
                Install via ShizuStore
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground font-mono">
              v1.4.0+
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Open directly in ShizuStore on your Android device to install silently with Shizuku permissions:
          </p>

          {/* Direct Custom Protocol Deep Link */}
          <a
            href={deepLink}
            className="w-full h-9 rounded-lg bg-primary text-primary-foreground hover:opacity-90 text-xs font-semibold flex items-center justify-center gap-2 transition-opacity"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in ShizuStore App</span>
          </a>

          {/* Deep link copy box */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Direct Deep Link:</span>
              <span className="text-[10px] font-mono text-muted-foreground">shizustore://</span>
            </div>
            <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-background border border-border">
              <span className="text-xs font-mono text-foreground truncate select-all">
                {deepLink}
              </span>
              <button
                onClick={() => handleCopy(deepLink, "deeplink")}
                type="button"
                className="px-2.5 py-1 rounded-md bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
                title="Copy deep link URL"
              >
                {copiedKey === "deeplink" ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Manual Package Search */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] text-muted-foreground block">
              Or search manually in ShizuStore:
            </span>
            <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-background border border-border">
              <span className="text-xs font-mono text-foreground truncate select-all">
                {searchQuery}
              </span>
              <button
                onClick={() => handleCopy(searchQuery, "package")}
                type="button"
                className="px-2.5 py-1 rounded-md bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
                title="Copy search query"
              >
                {copiedKey === "package" ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-border/60">
            <a
              href="https://github.com/timschneeb/ShizuStore/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-8 rounded-lg border border-border bg-background hover:bg-secondary text-foreground text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Need the app? Download ShizuStore APK</span>
            </a>
          </div>
        </div>

        {/* Direct Source Links */}
        <div className="space-y-2">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
            Direct & Source Links
          </span>
          <div className="grid grid-cols-2 gap-2">
            {app.sourceUrl && (
              <a
                href={app.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 px-3 rounded-lg border border-border bg-background hover:bg-secondary text-foreground text-xs font-medium flex items-center justify-center gap-1.5 transition-colors truncate"
              >
                <Code2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Source Code</span>
              </a>
            )}

            {app.playStoreUrl && (
              <a
                href={app.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 px-3 rounded-lg border border-border bg-background hover:bg-secondary text-foreground text-xs font-medium flex items-center justify-center gap-1.5 transition-colors truncate"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Google Play</span>
              </a>
            )}

            {app.fdroidUrl && (
              <a
                href={app.fdroidUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 px-3 rounded-lg border border-border bg-background hover:bg-secondary text-foreground text-xs font-medium flex items-center justify-center gap-1.5 transition-colors truncate"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">F-Droid</span>
              </a>
            )}

            {app.websiteUrl && (
              <a
                href={app.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 px-3 rounded-lg border border-border bg-background hover:bg-secondary text-foreground text-xs font-medium flex items-center justify-center gap-1.5 transition-colors truncate"
              >
                <Globe className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Website</span>
              </a>
            )}

            {!app.sourceUrl && !app.playStoreUrl && !app.fdroidUrl && !app.websiteUrl && app.url && (
              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 h-8 px-3 rounded-lg border border-border bg-background hover:bg-secondary text-foreground text-xs font-medium flex items-center justify-center gap-1.5 transition-colors truncate"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Upstream Project Page</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
