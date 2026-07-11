---
title: Connectors (Notion & Confluence)
description: Import private knowledge bases — roadmap and early access.
category: Deployment
order: 5
nav_title: Connectors
---

## Overview

**P1 — Growth:** doc2mcp is adding first-class connectors so teams can convert
Notion workspaces and Confluence spaces without public URLs.

## Planned flow

1. Connect OAuth (Notion or Atlassian) from **Dashboard → Settings**.
2. Pick a workspace / space and root page.
3. doc2mcp crawls exported HTML/markdown through the same Gemini pipeline.
4. MCP tools and Understanding Score appear like any URL-based project.

## Today

Use a public docs URL or [private docs](/docs/private-docs) upload paths where
available. For enterprise pilots, contact us via [Contact](/contact).

## Webhook alternative

If your connector publishes to GitHub on change, use [Webhook sync](/docs/webhook-sync)
to re-run conversion automatically.
