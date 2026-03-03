// ============================================
// LemonSqueezy API Client
// Base fetch wrapper with auth headers
// ============================================

const BASE_URL = "https://api.lemonsqueezy.com/v1";

export async function lemonSqueezyFetch<T>(
  endpoint: string,
  options: {
    method?: string;
    body?: Record<string, unknown>;
  } = {}
): Promise<T> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;

  if (!apiKey) {
    throw new Error("LEMONSQUEEZY_API_KEY is not configured.");
  }

  const { method = "GET", body } = options;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`LemonSqueezy API error [${res.status}]:`, errorBody);
    throw new Error(`LemonSqueezy API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data as T;
}
