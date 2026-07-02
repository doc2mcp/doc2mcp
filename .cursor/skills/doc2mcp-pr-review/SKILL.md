---
name: doc2mcp-pr-review
description: Runs AI code review for doc2mcp pull requests using Bugbot and Security Review subagents. Use when a PR is opened, updated, or when the user asks for PR review, code review, /review, or review-bugbot on doc2mcp changes.
---

# doc2mcp PR code review

Review doc2mcp PRs before merge. GitHub Actions also posts an automated Gemini
review on PRs to `staging`/`main` (see `.github/workflows/pr-ai-review.yml`).

## When to run

- User opens or updates a PR
- User says "review PR", "code review", `/review`, or `/review-bugbot`
- CI failed and user wants a pre-merge sanity check

## Workflow

1. **Confirm target** — PR branch checked out locally, or user gave PR URL/number.
2. **Bugbot** — launch one `bugbot` subagent (`readonly: true`):

```text
Full Repository Path: <repo root>
Diff: branch changes
Base Branch: <staging or main — PR base>
Custom Instructions: doc2mcp Next.js monolith. Flag unused API routes, auth gaps, QStash/Gemini env assumptions, breaking MCP JSON-RPC changes.
```

3. **Security** — launch one `security-review` subagent (`readonly: true`):

```text
Full Repository Path: <repo root>
Diff: branch changes
Base Branch: <same as Bugbot>
Custom Instructions: Check for committed secrets, Supabase service role misuse, MCP token leaks, Razorpay webhook verification, rate-limit bypass.
```

4. **Summarize** for the user:

| Severity | Location | Finding |
|----------|----------|---------|
| Critical / High / Medium / Low | `path:line` | one line |

5. **Do not auto-fix** unless the user asks.

## doc2mcp-specific checks

- No direct push to `main`/`staging` (PR only)
- No secrets in `.env*` commits
- MCP changes stay on `/api/mcp/{id}/mcp` JSON-RPC (no new legacy REST routes)
- Server-only logic stays in `app/api/`, `lib/`, `services/`
- `vercel.json` `functions` entries must match existing `route.ts` files

## Failures

If a subagent cannot compute the diff, retry once with `Diff: natural language`
and a per-file `Change Description`. Stop after two failures.
