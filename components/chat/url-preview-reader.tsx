"use client";

import { ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { MessageResponse } from "@/components/ai-elements/message";
import { cn } from "@/lib/utils";

export type WebSearchResultItem = {
  title: string;
  url: string;
  snippet?: string;
  fullContent?: string;
  images?: string[];
  source?: string;
};

export function WebSearchResults({
  results,
  className,
}: {
  results: WebSearchResultItem[];
  className?: string;
}) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {results.map((result) => (
        <article
          className="overflow-hidden rounded-lg border border-border/50 bg-background/60"
          key={result.url}
        >
          <header className="border-border/40 border-b bg-muted/30 px-4 py-3">
            <a
              className="font-medium text-foreground text-sm hover:underline"
              href={result.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {result.title}
            </a>
            <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground">
              {result.url}
            </p>
          </header>

          <div className="max-h-[min(60vh,520px)] overflow-y-auto px-4 py-3 text-sm">
            <MessageResponse>
              {result.fullContent?.trim() || result.snippet?.trim() || ""}
            </MessageResponse>
          </div>

          {result.images && result.images.length > 0 ? (
            <div className="flex flex-wrap gap-2 border-border/40 border-t bg-muted/20 p-3">
              {result.images.slice(0, 6).map((src) => (
                <a
                  className="block size-20 overflow-hidden rounded-md border border-border/50 bg-background"
                  href={src}
                  key={src}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {/* biome-ignore lint/performance/noImgElement: arbitrary third-party URLs from web search */}
                  <img
                    alt=""
                    className="size-full object-cover"
                    loading="lazy"
                    src={src}
                  />
                </a>
              ))}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export function UrlPreviewReader({
  url,
  className,
}: {
  url: string;
  className?: string;
}) {
  const [state, setState] = useState<{
    status: "loading" | "ready" | "error";
    title?: string;
    content?: string;
    images?: string[];
    message?: string;
  }>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    const load = async () => {
      try {
        const res = await fetch(
          `/api/url-preview?url=${encodeURIComponent(url)}`
        );
        const data = (await res.json()) as {
          title?: string;
          content?: string;
          images?: string[];
          message?: string;
        };
        if (cancelled) {
          return;
        }
        if (!res.ok) {
          setState({
            status: "error",
            message: data.message ?? "Preview unavailable for this site.",
          });
          return;
        }
        setState({
          status: "ready",
          title: data.title,
          content: data.content,
          images: data.images,
        });
      } catch {
        if (!cancelled) {
          setState({
            status: "error",
            message: "Could not load preview.",
          });
        }
      }
    };

    load().catch(() => {
      if (!cancelled) {
        setState({
          status: "error",
          message: "Could not load preview.",
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (state.status === "loading") {
    return (
      <div
        className={cn(
          "flex h-full min-h-[180px] flex-col items-center justify-center gap-2 bg-muted/20 p-6",
          className
        )}
      >
        <Loader2 className="size-6 animate-spin text-primary" />
        <p className="font-mono text-muted-foreground text-xs">
          Fetching readable preview…
        </p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div
        className={cn(
          "flex h-full min-h-[180px] flex-col items-center justify-center gap-3 bg-muted/20 p-6 text-center",
          className
        )}
      >
        <p className="text-muted-foreground text-sm">{state.message}</p>
        <a
          className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 font-medium text-foreground text-xs hover:bg-muted/50"
          href={url}
          rel="noopener noreferrer"
          target="_blank"
        >
          Open in new tab
          <ExternalLink className="size-3.5" />
        </a>
      </div>
    );
  }

  return (
    <div
      className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 text-sm">
        <MessageResponse>{state.content ?? ""}</MessageResponse>
      </div>
      {state.images && state.images.length > 0 ? (
        <div className="flex flex-wrap gap-2 border-border/40 border-t bg-muted/20 p-3">
          {state.images.slice(0, 8).map((src) => (
            <a
              className="block size-16 overflow-hidden rounded-md border border-border/50 bg-background"
              href={src}
              key={src}
              rel="noopener noreferrer"
              target="_blank"
            >
              {/* biome-ignore lint/performance/noImgElement: arbitrary third-party preview URLs */}
              <img
                alt=""
                className="size-full object-cover"
                loading="lazy"
                src={src}
              />
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
