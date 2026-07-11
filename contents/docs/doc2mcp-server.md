---
title: doc2mcp-server npm package
description: Run a local stdio MCP proxy against your hosted doc2mcp endpoint.
category: Deployment
order: 3
nav_title: doc2mcp-server
---

## Overview

Some MCP clients prefer a local `command` + `args` entry instead of a remote
URL. The **`doc2mcp-server`** npm package is a stdio proxy that forwards
`tools/list` and `tools/call` to your hosted doc2mcp endpoint.

## Install / run

```bash title=terminal.sh
npx -y doc2mcp-server@latest \
  --url="https://doc2mcp.site/api/mcp/<project-id>/mcp" \
  --key="d2mcp_…"
```

Environment variables:

```bash title=.env
DOC2MCP_MCP_URL="https://doc2mcp.site/api/mcp/<project-id>/mcp"
DOC2MCP_TOKEN="d2mcp_…"
```

## Cursor config

```json title=mcp.json
{
  "mcpServers": {
    "stripe-docs": {
      "command": "npx",
      "args": [
        "-y",
        "doc2mcp-server@latest",
        "--url=https://doc2mcp.site/api/mcp/<project-id>/mcp",
        "--key=d2mcp_…"
      ]
    }
  }
}
```

Copy the URL and project token from your dashboard after conversion completes.

## Source

The package lives in `packages/doc2mcp-server/` in the doc2mcp monorepo. See
[Self hosted](/docs/self-hosted) if you need the full app on your own infra.
