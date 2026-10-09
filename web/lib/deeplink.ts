/**
 * Generates custom protocol deep link for ShizuStore v1.4.0+.
 *
 * Supported formats:
 * - Via slug/id: shizustore://apps/{slug} (recommended)
 * - Via package name: shizustore://apps/?package={packageName}
 */
export function getShizuStoreDeepLink(slug?: string, packageName?: string): string {
  if (slug) {
    return `shizustore://apps/${encodeURIComponent(slug)}`;
  }
  if (packageName) {
    return `shizustore://apps/?package=${encodeURIComponent(packageName)}`;
  }
  return "shizustore://apps/";
}

/**
 * Generates Android Intent URI for ShizuStore.
 * Enables Chrome Android to launch ShizuStore if installed,
 * or safely fall back to the web portal URL without showing net::ERR_UNKNOWN_URL_SCHEME.
 */
export function getShizuStoreIntentUri(
  slug?: string,
  packageName?: string,
  fallbackUrl?: string
): string {
  const target = slug
    ? `apps/${encodeURIComponent(slug)}`
    : packageName
    ? `apps/?package=${encodeURIComponent(packageName)}`
    : "apps/";
  const fallback = fallbackUrl
    ? `;S.browser_fallback_url=${encodeURIComponent(fallbackUrl)}`
    : "";
  return `intent://${target}#Intent;scheme=shizustore;package=me.timschneeberger.shizustore${fallback};end`;
}

