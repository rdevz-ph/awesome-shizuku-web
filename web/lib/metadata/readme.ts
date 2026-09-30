import { AppItem } from "@/lib/types";

/**
 * Fetches the live, real-time README.md directly from the upstream repository
 * (GitHub, GitLab, or Codeberg) bypassing stale backend database snapshots.
 */
export async function fetchLiveRepoReadme(app: AppItem): Promise<string | null> {
  const candidateUrls: string[] = [];

  const checkUrls = [app.url, app.sourceUrl].filter(Boolean) as string[];

  // 1. Direct blob links in URL (e.g. blob/main/README_EN.md)
  for (const u of checkUrls) {
    // GitHub blob link
    const ghBlob = u.match(/https?:\/\/(?:www\.)?github\.com\/([^/]+)\/([^/]+)\/blob\/([^?#]+)/i);
    if (ghBlob) {
      const [, owner, repo, filePath] = ghBlob;
      candidateUrls.push(`https://raw.githubusercontent.com/${owner}/${repo}/${filePath}`);
    }

    // GitLab blob link
    const glBlob = u.match(/https?:\/\/(?:www\.)?gitlab\.com\/([^/]+)\/([^/]+)\/-\/blob\/([^?#]+)/i);
    if (glBlob) {
      const [, owner, repo, filePath] = glBlob;
      candidateUrls.push(`https://gitlab.com/${owner}/${repo}/-/raw/${filePath}`);
    }

    // Codeberg src link
    const cbBlob = u.match(/https?:\/\/(?:www\.)?codeberg\.org\/([^/]+)\/([^/]+)\/src\/branch\/([^?#]+)/i);
    if (cbBlob) {
      const [, owner, repo, filePath] = cbBlob;
      candidateUrls.push(`https://codeberg.org/${owner}/${repo}/raw/branch/${filePath}`);
    }
  }

  // 2. Standard GitHub repository candidates
  if (app.repoOwner && app.repoName && app.sourceKind !== "gitlab") {
    const owner = app.repoOwner;
    const repo = app.repoName;
    candidateUrls.push(
      `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/README.md`,
      `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/README_en.md`,
      `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/README.en.md`,
      `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/readme.md`
    );
  }

  // 3. Standard GitLab repository candidates
  if (app.sourceKind === "gitlab" && app.repoOwner && app.repoName) {
    const owner = app.repoOwner;
    const repo = app.repoName;
    candidateUrls.push(
      `https://gitlab.com/${owner}/${repo}/-/raw/HEAD/README.md`,
      `https://gitlab.com/${owner}/${repo}/-/raw/main/README.md`,
      `https://gitlab.com/${owner}/${repo}/-/raw/master/README.md`
    );
  }

  // Deduplicate candidates
  const uniqueCandidates = Array.from(new Set(candidateUrls));

  for (const rawUrl of uniqueCandidates) {
    try {
      const res = await fetch(rawUrl, {
        headers: { "User-Agent": "ShizuStoreWeb/1.0" },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
      });

      if (res.ok) {
        const text = await res.text();
        if (text && text.trim().length > 30) {
          return text;
        }
      }
    } catch {
      // Continue to next candidate URL on failure or timeout
    }
  }

  return null;
}
