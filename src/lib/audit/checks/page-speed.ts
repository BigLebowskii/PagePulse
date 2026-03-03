// ============================================
// Check #3: Page Speed
// Uses Google PageSpeed Insights API (free, no key needed) with
// fallback to basic timing measurement
// ============================================

import { PageSpeedResult } from "../types";

const PSI_API = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const PSI_TIMEOUT_MS = 30_000;

export async function checkPageSpeed(
  url: string,
  fetchLoadTimeMs: number
): Promise<PageSpeedResult> {
  // Try Google PageSpeed Insights API first
  try {
    return await checkWithPSI(url);
  } catch (error) {
    console.log(
      "[Page Speed] PSI API failed, using fallback:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return fallbackSpeedCheck(fetchLoadTimeMs);
  }
}

async function checkWithPSI(url: string): Promise<PageSpeedResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PSI_TIMEOUT_MS);

  try {
    const apiUrl = `${PSI_API}?url=${encodeURIComponent(url)}&strategy=mobile&category=performance`;

    const res = await fetch(apiUrl, {
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`PSI API returned ${res.status}`);
    }

    const data = await res.json();

    const lighthouse = data.lighthouseResult;
    if (!lighthouse) {
      throw new Error("No lighthouse data in response");
    }

    // Extract metrics
    const performanceScore = Math.round(
      (lighthouse.categories?.performance?.score ?? 0) * 100
    );

    const audits = lighthouse.audits || {};
    const fcp = Math.round(
      audits["first-contentful-paint"]?.numericValue ?? 0
    );
    const lcp = Math.round(
      audits["largest-contentful-paint"]?.numericValue ?? 0
    );
    const loadTime = Math.round(
      audits["interactive"]?.numericValue ?? audits["speed-index"]?.numericValue ?? 0
    );

    // Gather recommendations from failed audits
    const recommendations: string[] = [];
    const opportunityAudits = [
      "render-blocking-resources",
      "uses-optimized-images",
      "uses-text-compression",
      "uses-responsive-images",
      "offscreen-images",
      "unminified-css",
      "unminified-javascript",
      "unused-css-rules",
      "unused-javascript",
      "efficient-animated-content",
      "uses-long-cache-ttl",
    ];

    for (const auditId of opportunityAudits) {
      const audit = audits[auditId];
      if (audit && audit.score !== null && audit.score < 0.9) {
        recommendations.push(audit.title || auditId);
      }
    }

    console.log(`[Page Speed] PSI score: ${performanceScore}, FCP: ${fcp}ms, LCP: ${lcp}ms`);

    return {
      score: performanceScore,
      load_time_ms: loadTime,
      first_contentful_paint: fcp,
      largest_contentful_paint: lcp,
      recommendations: recommendations.slice(0, 5),
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

function fallbackSpeedCheck(fetchLoadTimeMs: number): PageSpeedResult {
  // Estimate a score based on HTML load time:
  // < 500ms → 95, < 1000ms → 85, < 2000ms → 70, < 3000ms → 55, > 3000ms → 40
  let score: number;
  const recommendations: string[] = [];

  if (fetchLoadTimeMs < 500) {
    score = 95;
  } else if (fetchLoadTimeMs < 1000) {
    score = 85;
  } else if (fetchLoadTimeMs < 2000) {
    score = 70;
    recommendations.push("Optimize server response time");
  } else if (fetchLoadTimeMs < 3000) {
    score = 55;
    recommendations.push("Optimize server response time");
    recommendations.push("Enable compression");
  } else {
    score = 40;
    recommendations.push("Optimize server response time");
    recommendations.push("Enable compression");
    recommendations.push("Consider using a CDN");
  }

  console.log(
    `[Page Speed] Fallback: ${fetchLoadTimeMs}ms load → score: ${score}`
  );

  return {
    score,
    load_time_ms: fetchLoadTimeMs,
    first_contentful_paint: Math.round(fetchLoadTimeMs * 0.6),
    largest_contentful_paint: Math.round(fetchLoadTimeMs * 0.8),
    recommendations,
  };
}
