---
title: Gemini AI pipeline
description: How doc2mcp uses Google Gemini for crawl analysis, Q&A, and tool generation.
category: Core Concepts
order: 4
nav_title: Gemini pipeline
---

## Overview

doc2mcp is **Gemini-first**. All hosted AI features run on Google Gemini models
through the Generative Language API. We do not send your docs to third-party
LLM providers unless you configure an optional integration.

## Models by stage

| Stage | Default model | Purpose |
| --- | --- | --- |
| Crawl analysis | `gemini-2.5-flash` | Page classification, auth hints, workflow detection |
| Documentation Q&A | `gemini-2.5-flash` | `ask_documentation`, main chat, CLI `doc2mcp chat` |
| Tool naming / compression | `gemini-2.5-flash` | Semantic tool labels from OpenAPI and docs structure |
| Image generation | `gemini-3-pro-image-preview` | Chat image tool (when enabled) |

Override the text model in production with:

```bash title=.env
GEMINI_MODEL=gemini-2.5-flash
```

## Semantic MCP tools

After OpenAPI or HTML extraction, doc2mcp sends grouped endpoints to Gemini and
asks for **5–20 human-friendly tools** (`create_customer`, `list_invoices`, …).
Each tool maps to real HTTP routes — Gemini must not invent endpoints.

Tools tagged **Gemini** in the dashboard were model-generated; heuristic fallbacks
apply when parsing fails.

## Data flow

1. **Crawl** — HTML/markdown is fetched and stored in Supabase (your project only).
2. **Sanitize** — Scripts and unsafe markup are stripped before any AI call.
3. **Analyze** — Gemini classifies pages and detects auth patterns.
4. **Index** — Page text is chunked and embedded for retrieval.
5. **Serve** — MCP tools and chat read indexed content; Gemini answers with citations.

## Chat vs MCP

- **Web `/chat`** — Full Gemini assistant with tools (web search, images, PDFs,
  optional project docs via MCP toggle).
- **MCP runtime** — `ask_documentation` and search tools use Gemini for grounded
  answers from crawled pages only.
- **CLI `doc2mcp chat`** — Calls your hosted MCP `ask_documentation` tool
  (Gemini-backed on the server).

## Privacy

- Project tokens scope access to a single MCP project.
- Only crawled documentation for that project is sent to Gemini during Q&A.
- See [Security](/docs/security) for token handling and retention.

## Powered by Gemini

The product UI shows **Powered by Gemini** where AI features are active. Set
`GEMINI_API_KEY` in Vercel for production chat and conversion pipelines.
