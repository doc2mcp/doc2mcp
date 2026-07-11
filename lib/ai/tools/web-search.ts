import { tool } from "ai";
import { z } from "zod";
import { enrichSearchHitsWithPageContent } from "@/lib/search/page-content";
import { isWebSearchEnabled, webSearch } from "@/lib/search/providers";

export const webSearchTool = tool({
  description: [
    "Search the public web for fresh, up-to-date information.",
    "Use this for: news, current events, anything that may have changed",
    "recently (library versions, pricing, model launches, etc.), real-time",
    "facts (today's date, latest release), and any question where your training",
    "data could be stale. Prefer this over guessing.",
    "Pass a focused query (4-10 words). Results include full page content when available.",
    "After results return, write a thorough answer using the fullContent fields — not just links.",
  ].join(" "),
  inputSchema: z.object({
    query: z
      .string()
      .min(2)
      .describe("Focused web search query (4-10 words is best)."),
    site: z
      .string()
      .optional()
      .describe(
        "Optional: restrict search to a single domain (e.g. docs.stripe.com)."
      ),
    limit: z
      .number()
      .int()
      .min(1)
      .max(10)
      .default(6)
      .describe("How many results to return (1-10)."),
  }),
  execute: async ({ query, site, limit }) => {
    if (!isWebSearchEnabled()) {
      return {
        available: false,
        results: [],
        note: "Web search is not configured on this deployment.",
      };
    }

    try {
      const hits = await webSearch(query, { site, limit });
      if (hits.length === 0) {
        return {
          available: true,
          results: [],
          note: "No results returned for this query.",
        };
      }

      const enriched = await enrichSearchHitsWithPageContent(hits, {
        maxPages: Math.min(limit, 4),
        maxContentLength: 10_000,
      });

      return {
        available: true,
        results: enriched.map((h) => ({
          title: h.title,
          url: h.url,
          snippet: h.snippet.slice(0, 800),
          fullContent: h.fullContent.slice(0, 10_000),
          images: h.images.slice(0, 12),
          source: h.source,
        })),
      };
    } catch (error) {
      return {
        available: true,
        results: [],
        error:
          error instanceof Error ? error.message : "Search request failed.",
      };
    }
  },
});
