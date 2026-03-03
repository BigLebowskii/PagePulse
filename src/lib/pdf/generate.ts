// ============================================
// PDF Generator
// Renders AuditReport component to a PDF buffer
// ============================================

import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import AuditReport from "./AuditReport";
import type { AuditResults } from "@/lib/supabase/types";

interface GeneratePdfOptions {
  url: string;
  overallScore: number;
  results: AuditResults;
  createdAt: string;
  // White-label options
  brandName?: string;
  brandColor?: string;
  isWhiteLabel?: boolean;
  brandUrl?: string;
}

export async function generateAuditPdf(options: GeneratePdfOptions): Promise<Buffer> {
  const {
    url,
    overallScore,
    results,
    createdAt,
    brandName = "PagePulse",
    brandColor = "#2563EB",
    isWhiteLabel = false,
    brandUrl = "pagepulse.vercel.app",
  } = options;

  const element = React.createElement(AuditReport, {
    url,
    overallScore,
    results,
    createdAt,
    brandName,
    brandColor,
    isWhiteLabel,
    brandUrl,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(element as any);
  return Buffer.from(buffer);
}
