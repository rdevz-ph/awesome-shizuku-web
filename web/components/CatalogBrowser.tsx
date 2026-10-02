"use client";

import React, { useState, useMemo, useSyncExternalStore } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  LayoutGrid,
  List,
} from "lucide-react";
import { AppItem, CategoryItem, SortOption } from "@/lib/types";
import { AppCard } from "./AppCard";
import { DeepLinkModal } from "./DeepLinkModal";
import { SortDropdown } from "./SortDropdown";

const subscribeViewMode = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getViewModeSnapshot = (): "grid" | "list" => {
  try {
    const val = localStorage.getItem("shizu_view_mode");
    if (val === "grid" || val === "list") return val;
  } catch {
    // Ignore in restricted environments
  }
  return "grid";
};

const getViewModeServerSnapshot = (): "grid" | "list" => "grid";

interface CatalogBrowserProps {
  initialApps: AppItem[];
  categories: CategoryItem[];
  selectedCategorySlug?: string;
  title?: string;
  subtitle?: string;
}

export function CatalogBrowser({
  initialApps,
  categories,
  selectedCategorySlug,
}: CatalogBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(
    selectedCategorySlug || "all"
  );
  const [sortBy, setSortBy] = useState<SortOption>("stars");
  const [filterOpenSourceOnly, setFilterOpenSourceOnly] = useState(false);
  const [filterFeaturedOnly, setFilterFeaturedOnly] = useState(false);
  const [filterFreeOnly, setFilterFreeOnly] = useState(false);
  const [filterRootlessOnly, setFilterRootlessOnly] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 24;

  // View mode (grid vs list) synchronized with localStorage
  const viewMode = useSyncExternalStore(
    subscribeViewMode,
    getViewModeSnapshot,
    getViewModeServerSnapshot
  );

  const handleViewModeChange = (mode: "grid" | "list") => {
    try {
      localStorage.setItem("shizu_view_mode", mode);
      window.dispatchEvent(new Event("storage"));
    } catch {
      // Ignore
    }
  };

  // Categories collapse/expand state
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const COLLAPSED_CATEGORY_LIMIT = 8;

  const visibleCategories = useMemo(() => {
    if (isCategoriesExpanded || categories.length <= COLLAPSED_CATEGORY_LIMIT) {
      return categories;
    }
    const sliced = categories.slice(0, COLLAPSED_CATEGORY_LIMIT);
    if (
      activeCategory !== "all" &&
      !sliced.some((c) => c.slug === activeCategory)
    ) {
      const activeCatItem = categories.find((c) => c.slug === activeCategory);
      if (activeCatItem) {
        return [...sliced, activeCatItem];
      }
    }
    return sliced;
  }, [categories, isCategoriesExpanded, activeCategory]);

  // Deep Link Modal state
  const [modalApp, setModalApp] = useState<AppItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleGetOnShizuStore = (app: AppItem) => {
    setModalApp(app);
    setModalOpen(true);
  };

  // Filtered and Sorted list
  const filteredApps = useMemo(() => {
    return initialApps.filter((app) => {
      // Category filter
      if (activeCategory !== "all") {
        if (app.categorySlug !== activeCategory) {
          return false;
        }
      }

      // Quick filter chips
      if (filterOpenSourceOnly && app.license.toLowerCase().includes("proprietary")) {
        return false;
      }
      if (filterFeaturedOnly && !app.isRecommended) {
        return false;
      }
      if (filterFreeOnly && (app.hasPaid || app.hasIap)) {
        return false;
      }
      if (filterRootlessOnly && app.requiresRoot) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = app.name.toLowerCase().includes(q);
        const matchDesc = app.description.toLowerCase().includes(q);
        const matchDev = app.authorName?.toLowerCase().includes(q);
        const matchCat = app.category.toLowerCase().includes(q);
        const matchRepo = app.repoName?.toLowerCase().includes(q) || app.url.toLowerCase().includes(q);
        const matchPackage = app.packageName?.toLowerCase().includes(q);

        if (!matchName && !matchDesc && !matchDev && !matchCat && !matchRepo && !matchPackage) {
          return false;
        }
      }

      return true;
    });
  }, [
    initialApps,
    activeCategory,
    searchQuery,
    filterOpenSourceOnly,
    filterFeaturedOnly,
    filterFreeOnly,
    filterRootlessOnly,
  ]);

  // Sorting
  const sortedApps = useMemo(() => {
    const list = [...filteredApps];
    switch (sortBy) {
      case "stars":
        return list.sort((a, b) => (b.stars || 0) - (a.stars || 0));
      case "downloads":
        return list.sort(
          (a, b) =>
            (b.installCount || b.downloadTotal || 0) -
            (a.installCount || a.downloadTotal || 0)
        );
      case "updated":
        return list.sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.versionUpdatedAt || 0).getTime();
          const dateB = new Date(b.updatedAt || b.versionUpdatedAt || 0).getTime();
          return dateB - dateA;
        });
      case "added":
        return list;
      case "alphabetical":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [filteredApps, sortBy]);

  // Page calculations
  const totalPages = Math.ceil(sortedApps.length / ITEMS_PER_PAGE);
  const paginatedApps = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedApps.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedApps, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 320, behavior: "smooth" });
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setFilterOpenSourceOnly(false);
    setFilterFeaturedOnly(false);
    setFilterFreeOnly(false);
    setFilterRootlessOnly(false);
    setCurrentPage(1);
  };

  return (
    <section className="w-full space-y-6" id="catalog">
      {/* Search and Filters Controls */}
      <div className="space-y-4">
        {/* Search input and sort controls */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search apps by name, description, developer, category, or package..."
              className="h-10 w-full rounded-xl bg-card border border-input pl-10 pr-9 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-foreground/30 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort selector */}
          <SortDropdown
            value={sortBy}
            onChange={(newSort) => {
              setSortBy(newSort);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Filter Badges & Toggle Chips - Shadcn Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setFilterFeaturedOnly(!filterFeaturedOnly);
              setCurrentPage(1);
            }}
            className={filterFeaturedOnly ? "shadcn-pill-active" : "shadcn-pill"}
          >
            {filterFeaturedOnly && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
            <span>Featured</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFilterOpenSourceOnly(!filterOpenSourceOnly);
              setCurrentPage(1);
            }}
            className={filterOpenSourceOnly ? "shadcn-pill-active" : "shadcn-pill"}
          >
            {filterOpenSourceOnly && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
            <span>Open Source</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFilterFreeOnly(!filterFreeOnly);
              setCurrentPage(1);
            }}
            className={filterFreeOnly ? "shadcn-pill-active" : "shadcn-pill"}
          >
            {filterFreeOnly && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
            <span>Free Only</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFilterRootlessOnly(!filterRootlessOnly);
              setCurrentPage(1);
            }}
            className={filterRootlessOnly ? "shadcn-pill-active" : "shadcn-pill"}
          >
            {filterRootlessOnly && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
            <span>Rootless Only</span>
          </button>

          {(searchQuery ||
            activeCategory !== "all" ||
            filterOpenSourceOnly ||
            filterFeaturedOnly ||
            filterFreeOnly ||
            filterRootlessOnly) && (
            <button
              type="button"
              onClick={resetFilters}
              className="shadcn-pill text-muted-foreground hover:text-foreground ml-auto"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* Categories pill selector - Shadcn Pills */}
        <div className="pt-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                setCurrentPage(1);
              }}
              className={activeCategory === "all" ? "shadcn-pill-active" : "shadcn-pill"}
            >
              <span>All Categories</span>
              <span className={activeCategory === "all" ? "shadcn-pill-count-active" : "shadcn-pill-count"}>
                {initialApps.length}
              </span>
            </button>

            {visibleCategories.map((cat) => {
              const isSelected = activeCategory === cat.slug;
              return (
                <button
                  type="button"
                  key={cat.slug}
                  onClick={() => {
                    setActiveCategory(cat.slug);
                    setCurrentPage(1);
                  }}
                  className={isSelected ? "shadcn-pill-active" : "shadcn-pill"}
                >
                  <span>{cat.name}</span>
                  <span className={isSelected ? "shadcn-pill-count-active" : "shadcn-pill-count"}>
                    {cat.appCount}
                  </span>
                </button>
              );
            })}

            {categories.length > COLLAPSED_CATEGORY_LIMIT && (
              <button
                type="button"
                onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                className="shadcn-pill text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
              >
                {isCategoriesExpanded ? (
                  <>
                    <span>Show less</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>Show more</span>
                    {categories.length > visibleCategories.length && (
                      <span className="shadcn-pill-count">
                        +{categories.length - visibleCategories.length}
                      </span>
                    )}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 gap-2">
        <div className="truncate">
          Showing <strong className="text-foreground">{sortedApps.length}</strong>{" "}
          {sortedApps.length === 1 ? "application" : "applications"}
          {activeCategory !== "all" && (
            <>
              {" "}
              in{" "}
              <strong className="text-foreground">
                {categories.find((c) => c.slug === activeCategory)?.name || activeCategory}
              </strong>
            </>
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="font-mono text-[11px] hidden sm:inline">
            Page {currentPage} of {totalPages || 1}
          </span>

          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-lg bg-card border border-border/70 shadow-2xs">
            <button
              type="button"
              onClick={() => handleViewModeChange("grid")}
              aria-label="Grid view"
              title="Grid view"
              className={`h-7 w-7 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-secondary text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleViewModeChange("list")}
              aria-label="List view"
              title="List view"
              className={`h-7 w-7 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-secondary text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* App Grid or List */}
      {paginatedApps.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedApps.map((app) => (
              <AppCard
                key={app.slug}
                app={app}
                layout="grid"
                onGetOnShizuStore={handleGetOnShizuStore}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {paginatedApps.map((app) => (
              <AppCard
                key={app.slug}
                app={app}
                layout="list"
                onGetOnShizuStore={handleGetOnShizuStore}
              />
            ))}
          </div>
        )
      ) : (
        <div className="py-20 text-center rounded-2xl bg-card border border-border p-8 space-y-3">
          <div className="w-10 h-10 mx-auto rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              No matching applications found
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              No applications match your query. Try resetting your search filters.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="h-8 px-3 rounded-lg bg-secondary text-foreground hover:bg-accent text-xs font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, idx) => {
              let pageNum = idx + 1;
              if (totalPages > 7) {
                if (currentPage > 4) {
                  pageNum = currentPage - 3 + idx;
                  if (pageNum > totalPages) pageNum = totalPages - (6 - idx);
                }
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === pageNum
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Deep Link Modal */}
      <DeepLinkModal
        app={modalApp}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModalApp(null);
        }}
      />
    </section>
  );
}
