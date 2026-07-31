import { auth } from "@/app/(auth)/auth";
import {
  getPlatformProjectById,
  updatePlatformProject,
} from "@/lib/db/queries";
import { createMcpProjectToken, hashMcpToken } from "@/lib/doc2mcp/mcp-access";
import { ChatbotError } from "@/lib/errors";
import type { ProjectArtifacts } from "@/types/platform";

/**
 * Rotate the project MCP Bearer token. Invalidates the previous token
 * immediately (hash replaced). Returns the new plaintext once.
 */
export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || session.user.type === "guest") {
    return new ChatbotError("unauthorized:api").toResponse();
  }

  const { id } = await context.params;
  const project = await getPlatformProjectById({
    id,
    userId: session.user.id,
  });

  if (!project) {
    return new ChatbotError("not_found:database").toResponse();
  }

  const plaintext = createMcpProjectToken();
  const mcpTokenHash = hashMcpToken(plaintext);
  const previous = (project.artifacts ?? {}) as ProjectArtifacts;
  const artifacts: ProjectArtifacts = {
    ...previous,
    mcpAccessToken: plaintext,
    mcpTokenHash,
  };

  const updated = await updatePlatformProject({
    id,
    userId: session.user.id,
    data: { artifacts },
  });

  if (!updated) {
    return Response.json({ error: "Failed to rotate token" }, { status: 500 });
  }

  return Response.json({
    token: plaintext,
    projectId: id,
    message: "Previous project MCP token has been revoked.",
  });
}
