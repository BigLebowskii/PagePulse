// ============================================
// PDF Audit Report Component
// Professional PDF layout using @react-pdf/renderer
// ============================================

import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { createStyles } from "./styles";
import type { AuditResults } from "@/lib/supabase/types";

interface AuditReportProps {
  url: string;
  overallScore: number;
  results: AuditResults;
  createdAt: string;
  // White-label
  brandName: string;
  brandColor: string;
  isWhiteLabel: boolean;
  brandUrl: string;
}

// ---- Helpers ----

function gradeFromScore(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function scoreColor(score: number): string {
  if (score >= 80) return "#22C55E";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
}

function statusLabel(score: number): string {
  if (score >= 80) return "Good";
  if (score >= 60) return "Fair";
  return "Needs Work";
}

function statusIcon(score: number): string {
  if (score >= 80) return "✓";
  if (score >= 60) return "⚠";
  return "✗";
}

function priorityFromScore(score: number): { label: string; color: string; bg: string } {
  if (score < 50) return { label: "High", color: "#DC2626", bg: "#FEE2E2" };
  if (score < 75) return { label: "Medium", color: "#D97706", bg: "#FEF3C7" };
  return { label: "Low", color: "#16A34A", bg: "#DCFCE7" };
}

const CHECK_INFO = {
  broken_links: {
    name: "Broken Links",
    description: "We scanned all links on your page to check for broken or dead URLs.",
  },
  alt_text: {
    name: "Image Alt Text",
    description: "We checked all images for missing or empty alt text attributes.",
  },
  page_speed: {
    name: "Page Speed",
    description: "We measured your page load performance using Google PageSpeed Insights.",
  },
  meta_tags: {
    name: "Meta Tags",
    description: "We verified essential SEO meta tags including title, description, and Open Graph tags.",
  },
  mobile_friendly: {
    name: "Mobile Friendliness",
    description: "We verified your site is properly optimized for mobile devices.",
  },
  headings: {
    name: "Heading Structure",
    description: "We analyzed your heading hierarchy for proper H1-H6 structure.",
  },
};

type CheckKey = keyof typeof CHECK_INFO;

function getIssues(key: CheckKey, results: AuditResults): string[] {
  switch (key) {
    case "broken_links": {
      const r = results.broken_links;
      if (r.broken_count === 0) return ["No broken links found."];
      return r.broken_links.slice(0, 10).map(
        (l) => `${l.url} (status ${l.status_code})`
      );
    }
    case "alt_text": {
      const r = results.alt_text;
      if (r.missing_alt === 0) return ["All images have alt text."];
      return r.images
        .filter((img) => !img.has_alt)
        .slice(0, 10)
        .map((img) => `Missing alt: ${img.src.substring(0, 80)}`);
    }
    case "page_speed": {
      const r = results.page_speed;
      const issues: string[] = [];
      if (r.load_time_ms > 3000) issues.push(`Slow load time: ${(r.load_time_ms / 1000).toFixed(1)}s`);
      if (r.first_contentful_paint > 2000) issues.push(`FCP is ${(r.first_contentful_paint / 1000).toFixed(1)}s (should be under 2s)`);
      if (r.largest_contentful_paint > 4000) issues.push(`LCP is ${(r.largest_contentful_paint / 1000).toFixed(1)}s (should be under 4s)`);
      if (r.recommendations.length > 0) issues.push(...r.recommendations.slice(0, 5));
      return issues.length ? issues : ["Page speed is within acceptable limits."];
    }
    case "meta_tags": {
      const r = results.meta_tags;
      if (r.missing_tags.length === 0) return ["All essential meta tags are present."];
      return r.missing_tags.map((t) => `Missing: ${t}`);
    }
    case "mobile_friendly": {
      const r = results.mobile_friendly;
      if (r.issues.length === 0) return ["Site is properly optimized for mobile."];
      return r.issues.slice(0, 10);
    }
    case "headings": {
      const r = results.headings;
      if (r.issues.length === 0) return ["Heading structure is well-organized."];
      return r.issues.slice(0, 10);
    }
  }
}

function getFixes(key: CheckKey, score: number): string[] {
  if (score >= 90) return ["No immediate fixes needed. Keep monitoring regularly."];

  const fixMap: Record<CheckKey, string[]> = {
    broken_links: [
      "Update or remove broken links pointing to deleted pages.",
      "Set up 301 redirects for any pages that have moved.",
      "Use a link checking tool to regularly scan your site.",
    ],
    alt_text: [
      "Add descriptive alt text to every image that conveys meaning.",
      "Use empty alt=\"\" for purely decorative images.",
      "Describe the image content, not just 'image' or 'photo'.",
    ],
    page_speed: [
      "Optimize and compress images (use WebP format where possible).",
      "Minify CSS, JavaScript, and HTML files.",
      "Enable browser caching and use a CDN for static assets.",
      "Defer loading of non-critical JavaScript.",
    ],
    meta_tags: [
      "Add a unique title tag (50-60 characters) to every page.",
      "Write a compelling meta description (120-160 characters).",
      "Add Open Graph tags for better social media sharing.",
      "Include a canonical URL tag to avoid duplicate content issues.",
    ],
    mobile_friendly: [
      "Ensure the viewport meta tag is set correctly.",
      "Make buttons and links at least 48x48 pixels for easy tapping.",
      "Set a minimum font size of 16px for body text.",
      "Avoid horizontal scrolling by using responsive layouts.",
    ],
    headings: [
      "Ensure exactly one H1 tag per page with the main topic.",
      "Use headings in order (H1 → H2 → H3) without skipping levels.",
      "Make headings descriptive and keyword-rich.",
      "Don't use headings purely for visual styling — use CSS instead.",
    ],
  };

  return fixMap[key];
}

// ---- The Report ----

export default function AuditReport({
  url,
  overallScore,
  results,
  createdAt,
  brandName,
  brandColor,
  isWhiteLabel,
  brandUrl,
}: AuditReportProps) {
  const styles = createStyles(brandColor);
  const grade = gradeFromScore(overallScore);
  const dateStr = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const checks: { key: CheckKey; score: number }[] = [
    { key: "broken_links", score: results.broken_links.score },
    { key: "alt_text", score: results.alt_text.score },
    { key: "page_speed", score: results.page_speed.score },
    { key: "meta_tags", score: results.meta_tags.score },
    { key: "mobile_friendly", score: results.mobile_friendly.score },
    { key: "headings", score: results.headings.score },
  ];

  // Sort by score ascending for "top 3 to fix"
  const top3ToFix = [...checks].sort((a, b) => a.score - b.score).slice(0, 3);

  const estimatedImprovement = Math.min(
    100,
    overallScore + Math.round((100 - overallScore) * 0.4)
  );

  const lowestAreas = top3ToFix
    .map((c) => CHECK_INFO[c.key].name)
    .join(", ");

  const issueCount = checks.filter((c) => c.score < 80).length;

  return (
    <Document>
      {/* ---- Page 1: Cover ---- */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverBrand}>{brandName}</Text>
        <Text style={styles.coverTitle}>Website SEO Audit Report</Text>
        <Text style={styles.coverUrl}>{url.replace(/^https?:\/\//, "")}</Text>
        <Text style={styles.coverDate}>{dateStr}</Text>

        <View
          style={{
            ...styles.coverScoreCircle,
            borderColor: scoreColor(overallScore),
          }}
        >
          <Text style={{ ...styles.coverScoreText, color: scoreColor(overallScore) }}>
            {overallScore}
          </Text>
        </View>
        <Text style={{ ...styles.coverGrade, color: scoreColor(overallScore) }}>
          Grade: {grade}
        </Text>

        {!isWhiteLabel && (
          <Text style={styles.coverFooter}>Prepared by {brandName} — {brandUrl}</Text>
        )}
        {isWhiteLabel && (
          <Text style={styles.coverFooter}>Prepared by {brandName}</Text>
        )}
      </Page>

      {/* ---- Page 2: Executive Summary ---- */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Executive Summary</Text>

        <Text style={styles.summaryText}>
          We scanned {url.replace(/^https?:\/\//, "")} and found {issueCount} area{issueCount !== 1 ? "s" : ""} that need{issueCount === 1 ? "s" : ""} attention across 6 critical SEO checks. Your biggest priorities are {lowestAreas}. Addressing these issues could improve your overall score from {overallScore}/100 to approximately {estimatedImprovement}/100.
        </Text>

        {/* Score Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={{ ...styles.tableCellHeader, ...styles.colCheck }}>Check</Text>
            <Text style={{ ...styles.tableCellHeader, ...styles.colScore }}>Score</Text>
            <Text style={{ ...styles.tableCellHeader, ...styles.colStatus }}>Status</Text>
          </View>
          {checks.map((c) => (
            <View key={c.key} style={styles.tableRow}>
              <Text style={{ ...styles.tableCell, ...styles.colCheck }}>
                {CHECK_INFO[c.key].name}
              </Text>
              <Text style={{ ...styles.tableCell, ...styles.colScore, color: scoreColor(c.score) }}>
                {c.score}/100
              </Text>
              <Text style={{ ...styles.tableCell, ...styles.colStatus }}>
                {statusIcon(c.score)} {statusLabel(c.score)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.pageFooter}>
          <Text>{brandName}</Text>
          <Text>Page 2</Text>
        </View>
      </Page>

      {/* ---- Pages 3+: Detailed Results ---- */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Detailed Results</Text>

        {checks.map((c, idx) => {
          const info = CHECK_INFO[c.key];
          const issues = getIssues(c.key, results);
          const fixes = getFixes(c.key, c.score);
          const priority = priorityFromScore(c.score);

          return (
            <View
              key={c.key}
              style={styles.checkSection}
              wrap={idx > 0}
              break={idx === 3}
            >
              <View style={styles.checkHeader}>
                <View style={{ ...styles.checkScoreBadge, backgroundColor: scoreColor(c.score) }}>
                  <Text style={styles.checkScoreBadgeText}>{c.score}</Text>
                </View>
                <Text style={styles.checkName}>{info.name}</Text>
              </View>

              <Text style={styles.checkDescription}>{info.description}</Text>

              <View style={{ ...styles.checkPriority, backgroundColor: priority.bg }}>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: priority.color }}>
                  Priority: {priority.label}
                </Text>
              </View>

              <Text style={styles.subHeading}>Issues Found:</Text>
              {issues.map((issue, i) => (
                <Text key={i} style={styles.issueItem}>
                  • {issue}
                </Text>
              ))}

              <Text style={styles.subHeading}>How to Fix:</Text>
              {fixes.map((fix, i) => (
                <Text key={i} style={styles.fixItem}>
                  {i + 1}. {fix}
                </Text>
              ))}
            </View>
          );
        })}

        <View style={styles.pageFooter}>
          <Text>{brandName}</Text>
          <Text>Detailed Results</Text>
        </View>
      </Page>

      {/* ---- Last Page: Next Steps ---- */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Next Steps</Text>

        <Text style={{ ...styles.summaryText, marginBottom: 24 }}>
          Based on your audit results, here are the top 3 things to fix first for the biggest SEO impact:
        </Text>

        {top3ToFix.map((c, idx) => {
          const info = CHECK_INFO[c.key];
          const fixes = getFixes(c.key, c.score);
          return (
            <View key={c.key} style={styles.nextStepsItem}>
              <View style={styles.nextStepsNumber}>
                <Text style={styles.nextStepsNumberText}>{idx + 1}</Text>
              </View>
              <View style={styles.nextStepsContent}>
                <Text style={styles.nextStepsTitle}>
                  {info.name} (Score: {c.score}/100)
                </Text>
                <Text style={styles.nextStepsDesc}>
                  {fixes[0]}
                </Text>
              </View>
            </View>
          );
        })}

        <View style={{ marginTop: 30, padding: 16, backgroundColor: "#F8FAFC", borderRadius: 8 }}>
          <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: "#1E293B", marginBottom: 6 }}>
            Track Your Progress
          </Text>
          <Text style={{ fontSize: 10, color: "#64748B", lineHeight: 1.6 }}>
            Run another audit after making fixes to see your improved score. Regular monitoring helps you stay on top of SEO health.
          </Text>
        </View>

        {!isWhiteLabel && (
          <View style={{ marginTop: 20, padding: 16, backgroundColor: "#EFF6FF", borderRadius: 8 }}>
            <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: "#1E293B", marginBottom: 6 }}>
              Need More Audits?
            </Text>
            <Text style={{ fontSize: 10, color: "#64748B", lineHeight: 1.6 }}>
              Upgrade your plan for more monthly audits, automated weekly scans, and white-label reports. Visit {brandUrl} to learn more.
            </Text>
          </View>
        )}

        <View style={{ ...styles.pageFooter }}>
          <Text>Report generated by {brandName}{!isWhiteLabel ? ` — ${brandUrl}` : ""}</Text>
          <Text>Next Steps</Text>
        </View>
      </Page>
    </Document>
  );
}
