"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Download, Smartphone } from "lucide-react";
import { AppItem } from "@/lib/types";

interface AppCardProps {
  app: AppItem;
  layout?: "grid" | "list";
  onGetOnShizuStore: (app: AppItem) => void;
}

export function AppCard({ app, layout = "grid", onGetOnShizuStore }: AppCardProps) {
  const [imgError, setImgError] = useState(false);

  const formatCount = (count?: number) => {
    if (!count) return null;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return null;
    }
  };

  const formattedDate = formatDate(app.versionUpdatedAt || app.updatedAt || app.releaseDate);

  if (layout === "list") {
    return (
      <div className="shadcn-cardview p-4 sm:p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
        {/* Left Section: Icon, Name, Category, Description */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <Link href={`/apps/${app.slug}`} className="shrink-0">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center overflow-hidden">
              {app.iconUrl && !imgError ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={app.iconUrl}
                  alt={app.name}
                  className="w-full h-full object-contain p-1 rounded-xl"
                  onError={() => setImgError(true)}
                  loading="lazy"
                />
              ) : (
                <span className="text-sm font-semibold text-muted-foreground">
                  {app.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </Link>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <Link href={`/apps/${app.slug}`}>
                <h3 className="font-semibold text-sm text-foreground hover:underline truncate tracking-tight">
                  {app.name}
                </h3>
              </Link>
              {app.versionName && (
                <span className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-secondary text-muted-foreground shrink-0 font-medium">
                  v{app.versionName}
                </span>
              )}
              <Link
                href={`/categories/${app.categorySlug}`}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
              >
                {app.category}
              </Link>
              {app.isRecommended && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-foreground/15 text-foreground">
                  Featured
                </span>
              )}
              {app.license && (
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary/70 text-muted-foreground">
                  {app.license}
                </span>
              )}
              {app.requiresRoot && (
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary/70 text-muted-foreground">
                  Root required
                </span>
              )}
              {app.hasPaid && (
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary/70 text-muted-foreground">
                  Paid
                </span>
              )}
              {app.hasIap && (
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary/70 text-muted-foreground">
                  IAP
                </span>
              )}
              {app.hasAds && (
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary/70 text-muted-foreground">
                  Ads
                </span>
              )}
            </div>

            <Link href={`/apps/${app.slug}`}>
              <p className="text-xs text-muted-foreground line-clamp-2 md:line-clamp-1 leading-relaxed hover:text-foreground transition-colors">
                {app.description}
              </p>
            </Link>

            {app.authorName && (
              <p className="text-[11px] text-muted-foreground/75 truncate">
                by {app.authorName}
              </p>
            )}
          </div>
        </div>

        {/* Right Section: Stats and Action */}
        <div className="flex items-center justify-between md:justify-end gap-3.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border/40">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {app.stars !== undefined && (
              <span className="flex items-center gap-1 font-mono text-[11px]" title={`${app.stars} stars`}>
                <Star className="w-3.5 h-3.5 text-muted-foreground/70" />
                {formatCount(app.stars)}
              </span>
            )}
            {app.installCount !== undefined && app.installCount > 0 && (
              <span className="flex items-center gap-1 font-mono text-[11px]" title={`${app.installCount} installs`}>
                <Download className="w-3.5 h-3.5 text-muted-foreground/70" />
                {formatCount(app.installCount)}
              </span>
            )}
            {formattedDate && (
              <span className="hidden lg:inline-block text-[11px] text-muted-foreground/60 font-mono" title={`Updated: ${formattedDate}`}>
                {formattedDate}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onGetOnShizuStore(app);
            }}
            className="h-8 px-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 text-xs font-medium flex items-center gap-1.5 transition-opacity shrink-0 cursor-pointer"
            title={`Get ${app.name} on ShizuStore`}
          >
            <Smartphone className="w-3 h-3" />
            <span>Get on ShizuStore</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shadcn-cardview p-5 flex flex-col justify-between">
      {/* Top Details */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <Link href={`/apps/${app.slug}`} className="flex items-center gap-3.5 flex-1 min-w-0">
            {/* App Icon */}
            <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center overflow-hidden shrink-0">
              {app.iconUrl && !imgError ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={app.iconUrl}
                  alt={app.name}
                  className="w-full h-full object-contain p-1 rounded-xl"
                  onError={() => setImgError(true)}
                  loading="lazy"
                />
              ) : (
                <span className="text-sm font-semibold text-muted-foreground">
                  {app.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Name & Developer */}
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm text-foreground hover:underline truncate tracking-tight">
                {app.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {app.authorName ? app.authorName : app.category}
              </p>
            </div>
          </Link>

          {/* Version badge */}
          {app.versionName && (
            <span className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-secondary text-muted-foreground shrink-0 font-medium">
              v{app.versionName}
            </span>
          )}
        </div>

        {/* Description */}
        <Link href={`/apps/${app.slug}`}>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4 hover:text-foreground transition-colors">
            {app.description}
          </p>
        </Link>

        {/* Soft, filled pills without wireframe box lines */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          <Link
            href={`/categories/${app.categorySlug}`}
            className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
          >
            {app.category}
          </Link>

          {app.license && (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary/70 text-muted-foreground">
              {app.license}
            </span>
          )}

          {app.isRecommended && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-foreground/15 text-foreground">
              Featured
            </span>
          )}

          {app.requiresRoot && (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary/70 text-muted-foreground">
              Root required
            </span>
          )}

          {app.hasPaid && (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary/70 text-muted-foreground">
              Paid
            </span>
          )}
          {app.hasIap && (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary/70 text-muted-foreground">
              IAP
            </span>
          )}
          {app.hasAds && (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary/70 text-muted-foreground">
              Ads
            </span>
          )}
        </div>
      </div>

      {/* Footer / Stats & Action */}
      <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {app.stars !== undefined && (
            <span className="flex items-center gap-1 font-mono text-[11px]" title={`${app.stars} stars`}>
              <Star className="w-3 h-3 text-muted-foreground/70" />
              {formatCount(app.stars)}
            </span>
          )}
          {app.installCount !== undefined && app.installCount > 0 && (
            <span className="flex items-center gap-1 font-mono text-[11px]" title={`${app.installCount} installs`}>
              <Download className="w-3 h-3 text-muted-foreground/70" />
              {formatCount(app.installCount)}
            </span>
          )}
          {formattedDate && (
            <span className="hidden sm:inline-block text-[11px] text-muted-foreground/60 font-mono" title={`Updated: ${formattedDate}`}>
              {formattedDate}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onGetOnShizuStore(app);
          }}
          className="h-8 px-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 text-xs font-medium flex items-center gap-1.5 transition-opacity shrink-0"
          title={`Get ${app.name} on ShizuStore`}
        >
          <Smartphone className="w-3 h-3" />
          <span>Get on ShizuStore</span>
        </button>
      </div>
    </div>
  );
}
