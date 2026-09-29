import React from "react";
import { Download, ArrowRight } from "lucide-react";
import { getCatalog } from "@/lib/cache";
import { CatalogBrowser } from "@/components/CatalogBrowser";

export const revalidate = 3600;

export default async function HomePage() {
  const catalog = await getCatalog();
  const { apps, categories, stats } = catalog;

  return (
    <div className="space-y-16 py-12">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-5">
          {/* Subtle Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 text-xs text-muted-foreground font-mono">
            <span>awesome-shizuku catalog</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/60" />
            <span className="text-foreground">{stats.totalApps} applications</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            The Foundation for Shizuku Discovery
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Discover applications designed for elevated ADB capabilities without rooting.
            Browse repository metadata and install seamlessly via ShizuStore.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="https://github.com/timschneeb/ShizuStore/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto h-10 px-5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-opacity shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download ShizuStore APK</span>
            </a>

            <a
              href="#catalog"
              className="w-full sm:w-auto h-10 px-5 rounded-lg bg-secondary hover:bg-accent text-secondary-foreground text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </a>
          </div>

          {/* Seamless Stats Strip */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 pt-8">
            <div className="text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-foreground font-mono tracking-tight">
                {stats.totalApps}
              </span>
              <span className="text-xs text-muted-foreground">
                Verified Apps
              </span>
            </div>
            <div className="h-8 w-px bg-white/[0.08] hidden sm:block" />
            <div className="text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-foreground font-mono tracking-tight">
                {stats.totalCategories}
              </span>
              <span className="text-xs text-muted-foreground">
                Categories
              </span>
            </div>
            <div className="h-8 w-px bg-white/[0.08] hidden sm:block" />
            <div className="text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-foreground font-mono tracking-tight">
                {stats.openSourceApps}
              </span>
              <span className="text-xs text-muted-foreground">
                Open Source
              </span>
            </div>
            <div className="h-8 w-px bg-white/[0.08] hidden sm:block" />
            <div className="text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-foreground font-mono tracking-tight">
                {(stats.totalStars / 1000).toFixed(0)}k+
              </span>
              <span className="text-xs text-muted-foreground">
                GitHub Stars
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Workflow - Shadcn Cardviews */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              How the Ecosystem Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="shadcn-cardview p-6 space-y-2">
              <span className="text-[11px] font-mono text-muted-foreground block">01 / Setup</span>
              <h3 className="text-sm font-semibold text-foreground">
                Shizuku Service
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Runs a privileged process via ADB to provide system-level API access to normal apps on non-rooted Android devices.
              </p>
            </div>

            <div className="shadcn-cardview p-6 space-y-2">
              <span className="text-[11px] font-mono text-muted-foreground block">02 / Discover</span>
              <h3 className="text-sm font-semibold text-foreground">
                Web Catalog
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Fetches and parses the upstream awesome-shizuku repository, letting you browse, filter, search, and inspect app metadata.
              </p>
            </div>

            <div className="shadcn-cardview p-6 space-y-2">
              <span className="text-[11px] font-mono text-muted-foreground block">03 / Install</span>
              <h3 className="text-sm font-semibold text-foreground">
                Install via ShizuStore
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Click &quot;Get on ShizuStore&quot; to open the application in ShizuStore, which downloads and installs the official APK through Shizuku.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Catalog */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <CatalogBrowser
          initialApps={apps}
          categories={categories}
        />
      </section>
    </div>
  );
}
