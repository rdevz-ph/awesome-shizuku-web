export interface GitLabRepoMeta {
  path: string;
  name: string;
  description?: string;
  stars: number;
  forks: number;
  updatedAt: string;
  webUrl: string;
}

export function parseGitLabRepo(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/https?:\/\/(?:www\.)?gitlab\.com\/([a-zA-Z0-9._/-]+)/i);
  if (!match) return null;
  const projectPath = match[1].replace(/\/-\/.*$/, "").replace(/\.git$/, "");
  return projectPath.trim();
}

export async function fetchGitLabRepoMeta(
  projectPath: string
): Promise<GitLabRepoMeta | null> {
  try {
    const encodedPath = encodeURIComponent(projectPath);
    const res = await fetch(`https://gitlab.com/api/v4/projects/${encodedPath}`, {
      headers: {
        "User-Agent": "ShizuStoreWeb/1.0",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    const data = await res.json();

    return {
      path: projectPath,
      name: data.name || projectPath,
      description: data.description || undefined,
      stars: data.star_count || 0,
      forks: data.forks_count || 0,
      updatedAt: data.last_activity_at,
      webUrl: data.web_url,
    };
  } catch (err) {
    console.warn(`Error fetching GitLab repo ${projectPath}:`, err);
    return null;
  }
}
