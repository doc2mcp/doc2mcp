<div align="center">

# doc2mcp

### Documentation infrastructure for AI agents

**Paste any docs URL → get a hosted, Cursor-ready MCP server in under 60 seconds.**

No install. No local clone. No API keys to hand over.

![doc2mcp — documentation infrastructure for AI agents](./mcp-registry/assets/banner.png)

[**Live**](https://doc2mcp.site) · [Docs](https://doc2mcp.site/docs) · [Pricing](https://doc2mcp.site/pricing) · [Comparison](https://doc2mcp.site/comparison)

[![GitHub stars](https://img.shields.io/github/stars/doc2mcp/doc2mcp?style=social)](https://github.com/doc2mcp/doc2mcp/stargazers)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4?logo=googlegemini&logoColor=white)](https://ai.google.dev)
[![MCP](https://img.shields.io/badge/Model_Context_Protocol-SDK-7c3aed)](https://modelcontextprotocol.io)
[![Registry](https://img.shields.io/badge/MCP_Registry-io.github.doc2mcp-2563eb)](https://registry.modelcontextprotocol.io/?search=doc2mcp)
[![npm](https://img.shields.io/npm/v/doc2mcp?color=8b5cf6&label=doc2mcp&logo=npm)](https://www.npmjs.com/package/doc2mcp)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-22c55e)](https://github.com/doc2mcp/doc2mcp/pulls)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#license)

**If doc2mcp is useful to you, please [⭐ star the repo](https://github.com/doc2mcp/doc2mcp) — it helps other developers find it.**

</div>

---

## Why doc2mcp

LLMs hallucinate APIs because docs are written for humans, not agents. doc2mcp
turns documentation into the **runtime your AI editor actually calls** — a
hosted Model Context Protocol server with typed tools, semantic retrieval, and
live sync.

```
 Documentation → Crawling → Knowledge processing → Retrieval → MCP generation → AI agents
```

## How it works

1. Paste a docs URL in the chat with the **doc2mcp** toggle on.
2. The pipeline crawls the site (Mintlify, Docusaurus, OpenAPI, GitHub repos,
   GitBook, plain HTML), preserving code blocks and chunking by heading.
3. You get a remote MCP URL + Bearer token. Paste it into Cursor's `mcp.json`.
4. Every generated MCP is **auto-published to the official MCP Registry** under
   `io.github.doc2mcp/<slug>` and listed in the marketplace.

```json
{
  "mcpServers": {
    "stripe": {
      "url": "https://doc2mcp.site/api/mcp/<projectId>/mcp",
      "headers": {
        "Authorization": "Bearer <project-token>"
      }
    }
  }
}
```

## CLI

Install the terminal client and run the same conversion pipeline from your shell:

```bash
npm install -g doc2mcp
doc2mcp login
doc2mcp https://docs.example.com
```

The CLI uses browser-based device auth, shares your web account limits, and can
write configs to Cursor, VS Code, Claude Desktop, and Windsurf.

- 📦 npm: https://www.npmjs.com/package/doc2mcp
- 📖 [`cli/README.md`](./cli/README.md) · [docs/cli](https://doc2mcp.site/docs/cli)

## MCP tools

| Tool | What it does |
|------|--------------|
| `list_documentation_pages` | Every crawled page (title, url, id) |
| `get_documentation_page` | Full markdown of one page |
| `search_documentation` | Heading-aware section search |
| `get_documentation_overview` | Summary + `llms.txt` index |
| `read_full_documentation` | All pages combined as one markdown |
| `ask_documentation` | Natural-language Q&A with citations |

## Supported source formats

- **Mintlify** docs — uses `llms.txt` + `.md` source
- **Docusaurus / GitBook / Nextra** — HTML crawl with code-preserving extraction
- **OpenAPI JSON + YAML** — one page per endpoint
- **Postman collections**
- **GitHub repositories** — README, `/docs`, `/examples`, `/guides`
- **Raw `.md` / `.mdx`** URLs
- **Plain HTML** — Jina Reader fallback for SPA-rendered docs

## Architecture

- **Next.js 16** App Router on Vercel
- **Google Gemini** for analysis, tool compression, and `ask_documentation`
- **Supabase Postgres** for projects, sessions, chunks
- **Upstash Redis** for cross-lambda caching and rate limits
- **Upstash QStash** for background MCP pipeline workers
- **Streamable HTTP MCP** (JSON-RPC 2.0) at `/api/mcp/<projectId>/mcp`

## Local development

```bash
git clone https://github.com/doc2mcp/doc2mcp.git
cd doc2mcp
pnpm install
cp .env.example .env.local
# fill GEMINI_API_KEY, AUTH_SECRET, POSTGRES_URL, Supabase keys
pnpm db:migrate
pnpm dev
```

Open <http://localhost:3000>.

### Environment variables

See [`.env.example`](./.env.example) for the full list. Minimum required:

```env
AUTH_SECRET=...
GEMINI_API_KEY=...
POSTGRES_URL=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Production (recommended):** connect Upstash via the Vercel integration — it
injects `KV_REST_API_URL` / `KV_REST_API_TOKEN` (the app accepts these as
aliases for `UPSTASH_REDIS_REST_*`). Add QStash keys for the conversion pipeline:

```env
QSTASH_TOKEN=...
QSTASH_CURRENT_SIGNING_KEY=...
QSTASH_NEXT_SIGNING_KEY=...
QSTASH_URL=https://qstash-us-east-1.upstash.io
```

> **Never commit secrets.** Use `.env.local` (gitignored) or Vercel env vars.

## Deploy to Vercel

1. Import [github.com/doc2mcp/doc2mcp](https://github.com/doc2mcp/doc2mcp) at
   <https://vercel.com/new>.
2. Connect **Upstash Redis** and **Upstash QStash** from the Vercel integrations
   marketplace (or paste env vars manually).
3. Add Supabase + Gemini env vars.
4. Set `NEXT_PUBLIC_APP_URL` to your production domain (`https://doc2mcp.site`).

Supabase Auth redirect URLs must include your domain and `http://localhost:3000/**`
for local dev.

## Stack

| | |
|---|---|
| Framework | Next.js 16, React 19, Turbopack |
| AI | Google Gemini (`gemini-2.5-flash-lite` default) |
| Database | Supabase Postgres |
| Cache / queue | Upstash Redis + QStash |
| Auth | Supabase Auth (Google OAuth) |
| UI | Tailwind v4, shadcn/ui, Framer Motion |
| Lint | Ultracite (Biome) |
| MCP | `@modelcontextprotocol/sdk` + official MCP Registry |

## CI / CD

GitHub Actions ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)) runs
on every push and PR: type-check, lint, and production build.

Branching: feature → `staging` → `main` → tagged production release.

## Contributing

1. Fork the repo and branch off `staging`.
2. Run `pnpm check` and `pnpm exec tsc --noEmit` before opening a PR.
3. Open a PR against `staging`.

[Open an issue](https://github.com/doc2mcp/doc2mcp/issues) ·
[CONTRIBUTING.md](./CONTRIBUTING.md)

## Security

Never commit secrets. Report vulnerabilities via a
[private security advisory](https://github.com/doc2mcp/doc2mcp/security/advisories/new).

## License

Proprietary — all rights reserved. See [LICENSE](./LICENSE).

---

<div align="center">

**Built for developers shipping AI agents.** [⭐ Star the repo](https://github.com/doc2mcp/doc2mcp)

</div>
