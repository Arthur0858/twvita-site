# TWVita Cloudflare Pages Deployment

## Local project

- Site source: `/Users/mac/Documents/New project 3/twvita-site/public`
- Cloudflare Pages project: `twvita`
- Production target: `https://twvita.com.tw/`
- Preview target: `https://twvita.pages.dev/`
- Current deployed preview: `https://d31aa468.twvita.pages.dev`
- Latest deployment observed: `https://d31aa468.twvita.pages.dev`
- Current public asset version: `20260617-audit96`
- Deploy surface: Cloudflare Pages Direct Upload with a Pages Worker bundle.

## Deploy

```bash
npx wrangler pages deploy public --project-name=twvita --branch=main
```

Routine verification:

```bash
npm run validate
npm run audit:live
```

`npm run cache:live` is intentionally separate from the main smoke test. Public
pages must use the current versioned assets, while obsolete stylesheet URLs may
continue to return `cf-cache-status: HIT` until Cloudflare cache is purged by
specific URL. Do not use a full-zone purge unless there is a separate reason.

Contact lower phone action label refined on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://d31aa468.twvita.pages.dev`
- Changed the lower phone action button in the contact-page company information panel from `(02)2812-0021` to `來電洽詢`.
- Kept the contact-page phone information row and footer phone display as `(02)2812-0021`.
- Kept the telephone href as `tel:+886228120021`.
- Updated `npm run validate`, `npm run links:live`, `npm run layout:live`, and README maintenance guidance to enforce the current placement rule.
- Verification:
  - `npm run validate` passed.
  - `npm run copy:check` passed.
  - `SMOKE_BASE_URL=https://d31aa468.twvita.pages.dev SMOKE_REQUIRE_REMOVED_ASSETS=1 npm run smoke:live` passed for 15 URLs, 18 redirects, 7 assets, and 35 removed assets.
  - `LAYOUT_BASE_URL=https://d31aa468.twvita.pages.dev npm run layout:live` passed for 6 pages across 4 viewports.
  - Direct production checks confirmed `/contact` company info phone row and footer show `(02)2812-0021`, while the lower contact phone action shows `來電洽詢`.
  - `npm run links:live`, `npm run layout:live`, `npm run smoke:live`, and `npm run drift:live` passed on production.
  - Chrome verification on `https://twvita.com.tw/contact` confirmed the lower button renders `來電洽詢`, keeps `tel:+886228120021`, has no sticky contact bar, and preserves direct phone numbers in the company row and footer.

Tank/pool service copy and preview metadata verification refined on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://447a3efc.twvita.pages.dev`
- Refined the water-tank/pool page section heading from repeated `蓄水空間...` wording to `池體修繕要兼顧使用安全、耐久與維護。`.
- Updated both `public/tank-pool-waterproofing` and `public/tank-pool-waterproofing.html`; the mirror files remain byte-identical.
- Improved `npm run metadata:live` so preview checks can fetch a Pages preview while still requiring production canonical and `og:url` values.
- Updated `README.md` preview metadata command to pass `METADATA_CANONICAL_BASE_URL=https://twvita.com.tw`.
- Verification:
  - `npm run validate` passed.
  - `npm run copy:check` passed.
  - `SMOKE_BASE_URL=https://447a3efc.twvita.pages.dev SMOKE_REQUIRE_REMOVED_ASSETS=1 npm run smoke:live` passed for 15 URLs, 18 redirects, 7 assets, and 35 removed assets.
  - `LAYOUT_BASE_URL=https://447a3efc.twvita.pages.dev npm run layout:live` passed for 6 pages across 4 viewports.
  - `METADATA_BASE_URL=https://447a3efc.twvita.pages.dev METADATA_CANONICAL_BASE_URL=https://twvita.com.tw npm run metadata:live` passed for 6 pages.
  - Direct production check confirmed `https://twvita.com.tw/tank-pool-waterproofing` contains `池體修繕要兼顧使用安全、耐久與維護。`.
  - `npm run metadata:live`, `npm run links:live`, `npm run layout:live`, `npm run smoke:live`, and `npm run drift:live` passed on production.
  - Mobile browser check on production found no horizontal overflow and the updated tank/pool H2 sequence.

Maintenance phone-label guidance refined on 2026-06-17 Asia/Taipei:

- No public content deployment was needed; production already matches the intended phone-label behavior.
- Updated `README.md` so the current editing rules are explicit:
  - every footer displays `(02)2812-0021`.
  - the contact page company phone row and main phone action display `(02)2812-0021`.
  - non-contact inquiry CTAs and bottom quick-contact phone labels display `來電洽詢`.
- Updated `npm run validate` so this precise README guidance is required going forward.
- Verification:
  - `npm run validate` passed.
  - `npm run links:live` passed for 7 production pages and 35 internal URLs.
  - `npm run layout:live` passed for 6 production pages across 4 viewports.
  - `npm run audit:live` passed 18 checks before this documentation-only refinement; the only warning remains known obsolete Cloudflare stylesheet edge cache not referenced by public pages.

Contact link labeling guardrails expanded on 2026-06-17 Asia/Taipei:

- No public content deployment was needed; production already shows the intended phone labels.
- Expanded `npm run links:live` so production checks now verify:
  - non-contact sticky and inquiry phone links display `來電洽詢`.
  - footer phone links display `(02)2812-0021`.
  - the contact page displays the direct phone number and does not render the sticky contact bar.
  - Email inquiry links remain present, including Cloudflare Email Protection rewritten links on 404 responses.
- Verification:
  - `node -c scripts/link-live.mjs` passed.
  - `npm run links:live` passed for 7 production pages and 35 internal URLs.
  - `npm run layout:live` passed for 6 production pages across 4 viewports.
  - `npm run validate` passed.
  - `npm run smoke:live` passed for 15 URLs, 18 redirects, 7 assets, and `www` redirect.

Skip-link focus target refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://41b4aa01.twvita.pages.dev`
- Updated every public page so the skip-link target is `<main id="main" tabindex="-1">`.
- Expanded `npm run validate` to require the focusable `main#main` target on every HTML route.
- Expanded `npm run interaction:live` so activating the first skip link must move focus to `MAIN#main`, not only update the URL hash.
- Purpose: improve keyboard and assistive-technology navigation by making "跳到主要內容" land on the actual main content landmark.
- Verification:
  - `npm run validate` passed.
  - `npm run copy:check` passed.
  - mirrored route files stayed byte-identical.
  - Local browser check confirmed Tab first focuses `.skip-link`, Enter changes hash to `#main`, and active focus becomes `MAIN#main`.
  - `INTERACTION_BASE_URL=https://41b4aa01.twvita.pages.dev npm run interaction:live` passed for 6 pages across 4 viewports.
  - `SMOKE_BASE_URL=https://41b4aa01.twvita.pages.dev SMOKE_REQUIRE_REMOVED_ASSETS=1 npm run smoke:live` passed for 15 URLs, 18 redirects, 7 assets, and 35 removed assets.
  - Direct production checks confirmed `https://twvita.com.tw/` contains `<main id="main" tabindex="-1">`.
  - Production browser check confirmed the skip link moves focus to `MAIN#main`.
  - `npm run audit:live` passed 18 checks.
  - `npm run cache:live` reports 33 known obsolete stylesheet edge `HIT` warnings; public pages do not reference those URLs.

SEO metadata positioning checks expanded on 2026-06-17 Asia/Taipei:

- No public content deployment was needed; production already matches local `public`.
- Expanded `npm run metadata:live` checks so SEO descriptions must keep the current positioning:
  - homepage metadata must retain `修繕` in addition to double-Taipei, waterproofing company, roof, and tank/pool terms.
  - company metadata must retain `施工經驗` with 30+ years, public-project background, double-Taipei, and private waterproofing terms.
  - project metadata must retain `屋面工程` alongside MRT, tunnel, reservoir, and site-coordination terms.
- Purpose: prevent future SEO edits from drifting back into generic waterproofing copy and losing the public-project-to-private-repair positioning.
- Verification:
  - `node -c scripts/metadata-live.mjs` passed.
  - `npm run metadata:live` passed for 6 production pages.
  - `npm run validate` passed.
  - `npm run structured:live` passed for 6 production pages.
  - `npm run smoke:live` passed for 15 URLs, 18 redirects, 7 assets, and `www` redirect.
  - `npm run drift:live` confirmed production matches local public assets.

Search and AI summary metadata validation expanded on 2026-06-17 Asia/Taipei:

- No public content deployment was needed; production already matches local `public`.
- Expanded `npm run validate` coverage for `llms.txt` so it now checks:
  - core positioning around double-Taipei waterproofing service.
  - all six canonical page URLs.
  - phone, obfuscated Email, and company address.
  - no form submission, instant messaging inquiry, online quote, or ecommerce feature claims.
  - no stale LINE, Google Sites, or removed material-spec wording.
  - no raw `vitawaterproof@gmail.com` in the text-index file.
- Purpose: keep search/AI-readable summary files aligned with the live site and current inquiry boundaries.
- Verification:
  - `node -c scripts/validate-site.mjs` passed.
  - `npm run validate` passed.
  - `npm run discovery:live` passed for sitemap, robots, and manifest.
  - `npm run smoke:live` passed for 15 URLs, 18 redirects, 7 assets, and `www` redirect.
  - `npm run drift:live` confirmed production matches local public assets.
  - `npm run copy:check` passed.

CSS validation guardrails expanded on 2026-06-17 Asia/Taipei:

- No public content deployment was needed; production already matches local `public`.
- Added CSS structural checks to `npm run validate`:
  - verifies CSS braces are balanced.
  - verifies the expected media blocks exist and stay in order: 900px, 560px, reduced-motion, forced-colors, print.
  - verifies the mobile hero spacing, sticky contact offset, and footer safe-area clearance stay inside `@media (max-width: 560px)`.
- Purpose: prevent future mobile spacing or sticky-contact fixes from leaking into global CSS because of misplaced braces or media block edits.
- Verification:
  - `node -c scripts/validate-site.mjs` passed.
  - `npm run validate` passed.
  - `npm run copy:check` passed.
  - `npm run drift:live` confirmed production matches local public assets.
  - `npm run smoke:live` passed for 15 URLs, 18 redirects, 7 assets, and `www` redirect.
  - `npm run layout:live` passed for 6 pages across 4 viewports.

Mobile homepage first-screen spacing refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://19335303.twvita.pages.dev`
- Bumped the public asset version from `20260617-audit95` to `20260617-audit96` so mobile browsers request the updated CSS.
- Tightened mobile-only homepage hero spacing:
  - `.hero-copy` now uses `padding: 1.45rem 1rem 1.55rem`.
  - `.hero-copy .lead` now uses `margin-top: 0.95rem`, `font-size: 1rem`, and `line-height: 1.62`.
  - `.trust-panel` spacing and item padding are reduced on small screens.
  - mobile `.hero-media` min-height is reduced from 320px to 300px so the site image appears earlier.
- Kept desktop layout, copy, phone labels, footer phone display, and contact page phone display unchanged.
- Added `styles-20260617-audit95.css` to the obsolete cache list.
- Updated validation and smoke checks to require the new mobile hero spacing.
- Verification:
  - `npm run validate` passed.
  - `npm run copy:check` passed.
  - Local mobile 390x844 browser check showed no horizontal overflow, sticky phone text `來電洽詢`, hero height about 913px, image starting around y=685px, and the current CSS loaded.
  - `SMOKE_BASE_URL=https://19335303.twvita.pages.dev SMOKE_REQUIRE_REMOVED_ASSETS=1 npm run smoke:live` passed for 15 URLs, 18 redirects, 7 assets, and 35 removed assets.
  - `LAYOUT_BASE_URL=https://19335303.twvita.pages.dev npm run layout:live` passed for 6 pages across 4 viewports.
  - Preview mobile 390x844 browser check confirmed `/assets/styles-20260617-audit96.css`, no horizontal overflow, `來電洽詢` sticky phone label, and image starting around y=685px.
  - Direct production checks confirmed `https://twvita.com.tw/` loads `/assets/styles-20260617-audit96.css` and the production CSS contains the new mobile spacing.
  - `npm run audit:live` passed 18 checks.
  - `npm run cache:live` reports 34 known obsolete stylesheet edge `HIT` warnings; public pages do not reference those URLs.

Homepage and company copy refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://eada2970.twvita.pages.dev`
- Refined homepage copy from the more slogan-like `民間修繕案件，也以工程標準判斷。` to `小型案場，更需要把細節說清楚。`
- Reworded the following homepage sentence to explain the practical outcome: current conditions, feasible repair methods, and post-work inspection/maintenance.
- Refined company-page wording from `專業防水公司要先判斷現場，再談材料。` to `先把現場看清楚，再談材料。`
- Replaced one repeated `判斷` usage in company service notes with `確認`, keeping the same evaluation meaning in plainer language.
- Updated `npm run smoke:live` to require the new homepage sentence so the less slogan-like copy direction is protected in future deploys.
- Verification:
  - `npm run validate` passed.
  - `npm run copy:check` passed with 107 visible sentence candidates.
  - `/about` and `/about.html` are byte-identical.
  - `SMOKE_BASE_URL=https://eada2970.twvita.pages.dev SMOKE_REQUIRE_REMOVED_ASSETS=1 npm run smoke:live` passed for 15 URLs, 18 redirects, 7 assets, and 34 removed assets.
  - `LAYOUT_BASE_URL=https://eada2970.twvita.pages.dev npm run layout:live` passed for 6 pages across 4 viewports.
  - Direct production checks confirmed `https://twvita.com.tw/` contains `小型案場，更需要把細節說清楚。` and no longer contains the old `民間修繕案件，也以工程標準判斷。` phrase.
  - Direct production checks confirmed `https://twvita.com.tw/about` contains `先把現場看清楚，再談材料。`, `民間修繕更需要把範圍抓準。`, and `先確認是否需要到場勘查`.
  - `npm run audit:live` passed 18 checks.
  - `npm run cache:live` reports 33 known obsolete stylesheet edge `HIT` warnings; public pages do not reference those URLs.

Mobile bottom quick-contact cache guard deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://c75ba47c.twvita.pages.dev`
- Bumped the public asset version from `20260617-audit94` to `20260617-audit96` so mobile browsers request fresh page assets after the bottom quick-contact label change.
- Added a small JavaScript guard that forces the bottom quick-contact phone link to display `來電洽詢` while keeping `tel:+886228120021` unchanged.
- Kept footer company information and the contact page phone action as `(02)2812-0021`.
- Added `styles-20260617-audit94.css` to the obsolete cache list.
- Updated live smoke checks to verify the JavaScript guard is present.
- Preview verification:
  - `SMOKE_BASE_URL=https://c75ba47c.twvita.pages.dev SMOKE_REQUIRE_REMOVED_ASSETS=1 npm run smoke:live` passed for 15 URLs, 18 redirects, 7 assets, and 34 removed assets.
  - `DOM_BASE_URL=https://c75ba47c.twvita.pages.dev npm run dom:live` passed for 6 pages.
- Production verification:
  - Direct checks confirmed `https://twvita.com.tw/` returns `20260617-audit96`, loads `/assets/styles-20260617-audit96.css`, and the bottom sticky phone button displays `來電洽詢`.
  - Direct checks confirmed `https://twvita.com.tw/assets/site.js?v=20260617-audit96` contains the sticky-contact label guard.
  - Direct checks confirmed `https://twvita.com.tw/contact` keeps the contact page phone display as `(02)2812-0021` and has no bottom sticky contact bar.
  - Mobile browser check at 390x844 confirmed the rendered bottom phone text is `來電洽詢`, the link remains `tel:+886228120021`, and the footer phone remains `(02)2812-0021`.
  - `npm run audit:live` passed 18 checks.
  - `npm run cache:live` reports 33 known obsolete stylesheet edge `HIT` warnings; public pages do not reference those URLs.

Mobile first-screen spacing refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://2a68401c.twvita.pages.dev`
- Bumped the public asset version from `20260617-audit93` to `20260617-audit94` so the mobile CSS change is not blocked by immutable stylesheet cache.
- Removed the local `styles-20260617-audit93.css` file and added it to the obsolete cache list.
- Tightened mobile-only vertical spacing:
  - homepage hero copy uses `padding: 1.8rem 1rem 2.1rem`.
  - page-title sections use `padding: 2.2rem 0 2.6rem`.
  - mobile content sections are slightly denser while preserving readable spacing.
- Goal: bring the homepage CTA and contact-page company phone information into view sooner on 390px mobile screens without changing desktop layout or copy.
- Updated `npm run validate` and `npm run smoke:live` to require the compact mobile spacing and the new `audit94` asset version.
- Preview verification:
  - `SMOKE_BASE_URL=https://2a68401c.twvita.pages.dev SMOKE_REQUIRE_REMOVED_ASSETS=1 npm run smoke:live` passed for 15 URLs, 18 redirects, 7 assets, and 33 removed assets.
  - `LAYOUT_BASE_URL=https://2a68401c.twvita.pages.dev npm run layout:live` passed for 6 pages across 2 viewports.
  - Mobile screenshot checks at 390px confirmed the homepage CTA appears earlier and the contact page shows phone information in the first viewport.
- Production verification:
  - Direct checks confirmed `https://twvita.com.tw/` and `/contact` return HTTP 200, contain `20260617-audit94`, do not contain `20260617-audit93`, and load `/assets/styles-20260617-audit94.css`.
  - Direct CSS check confirmed the compact mobile hero and page-title spacing is live.
  - `npm run audit:live` passed 18 checks: validate, copy quality, drift, discovery, headers, links, interaction, DOM structure, metadata, assets, perf, structured data, smoke, console, layout, print, a11y, and cache hygiene.
  - `npm run cache:purge:obsolete` dry-run now lists 33 exact obsolete cache URLs.
  - `npm run cache:live` reports 32 known Cloudflare edge `HIT` warnings; public pages do not reference those URLs.

Responsive layout audit coverage expanded on 2026-06-17 Asia/Taipei:

- No public content deployment was needed; this update improves the production verification workflow.
- Expanded `npm run layout:live` from 2 viewport widths to 4:
  - mobile: 390x844
  - tablet: 768x1024
  - narrow desktop: 1024x900
  - desktop: 1440x1000
- Added `npm run validate` guardrails so those four viewport names must remain in `scripts/layout-live.mjs`.
- Visual spot checks:
  - 768px tablet keeps the compact header with menu button, service-area badge, and no horizontal overflow.
  - 1024px narrow desktop shows the full navigation without crowding and keeps the hero image/copy layout stable.
- Verification:
  - `npm run layout:live` passed for 6 pages across 4 viewports.
  - `npm run validate` passed.
  - `npm run audit:live` passed 18 checks, including the expanded 4-viewport layout audit.
  - `npm run cache:live` still reports 32 known Cloudflare edge `HIT` warnings for obsolete immutable CSS URLs; public pages do not reference them.

Responsive interaction audit coverage expanded on 2026-06-17 Asia/Taipei:

- No public content deployment was needed; this update improves the production verification workflow.
- Expanded `npm run interaction:live` from 2 viewport widths to 4:
  - mobile: 390x844
  - tablet: 768x1024
  - narrow desktop: 1024x900
  - desktop: 1440x1000
- The interaction audit now verifies:
  - skip link focus and activation.
  - focusable elements avoid positive `tabindex`.
  - mobile/tablet menu opens, closes after a nav-link click, closes after outside click, and restores `inert` state.
  - narrow desktop/desktop navigation is visible, non-inert, and exposes all navigation links.
  - service-page FAQ summaries keep visible focus and keyboard activation behavior.
- Added `npm run validate` guardrails so the 4-viewport interaction coverage and desktop-navigation checks remain in `scripts/interaction-live.mjs`.
- Verification:
  - `npm run interaction:live` passed for 6 pages across 4 viewports.
  - `npm run validate` passed.
  - `npm run audit:live` passed 18 checks, including the expanded interaction audit.
  - `npm run cache:live` still reports 32 known Cloudflare edge `HIT` warnings for obsolete immutable CSS URLs; public pages do not reference them.

Responsive console/runtime audit coverage expanded on 2026-06-17 Asia/Taipei:

- No public content deployment was needed; this update improves the production verification workflow.
- Expanded `npm run console:live` from 2 viewport widths to 4:
  - mobile: 390x844
  - tablet: 768x1024
  - narrow desktop: 1024x900
  - desktop: 1440x1000
- The runtime audit continues to watch console errors, page errors, failed requests, HTTP 4xx/5xx asset responses, `no-js` removal, Email initialization, and accidental inline CSP meta usage.
- Added `npm run validate` guardrails so those four viewport checks remain in `scripts/console-live.mjs`.
- Verification:
  - `npm run console:live` passed for 6 pages across 4 viewports.
  - `npm run validate` passed.
  - `npm run audit:live` passed 18 checks, including the expanded console/runtime audit.
  - `npm run cache:live` still reports 32 known Cloudflare edge `HIT` warnings for obsolete immutable CSS URLs; public pages do not reference them.

Accessibility viewport coverage expanded on 2026-06-17 Asia/Taipei:

- No public content deployment was needed; this update improves the production verification workflow.
- Expanded `npm run a11y:live` so axe runs on both:
  - mobile: 390x844
  - desktop: 1440x1000
- The script now passes Chrome `--window-size` options for each viewport and stops on the first axe failure.
- Added `npm run validate` guardrails so `scripts/a11y-live.mjs` must keep the mobile and desktop viewport checks.
- Verification:
  - `npm run validate` passed.
  - `npm run a11y:live` passed: 6 pages across 2 viewports, 0 violations on every page.
  - `npm run interaction:live` passed for 6 pages across 2 viewports.
  - `npm run audit:live` passed 18 checks, including the expanded axe coverage.
  - `npm run cache:live` still reports 32 known Cloudflare edge `HIT` warnings for obsolete immutable CSS URLs; public pages do not reference them.

Targeted obsolete-cache purge tooling added on 2026-06-17 Asia/Taipei:

- No public content deployment was needed; the current production deployment remains `https://3b9c4d5b.twvita.pages.dev`.
- Added `scripts/cache-assets.mjs` so current and obsolete cache asset lists are maintained in one place.
- Added `npm run cache:purge:obsolete` as a dry-run-first utility for the stale stylesheet cache issue.
- Updated `npm run smoke:live` to reuse the same `obsoleteAssets` list from `scripts/cache-assets.mjs`, preventing preview smoke checks and cache hygiene checks from drifting apart.
- The purge utility lists exact obsolete CSS URLs by default and only performs a Cloudflare API purge when all of the following are supplied:
  - `CACHE_PURGE_EXECUTE=1`
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ZONE_ID`
- The script sends targeted `files` purge requests in batches of 30 URLs and never purges the full zone.
- Updated `README.md` with the dry-run and execution commands.
- Updated `npm run validate` so README, `package.json`, and smoke removed-asset checks must keep this targeted purge workflow available.
- Verification:
  - `npm run validate` passed.
  - `npm run copy:check` passed.
  - `SMOKE_BASE_URL=https://3b9c4d5b.twvita.pages.dev SMOKE_REQUIRE_REMOVED_ASSETS=1 npm run smoke:live` passed for 15 URLs, 18 redirects, 7 assets, and 32 removed assets.
  - `npm run cache:purge:obsolete` dry-run listed 32 exact obsolete cache URLs.
  - `npm run audit:live` passed 18 production checks.
  - `npm run cache:live` still reports 31 known Cloudflare edge `HIT` warnings; public pages do not reference those URLs.

Contact page phone-priority refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://3b9c4d5b.twvita.pages.dev`
- Adjusted the contact page action buttons so `(02)2812-0021` appears first as the primary action, followed by `Email 洽詢` as the secondary action.
- Kept the contact page free of the bottom sticky quick-contact bar, preserving the cleaner company-information layout.
- Updated `npm run validate` so future edits must keep the contact page phone action before the Email action.
- Preview verification:
  - `SMOKE_BASE_URL=https://3b9c4d5b.twvita.pages.dev SMOKE_REQUIRE_REMOVED_ASSETS=1 npm run smoke:live` passed for 15 URLs, 18 redirects, 7 assets, and 32 removed assets.
  - `LAYOUT_BASE_URL=https://3b9c4d5b.twvita.pages.dev npm run layout:live` passed for 6 pages across 2 viewports.
  - Direct preview check confirmed `phoneFirst=true`, `phonePrimary=true`, and `emailSecondary=true`.
- Production verification:
  - Direct check confirmed `https://twvita.com.tw/contact` returns HTTP 200, phone action appears before Email, phone uses primary button styling, Email uses secondary button styling, and no sticky contact bar is present.
  - `npm run audit:live` passed 18 checks: validate, copy quality, drift, discovery, headers, links, interaction, DOM structure, metadata, assets, perf, structured data, smoke, console, layout, print, a11y, and cache hygiene.
  - `npm run cache:live` still reports only the known Cloudflare edge `HIT` warnings for obsolete immutable CSS URLs; public pages do not reference them.

Mobile bottom quick-contact label update deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://b538268b.twvita.pages.dev`
- Changed the mobile bottom quick-contact phone button on non-contact pages from `(02)2812-0021` back to the shorter `來電洽詢`.
- Kept footer company information and the contact page phone action as `(02)2812-0021`, so company contact details still show the number directly.
- Added `npm run interaction:live` and integrated it into `npm run audit:live` to verify skip-link focus, mobile menu state, and FAQ keyboard interaction across mobile and desktop viewports.
- Updated validation, smoke, DOM, layout, README, and interaction checks so the rules are explicit:
  - non-contact quick phone CTAs and bottom sticky phone labels use `來電洽詢`.
  - footer and contact-page company phone positions display `(02)2812-0021`.
  - the contact page does not include the bottom sticky quick-contact bar.
- Preview verification:
  - `SMOKE_BASE_URL=https://b538268b.twvita.pages.dev SMOKE_REQUIRE_REMOVED_ASSETS=1 npm run smoke:live` passed for 15 URLs, 18 redirects, 7 assets, and 32 removed assets.
  - `LAYOUT_BASE_URL=https://b538268b.twvita.pages.dev npm run layout:live` passed for 6 pages across 2 viewports.
  - `INTERACTION_BASE_URL=https://b538268b.twvita.pages.dev npm run interaction:live` passed for 6 pages across 2 viewports.
- Production verification:
  - Direct checks confirmed `/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, and `/projects` each have one bottom sticky bar, show `來電洽詢`, and do not show `(02)2812-0021` inside that sticky phone button.
  - Direct checks confirmed `/contact` has no bottom sticky bar, while its company phone and action button remain `(02)2812-0021`.
  - `npm run audit:live` passed 18 checks: validate, copy quality, drift, discovery, headers, links, interaction, DOM structure, metadata, assets, perf, structured data, smoke, console, layout, print, a11y, and cache hygiene.
  - `npm run cache:live` still reports only the known Cloudflare edge `HIT` warnings for obsolete immutable CSS URLs; public pages do not reference them.

Copy quality refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://8dc3951e.twvita.pages.dev`
- Refined the roof-waterproofing closing CTA to avoid repeating the FAQ photo checklist:
  - Old focus: repeating roof overview, drainage outlet, parapet, equipment base, and repaired-area photos.
  - New focus: explaining when water marks occur, such as after rain, continuous rain, AC drainage, or cleaning, so inspection order can be judged more clearly.
- Added `npm run copy:check` to guard visible copy quality:
  - checks for exact duplicate visible sentences across main content.
  - rejects stale or banned terms such as LINE, specification-page wording, old small-case labels, and exaggerated generic marketing phrases.
  - keeps guardrails for the current positioning: public-project discipline applied to private repair, service area in 雙北地區, and visible phone/Email contact information.
  - checks high-frequency terms so future edits do not drift back into repetitive wording.
- Integrated `copy:check` into `npm run audit:live` and README routine audit steps.
- Preview verification:
  - `SMOKE_BASE_URL=https://8dc3951e.twvita.pages.dev SMOKE_REQUIRE_REMOVED_ASSETS=1 npm run smoke:live` passed for 15 URLs, 18 redirects, 7 assets, and 32 removed assets.
  - `LAYOUT_BASE_URL=https://8dc3951e.twvita.pages.dev npm run layout:live` passed for 6 pages across 2 viewports.
