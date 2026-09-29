"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Download,
  Star,
  ExternalLink,
  Shield,
  Tag,
  Smartphone,
  ArrowLeft,
  ChevronRight,
  FileCode,
  Globe,
  Package,
  Info,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { GithubIcon, GitlabIcon } from "./Icons";
import { AppItem } from "@/lib/types";
import { DeepLinkModal } from "./DeepLinkModal";
import { ShareAppModal } from "./ShareAppModal";
import { AppCard } from "./AppCard";

interface AppDetailViewProps {
  app: AppItem;
  relatedApps: AppItem[];
}

export function AppDetailView({ app, relatedApps }: AppDetailViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    } catch {
      return null;
    }
  };

  const formattedUpdated = formatDate(app.versionUpdatedAt || app.updatedAt);
  const formattedRelease = formatDate(app.releaseDate);

  const shizukuPermissions = app.permissions?.filter(
    (p) => p.toLowerCase().includes("shizuku") || p.toLowerCase().includes("dhizuku")
  ) || [];
  const otherPermissions = app.permissions?.filter(
    (p) => !p.toLowerCase().includes("shizuku") && !p.toLowerCase().includes("dhizuku")
  ) || [];

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Catalog
        </Link>
        <ChevronRight className="w-3 h-3 opacity-40" />
        <Link
          href={`/categories/${app.categorySlug}`}
          className="hover:text-foreground"
        >
          {app.category}
        </Link>
        <ChevronRight className="w-3 h-3 opacity-40" />
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {app.name}
        </span>
      </div>

      {/* Main Header Cardview */}
      <div className="shadcn-cardview p-6 sm:p-7">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Icon & Title */}
          <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-secondary p-1.5 flex items-center justify-center overflow-hidden shrink-0">
              {app.iconUrl && !imgError ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={app.iconUrl}
                  alt={app.name}
                  className="w-full h-full object-contain rounded-xl"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">
                  {app.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                  {app.name}
                </h1>
                {app.isRecommended && (
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary text-xs font-medium text-foreground">
                    Featured
                  </span>
                )}
                {app.versionName && (
                  <span className="px-2 py-0.5 rounded-md bg-secondary text-xs font-mono text-muted-foreground font-medium">
                    v{app.versionName}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                {app.authorName && (
                  <span>
                    by <strong className="text-foreground font-medium">{app.authorName}</strong>
                  </span>
                )}
                <span>•</span>
                <Link
                  href={`/categories/${app.categorySlug}`}
                  className="text-foreground hover:underline font-medium"
                >
                  {app.category}
                </Link>
                {app.license && (
                  <>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded bg-secondary text-[11px] text-muted-foreground">
                      {app.license}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => setModalOpen(true)}
              className="h-10 px-5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-opacity shadow-xs cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Get on ShizuStore</span>
            </button>

            <button
              type="button"
              onClick={() => setShareModalOpen(true)}
              className="h-10 px-5 rounded-lg border border-border bg-secondary hover:bg-accent text-foreground font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share & README Badge</span>
            </button>

            <a
              href="https://github.com/timschneeb/ShizuStore/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 py-0.5"
            >
              Need ShizuStore app? Download APK
            </a>
          </div>
        </div>

        {/* Secondary Links Bar */}
        <div className="mt-6 pt-5 border-t border-white/[0.04] flex items-center gap-2 flex-wrap text-xs">
          <button
            type="button"
            onClick={() => setShareModalOpen(true)}
            className="h-8 px-3 rounded-lg bg-secondary hover:bg-accent text-foreground flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Embed Badge</span>
          </button>
          {app.url && (
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 px-3 rounded-lg bg-secondary hover:bg-accent text-foreground flex items-center gap-1.5 transition-colors font-medium"
            >
              {app.sourceKind === "github" ? (
                <GithubIcon className="w-3.5 h-3.5" />
              ) : app.sourceKind === "gitlab" ? (
                <GitlabIcon className="w-3.5 h-3.5" />
              ) : (
                <ExternalLink className="w-3.5 h-3.5" />
              )}
              <span>Project Repository</span>
            </a>
          )}

          {app.sourceUrl && app.sourceUrl !== app.url && (
            <a
              href={app.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 px-3 rounded-lg bg-secondary hover:bg-accent text-foreground flex items-center gap-1.5 transition-colors font-medium"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Source Code</span>
            </a>
          )}

          {app.repoOwner && app.repoName && (
            <a
              href={`https://github.com/${app.repoOwner}/${app.repoName}/releases`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 px-3 rounded-lg bg-secondary hover:bg-accent text-foreground flex items-center gap-1.5 transition-colors font-medium"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Releases</span>
            </a>
          )}

          {app.playStoreUrl && (
            <a
              href={app.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 px-3 rounded-lg bg-secondary hover:bg-accent text-foreground flex items-center gap-1.5 transition-colors font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Google Play</span>
            </a>
          )}

          {app.fdroidUrl && (
            <a
              href={app.fdroidUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 px-3 rounded-lg bg-secondary hover:bg-accent text-foreground flex items-center gap-1.5 transition-colors font-medium"
            >
              <Package className="w-3.5 h-3.5" />
              <span>F-Droid</span>
            </a>
          )}

          {app.websiteUrl && (
            <a
              href={app.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 px-3 rounded-lg bg-secondary hover:bg-accent text-foreground flex items-center gap-1.5 transition-colors font-medium"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Official Website</span>
            </a>
          )}
        </div>
      </div>

      {/* Grid: Details & Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Description, Changelog, Permissions (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Section */}
          <div className="shadcn-cardview p-6 space-y-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Info className="w-4 h-4 text-muted-foreground" />
              About Application
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {app.fullDescription || app.description}
            </p>
          </div>

          {/* Changelog / Release Notes */}
          {(app.changelog || app.releaseNotes) && (
            <div className="shadcn-cardview p-6 space-y-3">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                Release Notes & Changelog
              </h2>
              <div className="p-4 rounded-xl bg-secondary/60 text-xs text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {app.changelog || app.releaseNotes}
              </div>
            </div>
          )}

          {/* Android Permissions Breakdown */}
          {app.permissions && app.permissions.length > 0 && (
            <div className="shadcn-cardview p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  Declared Android Permissions
                </h2>
                <span className="text-xs text-muted-foreground font-mono">
                  {app.permissions.length} total
                </span>
              </div>

              {/* Shizuku Privileged Permissions */}
              {shizukuPermissions.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground" />
                    Shizuku API Permissions
                  </h3>
                  <div className="p-3.5 rounded-xl bg-secondary/60 space-y-1.5">
                    {shizukuPermissions.map((perm) => (
                      <div
                        key={perm}
                        className="text-xs font-mono text-foreground break-all flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
                        {perm}
                      </div>
                    ))}
                    <p className="text-[11px] text-muted-foreground pt-1">
                      This application connects to the Shizuku service to execute system-level operations with ADB elevated privileges.
                    </p>
                  </div>
                </div>
              )}

              {/* Other Permissions */}
              {otherPermissions.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground">
                    Standard Android Permissions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
                    {otherPermissions.map((perm) => (
                      <div
                        key={perm}
                        className="p-2 rounded-lg bg-secondary/40 text-[11px] font-mono text-muted-foreground truncate"
                        title={perm}
                      >
                        {perm.replace("android.permission.", "")}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Metadata Specifications Card (1 col) */}
        <div className="space-y-4">
          <div className="shadcn-cardview p-6 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Specifications
            </h2>

            <div className="space-y-3.5 text-xs divide-y divide-white/[0.04]">
              {/* Category */}
              <div className="pt-1 flex items-center justify-between">
                <span className="text-muted-foreground">Category</span>
                <Link
                  href={`/categories/${app.categorySlug}`}
                  className="font-medium text-foreground hover:underline"
                >
                  {app.category}
                </Link>
              </div>

              {/* Package Name */}
              {app.packageName && (
                <div className="pt-3 flex items-center justify-between">
                  <span className="text-muted-foreground">Package</span>
                  <span className="font-mono text-[11px] text-foreground truncate max-w-[160px]" title={app.packageName}>
                    {app.packageName}
                  </span>
                </div>
              )}

              {/* License */}
              <div className="pt-3 flex items-center justify-between">
                <span className="text-muted-foreground">License</span>
                <span className="font-medium text-foreground">
                  {app.license || "Proprietary"}
                </span>
              </div>

              {/* Stars */}
              {app.stars !== undefined && (
                <div className="pt-3 flex items-center justify-between">
                  <span className="text-muted-foreground">GitHub Stars</span>
                  <span className="font-mono font-medium text-foreground flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-muted-foreground" />
                    {app.stars.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Downloads / Installs */}
              {(app.installCount || app.downloadTotal) && (
                <div className="pt-3 flex items-center justify-between">
                  <span className="text-muted-foreground">Installs</span>
                  <span className="font-mono font-medium text-foreground flex items-center gap-1">
                    <Download className="w-3.5 h-3.5 text-muted-foreground" />
                    {(app.installCount || app.downloadTotal || 0).toLocaleString()}
                  </span>
                </div>
              )}

              {/* Android SDK */}
              {app.targetSdk && (
                <div className="pt-3 flex items-center justify-between">
                  <span className="text-muted-foreground">Target SDK</span>
                  <span className="font-mono text-foreground">
                    Android {app.targetSdk >= 34 ? "14+" : app.targetSdk} (API {app.targetSdk})
                  </span>
                </div>
              )}

              {/* Last Updated */}
              {formattedUpdated && (
                <div className="pt-3 flex items-center justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="text-foreground">{formattedUpdated}</span>
                </div>
              )}

              {/* Release Date */}
              {formattedRelease && (
                <div className="pt-3 flex items-center justify-between">
                  <span className="text-muted-foreground">Release Date</span>
                  <span className="text-foreground">{formattedRelease}</span>
                </div>
              )}

              {/* Root requirement */}
              <div className="pt-3 flex items-center justify-between">
                <span className="text-muted-foreground">Root Requirement</span>
                <span className="font-medium text-foreground">
                  {app.requiresRoot ? "Root Required" : "Rootless (Shizuku)"}
                </span>
              </div>
            </div>

            {/* ShizuStore Deep Link box */}
            <div className="pt-2">
              <div className="p-3.5 rounded-xl bg-secondary space-y-2">
                <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  ShizuStore Installation
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Install via ShizuStore to enable automatic updates and silent installations using Shizuku.
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full h-8 rounded-lg bg-primary text-primary-foreground hover:opacity-90 text-xs font-semibold transition-opacity"
                >
                  Install with ShizuStore
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Apps in Category */}
      {relatedApps.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-white/[0.04]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                More in {app.category}
              </h2>
              <p className="text-xs text-muted-foreground">
                Other applications in this category
              </p>
            </div>
            <Link
              href={`/categories/${app.categorySlug}`}
              className="text-xs font-medium text-foreground hover:underline flex items-center gap-1"
            >
              View all ({relatedApps.length + 1})
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedApps.slice(0, 3).map((rel) => (
              <AppCard
                key={rel.slug}
                app={rel}
                onGetOnShizuStore={() => setModalOpen(true)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Install Modal */}
      <DeepLinkModal
        app={app}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {/* Share & Badge Modal */}
      <ShareAppModal
        app={app}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  );
}
