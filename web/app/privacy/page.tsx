import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ShieldCheck, Database, HardDrive, Cookie, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | ShizuPortal",
  description: "Privacy policy for ShizuPortal web directory. Transparent, minimal, and tracker-free.",
};

export default function PrivacyPage() {
  const lastUpdated = "October 2026";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Breadcrumb / Back Link */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Directory
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-2 mb-10 pb-6 border-b border-border/50">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-border/60 bg-muted/30 text-[11px] text-muted-foreground font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          Privacy and Data
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {lastUpdated}. Straightforward information about how ShizuPortal handles data.
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
        {/* Section 1: Overview */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            1. Overview
          </h2>
          <p className="text-muted-foreground">
            ShizuPortal is an open-source, browsable web catalog for Shizuku-compatible Android applications.
            We respect your privacy. This service does not require account registration, does not track individual users across the web, and does not sell personal information.
          </p>
        </section>

        {/* Section 2: No File Hosting */}
        <section className="space-y-3 p-4 rounded-lg border border-border/60 bg-muted/20">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-primary" />
            2. No APK Hosting or Distribution
          </h2>
          <p className="text-muted-foreground">
            This website does not host, store, or distribute Android application packages (APKs) or binary assets.
            All download and repository links redirect users directly to upstream developer sources, including GitHub, GitLab, Codeberg, F-Droid, or Google Play.
          </p>
        </section>

        {/* Section 3: Data Collection */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            3. Information We Collect
          </h2>
          <p className="text-muted-foreground">
            We collect the absolute minimum data required to deliver and protect the web portal:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Standard Server Logs:</strong> Like most web applications, our hosting infrastructure may temporarily log routine technical metadata (such as IP addresses, user agents, and request timestamps) strictly for performance diagnostics, DDoS defense, and infrastructure security.
            </li>
            <li>
              <strong className="text-foreground">No Account Data:</strong> We do not offer accounts, logins, or user profiles.
            </li>
          </ul>
        </section>

        {/* Section 4: Cookies and Local Storage */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Cookie className="w-4 h-4 text-primary" />
            4. Cookies and Local Storage
          </h2>
          <p className="text-muted-foreground">
            We do not use tracking cookies, advertising identifiers, or commercial telemetry scripts.
          </p>
          <p className="text-muted-foreground">
            We use your browser local storage solely to remember client-side preferences (such as light or dark theme selection) across visits.
          </p>
        </section>

        {/* Section 5: Third-Party Services */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            5. External Links and Third-Party Sources
          </h2>
          <p className="text-muted-foreground">
            Our catalog references external public resources, including the upstream awesome-shizuku repository, developer source repositories, and ShizuStore services.
            When navigating through external links or using third-party services, their respective privacy policies and terms apply.
          </p>
        </section>

        {/* Section 6: Open Source and Contact */}
        <section className="space-y-3 pt-4 border-t border-border/40">
          <h2 className="text-base font-semibold text-foreground">
            6. Questions and Source Code
          </h2>
          <p className="text-muted-foreground">
            The code powering this website is open source. If you have questions regarding this privacy policy or would like to review how the web application functions, you can view the repository or open an issue on GitHub:
          </p>
          <div>
            <a
              href="https://github.com/rdevz-ph/awesome-shizuku-web"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground underline underline-offset-4 hover:opacity-80"
            >
              github.com/rdevz-ph/awesome-shizuku-web
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
