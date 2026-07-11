import { auth } from "@/app/(auth)/auth";
import { getPlatformProjectById } from "@/lib/db/queries";
import type { PlatformProject } from "@/lib/db/schema";
import { resolveMcpProject } from "@/lib/doc2mcp/mcp-api";
import { restartProjectPipeline } from "@/lib/doc2mcp/restart-pipeline";
import { ChatbotError } from "@/lib/errors";

const ACTIVE = new Set(["pending", "crawling", "analyzing", "generating"]);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  let project: PlatformProject | null = null;

  if (session?.user?.id && session.user.type !== "guest") {
    project = await getPlatformProjectById({
      id,
      userId: session.user.id,
    });
  }

  if (!project) {
    const resolved = await resolveMcpProject(request, id, { withPages: false });
    if (resolved.error === "not_found") {
      return new ChatbotError("not_found:document").toResponse();
    }
    if (resolved.error === "unauthorized") {
      return new ChatbotError("unauthorized:api").toResponse();
    }
    if (resolved.error === "not_ready") {
      return Response.json(
        {
          error: "not_ready",
          message:
            "Project must be in ready state for token-based sync, or sign in to sync failed projects.",
        },
        { status: 400 }
      );
    }
    project = await getPlatformProjectById({
      id,
      userId: resolved.project.userId,
    });
  }

  if (!project) {
    return new ChatbotError("not_found:document").toResponse();
  }

  if (ACTIVE.has(project.status)) {
    return Response.json(
      {
        error: "pipeline_active",
        message: "A conversion is already running for this project.",
      },
      { status: 409 }
    );
  }

  try {
    await restartProjectPipeline(project, {
      reason: "Re-syncing documentation (webhook or manual sync)…",
    });
    return Response.json({ id: project.id, status: "pending" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not start re-sync.";
    return Response.json({ error: "sync_failed", message }, { status: 500 });
  }
}
