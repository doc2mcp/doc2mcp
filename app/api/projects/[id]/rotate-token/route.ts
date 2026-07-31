import { auth } from "@/app/(auth)/auth";
import {
  getPlatformProjectById,
  updatePlatformProject,
} from "@/lib/db/queries";
import { createMcpProjectToken, hashMcpToken } from "@/lib/doc2mcp/mcp-access";
import { ChatbotError } from "@/lib/errors";
import type { McpServerConfig, ProjectArtifacts } from "@/types/platform";

/**
 * Patch Bearer token inside stored MCP export configs so Exports/CLI install
 * JSON does not keep serving a revoked secret. Does not add a top-level
 * `mcpAccessToken` plaintext field — that is returned once in the API body.
 */
function withRotatedBearer(
  config: McpServerConfig | null | undefined,
  plaintext: string
): McpServerConfig | null {
  if (!config) {
    return null;
  }

  const authHeader = `Bearer ${plaintext}`;
  const patchServers = (
    servers: Record<string, { url?: string; headers?: Record<string, string> }>
  ) => {
    const next: typeof servers = {};
    for (const [name, entry] of Object.entries(servers)) {
      next[name] = {
        ...entry,
        headers: {
          ...(entry.headers ?? {}),
          Authorization: authHeader,
        },
      };
    }
    return next;
  };

  return {
    ...config,
    cursorConfig: config.cursorConfig
      ? {
          ...config.cursorConfig,
          mcpServers: patchServers(
            (config.cursorConfig.mcpServers ?? {}) as Record<
              string,
              { url?: string; headers?: Record<string, string> }
            >
          ),
        }
      : config.cursorConfig,
    claudeConfig: config.claudeConfig
      ? {
          ...config.claudeConfig,
          mcpServers: patchServers(
            (config.claudeConfig.mcpServers ?? {}) as Record<
              string,
              { url?: string; headers?: Record<string, string> }
            >
          ),
        }
      : config.claudeConfig,
  };
}

/**
 * Rotate the project MCP Bearer token. Invalidates the previous token
 * immediately (hash replaced). Returns the new plaintext once — it is not
 * persisted as `artifacts.mcpAccessToken`.
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
    // Never persist plaintext here — returned once in the response body.
    mcpAccessToken: undefined,
    mcpTokenHash,
    mcpConfig: withRotatedBearer(previous.mcpConfig, plaintext),
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
