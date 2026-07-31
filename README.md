<div align="center">

# doc2mcp

### Documentation infrastructure for AI agents

**Paste any docs URL → get a hosted, Cursor-ready MCP server in under 60 seconds.**

[**Live**](https://doc2mcp.site) · [Docs](https://doc2mcp.site/docs) · [Marketplace](https://doc2mcp.site/marketplace) · [Open Source](https://doc2mcp.site/open-source) · [Pricing](https://doc2mcp.site/pricing)

[![MCP Registry](https://img.shields.io/badge/MCP_Registry-io.github.doc2mcp-2563eb)](https://registry.modelcontextprotocol.io/?search=doc2mcp)
[![npm](https://img.shields.io/npm/v/doc2mcp?color=8b5cf6&logo=npm)](https://www.npmjs.com/package/doc2mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/doc2mcp/doc2mcp?style=social)](https://github.com/doc2mcp/doc2mcp/stargazers)

⭐ **Star this repo** — it helps developers discover doc2mcp on GitHub and the MCP Registry.

[![doc2mcp on Product Hunt](https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1171095&theme=light)](https://www.producthunt.com/products/doc2mcp)

</div>

---

## What is doc2mcp?

Turn any documentation URL (Stripe, LangChain, Mintlify, OpenAPI, GitHub…)
into a live **Model Context Protocol** server that Cursor, Claude, and VS Code
can query — no install, no shared API keys.

| Surface | Purpose |
|---------|---------|
| **[doc2mcp/doc2mcp](https://github.com/doc2mcp/doc2mcp)** (this repo) | Open-source product: Next.js app, CLI, pipeline, MCP runtime |
| **[doc2mcp/doc2mcp-registry](https://github.com/doc2mcp/doc2mcp-registry)** | Public MCP Registry gateway manifest (`server.json`) + OIDC publish |

Live product: **[doc2mcp.site](https://doc2mcp.site)**

## How it works

1. Sign in at [doc2mcp.site/login](https://doc2mcp.site/login)
2. Paste a docs URL
3. Get a hosted MCP URL + Bearer token
4. Paste into Cursor / Claude / VS Code `mcp.json`
5. Converted MCPs auto-list on the [MCP Registry](https://registry.modelcontextprotocol.io/?search=doc2mcp) as `io.github.doc2mcp/<slug>`

```json
{
  "mcpServers": {
    "my-docs": {
      "url": "https://doc2mcp.site/api/mcp/{project_id}/mcp",
      "headers": { "Authorization": "Bearer <your-token>" }
    }
  }
}
```

## CLI

```bash
npm install -g doc2mcp
doc2mcp login
doc2mcp https://docs.example.com
```

## MCP tools generated per project

| Tool | What it does |
|------|--------------|
| `list_documentation_pages` | Every crawled page |
| `get_documentation_page` | Full markdown of one page |
| `search_documentation` | Heading-aware search |
| `get_documentation_overview` | Summary + index |
| `read_full_documentation` | All pages combined |
| `ask_documentation` | Q&A with citations |

## Contribute

We welcome PRs. Look for `good first issue` and `help wanted` on GitHub.

1. Read [CONTRIBUTING.md](./CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
2. Branch from `staging` → open PR → `staging`
3. Redeem contributor coupon **`opensourcedoc2mcp`** on [Pricing](https://doc2mcp.site/pricing) or Dashboard → Settings — unlocks **Starter free for 12 months** (no Razorpay)

More: [doc2mcp.site/open-source](https://doc2mcp.site/open-source)

## Local development

```bash
pnpm install
cp .env.example .env.local
# apply SQL in lib/db/migrations/ via Supabase (or your Postgres)
pnpm dev
```

Requirements: Node 20, pnpm 10, Supabase/Postgres. See [`.env.example`](./.env.example).

```bash
pnpm check
pnpm exec tsc --noEmit --skipLibCheck
```

## Stack

Next.js 16 · Google Gemini · Supabase · Upstash Redis + QStash · Streamable HTTP MCP · Razorpay

## CI / CD

Feature branch → `staging` (preview) → `main` → `v*` tag deploys production on Vercel.

## MCP Registry

| Entry | Namespace |
|-------|-----------|
| Platform gateway | `io.github.doc2mcp/doc2mcp` |
| Your converted docs | `io.github.doc2mcp/<slug>` |

Gateway publish workflow lives in the [registry repo](https://github.com/doc2mcp/doc2mcp-registry).

## Security

Report vulnerabilities to [doc2mcp@gmail.com](mailto:doc2mcp@gmail.com) or a [private advisory](https://github.com/doc2mcp/doc2mcp/security/advisories/new). See [SECURITY.md](./SECURITY.md).

## License

[MIT](./LICENSE) — contributions welcome.
