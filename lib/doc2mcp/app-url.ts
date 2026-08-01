const CANONICAL_PROD_URL = "https://www.doc2mcp.site";

/** Prefer the canonical www host so OAuth PKCE cookies stay on one origin. */
function canonicalizePublicUrl(url: string): string {
  const trimmed = url.replace(/\/$/, "");
  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname === "doc2mcp.site") {
      parsed.hostname = "www.doc2mcp.site";
      return parsed.toString().replace(/\/$/, "");
    }
  } catch {
    // fall through
  }
  return trimmed;
}

/** Public base URL for MCP server callbacks (no trailing slash). */
export function getDoc2McpBaseUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  // Ignore a localhost value when running on Vercel so generated MCP configs
  // never ship a localhost endpoint to production users.
  if (configured && !(process.env.VERCEL && configured.includes("localhost"))) {
    return canonicalizePublicUrl(configured);
  }
  if (process.env.VERCEL_ENV === "production") {
    return CANONICAL_PROD_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return canonicalizePublicUrl(
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    );
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
