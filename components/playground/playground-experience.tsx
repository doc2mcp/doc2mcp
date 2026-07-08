"use client";

import { Loader2, Play, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { McpPlayground } from "@/components/doc2mcp/mcp-playground";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CompressedTool } from "@/types/platform";

type PlaygroundProject = {
  id: string;
  name: string;
  sourceUrl: string | null;
  status: string;
  tools: CompressedTool[];
  hasToken: boolean;
};

function PlaygroundChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-float)]">
      <div className="flex items-center justify-between border-border border-b bg-[#1a1a1a] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 font-mono text-[11px] text-white/50">
            doc2mcp playground
          </span>
        </div>
        <button
          className="inline-flex items-center gap-1.5 font-mono text-[10px] text-white/40 uppercase tracking-wider"
          type="button"
        >
          <RotateCcw className="size-3" />
          Replay
        </button>
      </div>
      {children}
    </div>
  );
}

export function PlaygroundExperience({
  projects,
  initialProjectId,
}: {
  projects: PlaygroundProject[];
  initialProjectId?: string;
}) {
  const readyProjects = useMemo(
    () => projects.filter((p) => p.status === "ready" && p.hasToken),
    [projects]
  );

  const [selectedId, setSelectedId] = useState(
    initialProjectId ?? readyProjects[0]?.id ?? ""
  );

  const selected = readyProjects.find((p) => p.id === selectedId);

  if (readyProjects.length === 0) {
    return (
      <PlaygroundChrome>
        <div className="grid min-h-[480px] lg:grid-cols-[320px_1fr]">
          <aside className="border-border/40 border-b bg-[#111111] p-6 lg:border-r lg:border-b-0">
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
              canvas
            </p>
            <p className="mt-4 text-sm text-white/70">
              No ready projects yet. Convert a docs URL in chat first.
            </p>
          </aside>
          <div className="grid-dots-bg flex flex-col items-center justify-center bg-[#f4f4f2] p-10 text-center dark:bg-[#e8e8e6]">
            <Sparkles className="mb-4 size-8 text-foreground/40" />
            <h2 className="font-display font-thin text-2xl tracking-tight text-foreground">
              Start a conversion
            </h2>
            <p className="mt-2 max-w-sm text-muted-foreground text-sm">
              Once your MCP is ready, pick it here and run live tool calls in
              the sandbox.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild type="button">
                <Link href="/chat">
                  <Play className="mr-1.5 size-4" />
                  Open chat
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </PlaygroundChrome>
    );
  }

  return (
    <PlaygroundChrome>
      <div className="grid min-h-[560px] lg:grid-cols-[340px_1fr]">
        <aside className="flex flex-col gap-4 border-border/40 border-b bg-[#111111] p-5 lg:border-r lg:border-b-0">
          <div>
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
              Project
            </p>
            <Select onValueChange={setSelectedId} value={selectedId}>
              <SelectTrigger className="mt-2 border-white/10 bg-white/5 text-white">
                <SelectValue placeholder="Pick a project" />
              </SelectTrigger>
              <SelectContent>
                {readyProjects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name || p.sourceUrl}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selected?.sourceUrl ? (
            <p className="truncate font-mono text-[10px] text-white/45">
              {selected.sourceUrl}
            </p>
          ) : null}
          <div className="mt-auto space-y-2 font-mono text-[10px] text-white/40">
            <p>✓ MCP token ready</p>
            <p>✓ {selected?.tools.length ?? 0} semantic tools</p>
          </div>
        </aside>

        <div className="grid-dots-bg min-h-[400px] bg-[#f4f4f2] p-4 dark:bg-[#e8e8e6] lg:p-6">
          {selected ? (
            <McpPlayground projectId={selected.id} tools={selected.tools} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
    </PlaygroundChrome>
  );
}
