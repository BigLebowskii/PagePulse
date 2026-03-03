// ============================================
// Sign Out API Route
// POST /api/auth/signout → logs out and redirects to landing page
// ============================================

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), {
    status: 302,
  });
}
