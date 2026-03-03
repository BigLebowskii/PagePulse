// ============================================
// Check #2: Image Alt Text
// Finds images missing alt attributes (bad for SEO + accessibility)
// ============================================

import * as cheerio from "cheerio";
import { AltTextResult } from "../types";

export function checkAltText(html: string, pageUrl: string): AltTextResult {
  const $ = cheerio.load(html);

  const images: AltTextResult["images"] = [];
  let missing_alt = 0;

  $("img").each((_, el) => {
    const src = $(el).attr("src") || "";
    const alt = $(el).attr("alt");
    const role = $(el).attr("role");

    // Skip decorative images (role="presentation" or explicitly empty alt)
    if (role === "presentation") return;

    // Check if alt is missing (undefined) vs intentionally empty ("")
    // Intentionally empty alt="" is valid for decorative images
    const hasAlt = alt !== undefined && alt.trim().length > 0;

    // If alt is undefined (attribute missing entirely), it's a problem
    if (alt === undefined) {
      missing_alt++;
    }

    images.push({
      src: src.startsWith("http") ? src : src.slice(0, 100),
      has_alt: hasAlt,
      found_on: pageUrl,
    });
  });

  const total_images = images.length;

  // Score: 100 - (missing/total * 100). If 0 images → 100
  const score =
    total_images === 0
      ? 100
      : Math.round(100 - (missing_alt / total_images) * 100);

  console.log(
    `[Alt Text] ${total_images} images found, ${missing_alt} missing alt → score: ${score}`
  );

  return {
    score: Math.max(0, score),
    total_images,
    missing_alt,
    images: images.filter((img) => !img.has_alt).slice(0, 20), // Only return problematic images, max 20
  };
}
