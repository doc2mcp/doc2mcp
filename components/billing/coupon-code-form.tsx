"use client";

import { Gift, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CouponCodeForm({
  className,
  redirectOnSuccess = "/dashboard?checkout=success",
}: {
  className?: string;
  redirectOnSuccess?: string;
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) {
      toast.error("Enter a coupon code");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Applying coupon…");
    try {
      const res = await fetch("/api/billing/apply-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        plan?: string;
        description?: string;
        currentPeriodEnd?: string;
      };

      if (res.status === 401) {
        toast.error("Sign in to redeem a coupon", {
          id: toastId,
          action: {
            label: "Sign in",
            onClick: () => {
              router.push(
                `/login?redirectUrl=${encodeURIComponent("/pricing")}`
              );
            },
          },
        });
        return;
      }

      if (!res.ok) {
        toast.error(data.error ?? "Could not apply coupon", { id: toastId });
        return;
      }

      toast.success(
        data.description ??
          `Starter plan activated${data.plan ? ` (${data.plan})` : ""}`,
        { id: toastId }
      );
      router.push(redirectOnSuccess);
      router.refresh();
    } catch {
      toast.error("Network error — try again", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      <div className="rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
            <Gift className="size-4" />
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <p className="font-medium text-sm">Have a contributor coupon?</p>
              <p className="mt-0.5 text-muted-foreground text-xs leading-relaxed">
                Open-source contributors can unlock Starter free — no Razorpay
                checkout. Try{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                  opensourcedoc2mcp
                </code>
                .
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                aria-label="Coupon code"
                autoComplete="off"
                disabled={loading}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter coupon code"
                value={code}
              />
              <Button disabled={loading} type="submit">
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Apply"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
