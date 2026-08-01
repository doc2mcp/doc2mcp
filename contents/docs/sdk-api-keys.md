---
title: "SDK API keys"
nav_title: SDK API keys
description: Create User PAT and project tokens on doc2mcp.site for use with doc2mcp-sdk — the SDK has no separate auth.
category: Getting Started
order: 9
---

## SDK has no auth of its own

`doc2mcp-sdk` does **not** mint tokens. Create credentials on [doc2mcp.site](https://doc2mcp.site) (or via the [CLI](/docs/cli)), then pass them into the SDK.

![API keys flow](/diagrams/sdk-architecture.png)

## Tokens

| Env var | Token | Prefix | Create |
|---------|-------|--------|--------|
| `DOC2MCP_PAT` | User PAT | `d2mcp_pat_…` | `npx doc2mcp login` or Settings → CLI tokens |
| `DOC2MCP_PROJECT_TOKEN` | Project token | `d2mcp_…` | Ready project (`mcp.token`) or rotate on Exports |
| `DOC2MCP_MCP_URL` | Hosted MCP URL | `https://doc2mcp.site/api/mcp/…` | Ready project |
| `DOC2MCP_PROJECT_ID` | Project id | uuid | Dashboard / convert response |

## Which methods need which key

| Method | Auth |
|--------|------|
| `convert` / `convertAndWait` / `getProject` / `listProjects` / `waitUntilReady` | User PAT |
| `sync` | Project token |
| `listTools` / `callTool` / `callToolText` | Project token + MCP URL |

Full handbook: [doc2mcp-sdk docs — API keys](https://github.com/doc2mcp/doc2mcp-sdk/blob/main/docs/02-api-keys.md)

See also [SDK](/docs/sdk) · [API authentication](/docs/api-authentication) · [API keys](/docs/api-keys)
