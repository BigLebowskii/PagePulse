// ============================================
// Monthly Usage Reset Cron Job
// Resets audits_used_this_month for all users
// Protected by CRON_SECRET header
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient<Database>(url, key);
}

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret (Vercel cron sends this header)
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getServiceClient();

    // Reset usage for all users
    const { error, count } = await supabase
      .from("profiles")
      .update({
        audits_used_this_month: 0,
        updated_at: new Date().toISOString(),
      })
      .gte("audits_used_this_month", 1);

    if (error) {
      console.error("[Cron] Reset usage error:", error);
      return NextResponse.json({ error: "Failed to reset usage" }, { status: 500 });
    }

    console.log(`[Cron] Reset monthly usage for ${count ?? 0} users`);

    return NextResponse.json({
      success: true,
      usersReset: count ?? 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[Cron] Error:", err);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
