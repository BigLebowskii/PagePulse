// ============================================
// GET /api/audit/[id] — Fetch full audit results by ID
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
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id) // RLS also enforces this
      .single();

    if (error || !audit) {
      return NextResponse.json({ error: "Audit not found." }, { status: 404 });
    }

    return NextResponse.json(audit);
  } catch (err: unknown) {
    console.error("Get audit error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