- Production verification:
  - Direct checks confirmed `https://twvita.com.tw/roof-waterproofing` contains `屋頂反覆滲水，先說明發生時機。` and no longer contains `屋頂反覆滲水，先整理水痕與排水位置。`.
  - `npm run copy:check` passed for 6 pages and 108 visible sentence candidates.
  - `npm run audit:live` passed 17 checks: validate, copy quality, drift, discovery, headers, links, DOM structure, metadata, assets, perf, structured data, smoke, console, layout, print, a11y, and cache hygiene.
  - `npm run cache:live` still reports only the known Cloudflare edge `HIT` warnings for obsolete immutable CSS URLs; public pages do not reference them.

Image and static asset audit added on 2026-06-17 Asia/Taipei:

- No public content deployment was needed; this update improves the maintenance and production audit workflow.
- Added `npm run assets:live` to verify production image assets and rendered responsive image behavior.
- The asset check verifies:
  - icon, apple-touch icon, social card, and responsive WebP files return HTTP 200 with expected content type, cache behavior, byte range, and image dimensions.
  - hero preload image and `imagesrcset` match each page's primary visual.
  - rendered hero images use responsive WebP sources on mobile and desktop.
  - hero images are high priority and not lazy-loaded.
  - lazy-loaded below-fold images are allowed to stay unloaded until the browser needs them.
  - loaded content images use WebP sources rather than falling back to larger JPGs.
- Integrated `assets:live` into `npm run audit:live` and README preview verification steps.
- Production verification:
  - `npm run validate` passed.
  - `npm run assets:live` passed for 14 production asset files and 5 image-bearing pages across mobile and desktop viewports.
  - `npm run audit:live` passed 16 checks: validate, drift, discovery, headers, links, DOM structure, metadata, assets, perf, structured data, smoke, console, layout, print, a11y, and cache hygiene.
  - `npm run cache:live` still reports only the known Cloudflare edge `HIT` warnings for obsolete immutable CSS URLs; public pages do not reference them.

SEO and social metadata audit added on 2026-06-17 Asia/Taipei:

- No public content deployment was needed; this update improves the maintenance and production audit workflow.
- Added `npm run metadata:live` to inspect the six public pages for search-result and sharing-preview quality.
- The metadata check verifies:
  - expected page title and H1 for each route.
  - title, meta description, and OG description length ranges.
  - unique title and meta description across public pages.
  - canonical URL and `og:url` match the current route.
  - OG/Twitter titles match the document title.
  - Twitter description matches OG description while meta description stays distinct.
  - all pages use the canonical 1200x630 social card with consistent alt text.
  - each meta description includes page-specific terms such as service area, service type, public-work background, project categories, or inquiry requirements.
- Integrated `metadata:live` into `npm run audit:live` and README preview verification steps.
- Production verification:
  - `npm run validate` passed.
  - `npm run metadata:live` passed for 6 production pages.
  - `npm run audit:live` passed 15 checks: validate, drift, discovery, headers, links, DOM structure, metadata, perf, structured data, smoke, console, layout, print, a11y, and cache hygiene.
  - `npm run cache:live` still reports only the known Cloudflare edge `HIT` warnings for obsolete immutable CSS URLs; public pages do not reference them.

DOM structure audit added on 2026-06-17 Asia/Taipei:

- No public content deployment was needed; this update improves the maintenance and production audit workflow.
- Added `npm run dom:live` to inspect the rendered DOM for the six public pages.
- The DOM check verifies:
  - one `main#main` and one visible H1 per page.
  - skip-link target, duplicate ids, and `aria-controls` / `aria-labelledby` / `aria-describedby` references.
  - navigation landmarks, current-page navigation, menu button type/name, empty links, nested interactive controls, image alt/dimensions.
  - phone display rules: footer and bottom quick-contact show `(02)2812-0021`; non-bottom CTAs use `來電洽詢`; contact page company/action phone shows `(02)2812-0021`.
- Integrated `dom:live` into `npm run audit:live` and README preview verification steps.
- Production verification:
  - `npm run validate` passed.
  - `npm run dom:live` passed for 6 production pages.
  - `npm run audit:live` passed 14 checks: validate, drift, discovery, headers, links, DOM structure, perf, structured data, smoke, console, layout, print, a11y, and cache hygiene.
  - `npm run cache:live` still reports only the known Cloudflare edge `HIT` warnings for obsolete immutable CSS URLs; public pages do not reference them.

Bottom phone display update deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://737cc9b7.twvita.pages.dev`
- Kept general page CTA phone buttons as `來電洽詢`.
- Changed bottom quick-contact phone links on non-contact pages to display `(02)2812-0021` directly.
- Contact page company information and contact phone action continue to display `(02)2812-0021` directly.
- Footer company information continues to display `TEL：(02)2812-0021`.
- Updated validation, smoke, and layout checks to enforce this split.
- Preview verification:
  - `SMOKE_BASE_URL=https://737cc9b7.twvita.pages.dev SMOKE_REQUIRE_REMOVED_ASSETS=1 npm run smoke:live` passed for 15 URLs, 18 redirects, 7 assets, and 32 removed assets.
  - `LAYOUT_BASE_URL=https://737cc9b7.twvita.pages.dev npm run layout:live` passed for 6 pages across 2 viewports.
- Production verification:
  - Direct checks confirmed `https://twvita.com.tw/` has bottom sticky phone `(02)2812-0021` and general CTA `來電洽詢`.
  - Direct checks confirmed `https://twvita.com.tw/contact` has no bottom sticky contact and its contact phone button displays `(02)2812-0021`.
  - `npm run audit:live` passed 13 checks: validate, drift, discovery, headers, links, perf, structured data, smoke, console, layout, print, a11y, and cache hygiene.
  - `npm run cache:live` still reports only the known Cloudflare edge `HIT` warnings for obsolete immutable CSS URLs; public pages do not reference them.

Mobile contact-page refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://b324ffc4.twvita.pages.dev`
- Versioned public assets to `20260617-audit90`.
- Removed the redundant floating quick-contact navigation from `/contact`, because the page already presents company phone and Email directly.
- Kept the floating quick-contact bar on non-contact pages, with phone CTA text as `來電洽詢`.
- Extended obsolete stylesheet handling to include `styles-20260617-audit89.css`.
- Production verification:
  - `npm run validate` passed.
  - `npm run smoke:live` passed for 14 URLs, 18 redirects, 7 assets, and `www` redirect.
  - `npm run layout:live` passed for 6 pages across mobile and desktop viewports.
  - `npm run a11y:live` found 0 automated axe violations on 6 pages.
  - `npm run cache:live` still reports only known Cloudflare edge `HIT` warnings for obsolete immutable CSS URLs.
  - `https://twvita.com.tw/contact` contains `<body class="contact-page">`, uses `20260617-audit90`, has no horizontal overflow, and does not include `<nav class="sticky-contact">`.

Service FAQ wording update deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://eeff7c44.twvita.pages.dev`
- Versioned public assets to `20260617-audit91`.
- Reworked service FAQ wording away from material-spec questions and toward customer site conditions:
  - `/roof-waterproofing`: replaced the PVC/TPO suitability question with an equipment-node/local repair question.
  - `/tank-pool-waterproofing`: replaced the membrane maintenance question with a follow-up inspection question.
- Updated matching FAQPage JSON-LD and CSP hashes.
- Extended obsolete stylesheet handling to include `styles-20260617-audit90.css`.
- Production verification:
  - `npm run validate` passed.
  - `npm run smoke:live` passed for 14 URLs, 18 redirects, 7 assets, and `www` redirect.
  - `npm run layout:live` passed for 6 pages across mobile and desktop viewports.
  - `npm run a11y:live` found 0 automated axe violations on 6 pages.
  - `npm run cache:live` still reports only known Cloudflare edge `HIT` warnings for obsolete immutable CSS URLs.
  - All 6 main production pages use `20260617-audit91`, contain no Google Sites or LINE markers, and no longer contain the old FAQ questions `PVC/TPO 防水膜適合哪些屋頂？` or `防水膜後續可以維修嗎？`.

Robots header consistency update deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://993b0e55.twvita.pages.dev`
- Versioned public assets to `20260617-audit92`.
- Added explicit Worker handling for `/robots.txt` so preview serves:
  - `Content-Type: text/plain; charset=utf-8`
  - `Cache-Control: public, max-age=3600, must-revalidate, no-transform`
  - `Content-Language: zh-Hant-TW`
- Updated smoke tests so preview requires the robots headers, while production apex verifies robots availability and sitemap declaration because Cloudflare may still return managed/cached robots headers on the custom domain.
- Extended obsolete stylesheet handling to include `styles-20260617-audit91.css`.
- Production verification:
  - `npm run validate` passed.
  - `SMOKE_BASE_URL=https://993b0e55.twvita.pages.dev SMOKE_REQUIRE_REMOVED_ASSETS=1 npm run smoke:live` passed.
  - `npm run smoke:live` passed for 14 URLs, 18 redirects, 7 assets, and `www` redirect.
  - `npm run layout:live` passed for 6 pages across mobile and desktop viewports.
  - `npm run a11y:live` found 0 automated axe violations on 6 pages.
  - `npm run cache:live` still reports only known Cloudflare edge `HIT` warnings for obsolete immutable CSS URLs.
  - All 6 main production pages use `20260617-audit92`, contain no Google Sites or LINE markers, and `/robots.txt` returns HTTP 200 with the sitemap declaration.

Manifest language consistency update deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://606cfb99.twvita.pages.dev`
- Kept public asset version at `20260617-audit92`; this update only corrected the Web App Manifest metadata and verification rules.
- Updated `manifest.webmanifest` language from `zh-Hant` to `zh-Hant-TW`, matching the HTML alternate links, JSON-LD language, and Worker `Content-Language` header.
- Added validation and live smoke coverage for the manifest language value.
- Production verification:
  - `npm run validate` passed.
  - `SMOKE_BASE_URL=https://606cfb99.twvita.pages.dev SMOKE_REQUIRE_REMOVED_ASSETS=1 npm run smoke:live` passed.
  - `LAYOUT_BASE_URL=https://606cfb99.twvita.pages.dev npm run layout:live` passed.
  - `npm run smoke:live` passed for 14 URLs, 18 redirects, 7 assets, and `www` redirect.
  - `npm run a11y:live` found 0 automated axe violations on 6 pages.
  - Direct checks confirmed both `https://606cfb99.twvita.pages.dev/manifest.webmanifest` and `https://twvita.com.tw/manifest.webmanifest` return `lang: zh-Hant-TW`.
  - `npm run cache:live` still reports only known Cloudflare edge `HIT` warnings for obsolete immutable CSS URLs; public pages do not reference those old stylesheet URLs.

HTML language consistency update deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://a2065ac5.twvita.pages.dev`
- Kept public asset version at `20260617-audit92`; this update corrected HTML metadata and verification rules only.
- Updated all public HTML route files from `<html lang="zh-Hant" class="no-js">` to `<html lang="zh-Hant-TW" class="no-js">`, matching the manifest, JSON-LD, alternate links, and Worker `Content-Language` header.
- Added validation and live smoke coverage for the exact HTML language value.
- Production verification:
  - `npm run validate` passed.
  - `SMOKE_BASE_URL=https://a2065ac5.twvita.pages.dev SMOKE_REQUIRE_REMOVED_ASSETS=1 npm run smoke:live` passed.
  - `LAYOUT_BASE_URL=https://a2065ac5.twvita.pages.dev npm run layout:live` passed.
  - `npm run smoke:live` passed for 14 URLs, 18 redirects, 7 assets, and `www` redirect.
  - `npm run a11y:live` found 0 automated axe violations on 6 pages.
  - Direct checks confirmed `https://a2065ac5.twvita.pages.dev/`, `/about`, `/contact`, and the same production routes return `lang="zh-Hant-TW"`, no Google Sites markers, and no LINE markers.
  - `npm run cache:live` still reports only known Cloudflare edge `HIT` warnings for obsolete immutable CSS URLs; public pages do not reference those old stylesheet URLs.

Verification hardening update on 2026-06-17 Asia/Taipei:

- No public deploy was required; this update changed local verification scripts only.
- Added `20260617-audit87` through `20260617-audit91` to local stale-version checks so future content or asset-version regressions are caught earlier.
- Added live mobile-menu interaction coverage to `npm run layout:live`, verifying the menu starts hidden/inert on mobile, opens with the correct accessible state, and closes with Escape.
- Added live phone and Email DOM coverage to `npm run layout:live`, verifying footer Email initialization, contact-page real Email display, initialized mailto templates, and the agreed phone-label rule.
- Added live skip-link and no-JavaScript fallback coverage to `npm run layout:live`, verifying the skip link moves into view on focus, JavaScript removes `no-js`, and mobile navigation remains visible/usable when JavaScript is disabled.
- Added live CSS and JavaScript minimum byte-size checks to `npm run smoke:live`, preventing empty or severely truncated stylesheet/script assets from passing on keyword checks alone.
- Expanded stale-version and cache-hygiene tracking so `audit91` through `audit63` stylesheet URLs are checked consistently across `smoke:live` and `cache:live`.
- Added stricter social metadata validation for `og:locale`, `og:site_name`, social image URL, image dimensions, image alt text, Twitter card, and Twitter image metadata.
- Verification:
  - `npm run validate` passed.
  - `npm run layout:live` passed for 6 pages across mobile and desktop viewports, including mobile menu, phone-label, Email initialization, skip-link, and no-JavaScript fallback checks.
  - `npm run smoke:live` passed for 14 URLs, 18 redirects, 7 assets, and `www` redirect.
  - `npm run a11y:live` found 0 automated axe violations on 6 pages after one retry; the first run failed because the axe/Selenium server terminated early before returning page violations.
  - `npm run cache:live` still reports only known Cloudflare edge `HIT` warnings for 30 obsolete immutable CSS URLs; public pages do not reference those old stylesheet URLs.
  - Direct production checks confirmed `/assets/styles-20260617-audit92.css` is 18199 bytes and `/assets/site.js?v=20260617-audit92` is 2286 bytes.

Deployed on 2026-06-15 with Cloudflare Pages Direct Upload. The live preview passed checks for:

- `/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, `/membranes`, `/contact`
- `/robots.txt`, `/sitemap.xml`, `/favicon.ico`
- `.html` redirects to extensionless URLs
- Redirect aliases: `/home`, `/company`, `/roof`, `/tank`, `/pool`, `/works`, `/spec`, `/contact-us`
- Desktop and mobile browser checks: HTTP 200, no broken images, no horizontal overflow, no console errors.

Visual/copy optimization deployed on 2026-06-16 Asia/Taipei:

- Added clearer trust and evaluation copy on the homepage.
- Replaced complex generated graphics with a simpler waterproofing visual: water beading on membrane surface.
- Removed LINE as an inquiry path and focused conversion on phone and Email.
- Added service-page CTA sections and practical decision copy for roof, tank/pool, membranes, projects, and about pages.
- Mobile fixed CTA is disabled to avoid covering primary content; desktop keeps fixed phone/Email actions.
- CSS and JS are versioned with query parameters to avoid stale immutable asset cache.

## Domain cutover

The original TISNet forwarding form for `www.twvita.com.tw` pointed to `sites.google.com/view/twvita`. It was not used as the final architecture.

Cloudflare zone created for `twvita.com.tw` in account `e6780ef96bb6f53eba1dbc4d6dfa7376`.

Registrar/TISNet nameserver migration submitted successfully on 2026-06-16 Asia/Taipei via Chrome:

- Cloudflare nameserver 1: `dilbert.ns.cloudflare.com`
- Cloudflare nameserver 2: `iris.ns.cloudflare.com`
- TISNet form also required IPv4 values:
  - `dilbert.ns.cloudflare.com` -> `108.162.193.155`
  - `iris.ns.cloudflare.com` -> `172.64.32.118`

External DNS verification after TISNet submission:

- `dig +short NS twvita.com.tw` returned `dilbert.ns.cloudflare.com.` and `iris.ns.cloudflare.com.`
- `dig +trace NS twvita.com.tw` showed the `.com.tw` delegation pointing at the Cloudflare nameservers.

Cloudflare Pages custom domains were added on 2026-06-16 Asia/Taipei:

- `twvita.com.tw`
- `www.twvita.com.tw`

Status immediately after adding:

- `twvita.com.tw`: `Verifying`
- `www.twvita.com.tw`: `Verifying`
- DNS records in Cloudflare:
  - `twvita.com.tw` CNAME `twvita.pages.dev`, proxied, TTL Auto
  - `www.twvita.com.tw` CNAME `twvita.pages.dev`, proxied, TTL Auto
  - `twvita.com.tw` TXT Google site verification record retained, DNS only, TTL Auto
- DNS records resolve externally to Cloudflare proxy IPs.
- `https://twvita.pages.dev/` returns HTTP 200.
- Cloudflare Edge Certificates shows Universal SSL for `*.twvita.com.tw, twvita.com.tw` as `Pending Validation(TXT)`.
- `https://twvita.com.tw/` and `https://www.twvita.com.tw/` temporarily fail TLS handshake while Cloudflare completes Pages custom-domain verification and certificate issuance.

Update after 2026-06-16 visual/copy deployment:

- `https://twvita.com.tw/` returns HTTP 200 and serves the optimized site.
- Browser verification on `https://twvita.com.tw/contact` confirmed phone `tel:` links and Email `mailto:` links work after client-side initialization.
- `https://www.twvita.com.tw/` still fails TLS handshake and is waiting for Cloudflare custom-domain/SSL completion.

Production-domain check on 2026-06-16 Asia/Taipei:

- `https://twvita.com.tw/` returns HTTP 200 from Cloudflare and serves the rebuilt site, not Google Sites.
- Cloudflare Pages dashboard shows `twvita.com.tw` as `Active` with `SSL enabled`.
- `www.twvita.com.tw` authoritative DNS is delegated to Cloudflare and resolves through Cloudflare proxy IPs from `1.1.1.1`, `8.8.8.8`, `dilbert.ns.cloudflare.com`, and `iris.ns.cloudflare.com`.
- Cloudflare Pages dashboard still shows `www.twvita.com.tw` as `Verifying` with `Complete DNS setup`.
- A non-destructive `Check DNS records` recheck was triggered from the Cloudflare Pages custom-domain panel. Cloudflare responded that records for `www.twvita.com.tw` are being rechecked.
- `npx wrangler pages project list` still lists `twvita.pages.dev, twvita.com.tw` only for the `twvita` project, not `www.twvita.com.tw`.
- `https://www.twvita.com.tw/` still fails TLS handshake with no peer certificate. The remaining repair path is to remove the stuck `www.twvita.com.tw` custom-domain association in Cloudflare Pages and add it again to the same `twvita` Pages project, then verify HTTPS.

Follow-up check on 2026-06-16 Asia/Taipei:

- `https://twvita.com.tw/` still returns HTTP 200.
- `www.twvita.com.tw` still resolves to Cloudflare proxy IPs from public DNS.
- `https://www.twvita.com.tw/` still fails TLS handshake with no peer certificate.
- `npx wrangler pages project list` still lists `twvita.pages.dev, twvita.com.tw` only for the `twvita` project.
- No further non-destructive repair remains beyond waiting for Cloudflare. Active repair still requires removing and re-adding the stuck `www.twvita.com.tw` Pages custom-domain association.

Conversion-copy update deployed on 2026-06-16 Asia/Taipei:

- Deployment URL: `https://c7d409ba.twvita.pages.dev`
- Added a homepage inquiry-preparation section explaining what to provide before calling or emailing.
- Added contact-page guidance for urgent leaks versus photo/document email inquiries.
- Renamed the waterproof surface visual asset to `roof-waterproof-surface.*` to avoid client-side blocking by filename and verified both image formats return HTTP 200.
- Updated CSS cache bust to `styles.css?v=20260616-conversion1`.
- Verified on `https://twvita.com.tw/` and `https://twvita.com.tw/contact`:
  - New conversion copy is visible.
  - Desktop 1280px and mobile 390px have no horizontal overflow.
  - Images load successfully.
  - Phone and Email paths remain active.
  - No LINE copy or links are present.

FAQ trust update deployed on 2026-06-16 Asia/Taipei:

- Deployment URL: `https://fb23cdee.twvita.pages.dev`
- Added FAQ sections to:
  - `/roof-waterproofing`
  - `/tank-pool-waterproofing`
  - `/membranes`
- Added `FAQPage` JSON-LD structured data to each of the three service pages, with 3 questions per page.
- Updated CSS cache bust to `styles.css?v=20260616-faq1`.
- Verified on preview and `https://twvita.com.tw/`:
  - FAQ copy is present.
  - JSON-LD parses successfully.
  - Desktop 1280px and mobile 390px have no horizontal overflow.
  - Images load successfully.
  - Phone and Email paths remain active.
  - No LINE copy or links are present.

Utility contact update deployed on 2026-06-16 Asia/Taipei:

- Deployment URL: `https://0b67122b.twvita.pages.dev`
- Added the top utility contact bar to the main inner pages so visitors entering from service, project, company, or contact pages can immediately see service area, phone, and Email.
- Updated CSS cache bust to `styles.css?v=20260616-utility1`.
- Verified on preview and `https://twvita.com.tw/`:
  - Home, projects, contact, roof, tank/pool, membranes, and about pages include the utility contact bar.
  - Desktop 1280px and mobile 390px have no horizontal overflow.
  - Email links initialize to `mailto:vitawaterproof@gmail.com`.
  - Phone links remain `tel:+886228120021`.
  - No LINE copy or links are present.

Project credibility update deployed on 2026-06-16 Asia/Taipei:

- Deployment URL: `https://9cc926b8.twvita.pages.dev`
- Reworked `/projects` from long paragraph lists into categorized project cards:
  - Roof and roof deck waterproofing
  - Water storage and tank/pool waterproofing
  - Tunnel and underground works
  - Metro and traffic infrastructure
  - Environmental and landfill facilities
- Added a quality-focus section explaining how project experience maps to current waterproofing decisions.
- Updated CSS cache bust to `styles.css?v=20260616-projects1`.
- Verified on preview and `https://twvita.com.tw/projects`:
  - 5 project category cards are present.
  - Quality-focus copy is visible.
  - Desktop 1280px and mobile 390px have no horizontal overflow.
  - Images load successfully.
  - Email links initialize to `mailto:vitawaterproof@gmail.com`.
  - No LINE copy or links are present.

About-page trust update deployed on 2026-06-16 Asia/Taipei:

- Deployment URL: `https://1c446f6d.twvita.pages.dev`
- Follow-up route/cache fix deployment URL: `https://0d2c9807.twvita.pages.dev`
- Added engineering-method content to `/about`:
  - Current-condition assessment
  - Material comparison
  - Detail and joint planning
  - Maintenance planning
- Added a delivery-focus section explaining what discussions cover before choosing a waterproofing method.
- Updated CSS cache bust to `styles.css?v=20260616-about1`.
- Changed HTML route cache headers to `public, max-age=0, must-revalidate`.
- A temporary extensionless rewrite attempt caused a redirect loop and was immediately reverted. Current verification confirms `/about` returns HTTP 200 and `/about.html` redirects to `/about` without looping.
- Verified on preview and `https://twvita.com.tw/about`:
  - 4 engineering-method cards are present.
  - Delivery-focus copy is visible.
  - Desktop 1280px and mobile 390px have no horizontal overflow.
  - Images load successfully.
  - Email links initialize to `mailto:vitawaterproof@gmail.com`.
  - No LINE copy or links are present.

Material-selection update deployed on 2026-06-16 Asia/Taipei:

- Deployment URL: `https://898ab546.twvita.pages.dev`
- Added a membrane material selection table to `/membranes`, covering PVC, TPO, HDPE, EVA/EPDM, and asphalt-based membranes.
- Positioned the table as an initial discussion guide, not an absolute specification, to keep engineering expectations realistic.
- Updated CSS cache bust to `styles.css?v=20260616-materials1`.
- Verified on preview and `https://twvita.com.tw/membranes`:
  - Material comparison table is present with 5 material rows.
  - Desktop 1280px and mobile 390px have no horizontal overflow.
  - The table remains horizontally scrollable on narrow screens instead of breaking layout.
  - Images load successfully.
  - Email links initialize to `mailto:vitawaterproof@gmail.com`.
  - No LINE copy or links are present.

Contact conversion update deployed on 2026-06-16 Asia/Taipei:

- Deployment URL: `https://e435bbc1.twvita.pages.dev`
- Added a contact-choice section to `/contact`:
  - Phone for urgent leaks, fast direction checks, and site-use constraints.
  - Email for photos, drawings, dimensions, prior repair records, and material specification discussion.
- Updated CSS cache bust to `styles.css?v=20260616-contact1`.
- Verified on preview and `https://twvita.com.tw/contact`:
  - 2 contact-choice cards are present.
  - Desktop 1280px and mobile 390px have no horizontal overflow.
  - Phone links remain `tel:+886228120021`.
  - Email links initialize to `mailto:vitawaterproof@gmail.com`.
  - No LINE copy or links are present.

Canonical domain fix deployed on 2026-06-16 Asia/Taipei:

- Deployment URL: `https://4aa8a1aa.twvita.pages.dev`
- Added `public/_worker.js` to redirect only `www.twvita.com.tw` requests to the apex domain while serving all other requests from the static Pages assets.
- Verified current production state:
  - `https://twvita.com.tw/` returns HTTP 200 from Cloudflare Pages.
  - `https://www.twvita.com.tw/` returns HTTP 301 with `Location: https://twvita.com.tw/`.
  - `https://www.twvita.com.tw/projects?x=1` returns HTTP 301 with `Location: https://twvita.com.tw/projects?x=1`, preserving path and query string.
  - Cloudflare Pages project `twvita` lists `twvita.pages.dev`, `twvita.com.tw`, and `www.twvita.com.tw`.
  - Live page content contains the new site CSS version `styles.css?v=20260616-contact1` and no Google Sites markers.
  - Main routes, `robots.txt`, `sitemap.xml`, `404.html`, CSS, JS, and roof waterproof image assets return HTTP 200.

Membranes page removal deployed on 2026-06-16 Asia/Taipei:

- Deployment URL: `https://aff9c076.twvita.pages.dev`
- Removed the standalone `/membranes` page from the public build.
- Removed the "防水膜規格" navigation and footer links from public pages.
- Updated the homepage service card CTA from material-spec navigation to project-experience navigation.
- Removed `/membranes` from `sitemap.xml` and `_headers`.
- Added redirects so old material-page URLs return to the homepage:
  - `https://twvita.com.tw/membranes` returns HTTP 301 to `/`.
  - `https://twvita.com.tw/membranes.html` returns HTTP 301 to `/`.
  - `https://twvita.com.tw/spec` returns HTTP 301 to `/`.
- Verified the remaining public routes return HTTP 200:
  - `/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, `/contact`, `/sitemap.xml`.

Humanized copy and simplified visual update deployed on 2026-06-16 Asia/Taipei:

- Deployment URL: `https://64ccc890.twvita.pages.dev`
- Reworked the homepage copy to sound less like generic marketing copy and more like a practical waterproofing contractor:
  - Clearer headline: "屋頂、水塔水池與工程防水修繕".
  - More direct service language around roof leaks, tank/pool leakage, site limits, repair scope, and follow-up maintenance.
  - Replaced English eyebrow labels on key pages with Traditional Chinese labels.
- Simplified visual presentation:
  - Reduced decorative gradients, strong shadows, and hover-lift effects.
  - Kept layout clearer and more information-oriented.
  - Updated CSS cache bust to `styles.css?v=20260616-human1`.
- Replaced low-resolution or less suitable imagery with generated engineering-style site photos:
  - `public/assets/images/site-roof-work.jpg` for rooftop waterproofing worksite imagery.
  - `public/assets/images/site-roof-detail.jpg` for waterproofing seam, parapet, and drain detail imagery.
- Verification:
  - Local desktop 1280px and mobile 390px checks passed with no horizontal overflow.
  - Production desktop 1280px and mobile 390px checks passed with no horizontal overflow.
  - `/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact` return HTTP 200 on `https://twvita.com.tw`.
  - New CSS and new images return HTTP 200.
  - No "防水膜規格" or old material-spec navigation text is visible on the checked public pages.

Private custom repair positioning update deployed on 2026-06-16 Asia/Taipei:

- Deployment URL: `https://a0aebe8e.twvita.pages.dev`
- Repositioned the site copy around:
  - Public works and major engineering experience as the credibility base.
  - Current service focus on private customized small repair cases.
  - Target customers: residential homes, apartment buildings, communities, shops, small factories, rooftops, water tanks, and small pools.
