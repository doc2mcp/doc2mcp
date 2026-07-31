"use client";

import { Check, Copy, KeyRound, Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function RotateProjectTokenButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [freshToken, setFreshToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRotate = async () => {
    setLoading(true);
    const toastId = toast.loading("Rotating token…");
    try {
      const res = await fetch(`/api/projects/${projectId}/rotate-token`, {
        method: "POST",
      });
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok || !data.token) {
        toast.error(data.error ?? "Failed to rotate token", { id: toastId });
        return;
      }
      setFreshToken(data.token);
      toast.success("New token created — copy it now", { id: toastId });
      router.refresh();
    } catch {
      toast.error("Network error — try again", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!freshToken) {
      return;
    }
    try {
      await navigator.clipboard.writeText(freshToken);
      setCopied(true);
      toast.success("Token copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-border/50 bg-muted/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-2">
          <KeyRound className="mt-0.5 size-4 text-muted-foreground" />
          <div>
            <p className="font-medium text-sm">Project MCP token</p>
            <p className="text-muted-foreground text-xs">
              Generate a new Bearer token. The previous token stops working
              immediately.
            </p>
          </div>
        </div>
        <Button
          disabled={loading}
          onClick={handleRotate}
          size="sm"
          type="button"
          variant="outline"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCw className="size-4" />
          )}
          Rotate token
        </Button>
      </div>

      {freshToken ? (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
          <p className="font-medium text-emerald-800 text-xs dark:text-emerald-200">
            Copy this token now — it won&apos;t be shown again.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-md bg-background/80 px-2 py-1 font-mono text-xs">
              {freshToken}
            </code>
            <Button
              onClick={handleCopy}
              size="sm"
              type="button"
              variant="outline"
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
