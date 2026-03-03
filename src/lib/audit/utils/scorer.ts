// ============================================
// Score Calculator
// Weighted average of all 6 check scores → overall score + grade
// ============================================

import { AuditCheckResults, Grade, ScoringResult } from "../types";

// Score weights (must add up to 1.0)
const WEIGHTS = {
  broken_links: 0.2,    // 20%
  alt_text: 0.1,        // 10%
  page_speed: 0.25,     // 25%
  meta_tags: 0.2,       // 20%
  mobile_friendly: 0.15, // 15%
  headings: 0.1,        // 10%
} as const;

export function calculateOverallScore(results: AuditCheckResults): ScoringResult {
  const overall_score = Math.round(
    results.broken_links.score * WEIGHTS.broken_links +
    results.alt_text.score * WEIGHTS.alt_text +
    results.page_speed.score * WEIGHTS.page_speed +
    results.meta_tags.score * WEIGHTS.meta_tags +
    results.mobile_friendly.score * WEIGHTS.mobile_friendly +
    results.headings.score * WEIGHTS.headings
  );

  // Clamp between 0-100
  const clamped = Math.max(0, Math.min(100, overall_score));

  return {
    overall_score: clamped,
    grade: scoreToGrade(clamped),
  };
}

function scoreToGrade(score: number): Grade {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}
