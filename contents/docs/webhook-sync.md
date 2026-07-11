---
title: Webhook sync
description: Re-crawl documentation when your docs site changes — CI, cron, or manual.
category: Deployment
order: 4
nav_title: Webhook sync
---

## Overview

Keep MCP tools fresh when upstream documentation changes. Trigger a **re-sync**
from GitHub Actions, your CMS webhook, or any HTTP client.

## Endpoint

```http title=sync.http
POST /api/projects/{projectId}/sync
Authorization: Bearer d2mcp_…
```

Returns `{ "id": "…", "status": "pending" }` and enqueues the full pipeline
(crawl → analyze → generate).

> **Tip** Use your **project MCP token** (`d2mcp_…`) for CI. Browser sessions
> also work when signed in.

## GitHub Action example

See `.github/workflows/doc2mcp-sync.example.yml` in the doc2mcp repo:

```yaml title=doc2mcp-sync.yml
- name: Trigger doc2mcp re-sync
  run: |
    curl -fsS -X POST "${{ secrets.DOC2MCP_SYNC_URL }}" \
      -H "Authorization: Bearer ${{ secrets.DOC2MCP_TOKEN }}"
```

Set secrets:

| Secret | Value |
| --- | --- |
| `DOC2MCP_SYNC_URL` | `https://doc2mcp.site/api/projects/<id>/sync` |
| `DOC2MCP_TOKEN` | Project token from the convert result page |

## Live progress

Watch the **SSE terminal** on the convert page or project dashboard logs tab while
the re-sync runs.
