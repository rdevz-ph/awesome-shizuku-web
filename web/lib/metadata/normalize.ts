import { AppItem } from "@/lib/types";
import { ParsedRawApp, slugify } from "@/lib/awesome-shizuku/parser";
import { parseGitHubRepo, GitHubRepoMeta } from "@/lib/github/api";
import { parseGitLabRepo, GitLabRepoMeta } from "@/lib/gitlab/api";

export interface ShizuBackendApp {
  slug: string;
  name: string;
  description?: string;
  license?: string;
  packageName?: string;
  versionName?: string;
  versionCode?: number;
  iconHash?: string;
  categorySlug?: string;
  updatedAt?: string;
  stars?: number;
  downloadTotal?: number;
  installCount?: number;
  authorName?: string;
  authorUrl?: string;
  permissions?: string[];
  screenshots?: string[];
  fullDescription?: string;
  changelog?: string;
  minSdk?: number;
  targetSdk?: number;
  url?: string;
  sourceUrl?: string;
}

const SHIZUSTORE_BASE_URL = "https://shizustore.timschneeberger.me";

/**
 * Normalizes raw parsed app and enriches with GitHub/GitLab and ShizuStore backend data.
 */
export function normalizeApp(
  raw: ParsedRawApp,
  backendMap: Map<string, ShizuBackendApp> = new Map(),
  gitHubMetaMap: Map<string, GitHubRepoMeta> = new Map(),
  gitLabMetaMap: Map<string, GitLabRepoMeta> = new Map()
): AppItem {
  const baseSlug = slugify(raw.name);
  const categorySlug = slugify(raw.category);

  // Check matching in backend map by slug, URL, or name
  const backend =
    backendMap.get(baseSlug) ||
    backendMap.get(raw.name.toLowerCase()) ||
    Array.from(backendMap.values()).find(
      (b) =>
        (raw.url && b.url && b.url.toLowerCase() === raw.url.toLowerCase()) ||
        (raw.sourceUrl && b.sourceUrl && b.sourceUrl.toLowerCase() === raw.sourceUrl.toLowerCase()) ||
        (b.name && b.name.toLowerCase().includes(raw.name.toLowerCase()))
    );

  // GitHub detection
  const githubSource = parseGitHubRepo(raw.sourceUrl || raw.url);
  const ghMeta = githubSource ? gitHubMetaMap.get(`${githubSource.owner}/${githubSource.repo}`) : null;

  // GitLab detection
  const gitlabSource = parseGitLabRepo(raw.sourceUrl || raw.url);
  const glMeta = gitlabSource ? gitLabMetaMap.get(gitlabSource) : null;

  // Determine sourceKind
  let sourceKind: AppItem["sourceKind"] = "other";
  const targetUrl = (raw.sourceUrl || raw.url).toLowerCase();
  if (targetUrl.includes("github.com")) sourceKind = "github";
  else if (targetUrl.includes("gitlab.com")) sourceKind = "gitlab";
  else if (targetUrl.includes("codeberg.org")) sourceKind = "codeberg";
  else if (targetUrl.includes("f-droid.org") || targetUrl.includes("izzysoft")) sourceKind = "fdroid";
  else if (targetUrl.includes("play.google.com")) sourceKind = "play";

  // Tags
  const isRecommended = raw.preTags.includes("✨") || (backend?.stars ? backend.stars > 500 : false);
  const hasPaid = /Paid/i.test(raw.preTags);
  const hasIap = /IAP/i.test(raw.preTags);
  const hasAds = /Ads/i.test(raw.preTags);
  const requiresRoot = /Root/i.test(raw.preTags);

  const trialMatch = raw.preTags.match(/(\d+)-day trial/i);
  const trialDays = trialMatch ? parseInt(trialMatch[1], 10) : null;

  // License
  let license = raw.license;
  if (license === "Unknown" && ghMeta?.license) {
    license = ghMeta.license;
  }
  if (license === "Unknown" && backend?.license) {
    license = backend.license;
  }

  // Stars
  let stars: number | undefined = undefined;
  if (ghMeta?.stars !== undefined) {
    stars = ghMeta.stars;
  } else if (glMeta?.stars !== undefined) {
    stars = glMeta.stars;
  } else if (backend?.stars !== undefined) {
    stars = backend.stars;
  }

  // Developer / Author
  let authorName = backend?.authorName;
  if (!authorName && githubSource) {
    authorName = githubSource.owner;
  } else if (!authorName && gitlabSource) {
    authorName = gitlabSource.split("/")[0];
  }

  // Icon
  let iconUrl: string | undefined = undefined;
  if (backend?.iconHash) {
    iconUrl = `${SHIZUSTORE_BASE_URL}/icons/${backend.iconHash}.png`;
  }

  // Downloads & Installs
  const downloadTotal =
    backend?.downloadTotal ||
    ghMeta?.latestRelease?.assets?.reduce(
      (acc: number, a: { downloadCount?: number }) => acc + (a.downloadCount || 0),
      0
    ) ||
    undefined;
  const installCount = backend?.installCount;

  // Version
  const versionName = backend?.versionName || ghMeta?.latestRelease?.version;
  const versionCode = backend?.versionCode;
  const releaseDate = ghMeta?.latestRelease?.publishedAt || backend?.updatedAt;
  const releaseNotes = ghMeta?.latestRelease?.body;
  const changelog = backend?.changelog;

  // Links
  let playStoreUrl: string | undefined = undefined;
  let fdroidUrl: string | undefined = undefined;
  let websiteUrl: string | undefined = undefined;

  if (raw.url.includes("play.google.com/store/apps")) {
    playStoreUrl = raw.url;
  }
  if (raw.url.includes("f-droid.org") || raw.url.includes("izzysoft.de")) {
    fdroidUrl = raw.url;
  }
  if (sourceKind === "other" && !raw.url.includes("github.com") && !raw.url.includes("gitlab.com")) {
    websiteUrl = raw.url;
  }

  const slug = backend?.slug || baseSlug;
  const deepLink = `shizustore://app/${slug}`;

  return {
    slug,
    name: raw.name.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "").trim(),
    description: raw.description.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "").trim(),
    category: raw.category,
    categorySlug,
    parentCategory: raw.parentCategory,
    url: raw.url,
    sourceUrl: raw.sourceUrl,
    sourceKind,
    authorName,
    license: license || (raw.isClosedSource ? "Proprietary" : "Open Source"),
    isRecommended,
    hasPaid,
    hasIap,
    hasAds,
    requiresRoot,
    trialDays,
    packageName: backend?.packageName,
    versionName,
    versionCode,
    stars,
    downloadTotal,
    installCount,
    iconUrl,
    iconHash: backend?.iconHash,
    updatedAt: backend?.updatedAt || ghMeta?.updatedAt,
    releaseDate,
    releaseNotes,
    changelog,
    permissions: backend?.permissions || [],
    screenshots: backend?.screenshots || [],
    repoOwner: githubSource?.owner,
    repoName: githubSource?.repo,
    minSdk: backend?.minSdk,
    targetSdk: backend?.targetSdk,
    fullDescription: backend?.fullDescription,
    playStoreUrl,
    fdroidUrl,
    websiteUrl,
    shizuStoreDeepLink: deepLink,
  };
}
