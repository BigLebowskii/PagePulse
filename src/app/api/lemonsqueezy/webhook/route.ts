// ============================================
// LemonSqueezy Webhook Handler
// Verifies HMAC signature, processes subscription events
// ============================================

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { LemonSqueezyWebhookEvent } from "@/lib/lemonsqueezy/types";
import { getPlanFromVariantId } from "@/lib/lemonsqueezy/helpers";
import type { Database } from "@/lib/supabase/types";

// Use service role client — webhooks don't have user sessions
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient<Database>(url, key);
}

/**
 * Verify LemonSqueezy HMAC-SHA256 webhook signature
 */
function verifySignature(rawBody: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("LEMONSQUEEZY_WEBHOOK_SECRET is not configured.");
    return false;
  }

  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") || "";

    // 1. Verify HMAC signature
    if (!verifySignature(rawBody, signature)) {
      console.error("Webhook signature verification failed.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 2. Parse the event
    const event: LemonSqueezyWebhookEvent = JSON.parse(rawBody);
    const eventName = event.meta.event_name;
    const userId = event.meta.custom_data?.user_id;

    console.log(`[LemonSqueezy Webhook] Event: ${eventName}, User: ${userId || "unknown"}`);

    if (!userId) {
      console.warn("Webhook event missing user_id in custom_data.");
      return NextResponse.json({ received: true });
    }

    const supabase = getServiceClient();
    const attrs = event.data.attributes;
    const subscriptionId = event.data.id;
    const variantId = String(attrs.variant_id);
    const customerId = String(attrs.customer_id);

    // 3. Handle events
    switch (eventName) {
      case "subscription_created":
      case "subscription_updated": {
        const { plan, limit } = getPlanFromVariantId(variantId);

        await supabase
          .from("profiles")
          .update({
            plan: plan as "free" | "starter" | "growth" | "agency",
            audits_limit: limit,
            lemonsqueezy_customer_id: customerId,
            lemonsqueezy_subscription_id: subscriptionId,
            subscription_status: attrs.status,
            current_period_end: attrs.renews_at,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        console.log(`[Webhook] Updated user ${userId} → plan: ${plan}, limit: ${limit}`);
        break;
      }

      case "subscription_cancelled": {
        // Keep the plan active until end of billing period
        await supabase
          .from("profiles")
          .update({
            subscription_status: "cancelled",
            current_period_end: attrs.ends_at,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        console.log(`[Webhook] Subscription cancelled for user ${userId}, active until ${attrs.ends_at}`);
        break;
      }

      case "subscription_expired": {
        // Billing period ended — downgrade to free
        await supabase
          .from("profiles")
          .update({
            plan: "free",
            audits_limit: 2,
            subscription_status: "expired",
            current_period_end: null,
            lemonsqueezy_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        console.log(`[Webhook] Subscription expired for user ${userId}, downgraded to free`);
        break;
      }

      case "subscription_payment_failed": {
        await supabase
          .from("profiles")
          .update({
            subscription_status: "past_due",
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        console.log(`[Webhook] Payment failed for user ${userId}`);
        break;
      }

      case "subscription_payment_success": {
        // Renew: reset monthly usage on successful payment
        const { plan, limit } = getPlanFromVariantId(variantId);

        await supabase
          .from("profiles")
          .update({
            plan: plan as "free" | "starter" | "growth" | "agency",
            audits_limit: limit,
            subscription_status: "active",
            current_period_end: attrs.renews_at,
            audits_used_this_month: 0,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        console.log(`[Webhook] Payment success for user ${userId}, usage reset`);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event: ${eventName}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Webhook] Error processing event:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
