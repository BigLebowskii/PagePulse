// ============================================
// Check #1: Broken Links
// Finds all <a href> links and verifies they're not returning 4xx/5xx
// ============================================

import * as cheerio from "cheerio";
import { BrokenLinksResult } from "../types";

const MAX_LINKS_TO_CHECK = 50;
const LINK_TIMEOUT_MS = 5_000;

// Links to skip entirely
const SKIP_PATTERNS = [
  /^mailto:/i,
  /^tel:/i,
  /^javascript:/i,
  /^#/,
  /^data:/i,
  /^blob:/i,
];

export async function checkBrokenLinks(
  html: string,
  pageUrl: string
): Promise<BrokenLinksResult> {
  const $ = cheerio.load(html);
  const baseUrl = new URL(pageUrl);

  // Extract all links
  const rawLinks: string[] = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href")?.trim();
    if (href) rawLinks.push(href);
  });

  // Filter out skip patterns and resolve relative URLs
  const resolvedLinks: string[] = [];
  for (const href of rawLinks) {
    if (SKIP_PATTERNS.some((p) => p.test(href))) continue;

    try {
      const absolute = new URL(href, baseUrl).href;
      // Deduplicate
      if (!resolvedLinks.includes(absolute)) {
        resolvedLinks.push(absolute);
      }
    } catch {
      // Invalid URL, skip
    }
  }

  const total_links = resolvedLinks.length;

  // Limit to MAX_LINKS_TO_CHECK for speed
  const linksToCheck = resolvedLinks.slice(0, MAX_LINKS_TO_CHECK);

  // Check each link in parallel with HEAD requests
  const broken_links: BrokenLinksResult["broken_links"] = [];

  const results = await Promise.allSettled(
    linksToCheck.map(async (url) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), LINK_TIMEOUT_MS);

      try {
        const res = await fetch(url, {
          method: "HEAD",
          redirect: "follow",
          signal: controller.signal,
          headers: {
            "User-Agent": "PagePulse Bot/1.0 (SEO Audit Tool)",
          },
        });

        // Some servers reject HEAD, try GET as fallback
        if (res.status === 405) {
          clearTimeout(timeoutId);
          const controller2 = new AbortController();
          const timeoutId2 = setTimeout(() => controller2.abort(), LINK_TIMEOUT_MS);
          try {
            const res2 = await fetch(url, {
              method: "GET",
              redirect: "follow",
              signal: controller2.signal,
              headers: {
                "User-Agent": "PagePulse Bot/1.0 (SEO Audit Tool)",
              },
            });
            clearTimeout(timeoutId2);
            return { url, status: res2.status };
          } catch {
            clearTimeout(timeoutId2);
            return { url, status: 0 };
          }
        }

        return { url, status: res.status };
      } catch {
        return { url, status: 0 }; // 0 = request failed entirely
      } finally {
        clearTimeout(timeoutId);
      }
    })
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      const { url, status } = result.value;
      if (status >= 400 || status === 0) {
        broken_links.push({
          url,
          status_code: status,
          found_on: pageUrl,
        });
      }
    }
  }

  const broken_count = broken_links.length;

  // Score: 100 - (broken/total * 100). If 0 total → 100
  const score =
    total_links === 0
      ? 100
      : Math.round(100 - (broken_count / total_links) * 100);

  console.log(
    `[Broken Links] ${total_links} links found, ${broken_count} broken → score: ${score}`
  );

  return {
    score: Math.max(0, score),
    total_links,
    broken_count,
    broken_links,
  };
}
