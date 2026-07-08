<div align="center">

# doc2mcp

### Documentation infrastructure for AI agents

**Paste any docs URL → get a hosted, Cursor-ready MCP server in under 60 seconds.**

[**Live**](https://doc2mcp.site) · [Docs](https://doc2mcp.site/docs) · [Marketplace](https://doc2mcp.site/marketplace) · [Pricing](https://doc2mcp.site/pricing)

[![MCP Registry](https://img.shields.io/badge/MCP_Registry-io.github.doc2mcp-2563eb)](https://registry.modelcontextprotocol.io/?search=doc2mcp)
[![npm](https://img.shields.io/npm/v/doc2mcp?color=8b5cf6&logo=npm)](https://www.npmjs.com/package/doc2mcp)
[![GitHub stars](https://img.shields.io/github/stars/doc2mcp/doc2mcp-registry?style=social)](https://github.com/doc2mcp/doc2mcp-registry/stargazers)

⭐ Star the public repo: [github.com/doc2mcp/doc2mcp-registry](https://github.com/doc2mcp/doc2mcp-registry)

</div>

---

> **Private codebase.** This repository contains proprietary product code.
> It is not open source. For public docs, badges, and MCP Registry publishing,
> see **[doc2mcp/doc2mcp-registry](https://github.com/doc2mcp/doc2mcp-registry)**.

## Product

- **Site:** [doc2mcp.site](https://doc2mcp.site)
- **CLI:** `npm install -g doc2mcp`
- **Registry:** every converted MCP auto-publishes to `io.github.doc2mcp/<slug>` on the [official MCP Registry](https://registry.modelcontextprotocol.io/?search=doc2mcp) when `MCP_REGISTRY_GITHUB_TOKEN` is configured in production.

## How it works

1. Paste a docs URL with the doc2mcp toggle on.
2. Pipeline crawls, chunks, and generates MCP tools.
3. You get a remote URL + Bearer token for Cursor / Claude / VS Code.
4. Listing appears on the MCP Registry and [marketplace](https://doc2mcp.site/marketplace).

## MCP tools

| Tool | What it does |
|------|--------------|
| `list_documentation_pages` | Every crawled page |
| `get_documentation_page` | Full markdown of one page |
| `search_documentation` | Heading-aware search |
| `get_documentation_overview` | Summary + index |
| `read_full_documentation` | All pages combined |
| `ask_documentation` | Q&A with citations |

## Stack

Next.js 16 · Google Gemini · Supabase · Upstash Redis + QStash · Streamable HTTP MCP

## Internal development

For team members with repo access:

```bash
pnpm install
cp .env.example .env.local
pnpm db:migrate   # or apply migrations via Supabase
pnpm dev
```

See [`.env.example`](./.env.example) and [`mcp-registry/README.md`](./mcp-registry/README.md) for production env vars (Supabase, Gemini, QStash, `MCP_REGISTRY_GITHUB_TOKEN`, Razorpay **live** keys).

## CI / CD

`staging` → `main` → `v*` tag deploys production on Vercel.

## Security

Report issues to doc2mcp@gmail.com or a private security advisory (org members only).

## License

**Proprietary** — all rights reserved. See [LICENSE](./LICENSE).
