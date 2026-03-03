// ============================================
// Web Page Fetcher
// Fetches HTML from a URL with proper headers and error handling
// ============================================

import { FetchResult } from "../types";

const USER_AGENT = "PagePulse Bot/1.0 (SEO Audit Tool)";
const TIMEOUT_MS = 15_000;

export async function fetchPage(url: string): Promise<FetchResult> {
  const startTime = Date.now();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      redirect: "follow",
      signal: controller.signal,
    });

    const loadTimeMs = Date.now() - startTime;

    // Check for too many redirects (fetch handles up to 20, we want max 5)
    if (response.redirected && loadTimeMs > TIMEOUT_MS) {
      throw new Error("Too many redirects or slow response.");
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      throw new Error("URL did not return an HTML page.");
    }

    const html = await response.text();

    // Convert headers to a plain object
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return {
      html,
      url: response.url, // final URL after redirects
      statusCode: response.status,
      headers,
      loadTimeMs,
    };
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`Request timed out after ${TIMEOUT_MS / 1000} seconds.`);
    }

    if (error instanceof TypeError && (error as NodeJS.ErrnoException).cause) {
      const cause = (error as NodeJS.ErrnoException).cause as NodeJS.ErrnoException;
      if (cause.code === "ENOTFOUND") {
        throw new Error("Domain not found. Please check the URL.");
      }
      if (cause.code === "ECONNREFUSED") {
        throw new Error("Connection refused. The server may be down.");
      }
      if (cause.code === "ERR_TLS_CERT_ALTNAME_INVALID" || cause.code === "CERT_HAS_EXPIRED") {
        throw new Error("SSL certificate error on this website.");
      }
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
