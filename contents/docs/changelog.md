---
title: Changelog
description: Product updates for doc2mcp — features, fixes, and roadmap milestones.
category: Getting Started
order: 20
nav_title: Changelog
---

## 2026-07-12 — Growth & enterprise scaffold

- **Docs Understanding Score** on project dashboard and convert result page.
- **Semantic MCP tools** — Gemini-generated tool names with badges in the UI.
- **Live crawl SSE terminal** — real-time pipeline logs via `/api/projects/{id}/stream`.
- **`doc2mcp-server` npm package** — stdio MCP proxy for Cursor/Claude (`npx doc2mcp-server`).
- **Webhook sync** — `POST /api/projects/{id}/sync` + GitHub Action example.
- **Docs code blocks** — filename header + copy button styling across `/docs`.
- **P1/P2 docs** — connectors, SSO/SAML, audit logs (roadmap pages).

## 2026-07-11 — P0 rebuild

- Web search answer fallback when tools run without text output.
- Free tier: **3 conversions/month**, **100 pages** per crawl.
- CLI **`doc2mcp doctor`** health check command.
- [Gemini AI pipeline](/docs/gemini-ai-pipeline) documentation.

## Releases

Production ships on **`v*`** tags from `main`. See GitHub Releases for version
history.
