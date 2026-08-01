import "server-only";

import { hashPat, readApiAuthToken, verifyPat } from "@/lib/cli/tokens";
import {
  getCliTokenByHash,
  getMcpAccessTokenByHash,
  getUserById,
  touchCliTokenLastUsed,
  touchMcpAccessTokenLastUsed,
} from "@/lib/db/queries";
import {
  hashMcpUserAccessToken,
  isMcpUserAccessToken,
  verifyMcpUserAccessToken,
} from "@/lib/doc2mcp/mcp-user-tokens";

export type ResolvedCliUser = {
  userId: string;
  tokenId: string;
  email: string;
  name: string | null;
  /** Which Settings/CLI token authenticated this request. */
  tokenKind: "cli_pat" | "api_token";
};

/**
 * Resolve the caller for CLI + SDK APIs.
 * Accepts:
 * - User PAT `d2mcp_pat_…` (from `doc2mcp login`)
 * - Settings API token `d2mcp_usr_…` (Dashboard → Settings → Create token)
 */
export async function resolveCliUser(
  request: Request
): Promise<ResolvedCliUser | null> {
  const token = readApiAuthToken(request);
  if (!token) {
    return null;
  }

  if (isMcpUserAccessToken(token)) {
    return await resolveSettingsApiToken(token);
  }

  return await resolveCliPat(token);
}

async function resolveCliPat(token: string): Promise<ResolvedCliUser | null> {
  const tokenHash = hashPat(token);
  const row = await getCliTokenByHash({ tokenHash });
  if (!row || row.revokedAt) {
    return null;
  }

  if (!verifyPat(token, row.tokenHash)) {
    return null;
  }

  const appUser = await getUserById(row.userId);
  if (!appUser || appUser.disabled) {
    return null;
  }

  await touchCliTokenLastUsed({ id: row.id });

  return {
    userId: row.userId,
    tokenId: row.id,
    email: appUser.email,
    name: appUser.name,
    tokenKind: "cli_pat",
  };
}

async function resolveSettingsApiToken(
  token: string
): Promise<ResolvedCliUser | null> {
  const tokenHash = hashMcpUserAccessToken(token);
  const row = await getMcpAccessTokenByHash({ tokenHash });
  if (!row || row.revokedAt) {
    return null;
  }

  if (!verifyMcpUserAccessToken(token, row.tokenHash)) {
    return null;
  }

  const appUser = await getUserById(row.userId);
  if (!appUser || appUser.disabled) {
    return null;
  }

  await touchMcpAccessTokenLastUsed({ id: row.id });

  return {
    userId: row.userId,
    tokenId: row.id,
    email: appUser.email,
    name: appUser.name,
    tokenKind: "api_token",
  };
}
