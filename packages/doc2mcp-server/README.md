# doc2mcp-server

Stdio MCP proxy for [doc2mcp](https://doc2mcp.site) hosted endpoints. Use it when
your MCP client expects a local `command` + `args` server instead of a remote URL.

## Usage

```bash
npx -y doc2mcp-server@latest \
  --url="https://doc2mcp.site/api/mcp/<project-id>/mcp" \
  --key="d2mcp_…"
```

Or set environment variables:

```bash
export DOC2MCP_MCP_URL="https://doc2mcp.site/api/mcp/<project-id>/mcp"
export DOC2MCP_TOKEN="d2mcp_…"
npx -y doc2mcp-server@latest
```

## Cursor config

```json
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

Copy the URL and token from your doc2mcp project dashboard after conversion.
