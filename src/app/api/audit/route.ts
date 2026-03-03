// ============================================
// POST /api/audit — Start a new SEO audit
// Authenticates user, validates URL, runs engine, saves results
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateAndNormalizeUrl } from "@/lib/audit/utils/url-validator";
import { runAudit } from "@/lib/audit";

// Plan limits
const PLAN_LIMITS: Record<string, number> = {
  free: 1,
  starter: 5,
  growth: 25,
  agency: 9999,
};

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    // 2. Get user profile (check audit limits)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Could not load user profile." },
        { status: 500 }
      );
    }

    const limit = PLAN_LIMITS[profile.plan] ?? 1;
    if (profile.audits_used_this_month >= limit) {
      return NextResponse.json(
        {
          error: `You've reached your ${profile.plan} plan limit of ${limit} audit${limit === 1 ? "" : "s"} this month. Upgrade your plan for more.`,
        },
        { status: 403 }
      );
    }

    // 3. Validate URL
    const body = await request.json();
    let url: string;
    try {
      url = validateAndNormalizeUrl(body.url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid URL.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    // 4. Create audit record with status "pending"
    const { data: audit, error: insertError } = await supabase
      .from("audits")
      .insert({
        user_id: user.id,
        url,
        status: "pending",
      })
      .select()
      .single();

    if (insertError || !audit) {
      console.error("Failed to create audit record:", insertError);
      return NextResponse.json(
        { error: "Failed to create audit." },
        { status: 500 }
      );
    }

    // 5. Update status to "running"
    await supabase
      .from("audits")
      .update({ status: "running" })
      .eq("id", audit.id);

    // 6. Run the audit engine
    let auditResult;
    try {
      auditResult = await runAudit(url);
    } catch (err: unknown) {
      // Mark as failed
      await supabase
        .from("audits")
        .update({ status: "failed" })
        .eq("id", audit.id);

      const message = err instanceof Error ? err.message : "Audit failed.";
      return NextResponse.json({ error: message }, { status: 500 });
    }

    // 7. Save results to database
    const { error: updateError } = await supabase
      .from("audits")
      .update({
        status: "completed",
        overall_score: auditResult.scoring.overall_score,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        results: auditResult.results as any,
        completed_at: new Date().toISOString(),
      })
      .eq("id", audit.id);

    if (updateError) {
      console.error("Failed to save audit results:", updateError);
    }

    // 8. Increment audits_used_this_month
    await supabase
      .from("profiles")
      .update({
        audits_used_this_month: profile.audits_used_this_month + 1,
      })
      .eq("id", user.id);

    // 9. Return results
    return NextResponse.json(
      {
        id: audit.id,
        url,
        overall_score: auditResult.scoring.overall_score,
        grade: auditResult.scoring.grade,
        results: auditResult.results,
        created_at: audit.created_at,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Audit API error:", err);
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
