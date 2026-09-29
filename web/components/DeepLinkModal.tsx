"use client";

import React, { useState } from "react";
import { Download, X, Smartphone, Check, Copy, ExternalLink, Code2, Globe } from "lucide-react";
import { AppItem } from "@/lib/types";

interface DeepLinkModalProps {
  app: AppItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeepLinkModal({ app, isOpen, onClose }: DeepLinkModalProps) {
  const [copiedPackage, setCopiedPackage] = useState(false);

  if (!isOpen || !app) return null;

  const searchQuery = app.packageName || app.name;

  const copySearchTerm = () => {
    navigator.clipboard.writeText(searchQuery);
    setCopiedPackage(true);
    setTimeout(() => setCopiedPackage(false), 2000);
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
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-foreground shrink-0" />
            <span className="text-xs font-semibold text-foreground">
              Install via ShizuStore (Recommended)
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Open the <strong>ShizuStore</strong> app on your Android device and search for this package to install with Shizuku permissions:
          </p>

          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-background border border-border">
            <span className="text-xs font-mono text-foreground truncate select-all">
              {searchQuery}
            </span>
            <button
              onClick={copySearchTerm}
              type="button"
              className="px-2.5 py-1 rounded-md bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
              title="Copy search query"
            >
              {copiedPackage ? (
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

          <a
            href="https://github.com/timschneeb/ShizuStore/releases/latest"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-8 rounded-lg bg-primary text-primary-foreground hover:opacity-90 text-xs font-medium flex items-center justify-center gap-1.5 transition-opacity"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ShizuStore APK</span>
          </a>
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
