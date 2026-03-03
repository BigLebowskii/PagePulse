// ============================================
// PDF Download API Route
// GET /api/audit/[id]/pdf — Generate or serve cached PDF
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { generateAuditPdf } from "@/lib/pdf/generate";
import type { Database, AuditResults } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

function getServiceSupabase() {
  return createServiceClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the audit
    const { data: audit } = await supabase
      .from("audits")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (!audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    if (audit.status !== "completed" || !audit.results) {
      return NextResponse.json({ error: "Audit is not complete" }, { status: 400 });
    }

    // Check for cached PDF
    if (audit.pdf_url) {
      try {
        const cachedRes = await fetch(audit.pdf_url);
        if (cachedRes.ok) {
          const pdfBuffer = await cachedRes.arrayBuffer();
          const domain = audit.url.replace(/^https?:\/\//, "").replace(/\//g, "_");
          const dateStr = new Date(audit.created_at).toISOString().split("T")[0];

          return new NextResponse(pdfBuffer, {
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename="seo-audit-${domain}-${dateStr}.pdf"`,
            },
          });
        }
      } catch {
        // Cached URL failed, regenerate
      }
    }

    // Fetch user profile for white-label settings
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, company_name, brand_color")
      .eq("id", user.id)
      .single();

    const isAgency = profile?.plan === "agency";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pagepulse.vercel.app";

    // Generate the PDF
    const pdfBuffer = await generateAuditPdf({
      url: audit.url,
      overallScore: audit.overall_score || 0,
      results: audit.results as AuditResults,
      createdAt: audit.created_at,
      brandName: isAgency && profile.company_name ? profile.company_name : "PagePulse",
      brandColor: isAgency && profile.brand_color ? profile.brand_color : "#2563EB",
      isWhiteLabel: isAgency,
      brandUrl: appUrl.replace(/^https?:\/\//, ""),
    });

    // Upload to Supabase Storage (non-blocking, use service client)
    const serviceSupabase = getServiceSupabase();
    const storagePath = `reports/${user.id}/${audit.id}.pdf`;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: _uploadData, error: uploadError } = await serviceSupabase.storage
      .from("audit-reports")
      .upload(storagePath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (!uploadError) {
      const { data: publicUrl } = serviceSupabase.storage
        .from("audit-reports")
        .getPublicUrl(storagePath);

      // Save the URL for caching
      await serviceSupabase
        .from("audits")
        .update({ pdf_url: publicUrl.publicUrl })
        .eq("id", audit.id);
    } else {
      console.warn("[PDF] Upload to storage failed:", uploadError.message);
    }

    // Return the PDF (convert Buffer to Uint8Array for NextResponse compatibility)
    const domain = audit.url.replace(/^https?:\/\//, "").replace(/\//g, "_");
    const dateStr = new Date(audit.created_at).toISOString().split("T")[0];

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="seo-audit-${domain}-${dateStr}.pdf"`,
      },
    });
  } catch (err) {
    console.error("[PDF] Error generating report:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF report" },
      { status: 500 }
    );
  }
}
