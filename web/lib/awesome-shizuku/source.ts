import fs from "fs";
import path from "path";

const UPSTREAM_RAW_BASE =
  "https://raw.githubusercontent.com/timschneeb/awesome-shizuku/master";

export interface AwesomeShizukuSourceFiles {
  readme: string;
  closedSource: string;
}

/**
 * Fetches the upstream awesome-shizuku markdown files.
 * If external fetch fails, falls back to local snapshot or cached files.
 */
export async function fetchAwesomeShizukuSources(): Promise<AwesomeShizukuSourceFiles> {
  const localCacheDir = path.join(process.cwd(), ".cache", "upstream");
  const readmeCachePath = path.join(localCacheDir, "README.md");
  const closedCachePath = path.join(localCacheDir, "CLOSED_SOURCE.md");

  try {
    const [readmeRes, closedRes] = await Promise.all([
      fetch(`${UPSTREAM_RAW_BASE}/README.md`, {
        headers: { "User-Agent": "ShizuStoreWeb/1.0" },
        next: { revalidate: 3600 },
      }),
      fetch(`${UPSTREAM_RAW_BASE}/pages/CLOSED_SOURCE.md`, {
        headers: { "User-Agent": "ShizuStoreWeb/1.0" },
        next: { revalidate: 3600 },
      }),
    ]);

    if (readmeRes.ok) {
      const readme = await readmeRes.text();
      const closedSource = closedRes.ok ? await closedRes.text() : "";

      // Save to local cache directory as fallback for future offline runs
      try {
        if (!fs.existsSync(localCacheDir)) {
          fs.mkdirSync(localCacheDir, { recursive: true });
        }
        fs.writeFileSync(readmeCachePath, readme, "utf-8");
        if (closedSource) {
          fs.writeFileSync(closedCachePath, closedSource, "utf-8");
        }
      } catch (err) {
        console.warn("Failed to write upstream cache to disk:", err);
      }

      return { readme, closedSource };
    }
  } catch (error) {
    console.warn("Failed to fetch fresh awesome-shizuku from GitHub:", error);
  }

  // Fallback to local cache if present
  if (fs.existsSync(readmeCachePath)) {
    const readme = fs.readFileSync(readmeCachePath, "utf-8");
    const closedSource = fs.existsSync(closedCachePath)
      ? fs.readFileSync(closedCachePath, "utf-8")
      : "";
    return { readme, closedSource };
  }

  // Fallback to bundled snapshot in project
  const bundledReadme = path.join(
    process.cwd(),
    "lib",
    "awesome-shizuku",
    "snapshot",
    "README.md"
  );
  const bundledClosed = path.join(
    process.cwd(),
    "lib",
    "awesome-shizuku",
    "snapshot",
    "CLOSED_SOURCE.md"
  );

  if (fs.existsSync(bundledReadme)) {
    return {
      readme: fs.readFileSync(bundledReadme, "utf-8"),
      closedSource: fs.existsSync(bundledClosed)
        ? fs.readFileSync(bundledClosed, "utf-8")
        : "",
    };
  }

  return { readme: "", closedSource: "" };
}
