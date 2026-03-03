// ============================================
// LemonSqueezy Helper Functions
// Common operations for checkout, subscriptions, etc.
// ============================================

import { lemonSqueezyFetch } from "./client";
import {
  LemonSqueezyResponse,
  LemonSqueezyCheckout,
  LemonSqueezySubscription,
  LemonSqueezyCustomer,
} from "./types";

/**
 * Create a checkout URL for a user
 */
export async function createCheckout(
  variantId: string,
  userEmail: string,
  userId: string
): Promise<string> {
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!storeId) throw new Error("LEMONSQUEEZY_STORE_ID is not configured.");

  const response = await lemonSqueezyFetch<LemonSqueezyResponse<LemonSqueezyCheckout>>(
    "/checkouts",
    {
      method: "POST",
      body: {
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email: userEmail,
              custom: {
                user_id: userId,
              },
            },
            checkout_options: {
              embed: false,
              media: false,
              button_color: "#3B82F6",
            },
            product_options: {
              enabled_variants: [variantId],
              redirect_url: `${appUrl}/dashboard?payment=success`,
              receipt_button_text: "Go to Dashboard",
              receipt_link_url: `${appUrl}/dashboard`,
            },
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: storeId,
              },
            },
            variant: {
              data: {
                type: "variants",
                id: variantId,
              },
            },
          },
        },
      },
    }
  );

  return response.data.attributes.url;
}

/**
 * Get a subscription by ID
 */
export async function getSubscription(
  subscriptionId: string
): Promise<LemonSqueezySubscription> {
  const response = await lemonSqueezyFetch<LemonSqueezyResponse<LemonSqueezySubscription>>(
    `/subscriptions/${subscriptionId}`
  );
  return response.data;
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<void> {
  await lemonSqueezyFetch(`/subscriptions/${subscriptionId}`, {
    method: "DELETE",
  });
}

/**
 * Resume a cancelled subscription (if still in billing period)
 */
export async function resumeSubscription(
  subscriptionId: string
): Promise<LemonSqueezySubscription> {
  const response = await lemonSqueezyFetch<LemonSqueezyResponse<LemonSqueezySubscription>>(
    `/subscriptions/${subscriptionId}`,
    {
      method: "PATCH",
      body: {
        data: {
          type: "subscriptions",
          id: subscriptionId,
          attributes: {
            cancelled: false,
          },
        },
      },
    }
  );
  return response.data;
}

/**
 * Update subscription (change plan/variant)
 */
export async function updateSubscription(
  subscriptionId: string,
  newVariantId: string
): Promise<LemonSqueezySubscription> {
  const response = await lemonSqueezyFetch<LemonSqueezyResponse<LemonSqueezySubscription>>(
    `/subscriptions/${subscriptionId}`,
    {
      method: "PATCH",
      body: {
        data: {
          type: "subscriptions",
          id: subscriptionId,
          attributes: {
            variant_id: parseInt(newVariantId),
          },
        },
      },
    }
  );
  return response.data;
}

/**
 * Get customer portal URL
 */
export async function getCustomerPortalUrl(customerId: string): Promise<string> {
  const response = await lemonSqueezyFetch<LemonSqueezyResponse<LemonSqueezyCustomer>>(
    `/customers/${customerId}`
  );
  return response.data.attributes.urls.customer_portal;
}

/**
 * Determine plan name and limit from variant ID
 */
export function getPlanFromVariantId(variantId: string | number): {
  plan: string;
  limit: number;
} {
  const vid = String(variantId);
  const starterVid = process.env.LEMONSQUEEZY_STARTER_VARIANT_ID;
  const growthVid = process.env.LEMONSQUEEZY_GROWTH_VARIANT_ID;
  const agencyVid = process.env.LEMONSQUEEZY_AGENCY_VARIANT_ID;

  if (vid === starterVid) return { plan: "starter", limit: 5 };
  if (vid === growthVid) return { plan: "growth", limit: 25 };
  if (vid === agencyVid) return { plan: "agency", limit: 9999 };

  // Default fallback
  console.warn(`Unknown variant ID: ${vid}`);
  return { plan: "starter", limit: 5 };
}
