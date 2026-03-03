// ============================================
// URL Validator
// Validates and normalizes user-submitted URLs
// ============================================

// Private IP ranges to block
const PRIVATE_IP_PATTERNS = [
  /^localhost/i,
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^0\.0\.0\.0/,
  /^\[::1\]/,
  /^169\.254\./,
];

export function validateAndNormalizeUrl(rawInput: string): string {
  let input = rawInput.trim();

  if (!input) {
    throw new Error("URL is required.");
  }

  // Add https:// if no protocol specified
  if (!/^https?:\/\//i.test(input)) {
    input = `https://${input}`;
  }

  // Reject non-HTTP protocols
  if (!/^https?:\/\//i.test(input)) {
    throw new Error("Only HTTP and HTTPS URLs are supported.");
  }

  // Try to parse as URL
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new Error("Invalid URL format. Please enter a valid website address.");
  }

  // Block private IPs and localhost
  const hostname = url.hostname;
  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(hostname)) {
      throw new Error("Cannot audit localhost or private IP addresses.");
    }
  }

  // Block non-standard ports (optional, but safer)
  if (url.port && url.port !== "80" && url.port !== "443") {
    throw new Error("Non-standard ports are not supported.");
  }

  // Ensure hostname has at least one dot (basic domain validation)
  if (!hostname.includes(".")) {
    throw new Error("Please enter a full domain name (e.g., example.com).");
  }

  // Remove trailing slash from pathname if it's just "/"
  let normalized = url.origin + url.pathname;
  if (normalized.endsWith("/") && url.pathname === "/") {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}
