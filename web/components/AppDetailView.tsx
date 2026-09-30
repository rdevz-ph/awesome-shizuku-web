"use client";

import React, { useState, useRef } from "react";
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
  ChevronLeft,
  FileCode,
  Globe,
  Package,
  Info,
  CheckCircle2,
  Share2,
  Image as ImageIcon,
  ZoomIn,
  X,
  ChevronDown,
} from "lucide-react";
import { GithubIcon, GitlabIcon } from "./Icons";
import { AppItem } from "@/lib/types";
import { DeepLinkModal } from "./DeepLinkModal";
import { ShareAppModal } from "./ShareAppModal";
import { AppCard } from "./AppCard";
import { MarkdownViewer } from "./MarkdownViewer";

interface AppDetailViewProps {
  app: AppItem;
  relatedApps: AppItem[];
}

export function AppDetailView({ app, relatedApps }: AppDetailViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState<number | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isChangelogExpanded, setIsChangelogExpanded] = useState(false);
  const screenshotScrollRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    } catch {
      return null;
    }
  };

  const scrollScreenshots = (direction: "left" | "right") => {
    if (screenshotScrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      screenshotScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
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

  const descriptionContent = app.fullDescription || app.description || "";
  const isLongDescription = descriptionContent.length > 350 || descriptionContent.split("\n").length > 6;

  const changelogContent = app.changelog || app.releaseNotes || "";
  const isLongChangelog = changelogContent.length > 350 || changelogContent.split("\n").length > 6;

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
          {/* Screenshots Gallery */}
          {app.screenshots && app.screenshots.length > 0 && (
            <div className="shadcn-cardview p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">
                    Screenshots
                  </h2>
                  <span className="text-xs text-muted-foreground font-mono">
                    ({app.screenshots.length})
                  </span>
                </div>
                {app.screenshots.length > 2 && (
                  <div className="hidden sm:flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => scrollScreenshots("left")}
                      aria-label="Scroll left"
                      className="p-1 rounded-lg border border-border bg-secondary hover:bg-accent text-foreground transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollScreenshots("right")}
                      aria-label="Scroll right"
                      className="p-1 rounded-lg border border-border bg-secondary hover:bg-accent text-foreground transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Scrollable Screenshots Strip */}
              <div
                ref={screenshotScrollRef}
                className="flex items-center gap-3.5 overflow-x-auto pb-2 pt-1 scroll-smooth snap-x snap-mandatory focus:outline-none"
                tabIndex={0}
              >
                {app.screenshots.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedScreenshotIndex(idx)}
                    className="relative shrink-0 snap-center rounded-xl overflow-hidden border border-border bg-secondary/30 shadow-xs hover:border-foreground/40 hover:shadow-md transition-all group focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                    title={`View screenshot ${idx + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`${app.name} screenshot ${idx + 1}`}
                      className="h-64 sm:h-72 w-auto max-w-none object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-2 rounded-full bg-background/90 text-foreground shadow-md backdrop-blur-xs">
                        <ZoomIn className="w-4 h-4" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description Section */}
          <div className="shadcn-cardview p-6 space-y-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Info className="w-4 h-4 text-muted-foreground" />
              About Application
            </h2>

            <div className="relative">
              <div
                className={`transition-all duration-300 ${
                  isLongDescription && !isDescriptionExpanded
                    ? "max-h-80 overflow-hidden"
                    : ""
                }`}
              >
                <MarkdownViewer
                  content={descriptionContent}
                  repoOwner={app.repoOwner}
                  repoName={app.repoName}
                />
              </div>

              {isLongDescription && !isDescriptionExpanded && (
                <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-card via-card/80 to-transparent pointer-events-none" />
              )}
            </div>

            {isLongDescription && (
              <button
                type="button"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="w-full py-2 px-4 rounded-xl border border-border bg-secondary/40 hover:bg-secondary text-foreground text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{isDescriptionExpanded ? "Show Less" : "Show Full Description"}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isDescriptionExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
          </div>

          {/* Changelog / Release Notes */}
          {changelogContent && (
            <div className="shadcn-cardview p-6 space-y-4">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                Release Notes & Changelog
              </h2>

              <div className="relative">
                <div
                  className={`transition-all duration-300 ${
                    isLongChangelog && !isChangelogExpanded
                      ? "max-h-72 overflow-hidden"
                      : ""
                  }`}
                >
                  <MarkdownViewer
                    content={changelogContent}
                    repoOwner={app.repoOwner}
                    repoName={app.repoName}
                  />
                </div>

                {isLongChangelog && !isChangelogExpanded && (
                  <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-card via-card/80 to-transparent pointer-events-none" />
                )}
              </div>

              {isLongChangelog && (
                <button
                  type="button"
                  onClick={() => setIsChangelogExpanded(!isChangelogExpanded)}
                  className="w-full py-2 px-4 rounded-xl border border-border bg-secondary/40 hover:bg-secondary text-foreground text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{isChangelogExpanded ? "Show Less" : "Show Full Changelog"}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isChangelogExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
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

      {/* Screenshot Lightbox Modal */}
      {selectedScreenshotIndex !== null && app.screenshots && app.screenshots[selectedScreenshotIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedScreenshotIndex(null)}
        >
          <div
            className="relative max-w-4xl max-h-[92vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar with Counter and Close */}
            <div className="w-full flex items-center justify-between pb-3 text-white text-xs">
              <span className="font-mono bg-white/10 px-2.5 py-1 rounded-md">
                {selectedScreenshotIndex + 1} / {app.screenshots.length}
              </span>
              <button
                type="button"
                onClick={() => setSelectedScreenshotIndex(null)}
                aria-label="Close preview"
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image Preview with Nav Arrows */}
            <div className="relative flex items-center justify-center">
              {app.screenshots.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setSelectedScreenshotIndex(
                      (selectedScreenshotIndex - 1 + app.screenshots!.length) % app.screenshots!.length
                    )
                  }
                  aria-label="Previous screenshot"
                  className="absolute -left-12 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-colors hidden sm:flex cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={app.screenshots[selectedScreenshotIndex]}
                alt={`${app.name} screenshot ${selectedScreenshotIndex + 1}`}
                className="max-h-[82vh] max-w-[85vw] object-contain rounded-xl shadow-2xl border border-white/10"
              />

              {app.screenshots.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setSelectedScreenshotIndex((selectedScreenshotIndex + 1) % app.screenshots!.length)
                  }
                  aria-label="Next screenshot"
                  className="absolute -right-12 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-colors hidden sm:flex cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