- Updated key page messaging:
  - Homepage headline: "把公共工程經驗，用在民間小型防水修繕。"
  - About page: "從公共工程經驗，走向民間客製修繕。"
  - Projects page: "公共工程經驗，是現在民間修繕的基礎。"
  - Contact page: "民間小案可先詢問"
- Updated meta descriptions and Open Graph copy to reflect private repair and custom small-case positioning.
- Updated CSS cache bust to `styles.css?v=20260616-private1`.
- Verification:
  - Production routes `/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact` return HTTP 200.
  - Production desktop 1280px and mobile 390px checks passed with no horizontal overflow.
  - New positioning words such as public works, private repair, small cases, custom evaluation, residential, community, shop, and small factory are present.
  - No "防水膜規格" or old material-spec navigation text is visible on checked pages.

Varied copy and imagery update deployed on 2026-06-16 Asia/Taipei:

- Deployment URL: `https://d7769bd5.twvita.pages.dev`
- Revised public copy to reduce repeated phrasing across pages:
  - Homepage headline: "大型案場累積的防水判斷，現在也服務住家與店面漏水。"
  - About page: "把大型案場的細節習慣，帶到一般建築維修。"
  - Projects page: "過去的代表工程，留下的是判斷細節的方式。"
  - Contact page: "先用電話或照片說明狀況"
- Added and used three new localized image assets:
  - `public/assets/images/private-rooftop-repair.jpg`
  - `public/assets/images/private-tank-lining.jpg`
  - `public/assets/images/private-shop-roof.jpg`
- Distributed imagery by page and section so the same old photo is not repeated as the main visual everywhere.
- Updated CSS cache bust to `styles.css?v=20260616-varied1`.
- Verification:
  - `https://twvita.com.tw/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, `/contact`, and `/404` pass desktop 1280px and mobile 390px checks with no horizontal overflow.
  - All new image assets return HTTP 200.
  - `https://www.twvita.com.tw/` returns HTTP 301 to `https://twvita.com.tw/`.
  - Live HTML contains the new CSS version and does not contain Google Sites, LINE links, or the removed "防水膜規格" page text.

VITA icon and contact simplification deployed on 2026-06-16 Asia/Taipei:

- Deployment URL: `https://e48d92ef.twvita.pages.dev`
- Generated a new VITA wordmark icon using the built-in image generation tool.
- Added icon assets:
  - `public/assets/images/vita-icon.png`
  - `public/assets/images/vita-icon-source.png`
  - `public/apple-touch-icon.png`
  - `public/favicon.ico`
- Replaced the old "耘" square mark with the VITA icon in the header and favicon links.
- Simplified `/contact` so the main content keeps only:
  - "公司資訊"
  - "讓我們更快判斷的資訊"
- Removed the contact-choice section and the "趕時間或正在漏水，建議先來電。" copy.
- Updated CSS cache bust to `styles.css?v=20260616-vita1`.
- Verification:
  - `https://twvita.com.tw/contact` returns HTTP 200 with the new icon and simplified contact page.
  - `https://twvita.com.tw/assets/images/vita-icon.png`, `/apple-touch-icon.png`, and `/favicon.ico` return HTTP 200.
  - Desktop 1280px and mobile 390px checks pass with no horizontal overflow or broken images.
  - `https://www.twvita.com.tw/contact` still redirects to `https://twvita.com.tw/contact`.

Top contact bar removal and concise copy update deployed on 2026-06-16 Asia/Taipei:

- Deployment URL: `https://6f6f10da.twvita.pages.dev`
- Removed the top utility contact bar from all public pages:
  - "台北出發，全台防水工程評估"
  - phone number
  - email address
- Simplified repeated copy across pages:
  - Removed duplicated homepage sections for evaluation steps, inquiry preparation, and repeated risk prompts.
  - Shortened About, Projects, Roof, Tank/Pool, and Contact page descriptions.
  - Removed unused CSS for the deleted utility bar and old repeated content sections.
- Updated CSS cache bust to `styles.css?v=20260616-clean1`.
- Verification:
  - `https://twvita.com.tw/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact` return HTTP 200.
  - `https://www.twvita.com.tw/` still returns HTTP 301 to the apex domain.
  - Production desktop 1280px and mobile 390px checks pass with no horizontal overflow or broken images.
  - Live pages do not contain the removed top-bar text.

Service area and professional positioning update deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://54f29d57.twvita.pages.dev`
- Added header service range label: "服務範圍：雙北地區".
- Updated brand subtitle to "專業防水工程公司".
- Repositioned copy toward a professional waterproofing contractor:
  - Homepage H1: "雙北地區專業防水工程公司。"
  - About H1: "30年以上防水工程經驗，服務雙北建築防水需求。"
  - Roof page H1: "雙北屋頂與設備周邊防水工程"
  - Tank/pool page H1: "雙北水塔、水箱與池體防水工程"
  - Contact H1: "雙北地區防水工程洽詢"
- Changed telephone CTA text from "撥打 (02)2812-0021", "撥打電話", and "電話諮詢" to "來電洽詢".
- Updated CSS cache bust to `styles.css?v=20260617-service1`.
- Verification:
  - `https://twvita.com.tw/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact` return HTTP 200.
  - `https://www.twvita.com.tw/` still returns HTTP 301 to the apex domain.
  - Production desktop 1280px and mobile 390px checks pass with no horizontal overflow or broken images.
  - Live pages contain the new service range and no old telephone CTA labels.

Metadata, image stability, and asset cleanup deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://cae938dc.twvita.pages.dev`
- Added width, height, decoding, and lazy-loading attributes to public page images to reduce layout shift.
- Added Open Graph and Twitter preview metadata to internal pages:
  - `/about`
  - `/roof-waterproofing`
  - `/tank-pool-waterproofing`
  - `/projects`
  - `/contact`
- Added `noindex` and description metadata to `404.html`.
- Updated CSS and JS cache busts to `20260617-audit1`.
- Removed unused old image files from `public/assets/images`; active public images are now limited to current page visuals and the VITA icon.
- Local verification:
  - Desktop 1280px and mobile 390px checks passed for `/`, `/about.html`, `/roof-waterproofing.html`, `/tank-pool-waterproofing.html`, `/projects.html`, `/contact.html`, and `/404.html`.
  - No broken local assets, missing image dimensions, old LINE text, Google Sites reference, removed material-spec page text, or old telephone CTA labels were found.
- Production verification:
  - `https://twvita.com.tw/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, `/contact`, `/404`, CSS, JS, and VITA icon return HTTP 200.
  - `https://www.twvita.com.tw/` returns HTTP 301 to `https://twvita.com.tw/`.
  - Desktop 1280px and mobile 390px checks passed on production with no horizontal overflow or broken images.
  - Production pages contain `20260617-audit1` assets and do not contain Google Sites, LINE links, old telephone CTA labels, or the removed material-spec page text.

SEO, headers, and fallback usability update deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://f0487b64.twvita.pages.dev`
- Improved no-JavaScript usability by changing Email inquiry links from placeholder `#` links to direct `mailto:vitawaterproof@gmail.com` links.
- Added sitemap `lastmod`, `changefreq`, and `priority` values for all public canonical pages.
- Added `Strict-Transport-Security` to public response headers and explicit cache rules for `sitemap.xml` and `robots.txt`.
- Added structured data:
  - BreadcrumbList on company, service, projects, and contact pages.
  - Service schema for roof waterproofing and tank/pool waterproofing pages.
- Removed unused CSS rules left from the removed specification/material page.
- Updated CSS and JS cache busts to `20260617-audit2`.
- Local verification:
  - JSON-LD parses successfully on all pages that include structured data.
  - `sitemap.xml` parses as valid XML.
  - No placeholder `href="#"`, broken local assets, missing image dimensions, unused visible CSS classes, or old LINE/Google Sites/material-spec/old telephone CTA text were found.
  - Desktop 1280px and mobile 390px checks passed locally; mobile lazy-loaded images loaded correctly after scrolling.
- Production verification:
  - `https://twvita.com.tw/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, `/contact`, `/sitemap.xml`, `/robots.txt`, CSS, and JS return HTTP 200.
  - `https://www.twvita.com.tw/` returns HTTP 301 to `https://twvita.com.tw/`.
  - Production homepage includes `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, and `Permissions-Policy`.
  - Production sitemap contains `2026-06-17` lastmod values.
  - Production desktop 1280px and mobile 390px checks passed with no horizontal overflow, broken images, old removed copy, or broken Email links.

Email no-JavaScript fallback hardening deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://e3a8f542.twvita.pages.dev`
- Added `no-transform` to HTML page cache-control headers so Cloudflare Email Address Obfuscation does not rewrite `mailto:` links.
- Reason:
  - The previous production HTML was rendered correctly in browsers after Cloudflare's decode script ran.
  - However, raw HTML contained `/cdn-cgi/l/email-protection` links, which weakens no-JavaScript usability and can create noisy crawler/audit results.
- Verification:
  - `https://twvita.com.tw/contact` now returns `Cache-Control: public, max-age=0, must-revalidate, no-transform`.
  - Production `/contact` raw HTML contains `mailto:vitawaterproof@gmail.com`.
  - Production `/contact` raw HTML no longer contains `email-protection`, `email-decode`, or `__cf_email__`.
  - Production `/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact` return HTTP 200 and contain usable `mailto:` links.
  - Production pages do not contain Google Sites, LINE links, old telephone CTA labels, or removed material-spec page text.

Mobile navigation accessibility and sharing metadata update deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://db6c872b.twvita.pages.dev`
- Added `aria-controls="site-nav"` to mobile menu buttons and `id="site-nav"` to page navigation.
- Improved mobile menu behavior:
  - Menu closes when pressing Escape.
  - Menu closes after selecting a navigation link.
- Removed unused JavaScript for a non-existent `data-year` element.
- Added Open Graph image width, height, and alt metadata to public canonical pages.
- Updated CSS and JS cache busts to `20260617-audit3`.
- Local verification:
  - Static structure check found no broken local assets, missing image dimensions, duplicate IDs, bad links, stale cache versions, or old removed copy.
  - JSON-LD still parses successfully and sitemap XML remains valid.
  - Desktop 1280px and mobile 390px checks passed for all public pages with no horizontal overflow.
  - Mobile menu test passed: initial `aria-expanded=false`, opens to `true`, and Escape returns it to `false`.
- Production verification:
  - `https://twvita.com.tw/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, `/contact`, CSS, and JS return HTTP 200.
  - Public canonical pages include `og:image:width`, `og:image:height`, and `og:image:alt`.
  - Public page headers include `aria-controls="site-nav"` and `id="site-nav"`.
  - Production desktop 1280px and mobile 390px checks passed with no horizontal overflow, missing image dimensions, old removed copy, or broken `mailto:` links.
  - Production mobile menu test passed: initial `aria-expanded=false`, opens to `true`, and Escape returns it to `false`.

Focus, reduced-motion, and theme metadata update deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://e9e1307e.twvita.pages.dev`
- Added `theme-color` metadata to all HTML pages.
- Added visible `:focus-visible` styles for links, buttons, summaries, CTA buttons, mobile menu button, and sticky contact links.
- Added `prefers-reduced-motion: reduce` handling to disable smooth scrolling and minimize animations/transitions for users who request reduced motion.
- Added `/index.html` to `/` redirect.
- Updated CSS and JS cache busts to `20260617-audit4`.
- Local verification:
  - Static structure check found no broken local assets, bad links, duplicate IDs, stale cache versions, or old removed copy.
  - JSON-LD still parses successfully and sitemap XML remains valid.
  - CSS contains `:focus-visible` rules and `prefers-reduced-motion: reduce`.
  - Desktop 1280px and mobile 390px checks passed for all public pages with no horizontal overflow.
- Production verification:
  - `https://twvita.com.tw/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, `/contact`, CSS, and JS return HTTP 200.
  - `/index.html` returns HTTP 301 to `/`.
  - Production pages include `theme-color` and load `20260617-audit4` assets.
  - Production CSS includes `:focus-visible` and `prefers-reduced-motion: reduce`.
  - Production desktop 1280px and mobile 390px checks passed with no horizontal overflow, missing image dimensions, old removed copy, Cloudflare email-protection rewrite, or broken `mailto:` links.

Web manifest and icon metadata update deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://27a2f7c0.twvita.pages.dev`
- Added `public/manifest.webmanifest` with VITA icon entries, theme/background colors, Traditional Chinese language metadata, and site start/scope URLs.
- Added manifest and explicit icon metadata to all HTML pages:
  - `/manifest.webmanifest`
  - `sizes="512x512"` for the VITA favicon link.
  - `sizes="180x180"` for the Apple touch icon.
- Added a cache rule for `/manifest.webmanifest`.
- Updated CSS and JS cache busts to `20260617-audit5`.
- Local verification:
  - Manifest JSON parses successfully and referenced icons exist.
  - All HTML pages include manifest and sized icon links.
  - Static structure check found no broken local assets, bad links, stale cache versions, JSON-LD errors, sitemap XML errors, or old removed copy.
  - Desktop 1280px and mobile 390px checks passed for all public pages with no horizontal overflow.
- Production verification:
  - `https://twvita.com.tw/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, `/contact`, `/manifest.webmanifest`, CSS, and JS return HTTP 200.
  - `https://www.twvita.com.tw/` returns HTTP 301 to `https://twvita.com.tw/`.
  - `/index.html` returns HTTP 301 to `/`.
  - Production pages include `/manifest.webmanifest`, sized icon metadata, `theme-color`, and load `20260617-audit5` assets.
  - Production manifest returns `application/manifest+json`, parses successfully, and references existing VITA icons.
  - Production desktop 1280px and mobile 390px checks passed with no horizontal overflow, missing image dimensions, old removed copy, Cloudflare email-protection rewrite, or broken `mailto:` links.
  - Header text shows `服務範圍：雙北地區`; telephone CTAs show `來電洽詢`.

Professional copy and contact metadata refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://f27c4617.twvita.pages.dev`
- Refined repeated CTA copy across pages so each closing section matches the page context:
  - Homepage now asks for photos and prior repair context.
  - Company page focuses on cause and scope assessment.
  - Projects page connects public engineering experience to smaller daily repair cases.
  - Roof page focuses on drainage, edges, equipment bases, and photo evidence.
  - Tank/pool page focuses on downtime, access, dimensions, and usage frequency.
- Simplified the contact page address display by removing the English address line.
- Added explicit contact-page service range text: `目前服務範圍：台北市、新北市`.
- Added LocalBusiness structured data to the contact page.
- Updated CSS and JS cache busts to `20260617-audit6`.
- Local verification:
  - Static structure check found no broken assets, duplicate IDs, stale cache versions, JSON-LD errors, sitemap XML errors, old telephone CTA text, Google Sites text, LINE text, material-spec text, English address clutter, or Cloudflare email-protection markup.
  - Desktop 1280px and mobile 390px checks passed locally with no horizontal overflow.
- Production verification:
  - `https://twvita.com.tw/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, `/contact`, CSS, and JS return HTTP 200.
  - `https://www.twvita.com.tw/` returns HTTP 301 to `https://twvita.com.tw/`.
  - Production contact page includes `LocalBusiness`, `目前服務範圍`, and `台北市、新北市`.
  - Production projects page includes the updated public-engineering-to-daily-case CTA copy.
  - Production desktop 1280px and mobile 390px checks passed with no horizontal overflow, missing image dimensions, old removed copy, stale `audit5` assets, or broken `mailto:` links.

Optimized WebP image delivery deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://7669208b.twvita.pages.dev`
- Added WebP versions for the five main site photos:
  - `private-rooftop-repair.webp` reduced from about 357 KB to about 103 KB.
  - `private-shop-roof.webp` reduced from about 405 KB to about 116 KB.
  - `private-tank-lining.webp` reduced from about 280 KB to about 58 KB.
  - `roof-waterproof-surface.webp` reduced from about 236 KB to about 113 KB.
  - `site-roof-detail.webp` reduced from about 380 KB to about 122 KB.
- Updated image markup to use `<picture>` with WebP sources and JPG fallback.
- Updated image CSS so hero, card, system visual, and split-layout images keep their original crop and responsive behavior after the `<picture>` change.
- Updated CSS and JS cache busts to `20260617-audit7`.
- Local verification:
  - Static structure check found no missing WebP sources, broken assets, missing image dimensions, stale cache versions, JSON-LD errors, sitemap XML errors, or old removed copy.
  - Desktop 1280px and mobile 390px checks passed locally with no horizontal overflow.
  - Mobile homepage scroll test loaded all lazy images; all six content images selected WebP and no image had zero natural dimensions.
- Production verification:
  - `https://twvita.com.tw/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, `/contact`, five WebP images, CSS, and JS return HTTP 200.
  - WebP image responses return `content-type: image/webp` and `Cache-Control: public, max-age=31536000, immutable`.
  - `https://www.twvita.com.tw/` returns HTTP 301 to `https://twvita.com.tw/`.
  - Production desktop 1280px and mobile 390px checks passed with no horizontal overflow, missing image dimensions, zero-dimension images, old removed copy, stale `audit6` assets, or broken `mailto:` links.
  - Production browser selected WebP for all six homepage content images and for the image on each service/company page that uses photography.

Responsive WebP image variants deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://4ecc0996.twvita.pages.dev`
- Added 720px and 1200px WebP variants for the five main site photos so mobile and narrower layouts do not need to download the full-size WebP image.
- New approximate file sizes:
  - `private-rooftop-repair-720.webp` 36 KB; `private-rooftop-repair-1200.webp` 80 KB.
  - `private-shop-roof-720.webp` 38 KB; `private-shop-roof-1200.webp` 87 KB.
  - `private-tank-lining-720.webp` 19 KB; `private-tank-lining-1200.webp` 44 KB.
  - `roof-waterproof-surface-720.webp` 47 KB; `roof-waterproof-surface-1200.webp` 94 KB.
  - `site-roof-detail-720.webp` 24 KB; `site-roof-detail-1200.webp` 68 KB.
- Updated `<source>` markup with width descriptors and `sizes` values for homepage, company, roof, and tank/pool photography.
- Updated CSS and JS cache busts to `20260617-audit8`.
- Local verification:
  - Static structure check found no missing responsive WebP candidates, missing `sizes`, broken assets, missing image dimensions, stale cache versions, JSON-LD errors, sitemap XML errors, or old removed copy.
  - Desktop 1280px and mobile 390px checks passed locally with no horizontal overflow, bad images, zero-dimension images, or old removed copy.
  - Local browser selected 720w WebP images on mobile and 1200w/full candidates on desktop according to rendered size.
- Production verification:
  - `https://twvita.com.tw/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, `/contact`, responsive WebP candidates, CSS, and JS return HTTP 200.
  - 720w WebP image responses return `content-type: image/webp` and `Cache-Control: public, max-age=31536000, immutable`.
  - `https://www.twvita.com.tw/` returns HTTP 301 to `https://twvita.com.tw/`.
  - Production desktop 1280px and mobile 390px checks passed with no horizontal overflow, missing image dimensions, zero-dimension images, old removed copy, stale `audit7` assets, or broken `mailto:` links.
  - Production browser selected 720w WebP images for the homepage content images and the company/service page photography at the checked viewport widths.

Responsive hero image preload deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://eefd8dda.twvita.pages.dev`
- Added a homepage-only responsive preload for the hero image:
  - `rel="preload"`
  - `as="image"`
  - `imagesrcset` with 720w, 1200w, and full WebP candidates.
  - `imagesizes="(max-width: 760px) 100vw, 45vw"`
  - `fetchpriority="high"`
- Kept the existing hero `<img fetchpriority="high">` for browser image priority after HTML parsing.
- Updated CSS and JS cache busts to `20260617-audit9`.
- Local verification:
  - Static structure check found exactly one homepage image preload, valid responsive preload candidates, no unexpected preloads on other pages, no missing assets, no stale cache versions, JSON-LD errors, sitemap XML errors, or old removed copy.
  - Desktop 1280px and mobile 390px checks passed locally with no horizontal overflow, bad images, zero-dimension images, or old removed copy.
- Production verification:
  - `https://twvita.com.tw/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, `/contact`, hero 720w WebP, CSS, and JS return HTTP 200.
  - `https://www.twvita.com.tw/` returns HTTP 301 to `https://twvita.com.tw/`.
  - Production homepage contains the responsive image preload and `20260617-audit9` assets.
  - Production desktop 1280px and mobile 390px checks passed with no horizontal overflow, missing image dimensions, zero-dimension images, old removed copy, stale `audit8` assets, or broken `mailto:` links.

Crawler and AI-readable site summary deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://7fc9f221.twvita.pages.dev`
- Added `public/llms.txt` with a concise Traditional Chinese site summary:
  - Company name and service positioning.
  - Current service area: 台北市、新北市.
  - Main waterproofing services.
  - Public-engineering background and current private/smaller-case focus.
  - Canonical page list.
  - Phone, Email, and address.
  - Clear note that inquiries use phone and Email, without listing removed inquiry channels.
- Added `/llms.txt` cache rule:
  - `Cache-Control: public, max-age=3600, must-revalidate`
- Local verification:
  - `llms.txt` includes company, service area, main services, canonical URLs, phone, Email, and address.
  - Static structure check found no missing assets, missing image dimensions, duplicate IDs, JSON-LD errors, sitemap XML errors, old removed copy, removed inquiry-channel text, or Cloudflare email-protection markup.
- Production verification:
  - `https://twvita.com.tw/`, `/llms.txt`, `/sitemap.xml`, `/robots.txt`, and `/contact` return HTTP 200.
  - `https://twvita.com.tw/llms.txt` returns `content-type: text/plain; charset=utf-8`.
  - `/llms.txt` returns `Cache-Control: public, max-age=3600, must-revalidate`.
  - `https://www.twvita.com.tw/` returns HTTP 301 to `https://twvita.com.tw/`.
  - Production desktop 1280px and mobile 390px checks passed with no horizontal overflow, missing image dimensions, zero-dimension images, old removed copy, removed inquiry-channel text, or broken `mailto:` links.

Sticky contact and 404 layout hardening deployed on 2026-06-17 Asia/Taipei:

- Deployment URLs:
  - Initial sticky/footer deploy: `https://6498abf8.twvita.pages.dev`
  - 404 raw-email hardening deploy: `https://a172de8b.twvita.pages.dev`
- Improved fixed contact usability:
  - Added safe-area-aware bottom offset: `bottom: calc(18px + env(safe-area-inset-bottom, 0px))`.
  - Increased footer bottom padding to `5.5rem` while keeping the small-phone layout at `2rem` because the sticky contact is hidden there.
- Made the 404 page consistent with the rest of the site:
  - Added shared header, navigation, service-area label, footer, sticky contact, and menu script.
  - Removed raw Email from 404 HTML and lets existing JavaScript populate the Email link/text, avoiding Cloudflare email-protection rewrites on unknown 404 URLs.
  - Added explicit `/404.html` no-transform cache rule.
- Updated CSS and JS cache busts to `20260617-audit10`.
- Local verification:
  - Static structure check found no missing assets, missing image dimensions, duplicate IDs, JSON-LD errors, sitemap XML errors, old removed copy, removed inquiry-channel text, or Cloudflare email-protection markup.
  - 390px browser checks hide sticky contact and keep footer padding at 32px.
  - 700px and 1280px browser checks show sticky contact and keep footer padding at 88px.
  - 404 page now has shared header/footer/sticky contact and no horizontal overflow.
- Production verification:
  - `https://twvita.com.tw/`, `/contact`, `/not-a-real-page`, `/llms.txt`, CSS, and JS return expected statuses.
  - `/not-a-real-page` returns HTTP 404 with shared header/footer/sticky contact and no `/cdn-cgi`, `email-protection`, or `__cf_email__` markup.
  - Production CSS includes the safe-area sticky contact offset and footer clearance.
  - Production desktop 1280px, tablet 700px, and mobile 390px checks passed with no horizontal overflow, old removed copy, hidden sticky contact at 390px, visible sticky contact plus footer clearance at 700px/1280px, and shared 404 layout.

Print stylesheet cleanup deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://f1d00b62.twvita.pages.dev`
- Added print-specific CSS for cleaner printed pages and PDF output:
  - Removes shadows/text shadows.
  - Hides skip link, mobile menu button, navigation, sticky contact, CTA button groups, hero action buttons, and decorative media badge.
  - Sets the sticky header to static and removes translucent/backdrop styling.
  - Uses white backgrounds and black text for main sections, CTA band, and footer.
  - Hides large photography blocks in print while preserving text and footer contact information.
  - Adds `break-inside: avoid` to cards, project entries, FAQ items, and decision blocks.
- Updated CSS and JS cache busts to `20260617-audit11`.
- Local verification:
  - Static structure check found print CSS, no missing assets, missing image dimensions, duplicate IDs, JSON-LD errors, sitemap XML errors, old removed copy, removed inquiry-channel text, or Cloudflare email-protection markup.
  - Browser screen checks at 390px and 900px passed with no horizontal overflow, missing headers/footers, old removed copy, or bad images.
  - Browser-accessible stylesheet rules include `@media print`.
- Production verification:
  - `https://twvita.com.tw/`, `/contact`, `/not-a-real-page`, CSS, and JS return expected statuses.
  - Production CSS contains `@media print`, hidden interactive print selectors, and `break-inside: avoid`.
  - Production 404 continues to include shared header/footer/sticky contact and no `/cdn-cgi`, `email-protection`, or `__cf_email__` markup.
  - Production browser screen checks at 390px and 900px passed with no horizontal overflow, missing headers/footers, old removed copy, or bad images.

Service-area header and professional copy refresh deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://3cf86552.twvita.pages.dev`
- Updated all page headers to show `目前服務範圍：雙北地區`.
- Refined copy across homepage, company profile, roof service, tank/pool service, projects, contact, manifest, and `llms.txt`:
  - Stronger positioning as a professional waterproofing company.
  - Clearer story: past public-engineering experience, now focused on Double Taipei private and smaller custom repair cases.
  - Reduced repeated wording and shifted service pages toward practical assessment conditions.
- Kept phone CTA labels as `來電洽詢`; company information still displays the phone number where contact details are expected.
- Updated CSS and JS cache busts to `20260617-audit13`.
- Local verification:
  - Static structure check found no broken internal links, missing image assets, missing image dimensions, duplicate IDs, JSON-LD errors, stale Google Sites/LINE/specification-page text, or old `audit12` references.
  - Local browser checks passed on 7 pages at 390px mobile and 1440px desktop:
    - Header service-area text matched `目前服務範圍：雙北地區`.
    - Phone CTA labels matched `來電洽詢`.
    - Mobile menu opened with `aria-label="關閉選單"` and returned to `開啟選單` after Escape.
    - No horizontal overflow.
- Production verification:
  - `https://3cf86552.twvita.pages.dev/`, `/about`, and `/contact` return HTTP 200; unknown paths return HTTP 404.
  - `https://twvita.com.tw/`, `/about`, and `/contact` return HTTP 200; `/not-a-real-page` returns HTTP 404.
  - `https://www.twvita.com.tw/` and `/contact` return HTTP 301 to the apex `https://twvita.com.tw/` routes, then HTTP 200.
  - `https://twvita.com.tw/assets/styles.css?v=20260617-audit13` and `https://twvita.com.tw/assets/site.js?v=20260617-audit13` return HTTP 200.
  - Production homepage and contact page contain `20260617-audit13`, `目前服務範圍：雙北地區`, and `來電洽詢`; no Google Sites, LINE, removed specification-page text, or old `audit12` references were found.
  - Production browser checks passed on 7 routes at 390px mobile and 1440px desktop with no failures.

Social metadata and icon-weight optimization deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://acbceb07.twvita.pages.dev`
- Added Twitter/X card metadata to all six public canonical pages:
  - `twitter:title`
  - `twitter:description`
  - `twitter:image`
  - `twitter:image:alt`
- Kept the 404 page as `noindex` without social share metadata.
- Optimized icon assets without changing their displayed dimensions:
  - `public/assets/images/vita-icon.png`: 512x512, reduced from about 236 KB to 9.5 KB.
  - `public/apple-touch-icon.png`: 180x180, reduced from about 26 KB to 3.2 KB.
- Added `20260617-audit14` cache-busting to:
  - CSS and JS references.
  - `rel="icon"` and `rel="apple-touch-icon"`.
  - Brand icon images.
  - `manifest.webmanifest` icon URLs.
