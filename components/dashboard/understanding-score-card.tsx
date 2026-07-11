"use client";

import { Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { QualityScore } from "@/types/platform";

function scoreTone(value: number): string {
  if (value >= 80) {
    return "text-emerald-500";
  }
  if (value >= 60) {
    return "text-amber-500";
  }
  return "text-red-400";
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn("font-mono font-semibold", scoreTone(clamped))}>
          {clamped}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            clamped >= 80
              ? "bg-emerald-500"
              : clamped >= 60
                ? "bg-amber-500"
                : "bg-red-400"
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export function UnderstandingScoreCard({
  score,
  compact = false,
}: {
  score: QualityScore | null | undefined;
  compact?: boolean;
}) {
  if (!score) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4 text-primary" />
            Docs Understanding Score
          </CardTitle>
          <CardDescription>
            Run a conversion to see how MCP-ready your documentation is.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const overall = Math.round(
    (score.docsScore +
      score.authConfidence +
      score.workflowConfidence +
      score.mcpScore) /
      4
  );

  if (compact) {
    return (
      <Card>
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div>
            <p className="font-mono text-muted-foreground text-xs uppercase tracking-wider">
              Understanding
            </p>
            <p
              className={cn(
                "font-display font-bold text-3xl",
                scoreTone(overall)
              )}
            >
              {overall}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-muted-foreground text-xs">
            <span>Docs {score.docsScore}</span>
            <span>Auth {score.authConfidence}</span>
            <span>Workflow {score.workflowConfidence}</span>
            <span>MCP {score.mcpScore}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          Docs Understanding Score
        </CardTitle>
        <CardDescription>
          Gemini-evaluated readiness before you ship MCP to production. Overall:{" "}
          <span className={cn("font-semibold", scoreTone(overall))}>
            {overall}/100
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScoreBar label="Documentation quality" value={score.docsScore} />
        <ScoreBar label="Auth clarity" value={score.authConfidence} />
        <ScoreBar
          label="Workflow confidence"
          value={score.workflowConfidence}
        />
        <ScoreBar label="MCP readiness" value={score.mcpScore} />
        {score.explanation ? (
          <p className="rounded-lg border border-border/60 bg-muted/30 p-3 text-muted-foreground text-sm leading-relaxed">
            {score.explanation}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
