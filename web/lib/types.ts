export interface AppItem {
  slug: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  parentCategory?: string;
  url: string;
  sourceUrl?: string;
  sourceKind?: 'github' | 'gitlab' | 'codeberg' | 'fdroid' | 'play' | 'other';
  authorName?: string;
  authorUrl?: string;
  license: string;
  isRecommended: boolean;
  hasPaid: boolean;
  hasIap: boolean;
  hasAds: boolean;
  requiresRoot: boolean;
  trialDays?: number | null;
  packageName?: string;
  versionName?: string;
  versionCode?: number;
  stars?: number;
  downloadTotal?: number;
  installCount?: number;
  iconUrl?: string;
  iconHash?: string;
  updatedAt?: string;
  versionUpdatedAt?: string;
  releaseDate?: string;
  releaseNotes?: string;
  changelog?: string;
  permissions?: string[];
  screenshots?: string[];
  repoOwner?: string;
  repoName?: string;
  minSdk?: number;
  targetSdk?: number;
  fullDescription?: string;
  playStoreUrl?: string;
  fdroidUrl?: string;
  websiteUrl?: string;
  shizuStoreDeepLink?: string;
  downloadUrl?: string;
}

export interface CategoryItem {
  slug: string;
  name: string;
  description?: string;
  appCount: number;
  parentSlug?: string;
  children?: string[];
}

export interface CatalogData {
  apps: AppItem[];
  categories: CategoryItem[];
  stats: {
    totalApps: number;
    totalCategories: number;
    openSourceApps: number;
    totalStars: number;
    lastSyncedAt: string;
  };
}

export type SortOption =
  | 'stars'
  | 'updated'
  | 'added'
  | 'downloads'
  | 'alphabetical';
