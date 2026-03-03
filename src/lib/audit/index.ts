// ============================================
// Audit Engine Orchestrator
// Coordinates all 6 checks and produces final results
// ============================================

import { fetchPage } from "./utils/fetcher";
import { calculateOverallScore } from "./utils/scorer";
import { checkBrokenLinks } from "./checks/broken-links";
import { checkAltText } from "./checks/alt-text";
import { checkPageSpeed } from "./checks/page-speed";
import { checkMetaTags } from "./checks/meta-tags";
import { checkMobileFriendly } from "./checks/mobile-friendly";
import { checkHeadings } from "./checks/headings";
import {
  AuditCheckResults,
  BrokenLinksResult,
  AltTextResult,
  PageSpeedResult,
  MetaTagsResult,
  MobileFriendlyResult,
  HeadingsResult,
  ScoringResult,
} from "./types";



// Default "failed" results for when a check errors out
function defaultBrokenLinks(): BrokenLinksResult {
  return { score: 0, total_links: 0, broken_count: 0, broken_links: [] };
}
function defaultAltText(): AltTextResult {
  return { score: 0, total_images: 0, missing_alt: 0, images: [] };
}
function defaultPageSpeed(): PageSpeedResult {
  return { score: 0, load_time_ms: 0, first_contentful_paint: 0, largest_contentful_paint: 0, recommendations: ["Check failed"] };
}
function defaultMetaTags(): MetaTagsResult {
  return { score: 0, has_title: false, title_length: 0, has_description: false, description_length: 0, has_og_tags: false, missing_tags: ["Check failed"] };
}
function defaultMobileFriendly(): MobileFriendlyResult {
  return { score: 0, is_responsive: false, viewport_set: false, issues: ["Check failed"] };
}
function defaultHeadings(): HeadingsResult {
  return { score: 0, has_h1: false, h1_count: 0, structure: [], issues: ["Check failed"] };
}

export interface RunAuditResult {
  results: AuditCheckResults;
  scoring: ScoringResult;
}

export async function runAudit(url: string): Promise<RunAuditResult> {
  console.log(`\n========== Starting audit for: ${url} ==========`);
  const startTime = Date.now();

  // 1. Fetch the page HTML
  console.log("[Audit] Fetching page...");
  const fetchResult = await fetchPage(url);
  console.log(`[Audit] Page fetched in ${fetchResult.loadTimeMs}ms (${fetchResult.html.length} chars)`);

  const html = fetchResult.html;
  const pageUrl = fetchResult.url;

  // 2. Run all 6 checks in parallel (with individual try/catch)
  console.log("[Audit] Running 6 checks in parallel...");

  const [
    brokenLinksResult,
    altTextResult,
    pageSpeedResult,
    metaTagsResult,
    mobileFriendlyResult,
    headingsResult,
  ] = await Promise.all([
    // Check 1: Broken Links (async — makes HTTP requests)
    checkBrokenLinks(html, pageUrl).catch((err) => {
      console.error("[Audit] Broken links check failed:", err);
      return defaultBrokenLinks();
    }),

    // Check 2: Alt Text (sync, but wrapped in Promise for parallel)
    Promise.resolve().then(() => {
      try {
        return checkAltText(html, pageUrl);
      } catch (err) {
        console.error("[Audit] Alt text check failed:", err);
        return defaultAltText();
      }
    }),

    // Check 3: Page Speed (async — calls Google PSI API)
    checkPageSpeed(url, fetchResult.loadTimeMs).catch((err) => {
      console.error("[Audit] Page speed check failed:", err);
      return defaultPageSpeed();
    }),

    // Check 4: Meta Tags (sync)
    Promise.resolve().then(() => {
      try {
        return checkMetaTags(html);
      } catch (err) {
        console.error("[Audit] Meta tags check failed:", err);
        return defaultMetaTags();
      }
    }),

    // Check 5: Mobile Friendly (sync)
    Promise.resolve().then(() => {
      try {
        return checkMobileFriendly(html);
      } catch (err) {
        console.error("[Audit] Mobile friendly check failed:", err);
        return defaultMobileFriendly();
      }
    }),

    // Check 6: Headings (sync)
    Promise.resolve().then(() => {
      try {
        return checkHeadings(html);
      } catch (err) {
        console.error("[Audit] Headings check failed:", err);
        return defaultHeadings();
      }
    }),
  ]);

  // 3. Combine results
  const results: AuditCheckResults = {
    broken_links: brokenLinksResult,
    alt_text: altTextResult,
    page_speed: pageSpeedResult,
    meta_tags: metaTagsResult,
    mobile_friendly: mobileFriendlyResult,
    headings: headingsResult,
  };

  // 4. Calculate overall score
  const scoring = calculateOverallScore(results);

  const elapsed = Date.now() - startTime;
  console.log(
    `\n========== Audit complete: ${scoring.overall_score}/100 (${scoring.grade}) in ${elapsed}ms ==========\n`
  );

  return { results, scoring };
}