- Local verification:
  - Static checks found no missing assets, missing image dimensions, duplicate IDs, JSON-LD errors, sitemap XML errors, stale `audit13`/`audit12` references, old Google Sites/LINE/specification-page text, or old phone CTA copy.
  - Twitter metadata matches corresponding Open Graph title, description, image, and image alt values on all six public canonical pages.
  - Local browser checks passed on 7 pages at 390px mobile and 1440px desktop:
    - No horizontal overflow.
    - Header service-area text remains `目前服務範圍：雙北地區`.
    - Phone CTA labels remain `來電洽詢`.
    - Mobile menu opens and closes with synced ARIA labels.
    - Icon URLs include `20260617-audit14`.
- Production verification:
  - `https://acbceb07.twvita.pages.dev/`, `/about`, and `/contact` return HTTP 200.
  - `https://twvita.com.tw/`, `/about`, and `/contact` return HTTP 200; `/not-a-real-page` returns HTTP 404.
  - `https://twvita.com.tw/assets/images/vita-icon.png?v=20260617-audit14`, `/apple-touch-icon.png?v=20260617-audit14`, CSS, and JS return HTTP 200.
  - Production homepage and contact page contain Twitter card metadata, `20260617-audit14`, versioned icon URLs, `目前服務範圍：雙北地區`, and `來電洽詢`; no Google Sites, LINE, removed specification-page text, old `audit13`, or old `audit12` references were found.
  - `https://www.twvita.com.tw/` and `/contact` resolve to the apex `https://twvita.com.tw/` routes and return HTTP 200 after redirect.
  - Production 512px icon returns `content-type: image/png`, `content-length: 9700`, and `Cache-Control: public, max-age=31536000, immutable`.
  - Production browser checks passed on 7 routes at 390px mobile and 1440px desktop with no failures.

Standard social share card deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://f27c1bf8.twvita.pages.dev`
- Added dedicated 1200x630 social share image:
  - `public/assets/images/twvita-social-card-20260617.jpg`
  - Uses existing roof/site photography, VITA icon, company name, Double Taipei service area, and core waterproofing positioning.
  - File size: about 95 KB.
- Updated all six public canonical pages so Open Graph and Twitter/X share images use the standard social card:
  - `og:image`: `https://twvita.com.tw/assets/images/twvita-social-card-20260617.jpg`
  - `og:image:width`: `1200`
  - `og:image:height`: `630`
  - `og:image:alt` and `twitter:image:alt`: `臺灣耘達雙北專業防水公司分享圖`
- Updated CSS, JS, icon, and manifest cache-bust references to `20260617-audit15`.
- Local verification:
  - Static checks found no missing linked assets, missing image dimensions, duplicate IDs, JSON-LD errors, sitemap XML errors, stale `audit14`/`audit13`/`audit12` references, old Google Sites/LINE/specification-page text, or old phone CTA copy.
  - Open Graph and Twitter image metadata match the standard social card on all six public canonical pages.
  - Local browser checks passed on 7 pages at 390px mobile and 1440px desktop:
    - No horizontal overflow.
    - Header service-area text remains `目前服務範圍：雙北地區`.
    - Phone CTA labels remain `來電洽詢`.
    - Mobile menu opens and closes with synced ARIA labels.
- Production verification:
  - `https://f27c1bf8.twvita.pages.dev/` and `/contact` return HTTP 200.
  - `https://twvita.com.tw/`, `/about`, and `/contact` return HTTP 200; `/not-a-real-page` returns HTTP 404.
  - `https://twvita.com.tw/assets/images/twvita-social-card-20260617.jpg`, CSS, and JS return HTTP 200.
  - Production social card returns `content-type: image/jpeg`, `content-length: 97427`, and `Cache-Control: public, max-age=31536000, immutable`.
  - Production homepage contains the standard social card metadata, `og:image:width=1200`, `og:image:height=630`, `20260617-audit15`, `目前服務範圍：雙北地區`, and `來電洽詢`; no Google Sites, LINE, removed specification-page text, old `audit14`, or old phone CTA references were found.
  - `https://www.twvita.com.tw/` and `/contact` resolve to the apex `https://twvita.com.tw/` routes and return HTTP 200 after redirect.
  - Production browser checks passed on 7 routes at 390px mobile and 1440px desktop with no failures.

Clean URL routing and HTML content type hardening deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://c47da87f.twvita.pages.dev`
- Fixed clean route serving for:
  - `/about`
  - `/roof-waterproofing`
  - `/tank-pool-waterproofing`
  - `/projects`
  - `/contact`
- Replaced directory-index clean route copies with extensionless static assets so Cloudflare Pages serves each canonical path directly.
- Updated `_worker.js` to:
  - Redirect `www.twvita.com.tw` to the apex domain.
  - Normalize trailing slashes back to canonical clean paths.
  - Set `Content-Type: text/html; charset=utf-8` on extensionless HTML routes.
- Removed the Pages directory-index fallback that caused clean routes to return 308.
- Updated CSS, JS, icon, and manifest cache-bust references to `20260617-audit21`.
- Local verification:
  - Static checks found no missing route assets, missing image assets, missing image dimensions, duplicate attributes, JSON-LD errors, sitemap XML errors, old `audit20` references, or missing contact-link ARIA labels.
- Production verification:
  - `https://c47da87f.twvita.pages.dev/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact` return HTTP 200 with `content-type: text/html; charset=utf-8`.
  - `https://twvita.com.tw/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact` return HTTP 200 with `content-type: text/html; charset=utf-8`.
  - `https://twvita.com.tw/not-a-real-page` returns HTTP 404.
  - `https://www.twvita.com.tw/` and `/contact` resolve to the apex `https://twvita.com.tw/` routes and return HTTP 200 after redirect.
  - `https://twvita.com.tw/assets/styles.css?v=20260617-audit21` and `https://twvita.com.tw/assets/site.js?v=20260617-audit21` return HTTP 200.
  - Production pages contain `20260617-audit21`, `目前服務範圍：雙北地區`, and `專業防水工程公司`; no Google Sites or LINE URL references were found.
  - Browser checks passed across 14 route/viewport combinations: desktop 1440px and mobile 390px for all main routes plus 404, with no horizontal overflow.
  - Mobile menu opens with `aria-label="關閉選單"` and returns to `aria-label="開啟選單"` after Escape.
  - Lazy-loaded footer imagery was verified as loading correctly after scroll, not a broken image.

Duplicate URL canonicalization deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://21376727.twvita.pages.dev`
- Added Worker-level 301 redirects from duplicate `.html` paths to canonical clean URLs:
  - `/index.html` -> `/`
  - `/about.html` -> `/about`
  - `/roof-waterproofing.html` -> `/roof-waterproofing`
  - `/tank-pool-waterproofing.html` -> `/tank-pool-waterproofing`
  - `/projects.html` -> `/projects`
  - `/contact.html` -> `/contact`
- Kept trailing slash normalization:
  - `/about/` -> `/about`
  - `/contact/` -> `/contact`
- Updated CSS, JS, icon, and manifest cache-bust references to `20260617-audit22`.
- Local verification:
  - Static checks passed across 12 HTML-like files.
  - Confirmed all canonical extensionless route files are present.
  - Confirmed contact links retain ARIA labels and JSON-LD parses.
- Production verification:
  - `https://21376727.twvita.pages.dev/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact` return HTTP 200 with `content-type: text/html; charset=utf-8`.
  - `https://twvita.com.tw/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact` return HTTP 200 with `content-type: text/html; charset=utf-8`.
  - `https://twvita.com.tw/not-a-real-page` returns HTTP 404.
  - Production `.html` duplicates return HTTP 301 to the correct clean URLs.
  - `https://twvita.com.tw/assets/styles.css?v=20260617-audit22` and `https://twvita.com.tw/assets/site.js?v=20260617-audit22` return HTTP 200.
  - Production pages contain `20260617-audit22`, `目前服務範圍：雙北地區`, and `專業防水工程公司`; no Google Sites or LINE URL references were found.
  - Browser checks passed across 14 route/viewport combinations: desktop 1440px and mobile 390px for all main routes plus 404, with no horizontal overflow, no broken images, and no missing contact-link ARIA labels.
  - Mobile menu opens with `aria-label="關閉選單"` and returns to `aria-label="開啟選單"` after Escape.

Structured data consistency deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://e91b245b.twvita.pages.dev`
- Added a stable business identifier in JSON-LD:
  - `https://twvita.com.tw/#business`
- Improved homepage `LocalBusiness` structured data with `contactPoint`.
- Improved service-page structured data:
  - `/roof-waterproofing` provider now references the same business `@id` and includes business URL/address.
  - `/tank-pool-waterproofing` provider now references the same business `@id` and includes business URL/address.
- Improved informational-page structured data:
  - `/about` now includes `AboutPage`, `WebSite`, `LocalBusiness`, and `BreadcrumbList`.
  - `/projects` now includes `CollectionPage`, `WebSite`, `LocalBusiness`, and `BreadcrumbList`.
- Improved `/contact` `LocalBusiness` structured data with stable `@id`, social image, and `contactPoint`.
- Updated CSS, JS, icon, and manifest cache-bust references to `20260617-audit23`.
- Local verification:
  - Static checks passed across 12 HTML-like files.
  - JSON-LD parsed successfully on all public pages.
  - Confirmed canonical extensionless route files and `.html` redirect rules remain present.
  - Confirmed contact links retain ARIA labels and images keep dimensions.
- Production verification:
  - `https://e91b245b.twvita.pages.dev/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact` return HTTP 200 with `content-type: text/html; charset=utf-8`.
  - `https://twvita.com.tw/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact` return HTTP 200 with `content-type: text/html; charset=utf-8`.
  - `https://twvita.com.tw/not-a-real-page` returns HTTP 404.
  - Production pages contain `20260617-audit23`, `目前服務範圍：雙北地區`, `專業防水工程公司`, and the stable business `@id`.
  - Production `.html` duplicates still return HTTP 301 to the correct clean URLs.
  - Browser checks passed across 14 route/viewport combinations: desktop 1440px and mobile 390px for all main routes plus 404, with no horizontal overflow, no broken images, no missing contact-link ARIA labels, and no Google Sites or LINE URL references.
  - Mobile menu opens with `aria-label="關閉選單"` and returns to `aria-label="開啟選單"` after Escape.

Contact fallback and email-obfuscation hardening deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://76455d2f.twvita.pages.dev`
- Fixed 404 page contact fallbacks:
  - The Email quick-contact link no longer depends on an inconsistent `/contact` placeholder after JavaScript loads.
  - The footer Email text is no longer blank before JavaScript runs.
- Added mobile no-JavaScript navigation support:
  - When JavaScript is unavailable, the mobile navigation is visible and the menu button is hidden.
  - This prevents a JS failure from making the site navigation inaccessible on mobile.
- Avoided Cloudflare Email Protection rewrites on visible front-end Email links:
  - Static HTML now uses `/contact` as the non-JavaScript fallback for `data-email-link`.
  - Static visible fallback text uses `vitawaterproof [at] gmail.com`.
  - `site.js` still upgrades Email links to `mailto:vitawaterproof@gmail.com` and visible Email text to the normal address after JavaScript loads.
- Updated CSS, JS, icon, and manifest cache-bust references to `20260617-audit25`.
- Local verification:
  - Static checks passed across 12 HTML-like files.
  - Confirmed no static visible `mailto:vitawaterproof@gmail.com` links remain in front-end HTML.
  - Confirmed Email fallback text exists and JSON-LD still parses.
  - Browser checks confirmed JavaScript upgrades Email links to `mailto:vitawaterproof@gmail.com`.
  - Browser checks confirmed no-JavaScript mobile navigation is visible with no horizontal overflow.
- Production verification:
  - `https://76455d2f.twvita.pages.dev/`, `/contact`, and `/not-a-real-page` return expected HTTP 200/404 responses.
  - `https://twvita.com.tw/`, `/contact`, and `/not-a-real-page` return expected HTTP 200/404 responses.
  - `https://twvita.com.tw/assets/styles.css?v=20260617-audit25` and `https://twvita.com.tw/assets/site.js?v=20260617-audit25` return HTTP 200.
  - Production HTML no longer contains `/cdn-cgi/l/email-protection`, `__cf_email__`, or `email-decode.min.js`.
  - Production browser checks passed across 14 route/viewport combinations: desktop 1440px and mobile 390px for all main routes plus 404, with no horizontal overflow, no broken images, and working JavaScript-upgraded Email links.
  - Production no-JavaScript mobile check passed: navigation displays, menu button is hidden, fallback Email text is visible, and there is no horizontal overflow.

LLMS contact consistency deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://814023cb.twvita.pages.dev`
- Updated `public/llms.txt` Email display from `vitawaterproof@gmail.com` to `vitawaterproof [at] gmail.com` so the text-index file follows the same public fallback style as the front-end HTML.
- Local verification:
  - Text/link audit passed across 21 text files and 12 front-end HTML-like files.
  - Confirmed no LINE, Google Sites, removed specification-page text, old service-area text, or stale emergency wording appears in public text files.
  - Confirmed front-end HTML has no static visible `mailto:vitawaterproof@gmail.com`, no Cloudflare email-protection artifacts, and JSON-LD still parses.
- Production verification:
  - `https://814023cb.twvita.pages.dev/llms.txt` and `https://twvita.com.tw/llms.txt` return HTTP 200 with `content-type: text/plain; charset=utf-8`.
  - Production `llms.txt` contains `vitawaterproof [at] gmail.com` and no raw `vitawaterproof@gmail.com`.
  - `https://twvita.com.tw/`, `/contact`, and `/not-a-real-page` return expected HTTP 200/404 responses.
  - Browser checks confirmed JavaScript-upgraded Email links remain `mailto:vitawaterproof@gmail.com`.
  - Browser checks confirmed no-JavaScript mobile fallback remains visible with no horizontal overflow and no Cloudflare email-protection artifacts.

Security header hardening deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://3de15ed0.twvita.pages.dev`
- Added additional security headers to HTML and non-HTML asset responses:
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Cross-Origin-Resource-Policy: same-origin`
  - `X-Permitted-Cross-Domain-Policies: none`
- Kept existing headers:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Frame-Options: SAMEORIGIN`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- Implemented Worker-level header application for HTML and 404 responses.
- Added the same security headers explicitly to `/assets/*` because the asset-specific `_headers` block overrides inherited rules on Cloudflare Pages.
- Updated CSS, JS, icon, and manifest cache-bust references to `20260617-audit26` so immutable cached assets receive the new header set.
- Local verification:
  - Worker syntax check passed.
  - Static checks confirmed JSON-LD and manifest still parse.
  - `_headers` audit confirmed `/assets/*` includes the new security headers.
- Production verification:
  - `https://3de15ed0.twvita.pages.dev/` returns HTTP 200 with the expected security headers.
  - `https://twvita.com.tw/`, `/contact`, and `/not-a-real-page` return expected HTTP 200/404 responses with the expected security headers.
  - `https://twvita.com.tw/assets/styles.css?v=20260617-audit26`, `/assets/site.js?v=20260617-audit26`, `/assets/images/vita-icon.png?v=20260617-audit26`, and `/llms.txt` return HTTP 200 with the expected security headers.
  - Browser checks passed across 14 route/viewport combinations: desktop 1440px and mobile 390px for all main routes plus 404, with no horizontal overflow, no broken images, no stale Google Sites/LINE references, no Cloudflare email-protection artifacts, and working JavaScript-upgraded Email links.
  - Mobile menu opens with `aria-label="關閉選單"` and returns to `aria-label="開啟選單"` after Escape.

Mobile text-link hit area improvement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://93ff75bf.twvita.pages.dev`
- Improved mobile tappable areas for smaller text links:
  - Card body text links.
  - Contact-list text links.
  - Footer links.
- Added CSS rule with `inline-flex` and `min-height: 36px` for those text links.
- Updated CSS, JS, icon, and manifest cache-bust references to `20260617-audit27`.
- Local verification:
  - Static checks confirmed `audit27` references, valid JSON-LD, valid manifest, and valid sitemap.
  - Browser checks on local mobile pages confirmed no remaining non-navigation text targets under 32px height.
  - No-JavaScript mobile navigation remained visible with no horizontal overflow.
- Production verification:
  - `https://93ff75bf.twvita.pages.dev/` returns HTTP 200.
  - `https://twvita.com.tw/`, `/contact`, and `/not-a-real-page` return expected HTTP 200/404 responses.
  - `https://twvita.com.tw/assets/styles.css?v=20260617-audit27` and `/assets/site.js?v=20260617-audit27` return HTTP 200 with expected security headers.
  - Browser checks passed across 14 route/viewport combinations: desktop 1440px and mobile 390px for all main routes plus 404, with no horizontal overflow, no broken images, no stale Google Sites/LINE references, no Cloudflare email-protection artifacts, working JavaScript-upgraded Email links, and no remaining small non-navigation mobile text targets.
  - Mobile menu opens with `aria-label="關閉選單"` and returns to `aria-label="開啟選單"` after Escape.

Service-area and copy refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://5c050355.twvita.pages.dev`
- Updated the site header across pages to show `服務範圍：台北市、新北市`.
- Refined homepage and service-page copy toward a more professional waterproofing-company tone, emphasizing engineering evaluation, waterproofing materials, drainage, substrate condition, detailing, and maintenance planning.
- Changed visible telephone links on the contact page and footer from the phone number display to `來電洽詢`, while keeping `tel:+886228120021` functional.
- Added `fetchpriority="low"` to lazy-loaded non-hero images and kept the homepage hero image at high priority.
- Updated CSS, JS, icon, and manifest cache-bust references to `20260617-audit28`.
- Local verification:
  - Static checks confirmed no stale `目前服務範圍`, `雙北地區`, `20260617-audit27`, visible `(02)2812-0021`, or old phone aria wording remains in front-end pages.
  - JSON-LD still parses.
  - Image priority checks passed: lazy images use low priority and the homepage hero remains high priority.
  - Local browser checks passed across desktop 1440px and mobile 390px for all main routes plus 404, with no horizontal overflow, no broken images, working mobile menu, and working JavaScript-upgraded Email links.
- Production verification:
  - `https://5c050355.twvita.pages.dev/` returns HTTP 200.
  - `https://twvita.com.tw/` and `/contact` return HTTP 200; `/not-a-real-page` returns HTTP 404.
  - `https://www.twvita.com.tw/` returns HTTP 301 to `https://twvita.com.tw/`.
  - Production HTML contains `服務範圍：台北市、新北市`, `雙北專業防水工程評估與修繕`, `20260617-audit28`, and visible telephone links labeled `來電洽詢`.
  - Production browser checks passed across 14 route/viewport combinations: desktop 1440px and mobile 390px for all main routes plus 404, with no horizontal overflow, no broken images, no stale Google Sites/old phone-display references, working JavaScript-upgraded Email links, and working mobile menu.

Header normalization and LLMS contact consistency deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://d2482ced.twvita.pages.dev`
- Updated `public/llms.txt` contact phone display from `(02)2812-0021` to `來電洽詢`, matching the public website phone-label strategy.
- Expanded `_worker.js` to overwrite the full security-header set on Worker-served responses:
  - `Cross-Origin-Opener-Policy`
  - `Cross-Origin-Resource-Policy`
  - `Permissions-Policy`
  - `Referrer-Policy`
  - `Strict-Transport-Security`
  - `X-Content-Type-Options`
  - `X-Frame-Options`
  - `X-Permitted-Cross-Domain-Policies`
- This avoids duplicate header values on CSS/JS responses when multiple `_headers` rules apply.
- Updated CSS, JS, icon, and manifest cache-bust references to `20260617-audit29`.
- Local verification:
  - Static checks found no stale `audit28`, old service-area text, visible phone-number link text, or old phone aria wording in public pages.
  - JSON-LD and manifest parsing passed.
  - Worker syntax check passed.
  - Local exact header checks passed for homepage, CSS, JS, and `llms.txt`; each expected security header matched a single exact value.
  - Local browser checks passed across desktop 1440px and mobile 390px for all main routes plus 404, with no horizontal overflow, no broken images, working mobile menu, and JavaScript-upgraded Email links.
- Production verification:
  - `https://d2482ced.twvita.pages.dev/` returns HTTP 200.
  - `https://twvita.com.tw/`, `/contact`, `/llms.txt`, CSS, and JS return HTTP 200; `/not-a-real-page` returns HTTP 404.
  - `https://www.twvita.com.tw/` returns HTTP 301 to `https://twvita.com.tw/`.
  - Production content contains `20260617-audit29`, `服務範圍：台北市、新北市`, and `電話：來電洽詢` in `llms.txt`; no stale `audit28`, Google Sites, LINE, or visible phone-number link text was found.
  - Production exact header checks passed for homepage, 404, CSS, JS, and `llms.txt`; each expected security header matched a single exact value.
  - Production browser checks passed across 14 route/viewport combinations: desktop 1440px and mobile 390px for all main routes plus 404, with no horizontal overflow, no broken images, no stale Google Sites/old phone-display references, working JavaScript-upgraded Email links, and working mobile menu.

Content Security Policy hardening deployed on 2026-06-17 Asia/Taipei:

- Deployment URLs:
  - Initial CSP deploy: `https://9485cea1.twvita.pages.dev`
  - Final CSP allowlist deploy: `https://bf3768d5.twvita.pages.dev`
- Added `Content-Security-Policy` via `_worker.js`:
  - `default-src 'self'`
  - `base-uri 'self'`
  - `form-action 'self'`
  - `frame-ancestors 'self'`
  - `object-src 'none'`
  - `img-src 'self' data:`
  - `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com`
  - `style-src 'self'`
  - `font-src 'self'`
  - `connect-src 'self' https://cloudflareinsights.com`
  - `upgrade-insecure-requests`
- Kept `unsafe-inline` for scripts because the pages use inline JSON-LD structured data.
- Added Cloudflare Insights allowlist after production browser verification showed the initial CSP blocked Cloudflare's injected beacon script.
- Updated CSS, JS, icon, and manifest cache-bust references to `20260617-audit31`.
- Local verification:
  - Worker syntax check passed.
  - Static checks confirmed `audit31` references, valid JSON-LD, valid manifest, and no stale `audit30`/`audit29` visible page references.
  - Local CSP header checks passed for homepage, contact, 404, CSS, and JS.
  - Local browser spot check passed with no CSP console errors, no horizontal overflow, no broken images, working Email initialization, and working mobile menu.
- Production verification:
  - `https://bf3768d5.twvita.pages.dev/` returns HTTP 200 with the final CSP.
  - `https://twvita.com.tw/`, `/contact`, CSS, and JS return HTTP 200 with the final CSP; `/not-a-real-page` returns HTTP 404 with the final CSP.
  - Production content contains `20260617-audit31` and no stale `audit30`, Google Sites, LINE, or visible phone-number link text.
  - Production CSP allowlist header checks passed for homepage, contact, 404, CSS, and JS.
  - Production browser checks passed across 14 route/viewport combinations: desktop 1440px and mobile 390px for all main routes plus 404, with no CSP console errors, no horizontal overflow, no broken images, no stale Google Sites/old phone-display references, working JavaScript-upgraded Email links, and working mobile menu.

Hash-based CSP script policy deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://bfc53d6d.twvita.pages.dev`
- Replaced `script-src 'unsafe-inline'` with explicit `sha256` hashes for all inline JSON-LD scripts.
- Kept external script/connect allowlist for Cloudflare Insights:
  - `https://static.cloudflareinsights.com`
  - `https://cloudflareinsights.com`
- Updated CSS, JS, icon, and manifest cache-bust references to `20260617-audit32`.
- Local verification:
  - Worker syntax check passed.
  - Static checks confirmed `audit32` references, valid JSON-LD, valid manifest, and no stale `audit31`/`audit30` visible page references.
  - Hash coverage check confirmed every inline JSON-LD script hash is present in `_worker.js`.
  - Confirmed `unsafe-inline` is no longer present in `_worker.js`.
  - Local CSP header checks confirmed `script-src` contains hashes and no `unsafe-inline`.
  - Local browser checks passed across desktop 1440px and mobile 390px for all main routes plus 404, with no CSP console errors, no horizontal overflow, no broken images, working Email initialization, and working mobile menu.
- Production verification:
  - `https://bfc53d6d.twvita.pages.dev/` returns HTTP 200 with the hash-based CSP.
  - `https://twvita.com.tw/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact` return HTTP 200; `/not-a-real-page` returns HTTP 404.
  - Production CSP checks confirmed no `unsafe-inline`, `script-src` includes JSON-LD hashes, and Cloudflare Insights script/connect allowlists remain present.
  - Production content contains `20260617-audit32` and no stale `audit31`, Google Sites, LINE, or visible phone-number link text.
  - Production browser checks passed across 14 route/viewport combinations: desktop 1440px and mobile 390px for all main routes plus 404, with no CSP console errors, no horizontal overflow, no broken images, working JavaScript-upgraded Email links, and working mobile menu.

Validation tooling and robots header maintenance deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://098d883c.twvita.pages.dev`
- Added `package.json` with:
  - `npm run validate`
  - `npm run smoke:live`
- Added `scripts/validate-site.mjs` to catch deploy-time regressions:
  - Validates all 12 HTML route files exist.
  - Parses JSON-LD and confirms every inline JSON-LD hash exists in `_worker.js`.
  - Confirms CSP no longer contains `unsafe-inline`.
  - Checks stale removed wording, stale audit versions, duplicate IDs, local assets, responsive image candidates, image dimensions, lazy-image priority, homepage hero priority, manifest JSON, sitemap routes, and robots sitemap declaration.
- Added `scripts/smoke-live.mjs` to verify live/public serving:
  - Checks 12 live URLs.
  - Confirms expected HTTP status codes.
  - Confirms key page text and current audit markers.
  - Confirms CSP and security headers on HTML/assets/sitemap/llms responses.
  - Confirms `www.twvita.com.tw` redirects to the apex domain on production.
  - Supports `SMOKE_BASE_URL` for local or Pages deployment smoke checks.
- Updated `public/_headers` so `/robots.txt` has the same explicit security header set as other special static paths.
- Updated `public/robots.txt` content with a site comment, forcing a new asset ETag on Pages deployments.
- Local verification:
  - `npm run validate` passed.
  - Local Pages preview smoke passed using `SMOKE_BASE_URL=http://127.0.0.1:8788 npm run smoke:live`.
  - Local `robots.txt` headers included CSP, HSTS, COOP, CORP, Referrer-Policy, X-Frame-Options, X-Content-Type-Options, Permissions-Policy, and X-Permitted-Cross-Domain-Policies.
- Production verification:
  - `https://098d883c.twvita.pages.dev/robots.txt` returns HTTP 200 with the updated ETag and full security headers.
  - `npm run smoke:live` passed on `https://twvita.com.tw`.
  - `SMOKE_BASE_URL=https://098d883c.twvita.pages.dev npm run smoke:live` passed on the Pages deployment URL.
  - Production browser spot checks passed on desktop 1440px and mobile 390px for `/`, `/contact`, and `/not-a-real-page`, with no CSP console errors, no horizontal overflow, no broken images, working Email initialization, and working mobile menu.
  - Note: `https://twvita.com.tw/robots.txt` may be wrapped by Cloudflare Managed Robots content and edge cache. The smoke test intentionally verifies robots availability and sitemap declaration there, while requiring full security headers on HTML/assets/sitemap/llms responses.

Service-area wording and SEO copy consistency deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://800bf403.twvita.pages.dev`
- Standardized public page titles, meta descriptions, Open Graph/Twitter descriptions, H1s, social image alt text, and JSON-LD descriptions from mixed `雙北` wording to explicit `台北市、新北市` wording.
- Updated affected pages:
  - Homepage
  - Company profile
  - Roof waterproofing
  - Tank, water box, and pool waterproofing
  - Project history
  - Contact
- Recomputed all JSON-LD CSP hashes after structured-data text changes.
- Updated CSS, JS, icon, and manifest cache-bust references to `20260617-audit33`.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit33`.
  - `npm run smoke:live` now expects `20260617-audit33` and treats `audit32`/`audit31` as stale content.
- Local verification:
  - `npm run validate` passed.
  - Local Pages preview smoke passed using `SMOKE_BASE_URL=http://127.0.0.1:8788 npm run smoke:live`.
  - Local browser checks passed on desktop 1440px and mobile 390px for `/`, `/roof-waterproofing`, `/contact`, and `/not-a-real-page`, with no CSP console errors, no horizontal overflow, no broken images, working Email initialization, and working mobile menu.
  - Static keyword audit found no remaining public `雙北`, stale `audit32`/`audit31`, Google Sites, LINE, or removed material-spec text in public pages and scripts.
