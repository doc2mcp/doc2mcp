import { homedir } from "node:os";
import { join } from "node:path";

/** Canonical www host — apex redirects here; keeps OAuth PKCE on one origin. */
export const DEFAULT_API_URL = "https://www.doc2mcp.site";

export type CliConfig = {
  apiUrl: string;
  token?: string;
  /** User MCP access token for marketplace installs (`d2mcp_usr_…`). */
  mcpAccessToken?: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
  };
};

export function getConfigPath(): string {
  return join(homedir(), ".doc2mcp", "config.json");
}

export function getApiUrl(): string {
  return process.env.DOC2MCP_API_URL?.replace(/\/$/, "") ?? DEFAULT_API_URL;
}
