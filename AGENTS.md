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
- Deploy target: Cloudflare Pages. No GitHub remote auto-trigger; CI in
  `.github/workflows/deploy.yml` needs a remote + secrets to fire.

## Do NOT
- Commit `.local-secrets/`, `node_modules/`, or built output.
- Deploy to prod without explicit user confirmation.
