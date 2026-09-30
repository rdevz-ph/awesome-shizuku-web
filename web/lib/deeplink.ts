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