- Production verification:
  - `https://800bf403.twvita.pages.dev/` returns HTTP 200 with `20260617-audit33`.
  - `npm run smoke:live` passed on `https://twvita.com.tw`.
  - `SMOKE_BASE_URL=https://800bf403.twvita.pages.dev npm run smoke:live` passed on the Pages deployment URL.
  - `https://twvita.com.tw/`, `/roof-waterproofing`, and `/contact` return HTTP 200 with `20260617-audit33`, the hash-based CSP, and expected security headers.
  - Production content checks confirmed explicit `台北市、新北市` wording and no public `雙北`, stale `audit32`, Google Sites, LINE, or visible phone-number link text.
  - Production browser checks passed on desktop 1440px and mobile 390px for `/`, `/roof-waterproofing`, `/contact`, and `/not-a-real-page`, with no CSP console errors, no horizontal overflow, no broken images, working JavaScript-upgraded Email links, and working mobile menu.

Brand accessibility and current header/contact verification deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://2386e1c7.twvita.pages.dev`
- Confirmed all public page headers show `服務範圍：台北市、新北市`.
- Confirmed visible telephone CTAs use `來電洽詢` while keeping `tel:+886228120021` functional.
- Added consistent accessible labels to the brand homepage links across route pages.
- Updated CSS, JS, icon, and manifest cache-bust references to `20260617-audit34`.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit34`.
  - `npm run smoke:live` now expects `20260617-audit34` and treats `audit33`/`audit32`/`audit31` as stale content.
- Local verification:
  - `npm run validate` passed.
  - Local Pages preview smoke passed using `SMOKE_BASE_URL=http://127.0.0.1:8788 npm run smoke:live`.
  - Local browser checks passed across desktop 1440px and mobile 390px for all main routes plus 404, with no horizontal overflow, no broken images, working Email initialization, working mobile menu, expected service-area text, accessible brand links, and telephone labels shown as `來電洽詢`.
- Production verification:
  - `https://2386e1c7.twvita.pages.dev/` returns HTTP 200 with `20260617-audit34`.
  - `npm run smoke:live` passed on `https://twvita.com.tw`.
  - `SMOKE_BASE_URL=https://2386e1c7.twvita.pages.dev npm run smoke:live` passed on the Pages deployment URL.
  - `https://twvita.com.tw/` and `/contact` return HTTP 200 with `20260617-audit34`, `服務範圍：台北市、新北市`, `來電洽詢`, the hash-based CSP, and expected security headers.
  - `https://www.twvita.com.tw/` returns HTTP 301 to `https://twvita.com.tw/`.
  - Production content checks found no Google Sites, LINE, stale `audit33`, or visible phone-number link text.
  - Production browser checks passed across desktop 1440px and mobile 390px for all main routes plus 404, with no horizontal overflow, no broken images, working JavaScript-upgraded Email links, working mobile menu, expected service-area text, accessible brand links, and telephone labels shown as `來電洽詢`.

Contact structured-data consistency deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://ad0e129e.twvita.pages.dev`
- Improved contact-page JSON-LD:
  - Added a dedicated `ContactPage` entity for `https://twvita.com.tw/contact`.
  - Kept the shared `LocalBusiness` entity `@id` stable at `https://twvita.com.tw/#business`.
  - Corrected the `LocalBusiness` `url` from the contact page back to the homepage `https://twvita.com.tw/`.
  - Added the shared `WebSite` entity on the contact page for clearer graph linkage.
- Recomputed JSON-LD CSP hashes and updated the Worker security header.
- Updated CSS, JS, icon, and manifest cache-bust references to `20260617-audit35`.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit35`.
  - Contact pages must include `ContactPage`.
  - Contact pages must not set the shared `LocalBusiness` URL to `/contact`.
  - `npm run smoke:live` now treats `audit34`/`audit33`/`audit32`/`audit31` as stale content.
- Local verification:
  - `npm run validate` passed.
  - Local Pages preview smoke passed using `SMOKE_BASE_URL=http://127.0.0.1:8788 npm run smoke:live`.
  - Local browser checks passed on desktop 1440px and mobile 390px for `/`, `/contact`, and `/not-a-real-page`, with no horizontal overflow, no broken images, working Email initialization, working mobile menu, expected service-area text, `ContactPage` JSON-LD, and `LocalBusiness.url=https://twvita.com.tw/`.
- Production verification:
  - `https://ad0e129e.twvita.pages.dev/contact` returns HTTP 200 with `20260617-audit35`, `ContactPage`, the updated CSP hash, and expected security headers.
  - `npm run smoke:live` passed on `https://twvita.com.tw`.
  - `SMOKE_BASE_URL=https://ad0e129e.twvita.pages.dev npm run smoke:live` passed on the Pages deployment URL.
  - `https://twvita.com.tw/` and `/contact` return HTTP 200 with `20260617-audit35`, `服務範圍：台北市、新北市`, `來電洽詢`, and the hash-based CSP.
  - `https://www.twvita.com.tw/` returns HTTP 301 to `https://twvita.com.tw/`.
  - Production content checks found no Google Sites, LINE, stale `audit34`, or visible phone-number link text.
  - Production browser checks passed on desktop 1440px and mobile 390px for `/`, `/contact`, and `/not-a-real-page`, with no horizontal overflow, no broken images, working JavaScript-upgraded Email links, working mobile menu, `ContactPage` JSON-LD, and `LocalBusiness.url=https://twvita.com.tw/`.

Homepage structured-data graph deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://9b3f3dd2.twvita.pages.dev`
- Improved homepage JSON-LD:
  - Added `WebPage` for `https://twvita.com.tw/#homepage`.
  - Added `WebSite` for `https://twvita.com.tw/#website`.
  - Kept the shared `LocalBusiness` entity stable at `https://twvita.com.tw/#business`.
  - Linked the homepage to the business and primary image.
- Recomputed JSON-LD CSP hashes and updated the Worker security header without reintroducing `unsafe-inline`.
- Updated CSS, JS, icon, and manifest cache-bust references to `20260617-audit36`.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit36`.
  - Homepage must include `WebPage`, `WebSite`, and `LocalBusiness` JSON-LD nodes.
  - Homepage `WebSite.url` and `LocalBusiness.url` must remain `https://twvita.com.tw/`.
  - Social image metadata must use canonical `https://twvita.com.tw/` URLs and point to existing local assets.
  - `npm run smoke:live` now verifies the homepage `WebPage` marker and treats `audit35`/older versions as stale.
- Local verification:
  - `npm run validate` passed.
  - Local Pages preview smoke passed using `SMOKE_BASE_URL=http://127.0.0.1:8788 npm run smoke:live`.
  - Local browser checks passed on desktop 1440px and mobile 390px for `/`, `/contact`, and `/not-a-real-page`, with no horizontal overflow, no broken images, working Email initialization, working mobile menu, homepage `WebPage`/`WebSite` JSON-LD, and `LocalBusiness.url=https://twvita.com.tw/`.
- Production verification:
  - `https://9b3f3dd2.twvita.pages.dev/` returns HTTP 200 with `20260617-audit36`, `WebPage`, `WebSite`, the updated CSP hash, and expected security headers.
  - `npm run smoke:live` passed on `https://twvita.com.tw`.
  - `SMOKE_BASE_URL=https://9b3f3dd2.twvita.pages.dev npm run smoke:live` passed on the Pages deployment URL.
  - `https://twvita.com.tw/` and `/contact` return HTTP 200 with `20260617-audit36`, `服務範圍：台北市、新北市`, `來電洽詢`, and the hash-based CSP.
  - `https://www.twvita.com.tw/` returns HTTP 301 to `https://twvita.com.tw/`.
  - Production content checks found no Google Sites, LINE, stale `audit35`, or visible phone-number link text.
  - Production browser checks passed on desktop 1440px and mobile 390px for `/`, `/contact`, and `/not-a-real-page`, with no horizontal overflow, no broken images, working JavaScript-upgraded Email links, working mobile menu, homepage `WebPage`/`WebSite` JSON-LD, and `LocalBusiness.url=https://twvita.com.tw/`.

Homepage service-copy refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://bb407f14.twvita.pages.dev`
- Refined the homepage service section to reduce repeated, template-like wording:
  - Replaced eyebrow `主要服務` with `常見需求`.
  - Replaced heading `主要服務項目` with `先看漏水位置，再安排處理方向。`
  - Reworded the supporting sentence to focus on actual site conditions: substrate, drainage, use limits, and maintenance needs.
- Updated CSS, JS, icon, and manifest cache-bust references to `20260617-audit37`.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit37`.
  - Homepage must not contain the old repeated heading `主要服務項目`.
  - Homepage must contain the refined heading `先看漏水位置，再安排處理方向。`
  - `npm run smoke:live` now verifies the refined homepage heading and treats `audit36`/older versions as stale.
- Local verification:
  - `npm run validate` passed.
  - Local Pages preview smoke passed using `SMOKE_BASE_URL=http://127.0.0.1:8788 npm run smoke:live`.
  - Local browser checks passed on desktop 1440px and mobile 390px for `/`, `/contact`, and `/not-a-real-page`, with no horizontal overflow, no broken images, working Email initialization, working mobile menu, the refined homepage service heading, and no old `主要服務項目` heading.
- Production verification:
  - `https://bb407f14.twvita.pages.dev/` returns HTTP 200 with `20260617-audit37`, `先看漏水位置，再安排處理方向。`, and expected security headers.
  - `npm run smoke:live` passed on `https://twvita.com.tw`.
  - `SMOKE_BASE_URL=https://bb407f14.twvita.pages.dev npm run smoke:live` passed on the Pages deployment URL.
  - `https://twvita.com.tw/` and `/contact` return HTTP 200 with `20260617-audit37`, `服務範圍：台北市、新北市`, `來電洽詢`, and the hash-based CSP.
  - `https://www.twvita.com.tw/` returns HTTP 301 to `https://twvita.com.tw/`.
  - Production content checks found the refined homepage service heading and no Google Sites, LINE, stale `audit36`, or old `主要服務項目` heading.
  - Production browser checks passed on desktop 1440px and mobile 390px for `/`, `/contact`, and `/not-a-real-page`, with no horizontal overflow, no broken images, working JavaScript-upgraded Email links, working mobile menu, the refined homepage service heading, and no old `主要服務項目` heading.

Mobile menu close behavior deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://59f006e4.twvita.pages.dev`
- Improved mobile navigation behavior:
  - Tapping outside the open menu now closes the menu.
  - Resizing from mobile width to desktop width now closes the menu and resets the button label/state.
- Updated CSS, JS, icon, and manifest cache-bust references to `20260617-audit38`.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit38`.
  - Static validation checks the outside-click close and desktop-resize close JavaScript markers.
  - `npm run smoke:live` now treats `audit37`/older versions as stale content.
- Local verification:
  - `npm run validate` passed.
  - Local Pages preview smoke passed using `SMOKE_BASE_URL=http://127.0.0.1:8788 npm run smoke:live`.
  - Local browser interaction test passed on mobile 390px and desktop 1024px, including open, outside-click close, reopen, resize close, no horizontal overflow, Email initialization, and no stale `audit37`.
- Production verification:
  - `npm run smoke:live` passed on `https://twvita.com.tw`.
  - `SMOKE_BASE_URL=https://59f006e4.twvita.pages.dev npm run smoke:live` passed on the Pages deployment URL.
  - `https://twvita.com.tw/` returns HTTP 200 with `20260617-audit38`, `data-site-nav`, and `先看漏水位置，再安排處理方向。`
  - `https://twvita.com.tw/assets/site.js?v=20260617-audit38` returns HTTP 200 with immutable cache headers and the expected menu-close markers.
  - `https://www.twvita.com.tw/` returns HTTP 301 to `https://twvita.com.tw/`.
  - Production browser interaction test passed on mobile 390px and desktop 1024px, including open, outside-click close, reopen, resize close, no horizontal overflow, Email initialization, and no stale `audit37`.

Tank and pool service copy refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://06613f22.twvita.pages.dev`
- Refined the tank/pool waterproofing page to reduce repeated planning wording and make the service description more professional:
  - Replaced repeated `使用與停用` phrasing with practical assessment language around pool/body condition, substrate, leakage points, construction window, hygiene, durability, and maintenance.
  - Updated the service meta description, Open Graph/Twitter descriptions, Service JSON-LD, visible H2s, cards, FAQ wording, and CTA copy.
  - Updated `llms.txt` to match the refined assessment language.
- Updated CSS, JS, icon, and manifest cache-bust references to `20260617-audit39`.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit39`.
  - Static validation rejects the old repeated tank/pool copy and requires the new professional copy.
  - `npm run smoke:live` now verifies the refined tank/pool page copy and treats `audit38`/older versions as stale content.
- Local verification:
  - `npm run validate` passed.
  - Local Pages preview smoke passed using `SMOKE_BASE_URL=http://127.0.0.1:8788 npm run smoke:live`.
  - Local browser content/layout check passed on mobile 390px and desktop 1440px for `/tank-pool-waterproofing`, `/`, and `/contact`, with no horizontal overflow, no broken images, working Email initialization, `20260617-audit39`, and no stale tank/pool copy.
- Production verification:
  - `npm run smoke:live` passed on `https://twvita.com.tw`.
  - `SMOKE_BASE_URL=https://06613f22.twvita.pages.dev npm run smoke:live` passed on the Pages deployment URL after edge propagation settled.
  - `https://twvita.com.tw/tank-pool-waterproofing` and `https://06613f22.twvita.pages.dev/tank-pool-waterproofing` return HTTP 200 with `20260617-audit39`, the refined tank/pool copy, and no stale `audit38`.
  - `https://www.twvita.com.tw/` still resolves to the canonical apex `https://twvita.com.tw/`.
  - Production browser content/layout check passed on mobile 390px and desktop 1440px for `/tank-pool-waterproofing`, `/`, and `/contact`, with no horizontal overflow, no broken images, working JavaScript-upgraded Email links, `20260617-audit39`, and no stale tank/pool copy.

404 robots header hardening deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://c6176623.twvita.pages.dev`
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Improved 404 handling:
  - Real 404 responses now send `X-Robots-Tag: noindex, nofollow`.
  - Direct `/404.html` access also receives the noindex/nofollow robots header.
  - Normal homepage responses remain indexable and do not send `X-Robots-Tag` on the production apex.
- Front-end page asset version remains `20260617-audit39`; this release updates Worker/header behavior and validation tooling.
- Updated validation scripts:
  - `npm run validate` now checks that the Worker sets the 404 robots header.
  - `npm run smoke:live` now checks the 404 `X-Robots-Tag` and confirms the production homepage does not accidentally send an X-Robots-Tag.
- Local verification:
  - `npm run validate` passed.
  - Local Pages preview smoke passed using `SMOKE_BASE_URL=http://127.0.0.1:8788 npm run smoke:live`.
  - Local header checks confirmed `/not-a-real-page` returns HTTP 404 with `X-Robots-Tag: noindex, nofollow`, while `/` returns HTTP 200 without that header.
  - Local browser check passed on mobile 390px for the 404 page, with no horizontal overflow and working Email initialization.
- Production verification:
  - `npm run smoke:live` passed on `https://twvita.com.tw`.
  - `SMOKE_BASE_URL=https://c6176623.twvita.pages.dev npm run smoke:live` passed on the Pages deployment URL.
  - `https://twvita.com.tw/not-a-real-page`, `https://www.twvita.com.tw/not-a-real-page`, and `https://c6176623.twvita.pages.dev/not-a-real-page` return HTTP 404 with `X-Robots-Tag: noindex, nofollow`.
  - `https://twvita.com.tw/` returns HTTP 200 with `20260617-audit39` and no `X-Robots-Tag`.
  - Production browser/header check passed on mobile 390px for the 404 page and homepage, including no horizontal overflow, correct 404 content, working JavaScript-upgraded Email link, 404 noindex/nofollow, and no homepage noindex header.

Service page structured-data graph deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://2d5900a4.twvita.pages.dev`
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Improved JSON-LD on the two service pages:
  - Added `WebPage` and `WebSite` nodes to `/roof-waterproofing` and `/tank-pool-waterproofing`.
  - Added stable Service IDs: `https://twvita.com.tw/roof-waterproofing#service` and `https://twvita.com.tw/tank-pool-waterproofing#service`.
  - Linked each `WebPage.mainEntity` to the matching Service node and each `WebPage.primaryImageOfPage` to the local service image.
  - Kept the shared business ID stable at `https://twvita.com.tw/#business`.
- Recomputed JSON-LD CSP hashes and updated the Worker CSP without reintroducing `unsafe-inline`.
- Front-end page asset version remains `20260617-audit39`; this release updates service-page structured data, Worker CSP hashes, and validation tooling.
- Updated validation scripts:
  - `npm run validate` now requires service pages to include `WebPage`, `WebSite`, `Service`, `BreadcrumbList`, and `FAQPage`.
  - Service-page validation checks the stable `#webpage` and `#service` IDs, `mainEntity`, primary image, shared website URL, and business provider ID.
  - `npm run smoke:live` now verifies the service-page `#webpage` and `#service` identifiers on production and Pages URLs.
- Local verification:
  - `npm run validate` passed.
  - Local Pages preview smoke passed using `SMOKE_BASE_URL=http://127.0.0.1:8788 npm run smoke:live`.
  - Local header/CSP checks confirmed both service pages return HTTP 200 with `#webpage`, `#service`, CSP hashes, and no `unsafe-inline`.
  - Local browser checks passed on mobile 390px and desktop 1440px for both service pages, with no horizontal overflow, no broken images, working Email initialization, and complete service-page JSON-LD types.
- Production verification:
  - `npm run smoke:live` passed on `https://twvita.com.tw`.
  - `SMOKE_BASE_URL=https://2d5900a4.twvita.pages.dev npm run smoke:live` passed on the Pages deployment URL.
  - `https://twvita.com.tw/roof-waterproofing` and `https://twvita.com.tw/tank-pool-waterproofing` return HTTP 200 with `20260617-audit39`, `#webpage`, `#service`, no `unsafe-inline`, and no `X-Robots-Tag`.
  - Production browser checks passed on mobile 390px and desktop 1440px for both service pages, with no horizontal overflow, no broken images, working JavaScript-upgraded Email links, `20260617-audit39`, and complete service-page JSON-LD types.

Projects page visual proof section deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://d5bffca9.twvita.pages.dev`
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Improved the `工程實績` page:
  - Added a visual proof section using the local `site-roof-detail` image instead of leaving the page as text-only.
  - Added copy that connects public-project experience to private repair judgment: water path, substrate, seams, penetrations, maintenance access, and repair scope.
  - Added responsive WebP sources and a local JPEG fallback with explicit dimensions and descriptive alt text.
  - Added `primaryImageOfPage` on the `CollectionPage` JSON-LD node using `https://twvita.com.tw/assets/images/site-roof-detail.jpg`.
- Updated CSS, JS, icon, and manifest cache-bust references to `20260617-audit40`.
- Recomputed JSON-LD CSP hashes and updated the Worker CSP without reintroducing `unsafe-inline`.
- Updated validation scripts:
  - `npm run validate` now rejects stale `audit39`.
  - `projects` and `projects.html` must include the new visual proof section, the local `site-roof-detail` image, descriptive alt text, and `primaryImageOfPage`.
  - `npm run smoke:live` now verifies `20260617-audit40`, the projects visual proof copy, and the local image reference.
- Local verification:
  - `npm run validate` passed.
  - Local Pages preview smoke passed using `SMOKE_BASE_URL=http://127.0.0.1:8788 npm run smoke:live`.
  - Local checks confirmed `/projects` returns HTTP 200 with the visual section, the local image reference, CSP hashes, and no `unsafe-inline`.
  - Local browser checks passed on mobile 390px and desktop 1440px for `/projects`, with no horizontal overflow, no broken images, working Email initialization, `primaryImageOfPage`, and no stale `audit39`.
- Production verification:
  - `npm run smoke:live` passed on `https://twvita.com.tw`.
  - `SMOKE_BASE_URL=https://d5bffca9.twvita.pages.dev npm run smoke:live` passed on the Pages deployment URL.
  - `https://twvita.com.tw/projects` returns HTTP 200 with `20260617-audit40`, the visual proof copy, the local `site-roof-detail` image, no stale `audit39`, and no `X-Robots-Tag`.
  - `https://twvita.com.tw/assets/images/site-roof-detail-720.webp` returns HTTP 200 with immutable asset caching.
  - Production browser checks passed on mobile 390px and desktop 1440px for `/projects`, with no horizontal overflow, no broken images, working JavaScript-upgraded Email link, correct visual image alt text, `primaryImageOfPage`, and no stale `audit39`.

Email inquiry template deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://cb680e46.twvita.pages.dev`
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Improved Email inquiry flow:
  - JavaScript-upgraded Email links now use a `mailto:` URL with subject `臺灣耘達防水修繕評估`.
  - The mail body is prefilled with practical inquiry fields: `建築類型`, `問題位置`, `目前狀況`, `照片或尺寸`, and `可聯絡時間`.
  - The contact page now explains that Email inquiry will first bring in the information fields and reminds users to attach overview, leak-position, drain, or equipment-area photos.
- Updated CSS, JS, icon, and manifest cache-bust references to `20260617-audit41`.
- Updated validation scripts:
  - `npm run validate` now rejects stale `audit40`.
  - Static validation requires the Email subject/body template in `site.js`.
  - Contact-page validation requires the Email template explanation copy.
  - `npm run smoke:live` now verifies `20260617-audit41`, the contact-page explanation, and the Email template strings in `/assets/site.js`.
- Local verification:
  - `npm run validate` passed.
  - Local Pages preview smoke passed using `SMOKE_BASE_URL=http://127.0.0.1:8788 npm run smoke:live`.
  - Local checks confirmed `/contact` returns HTTP 200 with the Email template explanation and `/assets/site.js?v=20260617-audit41` contains the subject/body template.
  - Local browser checks passed on mobile 390px and desktop 1440px for `/contact`, with no horizontal overflow, no stale `audit40`, and all `data-email-link` links upgraded to `mailto:vitawaterproof@gmail.com` with the expected subject and fields.
- Production verification:
  - `npm run smoke:live` passed on `https://twvita.com.tw`.
  - `SMOKE_BASE_URL=https://cb680e46.twvita.pages.dev npm run smoke:live` passed on the Pages deployment URL.
  - `https://twvita.com.tw/contact` returns HTTP 200 with `20260617-audit41`, the Email template explanation, no stale `audit40`, and no `X-Robots-Tag`.
  - `https://twvita.com.tw/assets/site.js?v=20260617-audit41` returns HTTP 200 with immutable asset caching and the Email subject/body template.
  - Production browser checks passed on mobile 390px and desktop 1440px for `/contact`, with no horizontal overflow, no stale `audit40`, and all Email links upgraded to the expected prefilled `mailto:` URL.

LLMS public summary refresh deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://62cd7da5.twvita.pages.dev`
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated `public/llms.txt` to reflect recent site improvements:
  - Added an `工程經驗重點` section explaining how public-project experience maps to private repair judgment.
  - Added current assessment language around water path, substrate, seams, equipment penetrations, maintenance access, and repair scope.
  - Updated the contact summary to state that Email links prefill `建築類型`, `問題位置`, `目前狀況`, `照片或尺寸`, and `可聯絡時間`.
- Front-end page asset version remains `20260617-audit41`; this release updates the public LLM/search summary file and validation tooling.
- Updated validation scripts:
  - `npm run validate` now checks `llms.txt` for the updated engineering-experience and Email-template summary text.
  - `npm run smoke:live` now verifies the new `llms.txt` markers on production and Pages URLs.
- Local verification:
  - `npm run validate` passed.
  - Local Pages preview smoke passed using `SMOKE_BASE_URL=http://127.0.0.1:8788 npm run smoke:live`.
  - Local `llms.txt` check confirmed HTTP 200, `text/plain; charset=utf-8`, one-hour cache policy, no `X-Robots-Tag`, and the new engineering-experience and Email-template markers.
- Production verification:
  - `npm run smoke:live` passed on `https://twvita.com.tw`.
  - `SMOKE_BASE_URL=https://62cd7da5.twvita.pages.dev npm run smoke:live` passed on the Pages deployment URL.
  - `https://twvita.com.tw/llms.txt` returns HTTP 200 with `text/plain; charset=utf-8`, `Cache-Control: public, max-age=3600, must-revalidate`, no `X-Robots-Tag`, and the updated engineering-experience and Email-template summary text.
  - `https://62cd7da5.twvita.pages.dev/llms.txt` returns HTTP 200 with the same content markers; the preview hostname still sends Cloudflare's expected noindex header.

Content refinement and inquiry checklist deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://c260e455.twvita.pages.dev`
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit42`.
- Refined page copy to reduce repeated wording and make each page role clearer:
  - Homepage now explains the practical assessment flow: water path, substrate stability, drainage, usage limits, and suitable repair direction.
  - Company page now frames past large-site experience as construction discipline, material judgment, seam handling, and site coordination.
  - Roof service page now focuses on roof, parapet, drain, and equipment-base conditions instead of repeating generic service-area language.
  - Tank/pool page now emphasizes structure, surface condition, access, and workable construction windows.
  - Projects page now uses past project categories to explain technical judgment rather than repeating private-repair positioning.
  - Contact page now uses `讓我們更快判斷的資訊` and asks for practical constraints such as workable hours, whether the area can be emptied, and tenant/business impact.
- Updated Email inquiry template:
  - Added `使用限制：` between `照片或尺寸：` and `可聯絡時間：`.
  - Updated `llms.txt` to describe the same Email fields.
- Recomputed JSON-LD CSP hashes and kept the Worker CSP free of `unsafe-inline`.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit42`, rejects stale `audit41`, and checks the refined homepage/contact/project/tank copy.
  - `npm run smoke:live` now verifies `audit42`, the new copy markers, the added Email `使用限制：` field, and stale-content rejection.
- Local verification:
  - `npm run validate` passed.
  - Local Pages preview smoke passed using `SMOKE_BASE_URL=http://127.0.0.1:8788 npm run smoke:live`.
  - Playwright CLI snapshots confirmed homepage and contact page content, service-area header, visible inquiry checklist, and Email `mailto:` template including `使用限制：`.
- Production verification:
  - `npm run smoke:live` passed on `https://twvita.com.tw`.
  - `SMOKE_BASE_URL=https://c260e455.twvita.pages.dev npm run smoke:live` passed on the Pages deployment URL.
  - `https://twvita.com.tw/contact` returns HTTP 200 with `20260617-audit42`, `讓我們更快判斷的資訊`, `使用限制：可施工時段`, expected security headers, and no Google Sites, LINE, or stale `audit41` content.

Email no-JavaScript fallback deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://1d7805e4.twvita.pages.dev`
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit43`.
- Improved contact reliability:
  - All `data-email-link` anchors now include a static `mailto:vitawaterproof@gmail.com` fallback in the HTML.
  - The fallback includes the same inquiry fields used by JavaScript: `建築類型`, `問題位置`, `目前狀況`, `照片或尺寸`, `使用限制`, and `可聯絡時間`.
  - JavaScript still upgrades the links after load and reveals the visible Email address text where appropriate.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit43`, rejects stale `audit42`, and requires no-JavaScript Email fallbacks with the `使用限制` field.
  - `npm run smoke:live` now checks production and Pages HTML for the `mailto:vitawaterproof@gmail.com` fallback and stale `audit42` rejection.
- Local verification:
  - `npm run validate` passed.
  - Local Pages preview smoke passed using `SMOKE_BASE_URL=http://127.0.0.1:8788 npm run smoke:live`.
  - Local raw HTML check confirmed `/contact` includes `mailto:vitawaterproof@gmail.com` fallback links and no old `/contact` Email fallback hrefs.
  - Playwright CLI snapshot confirmed the contact page shows the real Email address after JavaScript load and all Email links include the full prefilled mailto body.
