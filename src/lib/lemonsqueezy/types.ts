// ============================================
// LemonSqueezy API Types
// JSON:API format responses
// ============================================

export interface LemonSqueezyResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
  links?: Record<string, string>;
}

export interface LemonSqueezyCheckout {
  type: "checkouts";
  id: string;
  attributes: {
    store_id: number;
    variant_id: number;
    custom_price: number | null;
    product_options: Record<string, unknown>;
    checkout_options: Record<string, unknown>;
    checkout_data: {
      email: string;
      custom: Record<string, string>;
    };
    expires_at: string | null;
    created_at: string;
    updated_at: string;
    test_mode: boolean;
    url: string;
  };
}

export interface LemonSqueezySubscription {
  type: "subscriptions";
  id: string;
  attributes: {
    store_id: number;
    customer_id: number;
    order_id: number;
    order_item_id: number;
    product_id: number;
    variant_id: number;
    product_name: string;
    variant_name: string;
    user_name: string;
    user_email: string;
    status: "on_trial" | "active" | "paused" | "past_due" | "unpaid" | "cancelled" | "expired";
    status_formatted: string;
    card_brand: string | null;
    card_last_four: string | null;
    pause: Record<string, unknown> | null;
    cancelled: boolean;
    trial_ends_at: string | null;
    billing_anchor: number;
    first_subscription_item: {
      id: number;
      subscription_id: number;
      price_id: number;
    } | null;
    urls: {
      update_payment_method: string;
      customer_portal: string;
      customer_portal_update_subscription: string;
    };
    renews_at: string;
    ends_at: string | null;
    created_at: string;
    updated_at: string;
    test_mode: boolean;
  };
}

export interface LemonSqueezyCustomer {
  type: "customers";
  id: string;
  attributes: {
    store_id: number;
    name: string;
    email: string;
    status: string;
    city: string | null;
    region: string | null;
    country: string | null;
    total_revenue_currency: number;
    mrr: number;
    status_formatted: string;
    country_formatted: string | null;
    urls: {
      customer_portal: string;
    };
    created_at: string;
    updated_at: string;
  };
}

// Webhook event payload
export interface LemonSqueezyWebhookEvent {
  meta: {
    event_name: string;
    custom_data?: {
      user_id?: string;
    };
    test_mode: boolean;
  };
  data: {
    type: string;
    id: string;
    attributes: LemonSqueezySubscription["attributes"] & {
      first_subscription_item?: {
        id: number;
        subscription_id: number;
        price_id: number;
      };
    };
  };
}
