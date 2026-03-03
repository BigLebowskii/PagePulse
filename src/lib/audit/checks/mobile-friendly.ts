// ============================================
// Check #5: Mobile Friendly
// Checks viewport, font sizes, tap targets, and responsive indicators
// ============================================

import * as cheerio from "cheerio";
import { MobileFriendlyResult } from "../types";

export function checkMobileFriendly(html: string): MobileFriendlyResult {
  const $ = cheerio.load(html);
  const issues: string[] = [];
  let checksPassedCount = 0;
  const totalChecks = 5;

  // 1. Viewport meta tag
  const viewport = $('meta[name="viewport"]').attr("content") || "";
  const viewport_set = viewport.length > 0;

  if (viewport_set) {
    checksPassedCount++;

    // Check if viewport is properly configured
    if (!viewport.includes("width=device-width")) {
      issues.push("Viewport missing 'width=device-width'");
    } else {
      checksPassedCount++;
    }
  } else {
    issues.push("No viewport meta tag found — page won't scale on mobile");
  }

  // 2. Check for fixed-width elements (common cause of horizontal scroll)
  let hasFixedWidth = false;
  $("[style]").each((_, el) => {
    const style = $(el).attr("style") || "";
    // Check for fixed pixel widths > 500px
    const widthMatch = style.match(/width\s*:\s*(\d+)px/i);
    if (widthMatch && parseInt(widthMatch[1]) > 500) {
      hasFixedWidth = true;
    }
  });

  if (!hasFixedWidth) {
    checksPassedCount++;
  } else {
    issues.push("Found elements with fixed widths over 500px (may cause horizontal scrolling)");
  }

  // 3. Check for small font sizes in inline styles
  let hasSmallFonts = false;
  $("[style]").each((_, el) => {
    const style = $(el).attr("style") || "";
    const fontMatch = style.match(/font-size\s*:\s*(\d+)px/i);
    if (fontMatch && parseInt(fontMatch[1]) < 12) {
      hasSmallFonts = true;
    }
  });

  if (!hasSmallFonts) {
    checksPassedCount++;
  } else {
    issues.push("Found text smaller than 12px (hard to read on mobile)");
  }

  // 4. Check tap target sizes (buttons and links)
  // Look for extremely small interactive elements
  let hasSmallTapTargets = false;
  $("a, button, input[type='submit'], input[type='button']").each((_, el) => {
    const style = $(el).attr("style") || "";
    const heightMatch = style.match(/height\s*:\s*(\d+)px/i);
    const widthMatch = style.match(/width\s*:\s*(\d+)px/i);

    if (
      (heightMatch && parseInt(heightMatch[1]) < 24) ||
      (widthMatch && parseInt(widthMatch[1]) < 24)
    ) {
      hasSmallTapTargets = true;
    }
  });

  if (hasSmallTapTargets) {
    issues.push("Some tap targets may be too small for mobile (< 24px)");
  }

  // 5. Check for responsive CSS indicators
  const hasResponsiveCSS =
    html.includes("@media") ||
    $('link[media]').length > 0 ||
    $('link[href*="responsive"]').length > 0 ||
    $('link[href*="mobile"]').length > 0;

  const is_responsive = viewport_set && !hasFixedWidth && hasResponsiveCSS;

  // Calculate score
  const score = Math.round((checksPassedCount / totalChecks) * 100);

  console.log(
    `[Mobile Friendly] ${checksPassedCount}/${totalChecks} checks passed, ${issues.length} issues → score: ${score}`
  );

  return {
    score,
    is_responsive,
    viewport_set,
    issues,
  };
}
