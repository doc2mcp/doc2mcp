/**
 * Fetch readable page content for chat preview and web-search enrichment.
 * Uses Jina Reader (same strategy as the docs crawler).
 */

const FETCH_TIMEOUT_MS = 12_000;
const USER_AGENT = "doc2mcp/1.0 (+https://doc2mcp.site)";

export type PageContent = {
  title: string;
  content: string;
  images: string[];
};

export function extractMarkdownImages(markdown: string): string[] {
  const urls = new Set<string>();
  const mdRe = /!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let match = mdRe.exec(markdown);
  while (match !== null) {
    const src = match[1]?.trim();
    if (src?.startsWith("http")) {
      urls.add(src);
    }
    match = mdRe.exec(markdown);
  }
  const htmlRe = /<img[^>]+src=["']([^"']+)["']/gi;
  let htmlMatch = htmlRe.exec(markdown);
  while (htmlMatch !== null) {
    const src = htmlMatch[1]?.trim();
    if (src?.startsWith("http")) {
      urls.add(src);
    }
    htmlMatch = htmlRe.exec(markdown);
  }
  return [...urls];
}

export function isPublicHttpUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return false;
    }
    const host = u.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host.endsWith(".local") ||
      host === "0.0.0.0" ||
      host === "[::1]"
    ) {
      return false;
    }
    if (/^(127\.|10\.|192\.168\.|169\.254\.)/.test(host)) {
      return false;
    }
    const parts = host.split(".").map(Number);
    if (
      parts.length === 4 &&
      parts[0] === 172 &&
      parts[1] !== undefined &&
      parts[1] >= 16 &&
      parts[1] <= 31
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function fetchPageContentAsMarkdown(
  url: string,
  maxLength = 12_000
): Promise<PageContent | null> {
  if (!isPublicHttpUrl(url)) {
    return null;
  }

  const apiKey = process.env.JINA_API_KEY;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(`https://r.jina.ai/${url}`, {
      signal: controller.signal,
      headers: {
        Accept: "text/markdown,text/plain",
        "User-Agent": USER_AGENT,
        "X-Return-Format": "markdown",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
    });
    if (!response.ok) {
      return null;
    }
    const text = await response.text();
    if (!text || text.trim().length < 80) {
      return null;
    }

    const title =
      text.match(/^Title:\s*(.+)$/m)?.[1]?.trim() ??
      text.match(/^#\s+(.+)$/m)?.[1]?.trim() ??
      new URL(url).hostname;

    const cleaned = text
      .replace(/^Title:\s*.+$/m, "")
      .replace(/^URL Source:\s*.+$/m, "")
      .replace(/^Markdown Content:\s*$/m, "")
      .trim()
      .slice(0, maxLength);

    return {
      title,
      content: cleaned,
      images: extractMarkdownImages(cleaned),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function enrichSearchHitsWithPageContent<
  T extends { url: string; title: string; snippet: string },
>(
  hits: T[],
  options?: { maxPages?: number; maxContentLength?: number }
): Promise<
  Array<
    T & {
      fullContent: string;
      images: string[];
    }
  >
> {
  const maxPages = options?.maxPages ?? 4;
  const maxContentLength = options?.maxContentLength ?? 10_000;
  const toFetch = hits.slice(0, maxPages);

  const settled = await Promise.allSettled(
    toFetch.map(async (hit) => {
      const page = await fetchPageContentAsMarkdown(hit.url, maxContentLength);
      if (page?.content.trim()) {
        return {
          ...hit,
          fullContent: page.content,
          images: page.images,
        };
      }
      return {
        ...hit,
        fullContent: hit.snippet,
        images: extractMarkdownImages(hit.snippet),
      };
    })
  );

  const enriched: Array<T & { fullContent: string; images: string[] }> = [];
  for (const result of settled) {
    if (result.status === "fulfilled") {
      enriched.push(result.value);
    }
  }

  for (const rest of hits.slice(maxPages)) {
    enriched.push({
      ...rest,
      fullContent: rest.snippet,
      images: extractMarkdownImages(rest.snippet),
    });
  }

  return enriched;
}
