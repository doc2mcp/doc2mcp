---
title: "doc2mcp-sdk"
nav_title: SDK
description: Programmatic JS/TS SDK to convert docs URLs into hosted MCP servers from code, CI, LangChain, and LangGraph.
category: Getting Started
order: 8
---

## Overview

**[`doc2mcp-sdk`](https://www.npmjs.com/package/doc2mcp-sdk)** is the programmatic client for doc2mcp. Use it from scripts, GitHub Actions, LangChain / LangGraph agents, and LangSmith-traced tools — without opening the dashboard.

> The SDK has **no separate signup or auth system**. Create an **API token** in Dashboard → Settings (or a CLI PAT via `doc2mcp login`), plus **project tokens** from a ready conversion, then pass them into the SDK. Generation stays on doc2mcp.site — the SDK is the remote control.

Full handbook + diagrams + framework examples: [github.com/doc2mcp/doc2mcp-sdk/tree/main/docs](https://github.com/doc2mcp/doc2mcp-sdk/tree/main/docs)

## Get API keys (on doc2mcp — not in the SDK)

| Key | Where to create | Prefix | SDK use |
|-----|-----------------|--------|---------|
| **API token (recommended)** | Dashboard → [Settings](https://doc2mcp.site/dashboard/settings) → **API & MCP tokens** → Create token | `d2mcp_usr_…` | `convert`, `listProjects`, `getProject`, `waitUntilReady` |
| User PAT (CLI login) | `npx doc2mcp login` | `d2mcp_pat_…` | Same as API token (optional) |
| Project token | Returned when a project becomes `ready` (or rotate in project Exports) | `d2mcp_…` | `sync`, `listTools`, `callTool`, MCP runtime |

```ts
const client = new Doc2MCP({
  token: process.env.DOC2MCP_API_TOKEN!, // d2mcp_usr_… from Settings
});
```

Never commit tokens. Store them in env / GitHub Actions secrets.

## Install

```bash
npm i doc2mcp-sdk
```

## Convert docs → MCP

Uses a **Settings API token** (`DOC2MCP_API_TOKEN` / `d2mcp_usr_…`).

```ts
import { Doc2MCP } from "doc2mcp-sdk";

const client = new Doc2MCP({
  // Settings → API & MCP tokens (d2mcp_usr_…) — not a project token
  token: process.env.DOC2MCP_API_TOKEN!,
});

const ready = await client.convertAndWait({
  sourceUrl: "https://js.langchain.com/docs",
});

console.log(ready.mcp.url);
// Prefer env/secrets for the project token in real apps — do not log tokens in production
const projectToken = ready.mcp.token;
```

## Call hosted tools

Uses the **project** MCP URL + project token from a ready conversion:

```ts
const text = await client.callToolText({
  mcpUrl: ready.mcp.url,
  mcpToken: projectToken, // project token d2mcp_… (not the Settings API token)
  name: "search_documentation",
  arguments: { query: "how do runnables work?" },
});
```

## LangChain.js

Constructor `token` can be any non-empty string when you only call MCP helpers — pass the **project token** here. `convert()` still needs a Settings API token.

```ts
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { Doc2MCP } from "doc2mcp-sdk";

// Project token (d2mcp_…) from a ready project — for sync / tools only
const projectToken = process.env.DOC2MCP_PROJECT_TOKEN!;
const mcpUrl = process.env.DOC2MCP_MCP_URL!;

const client = new Doc2MCP({ token: projectToken });

const docsSearch = new DynamicStructuredTool({
  name: "search_docs",
  description: "Search product docs via doc2mcp",
  schema: z.object({ query: z.string() }),
  func: async ({ query }) =>
    client.callToolText({
      mcpUrl,
      mcpToken: projectToken,
      name: "search_documentation",
      arguments: { query },
    }),
});
```

More frameworks: [LangGraph.js](https://github.com/doc2mcp/doc2mcp-sdk/blob/main/docs/13-langgraph-js.md), [LangSmith](https://github.com/doc2mcp/doc2mcp-sdk/blob/main/docs/15-langsmith.md), [LangChain Python](https://github.com/doc2mcp/doc2mcp-sdk/blob/main/docs/12-langchain-python.md), [OpenAI Agents](https://github.com/doc2mcp/doc2mcp-sdk/blob/main/docs/16-openai-agents.md), [Vercel AI SDK](https://github.com/doc2mcp/doc2mcp-sdk/blob/main/docs/17-vercel-ai-sdk.md).

## CI re-sync

Uses **project id + project token** (no User PAT required for sync):

```yaml
# on docs push
- run: |
    npm i doc2mcp-sdk
    node --input-type=module <<'EOF'
    import { Doc2MCP } from "doc2mcp-sdk";
    // Project token — sync does not need a User PAT
    const projectToken = process.env.DOC2MCP_PROJECT_TOKEN;
    const c = new Doc2MCP({ token: projectToken });
    const result = await c.sync(
      process.env.DOC2MCP_PROJECT_ID,
      projectToken
    );
    console.log(result.status);
    EOF
```

Secrets: `DOC2MCP_PROJECT_ID`, `DOC2MCP_PROJECT_TOKEN` (project token `d2mcp_…`).

## Auth quick reference

| Env var | Token type | Prefix | Methods |
|---------|------------|--------|---------|
| `DOC2MCP_API_TOKEN` | Settings API token | `d2mcp_usr_…` | convert / list / get / wait |
| `DOC2MCP_PAT` | CLI User PAT (optional) | `d2mcp_pat_…` | same as API token |
| `DOC2MCP_PROJECT_TOKEN` | Project token | `d2mcp_…` | sync / tools/list / tools/call |
| `DOC2MCP_MCP_URL` | Hosted MCP URL | `https://www.doc2mcp.site/api/mcp/…` | tools |

## Related

- Repo: [doc2mcp/doc2mcp-sdk](https://github.com/doc2mcp/doc2mcp-sdk)
- Design issue: [#87](https://github.com/doc2mcp/doc2mcp/issues/87)
- [CLI](/docs/cli) · [doc2mcp-server](/docs/doc2mcp-server) · [Webhook sync](/docs/webhook-sync) · [API keys](/docs/api-keys)
