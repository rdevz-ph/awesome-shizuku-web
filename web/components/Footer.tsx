import React from "react";
import Link from "next/link";
import { Download, ExternalLink, Shield } from "lucide-react";
import { GithubIcon } from "./Icons";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/40 bg-background">
      {/* Notice Banner */}
      <div className="border-b border-border/30 py-4 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-muted-foreground/70 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-foreground">
                Web Catalog Notice
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-2xl leading-relaxed">
                This website is a browsable directory powered by the upstream{" "}
                <a
                  href="https://github.com/timschneeb/awesome-shizuku"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 text-foreground"
                >
                  awesome-shizuku
                </a>{" "}
                repository. It does not install APKs or manage system permissions.
                To install and manage apps with Shizuku, use the official{" "}
                <a
                  href="https://github.com/timschneeb/ShizuStore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 text-foreground"
                >
                  ShizuStore
                </a>{" "}
                Android application.
              </p>
            </div>
          </div>
          <a
            href="https://github.com/timschneeb/ShizuStore/releases/latest"
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 shrink-0 hover:opacity-90 transition-opacity"
          >
            <Download className="w-3.5 h-3.5" />
            Get ShizuStore APK
          </a>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                S
              </div>
              <span className="font-semibold text-xs text-foreground">
                ShizuPortal
              </span>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              Curated directory of Shizuku-compatible Android apps with elevated privileges without root.
              Integrated with ShizuStore for safe on-device installation.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground mb-2.5">
              Ecosystem
            </h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>
                <a
                  href="https://github.com/timschneeb/ShizuStore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground flex items-center gap-1"
                >
                  ShizuStore Android App
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/timschneeb/ShizuStore/releases/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground flex items-center gap-1"
                >
                  Latest ShizuStore Release
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://shizuku.rikka.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground flex items-center gap-1"
                >
                  Official Shizuku Manager
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground mb-2.5">
              Source & Data
            </h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>
                <a
                  href="https://github.com/rdevz-ph/awesome-shizuku-web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground flex items-center gap-1.5"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  Web Catalog Source
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/timschneeb/awesome-shizuku"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground flex items-center gap-1.5"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  awesome-shizuku (Upstream)
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/timschneeb/awesome-shizuku/blob/master/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground flex items-center gap-1"
                >
                  Submit an App
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <Link
                  href="/api/catalog"
                  className="hover:text-foreground font-mono text-[11px]"
                >
                  Catalog JSON API
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ShizuPortal. Curated catalog for Shizuku apps.</p>
          <p className="font-mono text-[11px]">UI Inspired by Shadcn Neutral</p>
        </div>
      </div>
    </footer>
  );
}
