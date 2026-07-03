# TWVita Site Maintenance

Static Cloudflare Pages site for `twvita.com.tw`.

## Current Production

- Production URL: `https://twvita.com.tw/`
- Cloudflare Pages project: `twvita`
- Source directory: `public`
- Current public asset version: `20260617-audit96`
- Deploy method: Cloudflare Pages Direct Upload with the Pages Worker bundle

## Routine Audit

Run the full production audit after any content, asset, CSS, JS, Worker, or metadata change:

```bash
npm run audit:live
```

This runs:

- `npm run validate`
- `npm run copy:check`
- `npm run drift:live`
- `npm run discovery:live`
- `npm run headers:live`
- `npm run links:live`
- `npm run interaction:live`
- `npm run dom:live`
- `npm run metadata:live`
- `npm run assets:live`
- `npm run perf:live`
- `npm run structured:live`
- `npm run smoke:live`
- `npm run console:live`
- `npm run layout:live`
- `npm run print:live`
- `npm run a11y:live`
- `npm run cache:live`

`cache:live` may warn that old versioned stylesheet URLs still return Cloudflare edge `HIT`. That is acceptable only when public pages no longer reference those URLs. Use targeted Cloudflare purge by URL when cache-purge permission is available; do not use a full-zone purge without a separate reason.

To prepare a targeted purge list without changing Cloudflare state:

```bash
npm run cache:purge:obsolete
```

To execute the targeted purge, provide a Cloudflare API token with cache purge permission and the `twvita.com.tw` zone ID:

```bash
CACHE_PURGE_EXECUTE=1 CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ZONE_ID=... npm run cache:purge:obsolete
npm run cache:live
```

## Deployment

Deploy only after local validation passes:

```bash
npm run validate
npx wrangler pages deploy public --project-name=twvita --branch=main
```

After deploy, verify the Pages preview first:

```bash
SMOKE_BASE_URL=https://<preview>.twvita.pages.dev SMOKE_REQUIRE_REMOVED_ASSETS=1 npm run smoke:live
HEADERS_BASE_URL=https://<preview>.twvita.pages.dev npm run headers:live
INTERACTION_BASE_URL=https://<preview>.twvita.pages.dev npm run interaction:live
DOM_BASE_URL=https://<preview>.twvita.pages.dev npm run dom:live
METADATA_BASE_URL=https://<preview>.twvita.pages.dev METADATA_CANONICAL_BASE_URL=https://twvita.com.tw npm run metadata:live
ASSETS_BASE_URL=https://<preview>.twvita.pages.dev npm run assets:live
CONSOLE_BASE_URL=https://<preview>.twvita.pages.dev npm run console:live
LAYOUT_BASE_URL=https://<preview>.twvita.pages.dev npm run layout:live
PRINT_BASE_URL=https://<preview>.twvita.pages.dev npm run print:live
```

Then verify production:

```bash
npm run audit:live
```

Record the preview URL, production checks, and any known warnings in `DEPLOYMENT.md`.

## Editing Rules

- Keep public pages in Traditional Chinese.
- Keep service area text as `目前服務範圍：雙北地區`.
- Do not add LINE links.
- Footer company information should display `(02)2812-0021` on every page.
- The contact page company phone row should display `(02)2812-0021`; the lower contact phone action should use `來電洽詢`.
- Non-contact inquiry CTAs and bottom quick-contact phone labels should use `來電洽詢`.
- Keep Email links pointed to `vitawaterproof@gmail.com` with the inquiry template fields.
- Keep extensionless route files and `.html` mirror files byte-identical where validation expects them.

## DNS Safety

Do not change Cloudflare DNS, TISNet, registrar nameservers, Pages custom domains, or public traffic routing without action-time confirmation. The TISNet forwarding form is not the production architecture.
