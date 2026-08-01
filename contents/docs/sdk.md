---
title: "doc2mcp-sdk"
nav_title: SDK
description: Programmatic JS/TS SDK to convert docs URLs into hosted MCP servers from code, CI, LangChain, and LangGraph.
category: Getting Started
order: 8
---

## Overview

**`doc2mcp-sdk`** is the programmatic client for doc2mcp. Use it from scripts, GitHub Actions, LangChain / LangGraph agents, and LangSmith-traced tools — without opening the dashboard.

> Generation stays on [doc2mcp.site](https://doc2mcp.site). The SDK is the remote control (same pipeline as the [CLI](/docs/cli)).

Full docs + diagrams + 12 examples: [github.com/doc2mcp/doc2mcp-sdk](https://github.com/doc2mcp/doc2mcp-sdk)

## Install

```bash
npm i doc2mcp-sdk
```

## Convert docs → MCP

```ts
import { Doc2MCP } from "doc2mcp-sdk";

const client = new Doc2MCP({
  token: process.env.DOC2MCP_PAT!, // d2mcp_pat_… from `npx doc2mcp login`
});

const ready = await client.convertAndWait({
  sourceUrl: "https://js.langchain.com/docs",
});

console.log(ready.mcp.url);
console.log(ready.mcp.token);
```

## Call hosted tools

```ts
const text = await client.callToolText({
  mcpUrl: ready.mcp.url,
  mcpToken: ready.mcp.token,
  name: "search_documentation",
  arguments: { query: "how do runnables work?" },
});
```

## LangChain.js

```ts
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { Doc2MCP } from "doc2mcp-sdk";

const client = new Doc2MCP({ token: process.env.DOC2MCP_TOKEN! });

const docsSearch = new DynamicStructuredTool({
  name: "search_docs",
  description: "Search product docs via doc2mcp",
  schema: z.object({ query: z.string() }),
  func: async ({ query }) =>
    client.callToolText({
      mcpUrl: process.env.DOC2MCP_MCP_URL!,
      mcpToken: process.env.DOC2MCP_TOKEN!,
      name: "search_documentation",
      arguments: { query },
    }),
});
```

More: [LangGraph.js](https://github.com/doc2mcp/doc2mcp-sdk/blob/main/examples/07-langgraph-js.ts), [LangSmith](https://github.com/doc2mcp/doc2mcp-sdk/blob/main/examples/08-langsmith-tracing.ts), [LangChain Python](https://github.com/doc2mcp/doc2mcp-sdk/blob/main/examples/09-langchain-python.py), [LangGraph Python](https://github.com/doc2mcp/doc2mcp-sdk/blob/main/examples/10-langgraph-python.py).

## CI re-sync

```yaml
# on docs push
- run: |
    npm i doc2mcp-sdk
    node --input-type=module <<'EOF'
    import { Doc2MCP } from "doc2mcp-sdk";
    const c = new Doc2MCP({ token: process.env.DOC2MCP_TOKEN });
    console.log(await c.sync(process.env.DOC2MCP_PROJECT_ID, process.env.DOC2MCP_TOKEN));
    EOF
```

Secrets: `DOC2MCP_PROJECT_ID`, `DOC2MCP_TOKEN` (project token `d2mcp_…`).

## Auth

| Token | Prefix | Use |
|-------|--------|-----|
| User PAT | `d2mcp_pat_…` | convert / list / getProject |
| Project token | `d2mcp_…` | sync + MCP tools/list / tools/call |

## Related

- Repo: [doc2mcp/doc2mcp-sdk](https://github.com/doc2mcp/doc2mcp-sdk)
- Design issue: [#87](https://github.com/doc2mcp/doc2mcp/issues/87)
- [CLI](/docs/cli) · [doc2mcp-server](/docs/doc2mcp-server) · [Webhook sync](/docs/webhook-sync)
