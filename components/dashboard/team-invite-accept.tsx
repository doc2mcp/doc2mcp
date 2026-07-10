"use client";

import { CheckCircle2, Loader2, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AcceptState = "idle" | "accepting" | "success" | "error";

export function TeamInviteAcceptBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("invite");
  const attemptedRef = useRef<string | null>(null);
  const [state, setState] = useState<AcceptState>("idle");
  const [teamName, setTeamName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token || attemptedRef.current === token) {
      return;
    }
    attemptedRef.current = token;
    setState("accepting");

    fetch("/api/teams/invite/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const body = (await res.json().catch(() => ({}))) as {
          message?: string;
          team?: { name?: string };
        };
        if (!res.ok) {
          setErrorMessage(body.message ?? "Could not accept this team invite.");
          setState("error");
          toast.error(body.message ?? "Could not accept invite");
          return;
        }
        setTeamName(body.team?.name ?? "workspace");
        setState("success");
        toast.success(`Joined ${body.team?.name ?? "the team"}`);
        router.replace("/dashboard/settings");
      })
      .catch(() => {
        setErrorMessage("Network error while accepting invite.");
        setState("error");
        toast.error("Could not accept invite");
      });
  }, [token, router]);

  if (!token) {
    return null;
  }

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users aria-hidden="true" className="size-4" />
          Team invite
        </CardTitle>
        <CardDescription>
          {state === "accepting"
            ? "Joining the workspace…"
            : state === "success"
              ? `You joined ${teamName ?? "the workspace"}.`
              : state === "error"
                ? (errorMessage ??
                  "This invite could not be accepted. Ask the owner for a new link.")
                : "Accepting your team invite…"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        {state === "accepting" ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : null}
        {state === "success" ? (
          <CheckCircle2 className="size-4 text-emerald-500" />
        ) : null}
        {state === "error" ? (
          <Button
            onClick={() => {
              attemptedRef.current = null;
              setState("idle");
              router.refresh();
            }}
            size="sm"
            type="button"
            variant="outline"
          >
            Try again
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
