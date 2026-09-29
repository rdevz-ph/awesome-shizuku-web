export interface GitHubRepoMeta {
  owner: string;
  repo: string;
  fullName: string;
  description?: string;
  stars: number;
  forks: number;
  license?: string;
  updatedAt: string;
  defaultBranch: string;
  archived: boolean;
  latestRelease?: {
    version: string;
    tagName: string;
    publishedAt: string;
    body?: string;
    assets: Array<{
      name: string;
      downloadUrl: string;
      size: number;
      downloadCount: number;
    }>;
  };
}

export function parseGitHubRepo(url?: string): { owner: string; repo: string } | null {
  if (!url) return null;
  const match = url.match(/https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)/i);
  if (!match) return null;
  const owner = match[1];
  let repo = match[2];
  if (repo.endsWith(".git")) repo = repo.slice(0, -4);
  // Avoid non-repo paths
  if (["sindresorhus", "timschneeb"].includes(owner) && ["awesome", "changelog-awesome-shizuku"].includes(repo)) {
    return null;
  }
  return { owner, repo };
}

export async function fetchGitHubRepoMeta(
  owner: string,
  repo: string
): Promise<GitHubRepoMeta | null> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "ShizuStoreWeb/1.0",
  };
  if (token) {
    headers["Authorization"] = `token ${token}`;
  }

  try {
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
      next: { revalidate: 3600 },
    });

    if (repoRes.status === 403 || repoRes.status === 429) {
      console.warn(`GitHub API rate limited for ${owner}/${repo}`);
      return null;
    }

    if (!repoRes.ok) {
      return null;
    }

    const data = await repoRes.json();

    let latestRelease: GitHubRepoMeta["latestRelease"] = undefined;
    try {
      const relRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
        { headers, next: { revalidate: 3600 } }
      );
      if (relRes.ok) {
        const relData = await relRes.json();
        interface GitHubAssetRaw {
          name: string;
          browser_download_url: string;
          size: number;
          download_count?: number;
        }
        latestRelease = {
          version: relData.name || relData.tag_name,
          tagName: relData.tag_name,
          publishedAt: relData.published_at,
          body: relData.body,
          assets: Array.isArray(relData.assets)
            ? (relData.assets as GitHubAssetRaw[]).map((a) => ({
                name: a.name,
                downloadUrl: a.browser_download_url,
                size: a.size,
                downloadCount: a.download_count || 0,
              }))
            : [],
        };
      }
    } catch {
      // Releases are optional
    }

    return {
      owner,
      repo,
      fullName: data.full_name || `${owner}/${repo}`,
      description: data.description || undefined,
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      license: data.license?.spdx_id !== "NOASSERTION" ? data.license?.spdx_id : undefined,
      updatedAt: data.pushed_at || data.updated_at,
      defaultBranch: data.default_branch || "main",
      archived: Boolean(data.archived),
      latestRelease,
    };
  } catch (err) {
    console.warn(`Error fetching GitHub repo ${owner}/${repo}:`, err);
    return null;
  }
}
