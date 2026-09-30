"use client";

import React, { useState } from "react";
import { ExternalLink, X } from "lucide-react";

export function UnofficialBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-1">
      <div className="relative rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 text-foreground">
        {/* Left: Icon & Description */}
        <div className="flex items-center gap-3.5 min-w-0 pr-6 sm:pr-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-secondary border border-border p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/shizustore-icon.png"
              alt="ShizuStore"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
              Unofficial ShizuStore Web Portal
            </h4>
            <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed mt-0.5">
              This is an unofficial web portal for ShizuStore self-hosted by{" "}
              <a
                href="https://github.com/rdevz-ph"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground font-medium underline underline-offset-2 hover:opacity-80"
              >
                rdevz-ph
              </a>
              . Visit the official portal at{" "}
              <a
                href="https://shizustore.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground font-medium underline underline-offset-2 hover:opacity-80"
              >
                https://shizustore.com/
              </a>
              .
            </p>
          </div>
        </div>

        {/* Right: Action Button & Dismiss */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <a
            href="https://shizustore.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 px-4 rounded-full bg-primary text-primary-foreground hover:opacity-90 text-xs font-semibold flex items-center gap-1.5 transition-opacity shadow-xs"
          >
            <span>Official portal</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
