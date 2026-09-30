import fs from "fs";
import path from "path";
import { CatalogData, AppItem, CategoryItem } from "@/lib/types";
import { fetchAwesomeShizukuSources } from "@/lib/awesome-shizuku/source";
import { parseAwesomeShizuku } from "@/lib/awesome-shizuku/parser";
import { normalizeApp, ShizuBackendApp } from "@/lib/metadata/normalize";
import { fetchLiveRepoReadme } from "@/lib/metadata/readme";

const CACHE_DIR = path.join(process.cwd(), ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "catalog.json");
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

let memoryCache: CatalogData | null = null;
let lastSyncTime = 0;
let isSyncing = false;

/**
 * Loads cached catalog from disk if present.
 */
function loadDiskCache(): CatalogData | null {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const content = fs.readFileSync(CACHE_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.apps) && Array.isArray(parsed.categories)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to read disk cache:", err);
  }
  return null;
}

/**
 * Saves catalog to disk cache.
 */
function saveDiskCache(data: CatalogData) {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to write disk cache:", err);
  }
}

/**
 * Fetches the backend apps from ShizuStore production API.
 */
async function fetchShizuStoreBackendApps(): Promise<Map<string, ShizuBackendApp>> {
  const map = new Map<string, ShizuBackendApp>();
  try {
    let page = 1;
    let hasMore = true;
    while (hasMore && page <= 5) {
      const res = await fetch(
        `https://shizustore.timschneeberger.me/v1/apps?page=${page}&pageSize=200`,
        {
          headers: { "User-Agent": "ShizuStoreWeb/1.0" },
          next: { revalidate: 3600 },
        }
      );
      if (!res.ok) break;
      const data = await res.json();
      if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
        hasMore = false;
        break;
      }

      for (const item of data.items) {
        if (item.slug) map.set(item.slug.toLowerCase(), item);
        if (item.name) map.set(item.name.toLowerCase(), item);
        if (item.packageName) map.set(item.packageName.toLowerCase(), item);
      }

      if (data.items.length < 200) {
        hasMore = false;
      } else {
        page++;
      }
    }
  } catch (err) {
    console.warn("Notice: could not reach ShizuStore backend API, will use awesome-shizuku source:", err);
  }
  return map;
}

/**
 * Performs full catalog synchronization.
 */
export async function syncCatalog(force: boolean = false): Promise<CatalogData> {
  if (!force && isSyncing && memoryCache) {
    return memoryCache;
  }
  isSyncing = true;

  try {
    console.log("Starting catalog synchronization from awesome-shizuku...");

    // 1. Fetch upstream markdown files
    const sources = await fetchAwesomeShizukuSources();

    // 2. Parse applications and categories
    const parsed = parseAwesomeShizuku(sources.readme, sources.closedSource);

    // 3. Fetch ShizuStore backend database
    const backendMap = await fetchShizuStoreBackendApps();

    // 4. Normalize and enrich each app
    const normalizedApps: AppItem[] = [];
    const seenSlugs = new Set<string>();

    for (const raw of parsed.apps) {
      const app = normalizeApp(raw, backendMap);

      // Ensure unique slug
      let uniqueSlug = app.slug;
      let counter = 1;
      while (seenSlugs.has(uniqueSlug)) {
        uniqueSlug = `${app.slug}-${counter++}`;
      }
      seenSlugs.add(uniqueSlug);
      app.slug = uniqueSlug;

      normalizedApps.push(app);
    }

    // 5. Update category app counts
    const categoryCounts = new Map<string, number>();
    for (const app of normalizedApps) {
      const count = categoryCounts.get(app.categorySlug) || 0;
      categoryCounts.set(app.categorySlug, count + 1);
    }

    const categories: CategoryItem[] = parsed.categories.map((c) => ({
      ...c,
      appCount: categoryCounts.get(c.slug) || c.appCount,
    }));

    // Calculate stats
    const totalApps = normalizedApps.length;
    const openSourceApps = normalizedApps.filter(
      (a) => a.license && !a.license.toLowerCase().includes("proprietary")
    ).length;
    const totalStars = normalizedApps.reduce((acc, a) => acc + (a.stars || 0), 0);

    const catalogData: CatalogData = {
      apps: normalizedApps,
      categories,
      stats: {
        totalApps,
        totalCategories: categories.length,
        openSourceApps,
        totalStars,
        lastSyncedAt: new Date().toISOString(),
      },
    };

    memoryCache = catalogData;
    lastSyncTime = Date.now();
    saveDiskCache(catalogData);

    console.log(
      `Catalog synchronization complete: ${totalApps} apps, ${categories.length} categories, ${totalStars} stars.`
    );
    return catalogData;
  } finally {
    isSyncing = false;
  }
}

