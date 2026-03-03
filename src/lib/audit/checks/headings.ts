// ============================================
// Check #6: Heading Structure
// Validates H1-H6 hierarchy for proper SEO structure
// ============================================

import * as cheerio from "cheerio";
import { HeadingsResult } from "../types";

export function checkHeadings(html: string): HeadingsResult {
  const $ = cheerio.load(html);
  const issues: string[] = [];
  const structure: string[] = [];

  let h1_count = 0;
  let lastLevel = 0;
  let deductions = 0;

  // Parse all headings in document order
  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const tagName = $(el).prop("tagName")?.toUpperCase() || "";
    const level = parseInt(tagName.replace("H", ""));
    const text = $(el).text().trim().slice(0, 80); // cap at 80 chars

    if (level === 1) h1_count++;

    structure.push(`${tagName}: ${text || "(empty)"}`);

    // Check for skipped levels (e.g., H1 → H3 without H2)
    if (lastLevel > 0 && level > lastLevel + 1) {
      issues.push(`Skipped heading level: ${tagName} after H${lastLevel}`);
      deductions += 10;
    }

    // Check for empty headings
    if (!text) {
      issues.push(`Empty ${tagName} tag found`);
      deductions += 5;
    }

    lastLevel = level;
  });

  const has_h1 = h1_count > 0;

  // H1 validation
  if (h1_count === 0) {
    issues.push("No H1 tag found — every page should have exactly one H1");
    deductions += 25;
  } else if (h1_count > 1) {
    issues.push(`Multiple H1 tags found (${h1_count}) — use only one H1 per page`);
    deductions += 15;
  }

  // Check H1 quality (if it exists)
  if (h1_count >= 1) {
    const h1Text = $("h1").first().text().trim();
    if (h1Text.length < 5) {
      issues.push("H1 tag is too short — make it more descriptive");
      deductions += 5;
    }
  }

  // No headings at all
  if (structure.length === 0) {
    issues.push("No heading tags found on the page");
    deductions += 30;
  }

  // Score: start at 100, deduct for issues
  const score = Math.max(0, Math.min(100, 100 - deductions));

  console.log(
    `[Headings] ${structure.length} headings, H1 count: ${h1_count}, ${issues.length} issues → score: ${score}`
  );

  return {
    score,
    has_h1,
    h1_count,
    structure: structure.slice(0, 20), // max 20 headings in output
    issues,
  };
}
