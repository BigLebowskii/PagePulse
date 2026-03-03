// ============================================
// Check #4: Meta Tags
// Validates title, description, viewport, OG tags, and canonical
// ============================================

import * as cheerio from "cheerio";
import { MetaTagsResult } from "../types";

// Scoring: each tag check is worth points
const TAG_POINTS: Record<string, number> = {
  title_exists: 10,
  title_length: 10,
  description_exists: 10,
  description_length: 10,
  viewport: 15,
  og_title: 10,
  og_description: 10,
  og_image: 10,
  canonical: 15,
};

const TOTAL_POINTS = Object.values(TAG_POINTS).reduce((a, b) => a + b, 0);

export function checkMetaTags(html: string): MetaTagsResult {
  const $ = cheerio.load(html);
  const missing_tags: string[] = [];
  let earnedPoints = 0;

  // 1. Title tag
  const title = $("title").first().text().trim();
  const has_title = title.length > 0;
  const title_length = title.length;

  if (has_title) {
    earnedPoints += TAG_POINTS.title_exists;
    if (title_length >= 30 && title_length <= 60) {
      earnedPoints += TAG_POINTS.title_length;
    }
  } else {
    missing_tags.push("title");
  }

  // 2. Meta description
  const description =
    $('meta[name="description"]').attr("content")?.trim() || "";
  const has_description = description.length > 0;
  const description_length = description.length;

  if (has_description) {
    earnedPoints += TAG_POINTS.description_exists;
    if (description_length >= 120 && description_length <= 160) {
      earnedPoints += TAG_POINTS.description_length;
    }
  } else {
    missing_tags.push("meta description");
  }

  // 3. Viewport
  const viewport = $('meta[name="viewport"]').attr("content") || "";
  if (viewport) {
    earnedPoints += TAG_POINTS.viewport;
  } else {
    missing_tags.push("viewport");
  }

  // 4. OG Title
  const ogTitle = $('meta[property="og:title"]').attr("content") || "";
  if (ogTitle) {
    earnedPoints += TAG_POINTS.og_title;
  } else {
    missing_tags.push("og:title");
  }

  // 5. OG Description
  const ogDesc = $('meta[property="og:description"]').attr("content") || "";
  if (ogDesc) {
    earnedPoints += TAG_POINTS.og_description;
  } else {
    missing_tags.push("og:description");
  }

  // 6. OG Image
  const ogImage = $('meta[property="og:image"]').attr("content") || "";
  if (ogImage) {
    earnedPoints += TAG_POINTS.og_image;
  } else {
    missing_tags.push("og:image");
  }

  // 7. Canonical
  const canonical = $('link[rel="canonical"]').attr("href") || "";
  if (canonical) {
    earnedPoints += TAG_POINTS.canonical;
  } else {
    missing_tags.push("canonical");
  }

  const has_og_tags = Boolean(ogTitle && ogDesc && ogImage);
  const score = Math.round((earnedPoints / TOTAL_POINTS) * 100);

  console.log(
    `[Meta Tags] ${earnedPoints}/${TOTAL_POINTS} points, missing: [${missing_tags.join(", ")}] → score: ${score}`
  );

  return {
    score,
    has_title,
    title_length,
    has_description,
    description_length,
    has_og_tags,
    missing_tags,
  };
}