- Production verification:
  - `npm run smoke:live` passed on `https://twvita.com.tw`.
  - `SMOKE_BASE_URL=https://1d7805e4.twvita.pages.dev npm run smoke:live` passed on the Pages deployment URL.
  - `https://twvita.com.tw/contact` returns HTTP 200 with `20260617-audit43`, raw `mailto:vitawaterproof@gmail.com` fallback links, the `使用限制` field, expected security headers, and no Google Sites, LINE, or stale `audit42` content.

Metadata and public summary alignment deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://69b664bb.twvita.pages.dev`
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit44`.
- Aligned externally visible summary text with the current contact flow:
  - Contact page Open Graph and Twitter descriptions now mention photos, location, and usage constraints instead of only photos.
  - Contact page LocalBusiness JSON-LD description now includes the same practical inquiry guidance.
  - `manifest.webmanifest` description now reflects the current service and inquiry positioning instead of the older generic wording.
  - `llms.txt` now documents that Email links include a raw HTML `mailto:` fallback and prefilled inquiry fields.
- Recomputed JSON-LD CSP hashes and kept the Worker CSP free of `unsafe-inline`.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit44`, rejects stale `audit43`, checks the contact social descriptions, checks the manifest description, and verifies the updated `llms.txt` mailto-fallback summary.
  - `npm run smoke:live` now verifies `audit44`, the updated contact social description text, and `llms.txt` mailto-fallback wording.
- Local verification:
  - `npm run validate` passed.
  - Local Pages preview smoke passed using `SMOKE_BASE_URL=http://127.0.0.1:8788 npm run smoke:live`.
  - Local checks confirmed `/contact`, `/manifest.webmanifest`, and `/llms.txt` contain the updated summary markers and no stale `audit43` or old contact social description.
- Production verification:
  - `npm run smoke:live` passed on `https://twvita.com.tw`.
  - `SMOKE_BASE_URL=https://69b664bb.twvita.pages.dev npm run smoke:live` passed on the Pages deployment URL.
  - `https://twvita.com.tw/contact` returns HTTP 200 with `20260617-audit44`, updated Open Graph/Twitter descriptions, expected security headers, and no Google Sites, LINE, or stale `audit43` content.
  - `https://twvita.com.tw/manifest.webmanifest` and `https://twvita.com.tw/llms.txt` return the updated summary text.

Validation hardening added on 2026-06-17 Asia/Taipei:

- Deployment URL remains `https://69b664bb.twvita.pages.dev`.
- Deployment surface remains Cloudflare Pages Direct Upload; no public page assets changed in this validation-only update.
- Added mirrored-route drift protection to `scripts/validate-site.mjs`:
  - `public/about` must stay byte-identical to `public/about.html`.
  - `public/roof-waterproofing` must stay byte-identical to `public/roof-waterproofing.html`.
  - `public/tank-pool-waterproofing` must stay byte-identical to `public/tank-pool-waterproofing.html`.
  - `public/projects` must stay byte-identical to `public/projects.html`.
  - `public/contact` must stay byte-identical to `public/contact.html`.
- Reason:
  - Cloudflare Pages serves the extensionless routes, but the `.html` copies exist as canonical redirect targets and local static fallbacks. This check prevents future content, metadata, or JSON-LD drift between the mirrored files.
- Verification:
  - `npm run validate` passed.
  - `npm run smoke:live` passed on `https://twvita.com.tw`.
  - `SMOKE_BASE_URL=https://69b664bb.twvita.pages.dev npm run smoke:live` passed on the latest Pages deployment URL.

Redirect smoke coverage added on 2026-06-17 Asia/Taipei:

- Deployment URL remains `https://69b664bb.twvita.pages.dev`.
- Deployment surface remains Cloudflare Pages Direct Upload; no public page assets changed in this test-only update.
- Added 18 redirect assertions to `scripts/smoke-live.mjs`:
  - `.html` canonical redirects: `/index.html`, `/about.html`, `/roof-waterproofing.html`, `/tank-pool-waterproofing.html`, `/projects.html`, `/contact.html`.
  - Trailing-slash cleanup: `/about/`, `/contact/`.
  - Legacy/simple redirects from `_redirects`: `/home`, `/company`, `/roof`, `/tank`, `/pool`, `/works`, `/contact-us`, `/membranes`, `/membranes.html`, `/spec`.
- Noted current platform behavior in the smoke expectations:
  - Worker-managed `.html` and trailing-slash redirects return absolute `Location` values.
  - Cloudflare Pages `_redirects` legacy routes return relative `Location` values.
- Verification:
  - `npm run validate` passed.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, and the `www` apex redirect.
  - `SMOKE_BASE_URL=https://69b664bb.twvita.pages.dev npm run smoke:live` passed on the latest Pages deployment URL: 12 content URLs and 18 redirects.

Asset and cache smoke coverage added on 2026-06-17 Asia/Taipei:

- Deployment URL remains `https://69b664bb.twvita.pages.dev`.
- Deployment surface remains Cloudflare Pages Direct Upload; no public page assets changed in this test-only update.
- Added 7 asset assertions to `scripts/smoke-live.mjs`:
  - `/manifest.webmanifest`
  - `/assets/images/twvita-social-card-20260617.jpg`
  - `/assets/images/vita-icon.png?v=20260617-audit44`
  - `/apple-touch-icon.png?v=20260617-audit44`
  - `/favicon.ico`
  - `/assets/images/private-rooftop-repair-720.webp`
  - `/assets/images/site-roof-detail-720.webp`
- Each asset check verifies:
  - HTTP status 200.
  - Expected `Content-Type`.
  - Expected cache policy marker.
  - Minimum byte size to catch blank or truncated assets.
  - For the manifest, current description text and `20260617-audit44` icon references.
- Verification:
  - `npm run validate` passed.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `SMOKE_BASE_URL=https://69b664bb.twvita.pages.dev npm run smoke:live` passed on the latest Pages deployment URL: 12 content URLs, 18 redirects, and 7 assets.

SEO and accessibility structure validation added on 2026-06-17 Asia/Taipei:

- Deployment URL remains `https://69b664bb.twvita.pages.dev`.
- Deployment surface remains Cloudflare Pages Direct Upload; no public page assets changed in this test-only update.
- Added static HTML structure checks to `scripts/validate-site.mjs`:
  - Each HTML file must start with the expected `<!doctype html>` and `lang="zh-Hant"`.
  - Each HTML file must include the responsive viewport meta tag.
  - Each HTML file must have exactly one useful `<title>`.
  - Each HTML file must have exactly one useful meta description.
  - Each HTML file must have exactly one meaningful H1.
  - Each non-404 route must have the expected canonical URL.
  - Each non-404 route must mark exactly one matching navigation item with `aria-current="page"`.
  - The 404 page must not mark a navigation item as current and must not declare a canonical URL.
  - Any future `target="_blank"` links must include `rel="noopener"`.
- Reason:
  - These checks protect search-result quality, screen-reader/navigation clarity, and future edit safety. They catch structural regressions before deployment even when the page still visually looks acceptable.
- Verification:
  - `npm run validate` passed.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `SMOKE_BASE_URL=https://69b664bb.twvita.pages.dev npm run smoke:live` passed on the latest Pages deployment URL: 12 content URLs, 18 redirects, and 7 assets.

Search and redirect settings validation added on 2026-06-17 Asia/Taipei:

- Deployment URL remains `https://69b664bb.twvita.pages.dev`.
- Deployment surface remains Cloudflare Pages Direct Upload; no public page assets changed in this validation-only update.
- Added static search and redirect configuration checks to `scripts/validate-site.mjs`:
  - `sitemap.xml` must use the expected XML declaration and sitemap namespace.
  - `sitemap.xml` must list exactly the six canonical apex URLs: `/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact`.
  - Each sitemap URL must keep `lastmod` as `2026-06-17`, `changefreq` as `monthly`, and the expected priority.
  - `robots.txt` must allow crawlers and declare `Sitemap: https://twvita.com.tw/sitemap.xml`.
  - `_redirects` must contain the expected 10 legacy/simple rules and must not point to stale external targets.
- Reason:
  - These checks protect the post-migration domain setup by keeping Google Sites, removed pages, and old helper paths out of the canonical search surface.
- Verification:
  - `npm run validate` passed.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `SMOKE_BASE_URL=https://69b664bb.twvita.pages.dev npm run smoke:live` passed on the latest Pages deployment URL: 12 content URLs, 18 redirects, and 7 assets.

Homepage professional positioning refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://206ccab6.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit45`.
- Refined homepage positioning:
  - Page title and H1 now emphasize `台北市、新北市專業防水工程`.
  - Homepage lead now describes assessment by possible water path, substrate condition, drainage, construction limits, and maintainable waterproofing method.
  - Trust-panel labels now use more human business wording: large-project experience, private repair service, and pre-construction confirmation.
  - Proof strip now clearly separates public-project background from the current private small-job service direction.
  - Service-section heading changed to `先確認滲漏路徑，再安排防水做法。`
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit45`, rejects stale `audit44`, and requires the refined homepage heading.
  - `npm run smoke:live` now verifies the `audit45` homepage marker and rejects stale `audit44` on live pages.
- Local verification:
  - `npm run validate` passed.
- Production verification:
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `SMOKE_BASE_URL=https://206ccab6.twvita.pages.dev npm run smoke:live` passed on the latest Pages deployment URL: 12 content URLs, 18 redirects, and 7 assets.
  - Browser layout audit passed on desktop 1440px and mobile 390px for `/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact`: no horizontal overflow, no broken images, correct current navigation, and expected H1s.

Sitewide professional waterproof engineering alignment deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://bc2c7a4d.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit46`.
- Aligned sitewide wording with the current professional waterproof engineering positioning:
  - About page now states `從公共工程案場，走到日常防水工程。`
  - About-page service card changed from general repair wording to `民間小案服務`.
  - Roof service H1 now uses `屋頂、女兒牆與設備周邊防水工程`.
  - Tank/pool service H1 now uses `水塔、水箱與池體防水工程`.
  - Contact H1 and social descriptions now use `防水工程洽詢` and `專業防水工程洽詢`.
  - `manifest.webmanifest` and `llms.txt` now describe the site as serving professional waterproof engineering and repair needs.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit46`, rejects stale `audit45`, and checks the refreshed about, roof, tank/pool, contact, manifest, and llms positioning text.
  - `npm run smoke:live` now verifies `audit46`, the updated H1s, the professional contact summary, manifest text, and stale `audit45` rejection.
- Local verification:
  - `npm run validate` passed.
- Production verification:
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `SMOKE_BASE_URL=https://bc2c7a4d.twvita.pages.dev npm run smoke:live` passed on the latest Pages deployment URL: 12 content URLs, 18 redirects, and 7 assets.
  - Browser layout audit passed on desktop 1440px and mobile 390px for `/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact`: no horizontal overflow, no broken images, correct service-area header, correct current navigation, and expected H1s.

Search/social summary and inquiry subject refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://c2a13fc5.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit47`.
- Refined externally visible summary and inquiry text:
  - Homepage Open Graph/Twitter descriptions now use `防水工程` instead of the older `防水修繕` wording.
  - Roof page Open Graph/Twitter descriptions now use `設備周邊防水工程` instead of `設備周邊滲漏處理`.
  - Email subject changed from `臺灣耘達防水修繕評估` to `臺灣耘達防水工程評估`, including the no-JavaScript `mailto:` fallbacks and JavaScript-upgraded links.
  - `llms.txt` now describes water tank, reservoir, landscape pond, and small pool work as waterproof engineering.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit47`, rejects stale `audit46`, verifies the new Email subject, and rejects the old roof social-summary wording.
  - `npm run smoke:live` now verifies `audit47`, the new Email subject in `site.js`, and stale `audit46` rejection.
- Local verification:
  - `npm run validate` passed.
- Production verification:
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `SMOKE_BASE_URL=https://c2a13fc5.twvita.pages.dev npm run smoke:live` passed on the latest Pages deployment URL: 12 content URLs, 18 redirects, and 7 assets.
  - Browser layout audit passed on desktop 1440px and mobile 390px for `/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact`: no horizontal overflow, no broken images, correct current navigation, and expected H1s.

Explicit favicon and icon cache rules included in the 2026-06-17 Asia/Taipei deployment:

- Deployment URL: `https://ec792e0d.twvita.pages.dev`; the audit48 icon/cache work was folded into the audit49 production upload rather than released as a separate final deployment.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit48`.
- Added an explicit `/favicon.ico` link to all HTML route files.
- Added `_headers` cache rules for `/favicon.ico` and `/apple-touch-icon.png`.
- Updated validation scripts:
  - `npm run validate` required the explicit favicon link and root icon cache rules.
  - `npm run smoke:live` checked icon cache behavior and rejected stale `audit47` references.
- Local verification:
  - `npm run validate` passed.

Service-area and professional waterproof company copy deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://ec792e0d.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit49`.
- Updated all page headers to show `目前服務範圍：雙北地區`.
- Refined main positioning and contact paths:
  - Homepage title/H1 now position 臺灣耘達 as `雙北地區專業防水公司`.
  - Homepage service heading changed to `先確認滲漏路徑，再決定施工方式。`
  - About page now leads with `把公共工程的施工紀律，用在民間防水需求。`
  - Contact page now states `目前服務範圍為雙北地區` and asks for photos, location, dimensions, and usage constraints.
  - Visible telephone links remain `來電洽詢`; no visible `撥打` wording or phone-number CTA text remains.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit49`, rejects stale `audit48`, rejects the old `服務範圍：台北市、新北市` header, and requires the new professional-service-area wording.
  - `npm run smoke:live` now verifies the new homepage/about/contact copy, `目前服務範圍：雙北地區`, and the `來電洽詢` phone labels.
- Local verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
- Production verification:
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `SMOKE_BASE_URL=https://ec792e0d.twvita.pages.dev npm run smoke:live` passed on the latest Pages deployment URL: 12 content URLs, 18 redirects, and 7 assets.
  - Browser layout audit passed on desktop 1440px and mobile 390px for `/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact`: no horizontal overflow, no broken images, correct current navigation, header text `目前服務範圍：雙北地區`, and telephone labels shown as `來電洽詢`.

Public summary service-area wording unified on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://32dab585.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit50`.
- Refined outward-facing service-area copy:
  - Roof page meta/social/JSON-LD descriptions and visible page intro now use `雙北地區`.
  - Tank/pool page meta/social/JSON-LD descriptions and visible page intro now use `雙北地區`.
  - `manifest.webmanifest` and `llms.txt` now use `雙北地區` / `目前服務範圍為雙北地區`.
  - Contact checklist wording changed from `照片尺寸` to `照片與尺寸`.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit50`, rejects stale `audit49`, checks the refined roof/tank service-area copy, checks manifest/llms `雙北地區`, and requires the clearer contact checklist wording.
  - `npm run smoke:live` now verifies the refined roof/tank/contact/llms/manifest public summaries on both production and Pages deployment URLs.
- Local verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
- Production verification:
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `SMOKE_BASE_URL=https://32dab585.twvita.pages.dev npm run smoke:live` passed on the latest Pages deployment URL: 12 content URLs, 18 redirects, and 7 assets.
  - Browser layout audit passed on desktop 1440px and mobile 390px for `/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact`: no horizontal overflow, no broken images, correct current navigation, header text `目前服務範圍：雙北地區`, refined roof/tank service-area copy, and telephone labels shown as `來電洽詢`.

Mobile menu accessibility state improved on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://139a9cd5.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit51`.
- Improved mobile navigation behavior:
  - `site.js` now synchronizes menu `aria-expanded`, `aria-label`, and nav `aria-hidden`.
  - Closed mobile menu state now exposes `aria-hidden="true"` on the nav.
  - Open mobile menu state now exposes `aria-hidden="false"` and keeps the button label as `關閉選單`.
  - Desktop width keeps the nav readable to assistive technology.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit51`, rejects stale `audit50`, and requires `aria-hidden` synchronization logic in `site.js`.
  - `npm run smoke:live` now checks deployed `site.js` for the menu accessibility state logic.
- Local verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
- Production verification:
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `SMOKE_BASE_URL=https://139a9cd5.twvita.pages.dev npm run smoke:live` passed on the latest Pages deployment URL: 12 content URLs, 18 redirects, and 7 assets.
  - Browser mobile menu audit passed at 390px width: initial closed state `aria-expanded=false`, `aria-label=開啟選單`, `aria-hidden=true`; opened state `aria-expanded=true`, `aria-label=關閉選單`, `aria-hidden=false`; Escape returns to the closed state with no horizontal overflow.

Structured business data consistency improved on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://a9bf0149.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit52`.
- Improved JSON-LD consistency across homepage, company, service, projects, and contact pages:
  - WebSite nodes now consistently declare `inLanguage: zh-Hant` and publisher `https://twvita.com.tw/#business`.
  - LocalBusiness/provider data now consistently includes `foundingDate: 1990`, `contactPoint`, and professional `knowsAbout` topics including roof waterproofing, tank/pool waterproofing, PVC/TPO membranes, HDPE lining, and seam/detail work.
  - CSP JSON-LD hashes were regenerated for the updated structured data.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit52`, rejects stale `audit51`, and verifies business topics, founding date, zh-Hant language, and publisher linkage.
  - `npm run smoke:live` now checks production content for audit52, structured business topics, and no stale audit51 content.
- Local verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
- Production verification:
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `SMOKE_BASE_URL=https://a9bf0149.twvita.pages.dev npm run smoke:live` passed on the latest Pages deployment URL: 12 content URLs, 18 redirects, and 7 assets.
  - Chrome handoff was attempted for an additional browser check, but the Codex Chrome Extension connection was unavailable after retry. No DNS, TISNet, or form submission actions were performed.

Wildcard CORS header removed from public HTML on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://81f7c654.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit53`.
- Tightened response headers:
  - The Pages Worker now removes `Access-Control-Allow-Origin` from proxied public responses before applying the standard security headers.
  - This site has no cross-origin API, form endpoint, or public data feed requiring wildcard CORS.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit53`, rejects stale `audit52`, and requires the Worker to delete wildcard CORS.
  - `npm run smoke:live` now rejects stale `audit52` content and fails if public HTML responses expose `access-control-allow-origin`.
- Local verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
- Production verification:
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `SMOKE_BASE_URL=https://81f7c654.twvita.pages.dev npm run smoke:live` passed on the latest Pages deployment URL: 12 content URLs, 18 redirects, and 7 assets.
  - Direct header checks confirmed `https://twvita.com.tw/` returns HTTP 200 with CSP, HSTS, and cache-control, and without `access-control-allow-origin`.

Traditional Chinese hreflang alternates added on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://a7181f16.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit54`.
- Improved SEO language signals:
  - Added `rel="alternate" hreflang="zh-Hant-TW"` to every indexable canonical page.
  - Added `rel="alternate" hreflang="x-default"` to the same canonical URL on each indexable page.
  - Kept `404.html` as `noindex` and without alternate hreflang links.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit54`, rejects stale `audit53`, verifies alternate links match each page canonical, verifies `og:url` matches canonical, and prevents alternate links on non-indexable pages.
  - `npm run smoke:live` now checks the deployed homepage for `zh-Hant-TW`, `x-default`, audit54, and no stale audit53 content.
- Local verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
- Production verification:
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `SMOKE_BASE_URL=https://a7181f16.twvita.pages.dev npm run smoke:live` passed on the latest Pages deployment URL: 12 content URLs, 18 redirects, and 7 assets.
  - Direct HTML checks confirmed `https://twvita.com.tw/` contains canonical, `hreflang="zh-Hant-TW"`, `hreflang="x-default"`, `og:url`, and `20260617-audit54`; `https://twvita.com.tw/404.html` remains `noindex`.

Reduced-motion accessibility support added on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://c0035825.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit55`.
- Improved accessibility behavior:
  - Added `@media (prefers-reduced-motion: reduce)` to disable smooth scrolling for users requesting reduced motion.
  - Reduced transition and animation durations under the same preference.
  - Existing print styles still keep `scroll-behavior: auto`.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit55`, rejects stale `audit54`, and requires the reduced-motion CSS rules.
  - `npm run smoke:live` now checks deployed `styles.css` for the reduced-motion media query and transition-duration rule.
- Local verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
- Production verification:
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `SMOKE_BASE_URL=https://c0035825.twvita.pages.dev npm run smoke:live` passed on the latest Pages deployment URL: 12 content URLs, 18 redirects, and 7 assets.
  - Direct CSS check confirmed `https://twvita.com.tw/assets/styles.css?v=20260617-audit55` contains `prefers-reduced-motion`, `scroll-behavior: auto`, `transition-duration`, `animation-duration`, and `animation-iteration-count`.

Forced-colors accessibility support added on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://bc1ca0e7.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit56`.
- Improved high-contrast behavior:
  - Added `@media (forced-colors: active)` support.
  - Uses system colors such as `CanvasText`, `ButtonFace`, `ButtonText`, and `Highlight` for borders, buttons, current navigation, and focus outlines.
  - General visual design is unchanged outside forced-colors mode.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit56`, rejects stale `audit55`, and requires the forced-colors CSS rules.
  - `npm run smoke:live` now checks deployed `styles.css` for forced-colors and system-color rules.
- Local verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
- Production verification:
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `SMOKE_BASE_URL=https://bc1ca0e7.twvita.pages.dev npm run smoke:live` passed on the latest Pages deployment URL: 12 content URLs, 18 redirects, and 7 assets.
  - Direct CSS check confirmed `https://twvita.com.tw/assets/styles.css?v=20260617-audit56` contains `forced-colors`, `CanvasText`, `ButtonFace`, `ButtonText`, and `Highlight`.

Traditional Chinese content-language headers added on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://a266703c.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit57`.
- Improved HTTP language signals:
  - The Pages Worker now sets `Content-Language: zh-Hant-TW` for HTML, plain text, manifest, and XML public text responses.
  - Static CSS/JS assets are not forced to carry content-language.
  - This aligns HTTP headers with the existing `lang="zh-Hant"` and `hreflang="zh-Hant-TW"` markup.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit57`, rejects stale `audit56`, and requires the Worker to set `Content-Language`.
  - `npm run smoke:live` now verifies `content-language: zh-Hant-TW` on public content responses while exempting CSS/JS assets.
- Local verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
- Production verification:
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `SMOKE_BASE_URL=https://a266703c.twvita.pages.dev npm run smoke:live` passed on the latest Pages deployment URL: 12 content URLs, 18 redirects, and 7 assets.
  - Direct header checks confirmed `https://twvita.com.tw/`, `/contact`, and `/llms.txt` return `Content-Language: zh-Hant-TW`; `styles.css` keeps its immutable asset cache and no content-language header.

Homepage copy refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://7b1ade2f.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit58`.
- Improved homepage copy quality:
  - Replaced the repeated pair of headings `先確認滲漏路徑，再決定施工方式。` and `先釐清滲漏原因，再決定施作方式。`.
  - New service heading: `先看現場條件，再安排合適工法。`
  - New engineering detail heading: `節點處理清楚，後續維護才有依據。`
  - New CTA heading: `把現場條件說清楚，評估會更快。`
  - The homepage keeps the professional waterproof company positioning while reducing template-like repetition.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit58`, rejects stale `audit57`, and fails if the removed homepage phrases return.
  - `npm run smoke:live` now verifies the new homepage headings on the deployed site.
- Local verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
- Production verification:
  - `SMOKE_BASE_URL=https://7b1ade2f.twvita.pages.dev npm run smoke:live` passed on the latest Pages deployment URL: 12 content URLs, 18 redirects, and 7 assets.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - Direct homepage check confirmed `https://twvita.com.tw/` contains `20260617-audit58`, `先看現場條件，再安排合適工法。`, `節點處理清楚，後續維護才有依據。`, and `把現場條件說清楚，評估會更快。`; the removed homepage phrases and stale `audit57` marker were not present.

Footer phone display and homepage image loading refined on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://45732eb1.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit59`.
- Contact display changes:
  - Footer company information now displays `TEL：(02)2812-0021` directly on every page.
  - Contact page company information now displays `(02)2812-0021` directly.
  - Primary CTA buttons and the sticky quick-contact bar still use `來電洽詢` so button labels remain short.
  - `llms.txt` now lists `電話：(02)2812-0021`.
- Visual reliability change:
  - Homepage service-section images now use normal loading instead of lazy loading to avoid blank image frames during mobile full-page rendering.
- Updated validation scripts:
  - `npm run validate` now expects footer and contact information to show the phone number directly, while keeping `來電洽詢` available for CTA buttons.
  - `npm run smoke:live` now checks the deployed homepage, contact page, and `llms.txt` for `(02)2812-0021`.
- Local verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
- Production verification:
  - `SMOKE_BASE_URL=https://45732eb1.twvita.pages.dev npm run smoke:live` passed on the latest Pages deployment URL: 12 content URLs, 18 redirects, and 7 assets.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - Direct checks confirmed `https://twvita.com.tw/`, `/contact`, and `/llms.txt` expose `(02)2812-0021` in the expected information areas.
  - Mobile homepage browser check at 390px found no horizontal overflow, no broken images, footer text `TEL：(02)2812-0021`, and CTA labels still showing `來電洽詢` / `Email 洽詢`.

Structured service catalog added on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://11ff630e.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit60`.
- SEO / structured data improvement:
  - Added `hasOfferCatalog` to the LocalBusiness JSON-LD.
  - The catalog lists the current practical service areas without adding price, warranty, opening-hour, or unsupported claims:
    - `屋頂與設備周邊防水工程`
    - `水塔、水箱與池體防水工程`
  - Each catalog item keeps `areaServed` as `台北市` and `新北市`, matching the visible `目前服務範圍：雙北地區`.
  - Recomputed the Pages Worker CSP hashes for the updated JSON-LD scripts.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit60`, rejects stale `audit59`, and checks the LocalBusiness service catalog names and 雙北 service area.
  - `npm run smoke:live` now checks the deployed homepage for `hasOfferCatalog` and both service names.
- Local verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
- Production verification:
  - `SMOKE_BASE_URL=https://11ff630e.twvita.pages.dev npm run smoke:live` passed on the latest Pages deployment URL: 12 content URLs, 18 redirects, and 7 assets.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - Direct homepage check confirmed `https://twvita.com.tw/` contains `20260617-audit60`, `hasOfferCatalog`, `OfferCatalog`, `屋頂與設備周邊防水工程`, and `水塔、水箱與池體防水工程`.

Manifest discovery metadata refined on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://7b80bcaa.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit61`.
- Manifest improvements:
  - Added stable manifest `id`: `https://twvita.com.tw/`.
  - Added conservative categories: `business`, `utilities`.
  - Added manifest shortcuts for direct navigation:
    - `/contact`
    - `/roof-waterproofing`
    - `/tank-pool-waterproofing`
  - Shortcut icons use the existing generated VITA icon and current cache-bust version.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit61`, rejects stale `audit60`, and checks manifest `id`, categories, and shortcuts.
  - `npm run smoke:live` now checks the deployed manifest for the same fields.
- Local verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - Local manifest JSON parse confirmed the expected `id`, categories, shortcut URLs, and icon URLs.
- Production verification:
  - `SMOKE_BASE_URL=https://7b80bcaa.twvita.pages.dev npm run smoke:live` passed on the latest Pages deployment URL: 12 content URLs, 18 redirects, and 7 assets.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - Direct production manifest check confirmed `id=https://twvita.com.tw/`, categories `business/utilities`, shortcuts `/contact`, `/roof-waterproofing`, `/tank-pool-waterproofing`, and `audit61` icon URLs.

Contact phone display and mobile footer clearance refined on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://69733562.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit64`.
- Contact display changes:
  - The contact page company-information phone button now displays `(02)2812-0021` directly instead of `來電洽詢`.
  - Footer company information continues to display `TEL：(02)2812-0021` directly on every page.
  - General CTA and sticky quick-contact labels remain short, using `來電洽詢` and `Email 洽詢`.
- Mobile layout change:
  - Added a cache-fresh stylesheet file: `/assets/styles-20260617-audit64.css`.
  - Increased the small-screen footer bottom clearance so the fixed quick-contact bar does not cover footer company information.
- Updated validation scripts:
  - `npm run validate` now expects `20260617-audit64`, the cache-fresh stylesheet, the direct phone-number button on `/contact`, and the larger mobile footer clearance.
  - `npm run smoke:live` now checks the deployed audit64 stylesheet and content.
