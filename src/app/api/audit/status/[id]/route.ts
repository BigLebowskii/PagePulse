// ============================================
// GET /api/audit/status/[id] — Check audit status (for polling)
// Returns only status and score (lightweight)
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const { data: audit, error } = await supabase
      .from("audits")
      .select("id, status, overall_score, created_at, completed_at")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (error || !audit) {
      return NextResponse.json({ error: "Audit not found." }, { status: 404 });
    }

    return NextResponse.json({
      id: audit.id,
      status: audit.status,
      overall_score: audit.overall_score,
      created_at: audit.created_at,
      completed_at: audit.completed_at,
    });
  } catch (err: unknown) {
    console.error("Audit status error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
