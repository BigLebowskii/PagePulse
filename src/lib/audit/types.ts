// ============================================
// Audit Engine Types
// TypeScript interfaces for all audit data
// ============================================

// ----- Individual Check Results -----

export interface BrokenLinksResult {
  score: number;
  total_links: number;
  broken_count: number;
  broken_links: {
    url: string;
    status_code: number;
    found_on: string;
  }[];
}

export interface AltTextResult {
  score: number;
  total_images: number;
  missing_alt: number;
  images: {
    src: string;
    has_alt: boolean;
    found_on: string;
  }[];
}

export interface PageSpeedResult {
  score: number;
  load_time_ms: number;
  first_contentful_paint: number;
  largest_contentful_paint: number;
  recommendations: string[];
}

export interface MetaTagsResult {
  score: number;
  has_title: boolean;
  title_length: number;
  has_description: boolean;
  description_length: number;
  has_og_tags: boolean;
  missing_tags: string[];
}

export interface MobileFriendlyResult {
  score: number;
  is_responsive: boolean;
  viewport_set: boolean;
  issues: string[];
}

export interface HeadingsResult {
  score: number;
  has_h1: boolean;
  h1_count: number;
  structure: string[];
  issues: string[];
}

// ----- Combined Results -----

export interface AuditCheckResults {
  broken_links: BrokenLinksResult;
  alt_text: AltTextResult;
  page_speed: PageSpeedResult;
  meta_tags: MetaTagsResult;
  mobile_friendly: MobileFriendlyResult;
  headings: HeadingsResult;
}

// ----- Scoring -----

export type Grade = "A" | "B" | "C" | "D" | "F";

export interface ScoringResult {
  overall_score: number;
  grade: Grade;
}

// ----- Fetcher -----

export interface FetchResult {
  html: string;
  url: string;
  statusCode: number;
  headers: Record<string, string>;
  loadTimeMs: number;
}

// ----- Full Audit Response -----

export interface AuditResponse {
  id: string;
  url: string;
  overall_score: number;
  grade: Grade;
  results: AuditCheckResults;
  created_at: string;
}