- Local verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
- Production verification:
  - `SMOKE_BASE_URL=https://69733562.twvita.pages.dev npm run smoke:live` passed on the latest Pages deployment URL: 12 content URLs, 18 redirects, and 7 assets.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - Mobile browser check on `https://twvita.com.tw/contact` at 390px found `20260617-audit64`, no horizontal overflow, visible sticky contact, the contact phone button text `(02)2812-0021`, and `124px` clearance between footer company information and the fixed quick-contact bar.

Bottom phone labels aligned on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://43fd65d0.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit65`.
- Display change:
  - The mobile bottom quick-contact phone button now displays `(02)2812-0021` directly.
  - The contact page phone action and footer company information also display `(02)2812-0021` directly.
  - Other service-page CTA sections may still use `來電洽詢` where the label is a general action rather than the bottom/contact information block.
- Updated validation scripts:
  - `npm run validate` now checks that every page's sticky phone contact displays `(02)2812-0021`.
  - `npm run smoke:live` now expects `20260617-audit65` and the cache-fresh audit65 stylesheet.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `SMOKE_BASE_URL=https://43fd65d0.twvita.pages.dev npm run smoke:live` passed: 12 content URLs, 18 redirects, and 7 assets.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - Mobile browser check on `https://twvita.com.tw/contact` at 390px found `20260617-audit65`, no horizontal overflow, sticky links `(02)2812-0021` / `Email 洽詢`, contact phone button `(02)2812-0021`, and `121px` footer clearance above the fixed quick-contact bar.

Inquiry copy and deploy smoke coverage refined on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://b67ebc84.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit66`.
- Copy refinements:
  - About CTA now asks visitors to describe the site type, limits, and rough scope instead of repeating a generic photo request.
  - Roof CTA now focuses on water stains, drains, parapets, equipment bases, and likely water-path extension.
  - Projects CTA now asks for leak timing and prior repair method, matching the page's proof-oriented context.
  - Contact intro and notice now describe how to organize inquiry details without repeating the same "provide photos" wording.
- Validation improvements:
  - `npm run validate` now rejects stale `audit65` and repeated CTA phrases such as `可先提供照片與滲漏情形`.
  - `npm run smoke:live` now verifies the refined page-specific inquiry copy and checks every deployed HTML page for direct phone display in the sticky contact and footer.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `SMOKE_BASE_URL=https://b67ebc84.twvita.pages.dev npm run smoke:live` passed: 12 content URLs, 18 redirects, and 7 assets.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - Browser checks on production at 320px, 390px, and 1280px across all main routes plus 404 found `20260617-audit66`, no horizontal overflow, no broken images, and no sticky contact text overflow.

Contact metadata and machine-readable summaries aligned on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://5d3d7a6e.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit67`.
- Metadata refinements:
  - Contact page meta description, Open Graph description, Twitter description, and JSON-LD descriptions now match the refined inquiry guidance.
  - Manifest description now uses the same guidance: `洽詢時請說明現況、位置與可施工限制`.
  - `llms.txt` now frames photos and dimensions as supplemental information rather than the primary instruction.
  - Recomputed the Pages Worker CSP hashes for the updated JSON-LD scripts.
- Validation improvements:
  - `npm run validate` now expects `20260617-audit67`, rejects stale `audit66`, and checks the new contact social descriptions and manifest wording.
  - `npm run smoke:live` now checks the deployed contact social-copy marker and manifest wording.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `SMOKE_BASE_URL=https://5d3d7a6e.twvita.pages.dev npm run smoke:live` passed: 12 content URLs, 18 redirects, and 7 assets.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - Direct production checks confirmed `/contact`, `/manifest.webmanifest`, and `/llms.txt` no longer contain the old `可先提供照片、位置、尺寸與使用限制` summary.
  - Browser checks on production at 320px, 390px, and 1280px across all main routes plus 404 found `20260617-audit67`, no horizontal overflow, no broken images, no sticky contact text overflow, and the contact page Open Graph description `雙北地區防水工程洽詢，請先說明建築類型、滲漏位置、現況與可施工限制。`.

Touch target sizing refined on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://8862bd4f.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit68`.
- Layout refinements:
  - Mobile menu button increased to `46px` square sizing.
  - Card, contact, and footer text links now keep a `44px` minimum touch height.
- Validation improvements:
  - `npm run validate` expects `20260617-audit68`, rejects stale `audit67`, and checks the new touch-target CSS snippets.
  - `npm run smoke:live` checks the audit68 stylesheet and rejects stale content.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `SMOKE_BASE_URL=https://8862bd4f.twvita.pages.dev npm run smoke:live` passed: 12 content URLs, 18 redirects, and 7 assets.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - Browser checks on production at 320px, 390px, and 1280px across all main routes plus 404 found `20260617-audit68`, no horizontal overflow, no broken images, and no sticky link text overflow.

Bottom inquiry phone display aligned on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://18267b9b.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit69`.
- Display changes:
  - Bottom inquiry phone buttons on the homepage, company, roof, tank/pool, and projects pages now display `(02)2812-0021` directly instead of `來電洽詢`.
  - Contact page company information, contact action, sticky quick-contact bar, and footer company information continue to display `(02)2812-0021` directly.
  - Email inquiry buttons remain unchanged.
- Validation improvements:
  - `npm run validate` now expects `20260617-audit69`, rejects stale `audit68`, and requires phone-number display in bottom inquiry bands.
  - `npm run smoke:live` now checks deployed pages for the direct phone-number button when a bottom inquiry band is present.
- Local verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
- Production verification:
  - `SMOKE_BASE_URL=https://18267b9b.twvita.pages.dev npm run smoke:live` passed: 12 content URLs, 18 redirects, and 7 assets.
  - `npm run smoke:live` passed on `https://twvita.com.tw` after edge propagation settled: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - Direct production content checks confirmed `/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact` contain `20260617-audit69`, no `20260617-audit68`, direct phone-number bottom buttons, direct sticky phone display, and direct footer phone display.

Obsolete stylesheet cleanup deployed on 2026-06-17 Asia/Taipei:

- Deployment URLs:
  - Initial cleanup deploy: `https://fdd1ce30.twvita.pages.dev`.
  - Worker interception deploy: `https://1e361002.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit70`.
- Public asset cleanup:
  - Removed obsolete local stylesheet files `styles-20260617-audit63.css` through `styles-20260617-audit69.css` from `public/assets`.
  - Kept only `/assets/styles-20260617-audit70.css` and `/assets/styles.css` in the current public directory.
  - Added a Pages Worker guard that returns uncached 404 responses for obsolete `styles-20260617-audit63.css` through `styles-20260617-audit69.css` paths when they reach the current deployment.
- Validation improvements:
  - `npm run validate` now expects `20260617-audit70`, rejects stale `audit69`, and verifies only the latest versioned stylesheet exists locally.
  - `npm run smoke:live` checks current production content and assets against `audit70`.
  - Pages preview smoke also verifies the 7 removed stylesheet paths return 404.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `SMOKE_BASE_URL=https://1e361002.twvita.pages.dev npm run smoke:live` passed: 12 content URLs, 18 redirects, 7 assets, and 7 removed assets.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - Browser snapshot on `https://twvita.com.tw/contact` at 390px confirmed the contact page remains readable, shows `目前服務範圍：雙北地區`, exposes `(02)2812-0021` in company info, action button, sticky contact, and footer, and keeps Email links active.
- Cache note:
  - Direct Cloudflare API cache purge for the 7 obsolete CSS URLs failed with HTTP 401 using the current Wrangler OAuth token, even though zone lookup succeeded.
  - The latest Pages preview proves the current deployment no longer contains those files. The production apex may still return HTTP 200 for old immutable CSS URLs while Cloudflare edge cache entries remain warm, but those old CSS files are no longer referenced by live HTML and are not part of the current deployment directory.

404 robots directive alignment deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://4b0b0923.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit71`.
- SEO / crawler consistency:
  - Updated `404.html` meta robots from `noindex` to `noindex, nofollow`.
  - Kept the Pages Worker 404 `X-Robots-Tag` header as `noindex, nofollow`.
  - Extended obsolete stylesheet interception to include `styles-20260617-audit70.css`.
- Validation improvements:
  - `npm run validate` now expects `20260617-audit71`, rejects stale `audit70`, requires only `styles-20260617-audit71.css` as the current versioned stylesheet, and checks the 404 meta robots directive.
  - `npm run smoke:live` now checks audit71 content and keeps preview removed-asset verification active.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `SMOKE_BASE_URL=https://4b0b0923.twvita.pages.dev npm run smoke:live` passed: 12 content URLs, 18 redirects, 7 assets, and 7 removed assets.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - Direct checks confirmed both `https://4b0b0923.twvita.pages.dev/not-a-real-page` and `https://twvita.com.tw/not-a-real-page` return HTTP 404, `X-Robots-Tag: noindex, nofollow`, `20260617-audit71`, and `<meta name="robots" content="noindex, nofollow">`.

Direct phone display and stylesheet guard deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://853b3b5b.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit72`.
- Contact display:
  - Footer company information, sticky quick-contact, bottom inquiry bands, and the contact page action area display `(02)2812-0021` directly.
  - Public pages no longer contain the CTA label `來電洽詢`.
- Maintenance improvements:
  - Kept only `/assets/styles-20260617-audit72.css` and `/assets/styles.css` in the current public asset directory.
  - Extended obsolete stylesheet interception to include `styles-20260617-audit71.css`.
  - Added a validation guard against adjacent duplicate CSS selectors in grouped rules.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `SMOKE_BASE_URL=https://853b3b5b.twvita.pages.dev npm run smoke:live` passed: 12 content URLs, 18 redirects, 7 assets, and 9 removed assets.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - Direct production checks for `/` and `/contact` returned HTTP 200, contained `(02)2812-0021`, did not contain `來電洽詢`, and contained `20260617-audit72`.

Homepage image loading refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://06b67e4b.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit73`.
- Performance refinement:
  - Kept the homepage hero image as high-priority because it is part of the first viewport.
  - Changed below-fold homepage content images to `loading="lazy"` and `fetchpriority="low"`.
  - Kept WebP `srcset` sources with JPG fallbacks for compatibility.
- Validation improvements:
  - `npm run validate` now expects `20260617-audit73`, rejects stale `audit72` and `audit71`, and verifies below-fold homepage images use lazy loading with low priority.
  - Pages Worker obsolete stylesheet interception now covers `styles-20260617-audit63.css` through `styles-20260617-audit72.css`.
  - Preview smoke verifies 10 removed stylesheet paths return 404.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `SMOKE_BASE_URL=https://06b67e4b.twvita.pages.dev npm run smoke:live` passed: 12 content URLs, 18 redirects, 7 assets, and 10 removed assets.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - Direct production checks for `/`, `/contact`, and `/not-a-real-page` returned expected status codes, contained `20260617-audit73`, did not contain `20260617-audit72`, displayed `(02)2812-0021`, and did not contain `來電洽詢`.
  - Browser check on production at 390px confirmed no horizontal overflow, mobile nav hidden with menu button visible, direct phone display, and no `來電洽詢`.
  - After scrolling the mobile homepage, content images loaded the `720.webp` variants and completed successfully.

Structured navigation data deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://7cb029df.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit74`.
- SEO / structured data refinement:
  - Added a shared `SiteNavigationElement` JSON-LD node to every indexable page.
  - Connected each `WebSite` JSON-LD node to `https://twvita.com.tw/#site-navigation`.
  - The structured navigation lists the six canonical public pages: homepage, company profile, roof waterproofing, tank/pool waterproofing, projects, and contact.
- Security / validation updates:
  - Recomputed CSP hashes for the updated JSON-LD blocks.
  - `npm run validate` now requires the site navigation JSON-LD node and the six canonical navigation URLs on every indexable page.
  - Pages Worker obsolete stylesheet interception now covers `styles-20260617-audit63.css` through `styles-20260617-audit73.css`.
  - Preview smoke verifies 11 removed stylesheet paths return 404.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `SMOKE_BASE_URL=https://7cb029df.twvita.pages.dev npm run smoke:live` passed: 12 content URLs, 18 redirects, 7 assets, and 11 removed assets.
  - Preview direct check confirmed `SiteNavigationElement`, 6 navigation URLs, `20260617-audit74`, and matching CSP hash.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - Direct production checks for `/`, `/about`, `/contact`, and `/not-a-real-page` returned expected status codes, contained `20260617-audit74`, did not contain `20260617-audit73`, displayed `(02)2812-0021`, and did not contain `來電洽詢`.
  - Browser check on production at 390px confirmed no horizontal overflow, mobile nav hidden with menu button visible, direct phone display, no `來電洽詢`, and the structured navigation JSON-LD present in the document.

Mobile navigation accessibility refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://a0e62fd3.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit75`.
- Accessibility refinement:
  - Mobile navigation now synchronizes `inert` with `aria-hidden`.
  - Hidden mobile navigation is no longer focusable or interactive; opening the menu removes `inert`, and closing by Escape or outside click restores it.
- Validation improvements:
  - `npm run validate` now requires mobile navigation to set and remove `inert`.
  - `npm run smoke:live` verifies the deployed `site.js` includes the `inert` synchronization logic.
  - Pages Worker obsolete stylesheet interception now covers `styles-20260617-audit63.css` through `styles-20260617-audit74.css`.
  - Preview smoke verifies 12 removed stylesheet paths return 404.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `SMOKE_BASE_URL=https://a0e62fd3.twvita.pages.dev npm run smoke:live` passed: 12 content URLs, 18 redirects, 7 assets, and 12 removed assets.
  - Preview direct check confirmed `20260617-audit75`, `setAttribute("inert")`, `removeAttribute("inert")`, and no `來電洽詢`.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - Direct production checks for `/`, `/contact`, and `/not-a-real-page` returned expected status codes, contained `20260617-audit75`, did not contain `20260617-audit74`, displayed `(02)2812-0021`, and did not contain `來電洽詢`.
  - Browser check on production at 390px confirmed initial hidden nav has `aria-hidden="true"` and `inert`, opening removes both hidden state and `inert`, Escape restores them, and no horizontal overflow appears.

Sticky contact landmark refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://95bf1e60.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit76`.
- Accessibility refinement:
  - Changed the floating quick-contact block from a generic `div` to `<nav class="sticky-contact" aria-label="快速聯絡">`.
  - This resolves the automated axe `region` landmark violation for the sticky contact area.
- Validation improvements:
  - `npm run validate` now rejects `<div class="sticky-contact">` and requires the sticky contact `nav` to close before the footer.
  - `npm run smoke:live` now checks the sticky contact landmark markup.
  - Pages Worker obsolete stylesheet interception now covers `styles-20260617-audit63.css` through `styles-20260617-audit75.css`.
  - Preview smoke verifies 13 removed stylesheet paths return 404.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - Local axe scan on `index.html` and `contact.html` passed with 0 violations.
  - `SMOKE_BASE_URL=https://95bf1e60.twvita.pages.dev npm run smoke:live` passed: 12 content URLs, 18 redirects, 7 assets, and 13 removed assets.
  - Preview axe scan on `/` and `/contact` passed with 0 violations.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - Production axe scan on `/` and `/contact` passed with 0 violations.
  - Direct production checks for `/`, `/contact`, and `/not-a-real-page` returned expected status codes, contained `20260617-audit76`, did not contain `20260617-audit75`, used sticky contact `nav`, did not contain sticky contact `div`, displayed `(02)2812-0021`, and did not contain `來電洽詢`.
  - Browser check on production at 390px confirmed the sticky contact element is a `NAV`, remains visible, has `aria-label="快速聯絡"`, and no horizontal overflow appears.

Phone-label placement refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://1f9f52a4.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit77`.
- Contact wording refinement:
  - Footer company information continues to display `TEL：(02)2812-0021` directly on every page.
  - The contact page company-information phone row and secondary phone button display `(02)2812-0021` directly.
  - Floating quick-contact and non-footer inquiry CTA buttons use the short label `來電洽詢`.
- Validation improvements:
  - `npm run validate` now requires footer and contact-page company phone areas to show the number directly.
  - `npm run validate` and `npm run smoke:live` now require sticky contact and general inquiry CTA phone buttons to use `來電洽詢`.
  - Pages Worker obsolete stylesheet interception now covers `styles-20260617-audit63.css` through `styles-20260617-audit76.css`.
  - Preview smoke verifies 14 removed stylesheet paths return 404.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `SMOKE_BASE_URL=https://1f9f52a4.twvita.pages.dev npm run smoke:live` passed: 12 content URLs, 18 redirects, 7 assets, and 14 removed assets.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `npm run a11y:live` passed on the six production pages with 0 automated axe violations.
  - Direct production phone/CTA placement check passed for `/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, `/contact`, and `/not-a-real-page`.

Live layout verification tooling added on 2026-06-17 Asia/Taipei:

- Deployment status: no Cloudflare deploy required; only local validation tooling and documentation changed.
- Added `npm run layout:live`:
  - Uses Playwright Chromium against `https://twvita.com.tw` by default.
  - Supports `LAYOUT_BASE_URL` for Pages preview checks.
  - Checks six main pages at 390px mobile and 1440px desktop widths.
  - Verifies no horizontal overflow, no broken images, visible sticky contact navigation, correct `來電洽詢` / `Email 洽詢` sticky labels, direct footer phone display, contact-page direct phone action, and footer phone clearance above the sticky contact.
- Tooling dependencies:
  - Added Playwright as a development dependency.
  - Installed local Playwright Chromium browser binary for repeatable checks on this machine.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `npm run a11y:live` passed on the six production pages with 0 automated axe violations.
  - `npm run layout:live` passed on six production pages across mobile and desktop viewports.

Representative image loading refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://5e1269f4.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit78`.
- Performance / perceived loading refinement:
  - Added high-priority responsive image preload on the company, roof waterproofing, tank/pool waterproofing, and projects pages.
  - Changed each of those pages' first representative image from lazy/low priority to eager high-priority loading.
  - Kept lower-page homepage content images lazy-loaded with low fetch priority.
- Validation improvements:
  - `npm run validate` now requires the non-homepage representative images to have preload links and high fetch priority.
  - Pages Worker obsolete stylesheet interception now covers `styles-20260617-audit63.css` through `styles-20260617-audit77.css`.
  - Preview smoke verifies 15 removed stylesheet paths return 404.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `SMOKE_BASE_URL=https://5e1269f4.twvita.pages.dev npm run smoke:live` passed: 12 content URLs, 18 redirects, 7 assets, and 15 removed assets.
  - `LAYOUT_BASE_URL=https://5e1269f4.twvita.pages.dev npm run layout:live` passed on six preview pages across mobile and desktop viewports.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `npm run a11y:live` passed on the six production pages with 0 automated axe violations.
  - `npm run layout:live` passed on six production pages across mobile and desktop viewports.
  - Direct production checks confirmed `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, and `/projects` contain `20260617-audit78`, do not contain `20260617-audit77`, include the expected preload links, and use high-priority non-lazy first representative images.

LocalBusiness brand image structured data deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://d395dc50.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit79`.
- Structured data refinement:
  - Added a canonical VITA logo `ImageObject` to every `LocalBusiness` JSON-LD node and service-page provider object.
  - Standardized the LocalBusiness `image` field to the canonical brand social card: `https://twvita.com.tw/assets/images/twvita-social-card-20260617.jpg`.
  - Recomputed the Worker CSP hashes for the updated inline JSON-LD blocks.
- Validation improvements:
  - `npm run validate` now requires LocalBusiness JSON-LD to expose the VITA logo image object and canonical brand social image.
  - Pages Worker obsolete stylesheet interception now covers `styles-20260617-audit63.css` through `styles-20260617-audit78.css`.
  - Preview smoke verifies 16 removed stylesheet paths return 404.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - Local direct JSON-LD check confirmed every public page's LocalBusiness/provider object has the expected logo and image fields.
  - `SMOKE_BASE_URL=https://d395dc50.twvita.pages.dev npm run smoke:live` passed after edge propagation settled: 12 content URLs, 18 redirects, 7 assets, and 16 removed assets.
  - `LAYOUT_BASE_URL=https://d395dc50.twvita.pages.dev npm run layout:live` passed on six preview pages across mobile and desktop viewports.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `npm run a11y:live` passed on the six production pages with 0 automated axe violations.
  - `npm run layout:live` passed on six production pages across mobile and desktop viewports.
  - Direct production checks confirmed `/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact` contain `20260617-audit79`, do not contain `20260617-audit78`, and expose the expected LocalBusiness logo and brand image fields.

FAQ structured data consistency refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://4b0427b6.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit80`.
- Structured data refinement:
  - Added `inLanguage: zh-Hant-TW` to the service-page `FAQPage`, `Question`, and `Answer` JSON-LD nodes.
  - Aligned the roof waterproofing FAQ third answer so the visible page text and JSON-LD answer text match exactly.
  - Recomputed the Pages Worker CSP hashes for the updated inline JSON-LD.
- Validation improvements:
  - `npm run validate` now compares visible `<details>` FAQ questions and answers against `FAQPage` JSON-LD on service pages.
  - `npm run validate` now requires service-page FAQ structured data to declare `zh-Hant-TW`.
  - Pages Worker obsolete stylesheet interception now covers `styles-20260617-audit63.css` through `styles-20260617-audit79.css`.
  - Preview smoke verifies 17 removed stylesheet paths return 404.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `SMOKE_BASE_URL=https://4b0427b6.twvita.pages.dev npm run smoke:live` passed: 12 content URLs, 18 redirects, 7 assets, and 17 removed assets.
  - `LAYOUT_BASE_URL=https://4b0427b6.twvita.pages.dev npm run layout:live` passed on six preview pages across mobile and desktop viewports.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `npm run a11y:live` passed on the six production pages with 0 automated axe violations.
  - `npm run layout:live` passed on six production pages across mobile and desktop viewports.
  - Direct production checks confirmed `/roof-waterproofing` and `/tank-pool-waterproofing` have matching visible FAQ text, `FAQPage` JSON-LD, and `zh-Hant-TW` FAQ language markers.

Projects page experience ItemList structured data deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://e4917c31.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit81`.
- Structured data refinement:
  - Added a `zh-Hant-TW` `ItemList` to the projects page for the five visible representative experience categories.
  - Linked the `CollectionPage.mainEntity` to `https://twvita.com.tw/projects#project-categories`.
  - Kept the visible projects page layout unchanged while improving machine-readable evidence of past project scope.
  - Recomputed the Pages Worker CSP hashes for the updated inline JSON-LD.
- Validation improvements:
  - `npm run validate` now requires the projects page `CollectionPage` to link to the project category `ItemList`.
  - `npm run validate` now compares the five visible project category headings and descriptions against the `ItemList` entries.
  - Pages Worker obsolete stylesheet interception now covers `styles-20260617-audit63.css` through `styles-20260617-audit80.css`.
  - Preview smoke verifies 18 removed stylesheet paths return 404.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `SMOKE_BASE_URL=https://e4917c31.twvita.pages.dev npm run smoke:live` passed: 12 content URLs, 18 redirects, 7 assets, and 18 removed assets.
  - `LAYOUT_BASE_URL=https://e4917c31.twvita.pages.dev npm run layout:live` passed on six preview pages across mobile and desktop viewports.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `npm run a11y:live` passed on the six production pages with 0 automated axe violations.
  - `npm run layout:live` passed on six production pages across mobile and desktop viewports.
  - Direct production checks confirmed `/projects` contains `20260617-audit81`, `CollectionPage.mainEntity` points to the project category `ItemList`, and the ItemList contains five `zh-Hant-TW` entries: 屋頂與屋面防水, 水塔、水箱與蓄水池, 隧道與地下工程, 捷運與交通建設, 衛生掩埋場與環保設施.

JSON-LD language consistency refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://f24ff8a8.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit82`.
- Structured data refinement:
  - Standardized top-level public JSON-LD nodes to `inLanguage: zh-Hant-TW` across the six main pages.
  - Updated `WebSite`, `SiteNavigationElement`, page nodes, `LocalBusiness`, service providers, service catalog items, `BreadcrumbList`, `FAQPage`, and projects `ItemList` language markers.
  - Recomputed the Pages Worker CSP hashes for the updated inline JSON-LD.
- Validation improvements:
  - `npm run validate` now requires public JSON-LD top-level nodes to declare `zh-Hant-TW`.
  - `npm run validate` now requires LocalBusiness contact language and service catalog entries to use `zh-Hant-TW`.
  - Pages Worker obsolete stylesheet interception now covers `styles-20260617-audit63.css` through `styles-20260617-audit81.css`.
  - Preview smoke verifies 19 removed stylesheet paths return 404.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - Direct local JSON-LD scan confirmed the six main pages' top-level structured data nodes declare `zh-Hant-TW`.
  - `SMOKE_BASE_URL=https://f24ff8a8.twvita.pages.dev npm run smoke:live` passed: 12 content URLs, 18 redirects, 7 assets, and 19 removed assets.
  - `LAYOUT_BASE_URL=https://f24ff8a8.twvita.pages.dev npm run layout:live` passed on six preview pages across mobile and desktop viewports.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `npm run a11y:live` passed on the six production pages with 0 automated axe violations.
  - `npm run layout:live` passed on six production pages across mobile and desktop viewports.
  - Direct production checks confirmed `/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact` contain `20260617-audit82` and all targeted top-level JSON-LD nodes declare `zh-Hant-TW`.

Social card and mobile metadata refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://d453abd1.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit83`.
- Metadata refinement:
  - Added `format-detection=telephone=no` to all HTML route files so mobile browsers do not auto-link incidental number-like text.
  - Added `og:image:secure_url` and `og:image:type=image/jpeg` to the six indexable pages for more complete social card metadata.
  - Kept `404.html` noindex and without social-card image metadata.
- Validation improvements:
  - `npm run validate` now requires the mobile format-detection meta on every HTML route file.
  - `npm run validate` now requires indexable pages to expose Open Graph image `secure_url` and JPEG type metadata.
  - Pages Worker obsolete stylesheet interception now covers `styles-20260617-audit63.css` through `styles-20260617-audit82.css`.
  - Preview smoke verifies 20 removed stylesheet paths return 404.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - Direct local head scan confirmed the six indexable pages include `format-detection`, `og:image:secure_url`, and `og:image:type`; `404.html` includes only the format-detection addition.
  - `SMOKE_BASE_URL=https://d453abd1.twvita.pages.dev npm run smoke:live` passed: 12 content URLs, 18 redirects, 7 assets, and 20 removed assets.
  - `LAYOUT_BASE_URL=https://d453abd1.twvita.pages.dev npm run layout:live` passed on six preview pages across mobile and desktop viewports.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 12 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `npm run a11y:live` passed on the six production pages with 0 automated axe violations.
  - `npm run layout:live` passed on six production pages across mobile and desktop viewports.
  - Direct production checks confirmed `/`, `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact` contain `20260617-audit83`, `format-detection`, `og:image:secure_url`, and `og:image:type`; `/not-a-real-page` contains `format-detection` but no social-card image metadata.

Direct 404 route status hardening deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://f60205d6.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit84`.
- 404 handling refinement:
  - Pages Worker now handles `/404` and `/404.html` directly.
  - Both direct 404 routes return HTTP 404 instead of `/404` returning 200 or `/404.html` returning a redirect.
  - Direct 404 responses now consistently send `X-Robots-Tag: noindex, nofollow` and `Cache-Control: no-store`.
- Validation improvements:
  - `npm run validate` now requires the Worker-level direct 404 handling branch.
  - `npm run smoke:live` now verifies `/404`, `/404.html`, and unknown routes for 404/noindex behavior.
  - Pages Worker obsolete stylesheet interception now covers `styles-20260617-audit63.css` through `styles-20260617-audit83.css`.
  - Preview smoke verifies 21 removed stylesheet paths return 404.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `SMOKE_BASE_URL=https://f60205d6.twvita.pages.dev npm run smoke:live` passed: 14 content URLs, 18 redirects, 7 assets, and 21 removed assets.
  - `LAYOUT_BASE_URL=https://f60205d6.twvita.pages.dev npm run layout:live` passed on six preview pages across mobile and desktop viewports.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 14 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `npm run a11y:live` passed on the six production pages with 0 automated axe violations.
  - `npm run layout:live` passed on six production pages across mobile and desktop viewports.
  - Direct production checks confirmed `/404`, `/404.html`, and `/not-a-real-page` return HTTP 404 with no redirect, `X-Robots-Tag: noindex, nofollow`, `Cache-Control: no-store`, and `20260617-audit84` content.

