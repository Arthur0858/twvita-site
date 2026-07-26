# twvita-site — AGENTS

Static marketing site for twvita.com.tw. Deployed to Cloudflare Pages (preview + prod).

## Commands
- `npm run validate` — validate the built site. Run after any edit before calling it done.
- `npm run smoke:live` — live smoke check against the deployed URL.
- `npm run a11y:live` / `perf:live` / `links:live` — live quality gates (need the live site URL).
- All other `npm run *:live` scripts act on the deployed URL; pass it as arg/env.

## Conventions
- Content language: Traditional Chinese (繁體中文); code/comments in English.
- Secrets (CF Pages token) live in `.local-secrets/cf-pages-token.env` — never commit.
- Deploy target: Cloudflare Pages. Pull requests run validation only.
- Production deploys require a manual `workflow_dispatch` of
  `.github/workflows/deploy.yml`; configure approval protection on the GitHub
  `production` environment before relying on environment approval as a gate.

## Do NOT
- Commit `.local-secrets/`, `node_modules/`, or built output.
- Deploy to prod without explicit user confirmation.
- Add a `push` trigger to the production deploy workflow.
