import { CategoryItem } from "@/lib/types";

export interface ParsedRawApp {
  name: string;
  url: string;
  category: string;
  parentCategory?: string;
  license: string;
  sourceUrl?: string;
  preTags: string;
  description: string;
  isClosedSource: boolean;
}

export interface ParsedAwesomeShizuku {
  apps: ParsedRawApp[];
  categories: CategoryItem[];
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const APP_PATTERN = /^(\s*(?:\*|-)\s+)\[([^\]]+)\]\(([^)]+)\)(.*?)\s+-\s+(.*)$/;
const END_PATTERN = /^(.*?)\s+`([^`]+)`(?:\s+\[\(Source code\)\]\(([^)]+)\))?\s*$/;

const EXCLUDED_CATEGORIES = new Set([
  "Table of contents",
  "License",
  "Annotations",
  "Languages",
  "Development libraries",
  "Miscellaneous content",
  "Rish shell",
  "Unlisted apps",
]);

/**
 * Parses upstream awesome-shizuku README.md and CLOSED_SOURCE.md markdown texts.
 */
export function parseAwesomeShizuku(
  readmeContent: string,
  closedSourceContent: string = ""
): ParsedAwesomeShizuku {
  const rawApps: ParsedRawApp[] = [];
  const categoryMap = new Map<string, { name: string; count: number; parent?: string }>();

  function processDocument(content: string, isClosed: boolean) {
    if (!content) return;
    const lines = content.split("\n");
    let inAppsSection = false;
    let currentCategory = "";
    let parentCategory: string | undefined = undefined;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed.startsWith("## Table of contents")) {
        inAppsSection = false;
        continue;
      }

      // Check headers
      const headerMatch = trimmed.match(/^(#{2,6})\s+(.*)$/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const title = headerMatch[2].trim();

        if (title === "Apps") {
          inAppsSection = true;
          parentCategory = undefined;
          continue;
        }

        if (EXCLUDED_CATEGORIES.has(title)) {
          inAppsSection = false;
          continue;
        }

        if (inAppsSection || isClosed) {
          if (level === 3) {
            currentCategory = title;
            parentCategory = undefined;
          } else if (level >= 4) {
            parentCategory = currentCategory;
            currentCategory = `${parentCategory} - ${title}`;
          } else {
            currentCategory = title;
            parentCategory = undefined;
          }

          const catSlug = slugify(currentCategory);
          if (!categoryMap.has(catSlug)) {
            categoryMap.set(catSlug, {
              name: currentCategory,
              count: 0,
              parent: parentCategory ? slugify(parentCategory) : undefined,
            });
          }
        }
        continue;
      }

      if (!inAppsSection && !isClosed) continue;

      const match = trimmed.match(APP_PATTERN);
      if (match) {
        const [, , name, url, preTags, remainder] = match;
        const endMatch = remainder.match(END_PATTERN);

        let description = remainder.trim();
        let license = isClosed ? "Proprietary" : "Unknown";
        let sourceUrl: string | undefined = undefined;

        if (endMatch) {
          description = endMatch[1].trim();
          license = endMatch[2].trim();
          sourceUrl = endMatch[3];
        }

        const catName = currentCategory || (isClosed ? "Closed-source apps" : "General");
        const catSlug = slugify(catName);

        if (!categoryMap.has(catSlug)) {
          categoryMap.set(catSlug, {
            name: catName,
            count: 0,
            parent: parentCategory ? slugify(parentCategory) : undefined,
          });
        }
        categoryMap.get(catSlug)!.count++;

        // Remove any emojis
        const cleanName = name.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "").trim();
        const cleanDesc = description.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "").trim();

        rawApps.push({
          name: cleanName,
          url: url.trim(),
          category: catName,
          parentCategory,
          license,
          sourceUrl: sourceUrl?.trim(),
          preTags: preTags.trim(),
          description: cleanDesc,
          isClosedSource: isClosed,
        });
      }
    }
  }

  processDocument(readmeContent, false);
  processDocument(closedSourceContent, true);

  const categories: CategoryItem[] = Array.from(categoryMap.entries()).map(
    ([slug, data]) => ({
      slug,
      name: data.name,
      appCount: data.count,
      parentSlug: data.parent,
    })
  );

  return { apps: rawApps, categories };
}
