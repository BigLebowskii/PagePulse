// ============================================
// LemonSqueezy Customer Portal API Route
// Returns the customer portal URL for managing subscriptions
// ============================================

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCustomerPortalUrl } from "@/lib/lemonsqueezy/helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's LemonSqueezy customer ID from their profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("lemonsqueezy_customer_id")
      .eq("id", user.id)
      .single();

    if (!profile?.lemonsqueezy_customer_id) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    const portalUrl = await getCustomerPortalUrl(profile.lemonsqueezy_customer_id);

    return NextResponse.json({ url: portalUrl });
  } catch (err) {
    console.error("[Portal] Error:", err);
    return NextResponse.json(
      { error: "Failed to get customer portal URL" },
      { status: 500 }
    );
  }
}