CSP directive hardening deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://f109bf4a.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit85`.
- Security header refinement:
  - Added explicit `script-src-attr 'none'` and `style-src-attr 'none'` directives.
  - Added explicit `manifest-src 'self'`, `frame-src 'none'`, `media-src 'none'`, and `worker-src 'none'` directives.
  - Kept the existing JSON-LD CSP hashes, Cloudflare Insights script/connect allowlist, and self-hosted style/font/image policy.
- Validation improvements:
  - `npm run validate` now requires the additional CSP hardening directives in the Pages Worker.
  - `npm run smoke:live` now verifies the added CSP directives on deployed responses.
  - Pages Worker obsolete stylesheet interception now covers `styles-20260617-audit63.css` through `styles-20260617-audit84.css`.
  - Preview smoke verifies 22 removed stylesheet paths return 404.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `SMOKE_BASE_URL=https://f109bf4a.twvita.pages.dev npm run smoke:live` passed: 14 content URLs, 18 redirects, 7 assets, and 22 removed assets.
  - `LAYOUT_BASE_URL=https://f109bf4a.twvita.pages.dev npm run layout:live` passed on six preview pages across mobile and desktop viewports.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 14 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `npm run a11y:live` passed on the six production pages with 0 automated axe violations.
  - `npm run layout:live` passed on six production pages across mobile and desktop viewports.
  - Direct production checks confirmed `/`, `/manifest.webmanifest`, and `/404` contain `20260617-audit85` and include all added CSP directives.

Breadcrumb structured data linkage refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://164ddd8e.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit86`.
- Structured data refinement:
  - Added stable `@id` values to each inner page `BreadcrumbList`.
  - Linked each inner page node to its breadcrumb via `breadcrumb: { "@id": ... }`.
  - Applied this to `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact`.
  - Recomputed the Pages Worker CSP hashes for the updated inline JSON-LD.
- Validation improvements:
  - `npm run validate` now requires inner page JSON-LD to link to a stable breadcrumb id.
  - `npm run validate` now verifies each breadcrumb contains the homepage and current canonical page.
  - Pages Worker obsolete stylesheet interception now covers `styles-20260617-audit63.css` through `styles-20260617-audit85.css`.
  - Preview smoke verifies 23 removed stylesheet paths return 404.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - Direct local JSON-LD scan confirmed each inner page node references the matching BreadcrumbList id.
  - `SMOKE_BASE_URL=https://164ddd8e.twvita.pages.dev npm run smoke:live` passed: 14 content URLs, 18 redirects, 7 assets, and 23 removed assets.
  - `LAYOUT_BASE_URL=https://164ddd8e.twvita.pages.dev npm run layout:live` passed on six preview pages across mobile and desktop viewports.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 14 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `npm run a11y:live` passed on the six production pages with 0 automated axe violations.
  - `npm run layout:live` passed on six production pages across mobile and desktop viewports.
  - Direct production checks confirmed `/about`, `/roof-waterproofing`, `/tank-pool-waterproofing`, `/projects`, and `/contact` contain `20260617-audit86`, matching page `breadcrumb` references, matching BreadcrumbList ids, and two breadcrumb items.

Page primary image structured data refinement deployed on 2026-06-17 Asia/Taipei:

- Deployment URL: `https://82b7ad47.twvita.pages.dev`.
- Deployment surface: Cloudflare Pages Direct Upload with the Pages Worker bundle.
- Updated front-end cache-bust references to `20260617-audit87`.
- Structured data refinement:
  - Added `primaryImageOfPage` to the homepage `WebPage` node, pointing to `private-rooftop-repair.jpg`.
  - Added `primaryImageOfPage` to the about page `AboutPage` node, pointing to `private-rooftop-repair.jpg`.
  - Added `primaryImageOfPage` to the contact page `ContactPage` node, pointing to the canonical brand social card.
  - Recomputed the Pages Worker CSP hashes for the updated inline JSON-LD.
- Validation improvements:
  - `npm run validate` now requires homepage, about, and contact page JSON-LD to expose the expected `primaryImageOfPage`.
  - Pages Worker obsolete stylesheet interception now covers `styles-20260617-audit63.css` through `styles-20260617-audit86.css`.
  - Preview smoke verifies 24 removed stylesheet paths return 404.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - Direct local JSON-LD scan confirmed the homepage, about page, and contact page expose the expected primary image ids.
  - `SMOKE_BASE_URL=https://82b7ad47.twvita.pages.dev npm run smoke:live` passed: 14 content URLs, 18 redirects, 7 assets, and 24 removed assets.
  - `LAYOUT_BASE_URL=https://82b7ad47.twvita.pages.dev npm run layout:live` passed on six preview pages across mobile and desktop viewports.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 14 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `npm run a11y:live` passed on the six production pages with 0 automated axe violations.
  - `npm run layout:live` passed on six production pages across mobile and desktop viewports.
  - Direct production checks confirmed `/`, `/about`, and `/contact` contain `20260617-audit87` and the expected `primaryImageOfPage` values.

Verification coverage refinement on 2026-06-17 Asia/Taipei:

- No public deployment was required; public site content remains `20260617-audit92`.
- Verification script hardening:
  - `npm run smoke:live` now checks a missing CSS asset path (`/assets/does-not-exist.css`) returns HTTP 404 with `X-Robots-Tag: noindex, nofollow` and `Cache-Control: no-store`.
  - `npm run smoke:live` now includes `/assets/styles-20260617-audit62.css` in removed stylesheet coverage.
  - `npm run cache:live` now includes `/assets/styles-20260617-audit62.css` in obsolete stylesheet tracking.
- Production observations:
  - `https://twvita.com.tw/` and `/contact` return HTTP 200 with `20260617-audit92`.
  - Footer and contact-page company information expose `(02)2812-0021` directly.
  - Non-contact CTA and sticky phone labels continue to use `來電洽詢`.
  - `/assets/does-not-exist.css` and `/assets/styles-20260617-audit62.css` return HTTP 404 with `no-store` and `noindex, nofollow`.
  - `robots.txt` on the custom domain still shows Cloudflare managed-content behavior, but includes `Sitemap: https://twvita.com.tw/sitemap.xml`.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 15 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `npm run cache:live` exited 0. It still reports 30 obsolete stylesheet URLs returning Cloudflare edge `HIT`; public pages do not reference those URLs, and a targeted Cloudflare purge by URL remains the cleanup path when Cache Purge permission is available.
  - `npm run layout:live` passed on six production pages across mobile and desktop viewports.
  - `npm run a11y:live` passed on the six production pages with 0 automated axe violations.

SEO metadata validation hardening on 2026-06-17 Asia/Taipei:

- No public deployment was required; public site content remains `20260617-audit92`.
- Content/metadata audit:
  - Reviewed local page titles, meta descriptions, H1/H2 copy, canonical URLs, Open Graph descriptions, Twitter descriptions, and JSON-LD node coverage for the six public pages plus 404.
  - Repeated visible phrases are limited to necessary identity/contact/service-area terms such as company name, address, phone, Email, and `目前服務範圍：雙北地區`.
- Validation script hardening:
  - `npm run validate` now pins each page's expected `title`, meta description, H1, Open Graph description, and Twitter description.
  - `npm run validate` now requires `og:title` and `twitter:title` to match the page title.
  - `npm run validate` now requires `og:description` and `twitter:description` to match each page's intended social preview wording.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - Local metadata length check confirmed page titles are 17-23 characters and descriptions are 43-66 characters across the six public pages.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 15 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `npm run layout:live` passed on six production pages across mobile and desktop viewports.
  - `npm run a11y:live` passed on the six production pages with 0 automated axe violations.
  - `npm run cache:live` exited 0 with the known warning that 30 obsolete stylesheet URLs still return Cloudflare edge `HIT`; public pages do not reference those URLs.

Image delivery validation hardening on 2026-06-17 Asia/Taipei:

- No public deployment was required; public site content remains `20260617-audit92`.
- Image/performance audit:
  - Reviewed local image dimensions and file sizes for all public JPEG, WebP, PNG, and favicon assets.
  - Current content images use WebP `srcset` candidates for responsive delivery and JPEG fallbacks for compatibility.
  - Hero images use `fetchpriority="high"` with matching preload `imagesrcset`; below-fold homepage content images use `loading="lazy"` and `fetchpriority="low"`.
- Validation script hardening:
  - `npm run validate` now reads local PNG, JPEG, and WebP headers and verifies each `<img>` `width`/`height` matches the actual image file.
  - `npm run validate` now checks each `<source srcset>` image exists and that each width descriptor matches the actual image width.
  - `npm run validate` now checks image preload tags include usable `href`, `imagesrcset`, `imagesizes`, `type="image/webp"`, and `fetchpriority="high"`.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 15 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `npm run layout:live` passed on six production pages across mobile and desktop viewports.
  - `npm run a11y:live` passed on the six production pages with 0 automated axe violations.
  - `npm run cache:live` exited 0 with the known warning that 30 obsolete stylesheet URLs still return Cloudflare edge `HIT`; public pages do not reference those URLs.

Link and contact-action validation hardening on 2026-06-17 Asia/Taipei:

- No public deployment was required; public site content remains `20260617-audit92`.
- Link/contact audit:
  - Reviewed local `href`, `src`, `srcset`, `imagesrcset`, canonical, social image, `tel:`, and `mailto:` references across the six public pages plus 404.
  - Confirmed current phone links use `tel:+886228120021`.
  - Confirmed Email links include the no-JavaScript fallback inquiry template fields.
- Validation script hardening:
  - `npm run validate` now requires every `tel:` link to use `tel:+886228120021`.
  - `npm run validate` now requires every `mailto:` link to target `vitawaterproof@gmail.com` and include subject plus `建築類型`, `問題位置`, `目前狀況`, `照片或尺寸`, `使用限制`, and `可聯絡時間` fields.
  - `npm run validate` now checks every manifest shortcut is a clean local route and resolves to a known route or local file.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 15 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `npm run layout:live` passed on six production pages across mobile and desktop viewports.
  - `npm run a11y:live` passed on the six production pages with 0 automated axe violations.
  - `npm run cache:live` exited 0 with the known warning that 30 obsolete stylesheet URLs still return Cloudflare edge `HIT`; public pages do not reference those URLs.

Live link checker added on 2026-06-17 Asia/Taipei:

- No public deployment was required; public site content remains `20260617-audit92`.
- Tooling improvement:
  - Added `npm run links:live`.
  - The live checker fetches the production pages, extracts actual online internal routes, assets, responsive image candidates, canonical/social image URLs, in-page anchors, phone links, and Email links.
  - It verifies internal URLs return HTTP 200, `tel:` links use `tel:+886228120021`, `mailto:` links contain the inquiry template, and page-local anchors have matching ids.
  - Cloudflare-managed `/cdn-cgi/` email-obfuscation artifacts are ignored because they are provider-injected and not authored site links.
- Verification:
  - `npm run links:live` passed on `https://twvita.com.tw`: 7 pages and 35 internal URLs.
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 15 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `npm run layout:live` passed on six production pages across mobile and desktop viewports.
  - `npm run a11y:live` passed on the six production pages with 0 automated axe violations.
  - `npm run cache:live` exited 0 with the known warning that 30 obsolete stylesheet URLs still return Cloudflare edge `HIT`; public pages do not reference those URLs.

Live performance budget checker added on 2026-06-17 Asia/Taipei:

- No public deployment was required; public site content remains `20260617-audit92`.
- Production performance baseline:
  - Main pages are currently about 15-22 KB each.
  - Current stylesheet is about 18 KB and current JavaScript is about 2.3 KB.
  - Responsive 720w WebP content images are currently about 20-48 KB.
  - Homepage critical HTML/CSS/JS/hero-image bytes measured at 79,137 bytes.
- Tooling improvement:
  - Added `npm run perf:live`.
  - The live performance checker verifies production page/asset status, content type, size budgets, HTML cache policy, immutable asset cache policy, and a 90 KB homepage critical-byte budget.
- Verification:
  - `npm run perf:live` passed on `https://twvita.com.tw`: 15 URLs, critical homepage bytes 79,137.
  - `npm run links:live` passed on `https://twvita.com.tw`: 7 pages and 35 internal URLs.
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `npm run smoke:live` passed on `https://twvita.com.tw`: 15 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
  - `npm run layout:live` passed on six production pages across mobile and desktop viewports.
  - `npm run a11y:live` passed on the six production pages with 0 automated axe violations.
  - `npm run cache:live` exited 0 with the known warning that 30 obsolete stylesheet URLs still return Cloudflare edge `HIT`; public pages do not reference those URLs.

Full live audit runner added on 2026-06-17 Asia/Taipei:

- No public deployment was required; public site content remains `20260617-audit92`.
- Tooling improvement:
  - Added `npm run audit:live`.
  - The audit runner executes, in order: `validate`, `links:live`, `perf:live`, `smoke:live`, `layout:live`, `a11y:live`, and `cache:live`.
  - It stops on the first failing check and keeps the known `cache:live` stale-CSS edge HIT warning as a warning because that script exits 0 unless strict mode is enabled.
- Verification:
  - `npm run audit:live` passed all 7 checks.
  - Included results:
    - `validate`: 12 HTML route files and 8 JSON-LD CSP hashes.
    - `links:live`: 7 pages and 35 internal URLs.
    - `perf:live`: 15 URLs, critical homepage bytes 79,137.
    - `smoke:live`: 15 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
    - `layout:live`: six production pages across mobile and desktop viewports.
    - `a11y:live`: six production pages with 0 automated axe violations.
    - `cache:live`: exited 0 with the known warning that 30 obsolete stylesheet URLs still return Cloudflare edge `HIT`; public pages do not reference those URLs.

Maintenance README added on 2026-06-17 Asia/Taipei:

- No public deployment was required; public site content remains `20260617-audit92`.
- Documentation improvement:
  - Added `README.md` as the short maintenance guide for production status, routine audit, deployment sequence, editing rules, and DNS safety boundaries.
  - The README points routine validation to `npm run audit:live`.
  - The README records that Cloudflare DNS, TISNet, registrar nameservers, Pages custom domains, and public routing must not be changed without action-time confirmation.
- Validation improvement:
  - `npm run validate` now checks README maintenance guidance for the current public version, audit command, deploy command, service-area wording, phone/CTA conventions, Email address, and DNS safety boundary.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `npm run audit:live` passed all 7 checks.
  - Included production results:
    - `links:live`: 7 pages and 35 internal URLs.
    - `perf:live`: 15 URLs, critical homepage bytes 79,137.
    - `smoke:live`: 15 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
    - `layout:live`: six production pages across mobile and desktop viewports.
    - `a11y:live`: six production pages with 0 automated axe violations.
    - `cache:live`: exited 0 with the known warning that 30 obsolete stylesheet URLs still return Cloudflare edge `HIT`; public pages do not reference those URLs.

Live structured-data checker added on 2026-06-17 Asia/Taipei:

- No public deployment was required; public site content remains `20260617-audit92`.
- Tooling improvement:
  - Added `npm run structured:live`.
  - The live checker fetches the production pages and verifies deployed JSON-LD node types, `zh-Hant-TW` language, stable page ids, primary images, WebSite publisher, SiteNavigationElement URLs, BreadcrumbList links, LocalBusiness contact/service-area data, Service provider ids, FAQ counts, and project ItemList counts.
  - Added `structured:live` to `npm run audit:live`.
  - Updated `README.md` and `npm run validate` documentation checks so routine maintenance references `structured:live`.
- Verification:
  - `npm run structured:live` passed on `https://twvita.com.tw`: 6 pages.
  - `npm run audit:live` passed all 8 checks.
  - Included production results:
    - `validate`: 12 HTML route files and 8 JSON-LD CSP hashes.
    - `links:live`: 7 pages and 35 internal URLs.
    - `perf:live`: 15 URLs, critical homepage bytes 79,137.
    - `structured:live`: six production pages with expected JSON-LD graph coverage.
    - `smoke:live`: 15 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
    - `layout:live`: six production pages across mobile and desktop viewports.
    - `a11y:live`: six production pages with 0 automated axe violations.
    - `cache:live`: exited 0 with the known warning that 30 obsolete stylesheet URLs still return Cloudflare edge `HIT`; public pages do not reference those URLs.

Production drift checker added on 2026-06-17 Asia/Taipei:

- No public deployment was required; public site content remains `20260617-audit92`.
- Tooling improvement:
  - Added `npm run drift:live`.
  - The live drift checker compares SHA-256 hashes for production main HTML pages, current CSS/JS, icon/social assets, and responsive 720w WebP content images against local `public` files.
  - `/404` is intentionally not hash-compared because it is served through Worker fallback behavior; its status/content remains covered by `smoke:live`, `links:live`, and `layout:live`.
  - Added `drift:live` to `npm run audit:live`.
  - Updated `README.md` and `npm run validate` documentation checks so routine maintenance references `drift:live`.
- Verification:
  - `npm run drift:live` passed on `https://twvita.com.tw`: 15 files match local public assets.
  - `npm run audit:live` passed all 9 checks.
  - Included production results:
    - `validate`: 12 HTML route files and 8 JSON-LD CSP hashes.
    - `drift:live`: 15 production files matched local `public` files.
    - `links:live`: 7 pages and 35 internal URLs.
    - `perf:live`: 15 URLs, critical homepage bytes 79,137.
    - `structured:live`: six production pages with expected JSON-LD graph coverage.
    - `smoke:live`: 15 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
    - `layout:live`: six production pages across mobile and desktop viewports.
    - `a11y:live`: six production pages with 0 automated axe violations.
    - `cache:live`: exited 0 with the known warning that 30 obsolete stylesheet URLs still return Cloudflare edge `HIT`; public pages do not reference those URLs.

Live discovery checker and phone-label rule confirmed on 2026-06-17 Asia/Taipei:

- No public deployment was required; public site content remains `20260617-audit92`.
- Tooling improvement:
  - Added `npm run discovery:live`.
  - The discovery checker verifies production `robots.txt`, `sitemap.xml`, sitemap URL status/canonical metadata, and `manifest.webmanifest`.
  - Added `discovery:live` to `npm run audit:live`, bringing the full live audit to 10 checks.
- Phone display rule:
  - Footer company information must display `TEL：(02)2812-0021` directly.
  - Contact-page company information and its phone action must display `(02)2812-0021` directly.
  - Other phone CTA positions, including non-contact inquiry bands and sticky quick-contact labels, should display `來電洽詢`.
  - The contact page should not include sticky quick-contact over the company-information section.
- Verification:
  - `npm run audit:live` passed all 10 checks.
  - Included production results:
    - `validate`: 12 HTML route files and 8 JSON-LD CSP hashes.
    - `drift:live`: 15 production files matched local `public` files.
    - `discovery:live`: six sitemap URLs, production robots, and manifest passed.
    - `links:live`: 7 pages and 35 internal URLs.
    - `perf:live`: 15 URLs, critical homepage bytes 79,137.
    - `structured:live`: six production pages with expected JSON-LD graph coverage.
    - `smoke:live`: 15 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
    - `layout:live`: six production pages across mobile and desktop viewports, with footer/contact phone display and CTA label rules enforced.
    - `a11y:live`: six production pages with 0 automated axe violations.
    - `cache:live`: exited 0 with the known warning that 30 obsolete stylesheet URLs still return Cloudflare edge `HIT`; public pages do not reference those URLs.

Professional copy refinement deployed on 2026-06-17 Asia/Taipei:

- Preview deployment:
  - `https://068cc1e4.twvita.pages.dev`
  - Alias: `https://content-professional-copy.twvita.pages.dev`
- Production deployment:
  - `https://6122321b.twvita.pages.dev`
  - Production custom domain remains `https://twvita.com.tw/`.
- Content refinement:
  - Replaced the more casual `民間小案服務` wording with `民間修繕服務`.
  - Replaced homepage `小型民間案件，也以工程標準判斷。` with `民間修繕案件，也以工程標準判斷。`
  - Replaced projects CTA `想確認自己的案場是否適合處理？` with `需要初步判斷案場處理方式？`
  - Replaced roof FAQ `全部打掉重做` with the more formal `全部打除重做`.
- Validation hardening:
  - `npm run validate` now rejects the removed casual wording in public pages.
  - Updated `npm run smoke:live` expectations for the refined about/projects copy.
  - Updated the Pages Worker CSP hash list for the changed roof FAQ JSON-LD.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - Preview `SMOKE_BASE_URL=https://068cc1e4.twvita.pages.dev SMOKE_REQUIRE_REMOVED_ASSETS=1 npm run smoke:live` passed: 15 URLs, 18 redirects, 7 assets, and 31 removed assets.
  - Preview `LAYOUT_BASE_URL=https://068cc1e4.twvita.pages.dev npm run layout:live` passed: six pages across two viewports.
  - Production `npm run audit:live` passed all 10 checks.
  - Direct production keyword checks confirmed the new professional copy is live and no `民間小案服務`, `自己的案場`, `全部打掉重做`, or `小型民間案件` wording remains in checked public pages.
  - `cache:live` still reports the known warning that 30 obsolete stylesheet URLs return Cloudflare edge `HIT`; public pages do not reference those URLs.

Asset version refresh deployed on 2026-06-17 Asia/Taipei:

- Preview deployment:
  - `https://92e46c8f.twvita.pages.dev`
  - Alias: `https://asset-version-audit93.twvita.pages.dev`
- Production deployment:
  - `https://4141e283.twvita.pages.dev`
  - Production custom domain remains `https://twvita.com.tw/`.
- Versioning improvement:
  - Bumped public asset version from `20260617-audit92` to `20260617-audit93`.
  - Renamed the current stylesheet to `public/assets/styles-20260617-audit93.css`.
  - Updated public HTML, manifest icons, CSS/JS query strings, README, smoke/performance/drift/cache checks, and validation expectations.
  - Added `20260617-audit92` to stale marker checks and obsolete stylesheet checks.
  - Updated the Pages Worker old-stylesheet guard so `/assets/styles-20260617-audit92.css` is treated as obsolete.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - Preview `SMOKE_BASE_URL=https://92e46c8f.twvita.pages.dev SMOKE_REQUIRE_REMOVED_ASSETS=1 npm run smoke:live` passed: 15 URLs, 18 redirects, 7 assets, and 32 removed assets.
  - Preview `LAYOUT_BASE_URL=https://92e46c8f.twvita.pages.dev npm run layout:live` passed: six pages across two viewports.
  - Preview strict cache check passed: current assets live and obsolete stylesheets return 404.
  - Production `npm run audit:live` passed all 10 checks.
  - Direct production checks confirmed `/`, `/about`, and `/contact` contain `20260617-audit93` and no `20260617-audit92`.
  - Direct production check confirmed `/assets/styles-20260617-audit93.css` returns 200.
  - `cache:live` now reports the known warning for 31 obsolete stylesheet URLs returning Cloudflare edge `HIT`, including the newly obsolete `/assets/styles-20260617-audit92.css`; public pages do not reference those URLs.

Live console/runtime checker added on 2026-06-17 Asia/Taipei:

- No public deployment was required; public site content remains `20260617-audit93`.
- Tooling improvement:
  - Added `npm run console:live`.
  - The checker opens the six main production pages at mobile and desktop viewport widths.
  - It fails on browser console errors, page exceptions, unexpected failed requests, unexpected 4xx/5xx resource responses, unremoved `no-js` state, uninitialized Email placeholders, or inline CSP meta tags.
  - Added `console:live` to `npm run audit:live`, bringing the full live audit to 11 checks.
  - Updated `README.md` and `npm run validate` documentation checks so preview verification and routine maintenance include `console:live`.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `npm run console:live` passed on `https://twvita.com.tw`: six pages across two viewports.
  - Production `npm run audit:live` passed all 11 checks.
  - Included production results:
    - `validate`: 12 HTML route files and 8 JSON-LD CSP hashes.
    - `drift:live`: 15 production files matched local `public` files.
    - `discovery:live`: six sitemap URLs, production robots, and manifest passed.
    - `links:live`: 7 pages and 35 internal URLs.
    - `perf:live`: 15 URLs, critical homepage bytes 79,137.
    - `structured:live`: six production pages with expected JSON-LD graph coverage.
    - `smoke:live`: 15 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
    - `console:live`: six production pages across mobile and desktop with no console/runtime failures.
    - `layout:live`: six production pages across mobile and desktop viewports.
    - `a11y:live`: six production pages with 0 automated axe violations.
    - `cache:live`: exited 0 with the known warning that 31 obsolete stylesheet URLs still return Cloudflare edge `HIT`; public pages do not reference those URLs.

Live print checker added on 2026-06-17 Asia/Taipei:

- No public deployment was required; public site content remains `20260617-audit93`.
- Tooling improvement:
  - Added `npm run print:live`.
  - The checker opens the six main production pages with browser print media emulation.
  - It verifies black-on-white print styling, non-sticky header behavior, hidden navigation/menu/sticky CTA/action buttons/images, visible brand and H1, visible footer, printed phone `(02)2812-0021`, initialized footer Email, and page-break protection for cards/panels.
  - Added `print:live` to `npm run audit:live`, bringing the full live audit to 12 checks.
  - Updated `README.md` and `npm run validate` documentation checks so preview verification and routine maintenance include `print:live`.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `npm run print:live` passed on `https://twvita.com.tw`: six pages.
  - Production `npm run audit:live` passed all 12 checks.
  - Included production results:
    - `validate`: 12 HTML route files and 8 JSON-LD CSP hashes.
    - `drift:live`: 15 production files matched local `public` files.
    - `discovery:live`: six sitemap URLs, production robots, and manifest passed.
    - `links:live`: 7 pages and 35 internal URLs.
    - `perf:live`: 15 URLs, critical homepage bytes 79,137.
    - `structured:live`: six production pages with expected JSON-LD graph coverage.
    - `smoke:live`: 15 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
    - `console:live`: six production pages across mobile and desktop with no console/runtime failures.
    - `layout:live`: six production pages across mobile and desktop viewports.
    - `print:live`: six production pages with expected print media behavior.
    - `a11y:live`: six production pages with 0 automated axe violations.
    - `cache:live`: exited 0 with the known warning that 31 obsolete stylesheet URLs still return Cloudflare edge `HIT`; public pages do not reference those URLs.

Live headers checker added on 2026-06-17 Asia/Taipei:

- No public deployment was required; public site content remains `20260617-audit93`.
- Tooling improvement:
  - Added `npm run headers:live`.
  - The checker verifies production HTTP status, content type, cache policy, content language, security headers, CSP directives, no unexpected CORS header, indexable-page `x-robots-tag` behavior, 404 noindex behavior, current assets, and the `www` to apex redirect.
  - The checker allows expected Cloudflare Pages preview behavior, including `x-robots-tag=noindex` on preview pages.
  - Production `robots.txt` is checked for status and content type, but not forced through the normal HTML security-header policy because Cloudflare can merge managed robots content on the custom domain.
  - Added `headers:live` to `npm run audit:live`, bringing the full live audit to 13 checks.
  - Updated `README.md` and `npm run validate` documentation checks so preview verification and routine maintenance include `headers:live`.
- Verification:
  - `npm run validate` passed: 12 HTML route files and 8 JSON-LD CSP hashes.
  - `npm run headers:live` passed on `https://twvita.com.tw`: 15 resources.
  - Preview `HEADERS_BASE_URL=https://92e46c8f.twvita.pages.dev npm run headers:live` passed: 16 resources.
  - Production `npm run audit:live` passed all 13 checks.
  - Included production results:
    - `validate`: 12 HTML route files and 8 JSON-LD CSP hashes.
    - `drift:live`: 15 production files matched local `public` files.
    - `discovery:live`: six sitemap URLs, production robots, and manifest passed.
    - `headers:live`: 15 production resources with expected security, cache, language, redirect, and noindex behavior.
    - `links:live`: 7 pages and 35 internal URLs.
    - `perf:live`: 15 URLs, critical homepage bytes 79,137.
    - `structured:live`: six production pages with expected JSON-LD graph coverage.
    - `smoke:live`: 15 content URLs, 18 redirects, 7 assets, and the `www` apex redirect.
    - `console:live`: six production pages across mobile and desktop with no console/runtime failures.
    - `layout:live`: six production pages across mobile and desktop viewports.
    - `print:live`: six production pages with expected print media behavior.
    - `a11y:live`: six production pages with 0 automated axe violations.
    - `cache:live`: exited 0 with the known warning that 31 obsolete stylesheet URLs still return Cloudflare edge `HIT`; public pages do not reference those URLs.
