<!--
PR titles must follow Conventional Commits, e.g.:
  feat: add MCP marketplace search
  fix(auth): allow login on Vercel preview deployments
  docs: document self-hosting steps
-->

## What does this PR do?

<!-- A short summary of the change and the motivation behind it. -->

## Related issues

<!-- e.g. Closes #123 -->

## Type of change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that changes existing behavior)
- [ ] Documentation only

## Checklist

- [ ] PR title follows Conventional Commits (`feat:`, `fix:`, …)
- [ ] `pnpm check` passes (Biome + Ultracite)
- [ ] `pnpm exec tsc --noEmit --skipLibCheck` passes
- [ ] `pnpm exec next build` succeeds (or change is docs-only)
- [ ] Tested on a Vercel **preview** deployment when UI/auth changed
- [ ] No secrets, tokens, or real `.env*` values committed
- [ ] AI review comment on this PR reviewed (posted automatically on open/update)

## Screenshots / recordings

<!-- For UI changes, attach before/after screenshots or a short clip. -->
