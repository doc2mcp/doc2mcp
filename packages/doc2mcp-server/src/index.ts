import { parseArgs } from "node:util";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const { values } = parseArgs({
  options: {
    url: { type: "string" },
    key: { type: "string" },
    name: { type: "string", default: "doc2mcp" },
  },
  allowPositionals: false,
});

const remoteUrl = values.url ?? process.env.DOC2MCP_MCP_URL;
const token = values.key ?? process.env.DOC2MCP_TOKEN;
const serverName = values.name ?? "doc2mcp";

if (!remoteUrl || !token) {
  process.stderr.write(
    "Usage: doc2mcp-server --url=<hosted-mcp-url> --key=<project-token>\n" +
      "  Or set DOC2MCP_MCP_URL and DOC2MCP_TOKEN.\n"
  );
  process.exit(1);
}

const authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

const server = new Server(
  { name: serverName, version: "0.1.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  const res = await fetch(remoteUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/list",
      params: {},
    }),
  });
  const data = (await res.json()) as {
    error?: { message?: string };
    result?: { tools?: unknown[] };
  };
  if (data.error) {
    throw new Error(data.error.message ?? "Remote tools/list failed");
  }
  return { tools: data.result?.tools ?? [] };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const res = await fetch(remoteUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: request.params.name,
        arguments: request.params.arguments ?? {},
      },
    }),
  });
  const data = (await res.json()) as {
    error?: { message?: string };
    result?: unknown;
  };
  if (data.error) {
    throw new Error(data.error.message ?? "Remote tool call failed");
  }
  return data.result as { content: unknown[]; isError?: boolean };
});

const transport = new StdioServerTransport();
await server.connect(transport);
