import { currentAssets, obsoleteAssets } from "./cache-assets.mjs";

const baseUrl = process.env.CACHE_BASE_URL ?? "https://twvita.com.tw";
const strict = process.env.CACHE_HYGIENE_STRICT === "1";

const issues = [];
const staleCacheHits = [];

async function check(urlPath) {
  const response = await fetch(`${baseUrl}${urlPath}`, {
    redirect: "manual",
    headers: { "cache-control": "no-cache" },
  });
  const text = await response.text();
  return {
    path: urlPath,
    status: response.status,
    cacheControl: response.headers.get("cache-control") ?? "",
    cfCacheStatus: response.headers.get("cf-cache-status") ?? "",
    bytes: text.length,
  };
}

for (const asset of currentAssets) {
  const result = await check(asset);
  if (result.status !== 200) {
    issues.push(`${asset}: current asset expected 200, got ${result.status}`);
  }
}

for (const asset of obsoleteAssets) {
  const result = await check(asset);
  if (result.status === 404) {
    continue;
  }
  if (result.status === 200 && result.cfCacheStatus === "HIT" && result.cacheControl.includes("immutable")) {
    staleCacheHits.push(result);
    continue;
  }
  issues.push(`${asset}: obsolete asset expected 404 or known Cloudflare edge HIT, got ${result.status} cf=${result.cfCacheStatus || "none"} cache=${result.cacheControl || "none"}`);
}

if (strict && staleCacheHits.length > 0) {
  for (const hit of staleCacheHits) {
    issues.push(`${hit.path}: obsolete asset is still cached at Cloudflare edge; purge this exact URL`);
  }
}

if (issues.length > 0) {
  console.error(`Cache hygiene failed for ${baseUrl} with ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

if (staleCacheHits.length > 0) {
  console.warn(`Cache hygiene warning for ${baseUrl}: ${staleCacheHits.length} obsolete stylesheet URL(s) still return Cloudflare edge HIT.`);
  for (const hit of staleCacheHits) {
    console.warn(`- ${hit.path}: status=${hit.status}, cf=${hit.cfCacheStatus}, cache=${hit.cacheControl}, bytes=${hit.bytes}`);
  }
  console.warn("Public pages no longer reference these URLs. Use a targeted Cloudflare purge by URL when Cache Purge permission is available.");
} else {
  console.log(`Cache hygiene passed for ${baseUrl}: current assets are live and obsolete stylesheets return 404.`);
}