/**
 * Gets the application catalog.
 * Serves from memory or disk cache immediately, and revalidates in the background if expired.
 */
export async function getCatalog(): Promise<CatalogData> {
  const now = Date.now();

  // Return fresh in-memory cache
  if (memoryCache && now - lastSyncTime < CACHE_TTL_MS) {
    return memoryCache;
  }

  // Try loading from disk
  if (!memoryCache) {
    memoryCache = loadDiskCache();
    if (memoryCache) {
      lastSyncTime = memoryCache.stats.lastSyncedAt
        ? new Date(memoryCache.stats.lastSyncedAt).getTime()
        : now;
    }
  }

  // If we have cache and it's slightly stale, revalidate in background
  if (memoryCache) {
    if (now - lastSyncTime >= CACHE_TTL_MS && !isSyncing) {
      syncCatalog(true).catch(console.error);
    }
    return memoryCache;
  }

  // No cache at all: bootstrap immediately
  return await syncCatalog(true);
}

/**
 * Gets a specific application by slug.
 */
export async function getAppBySlug(slug: string): Promise<AppItem | null> {
  const catalog = await getCatalog();
  const normalizedSlug = decodeURIComponent(slug).toLowerCase();
  const baseApp =
    catalog.apps.find((a) => a.slug.toLowerCase() === normalizedSlug) || null;

  if (!baseApp) return null;

  // Shallow copy to avoid mutating the base catalog item in memory
  const app: AppItem = { ...baseApp };

  // Fetch live README directly from app repository and backend enrichment in parallel
  const [liveReadmeResult] = await Promise.allSettled([
    fetchLiveRepoReadme(app),
    (async () => {
      if (!app.screenshots || app.screenshots.length === 0) {
        try {
          const res = await fetch(
            `https://shizustore.timschneeberger.me/v1/apps/${encodeURIComponent(app.slug)}`,
            {
              headers: { "User-Agent": "ShizuStoreWeb/1.0" },
              next: { revalidate: 3600 },
            }
          );
          if (res.ok) {
            const detail = await res.json();
            if (Array.isArray(detail.screenshots) && detail.screenshots.length > 0) {
              app.screenshots = detail.screenshots;
            }
            if (detail.fullDescription && !app.fullDescription) {
              app.fullDescription = detail.fullDescription;
            }
            if (detail.changelog && !app.changelog) {
              app.changelog = detail.changelog;
            }
            if (
              Array.isArray(detail.permissions) &&
              detail.permissions.length > 0 &&
              (!app.permissions || app.permissions.length === 0)
            ) {
              app.permissions = detail.permissions;
            }
          }
        } catch {
          // Fallback silently if offline or backend is unreachable
        }
      }
    })(),
  ]);

  // Prioritize live repo README if found
  if (liveReadmeResult.status === "fulfilled" && liveReadmeResult.value) {
    app.fullDescription = liveReadmeResult.value;
  }

  return app;
}

/**
 * Gets all categories.
 */
export async function getCategories(): Promise<CategoryItem[]> {
  const catalog = await getCatalog();
  return catalog.categories;
}
