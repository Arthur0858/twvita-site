import { obsoleteAssets } from "./cache-assets.mjs";

const baseUrl = process.env.CACHE_BASE_URL ?? "https://twvita.com.tw";
const zoneId = process.env.CLOUDFLARE_ZONE_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;
const execute = process.env.CACHE_PURGE_EXECUTE === "1";
const batchSize = 30;

const files = obsoleteAssets.map((asset) => new URL(asset, baseUrl).toString());
const batches = [];
for (let index = 0; index < files.length; index += batchSize) {
  batches.push(files.slice(index, index + batchSize));
}

if (!execute) {
  console.log(`Dry run: ${files.length} obsolete cache URL(s) would be purged from ${baseUrl}.`);
  console.log("Set CACHE_PURGE_EXECUTE=1 with CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID to run the targeted purge.");
  for (const file of files) {
    console.log(`- ${file}`);
  }
  process.exit(0);
}

const missing = [];
if (!token) missing.push("CLOUDFLARE_API_TOKEN");
if (!zoneId) missing.push("CLOUDFLARE_ZONE_ID");
if (missing.length > 0) {
  console.error(`Missing required environment variable(s): ${missing.join(", ")}`);
  process.exit(1);
}

for (const [batchIndex, batch] of batches.entries()) {
  const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ files: batch }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.success !== true) {
    console.error(`Cloudflare purge failed for batch ${batchIndex + 1}/${batches.length}: HTTP ${response.status}`);
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  console.log(`Purged batch ${batchIndex + 1}/${batches.length}: ${batch.length} URL(s).`);
}

console.log(`Targeted cache purge completed for ${files.length} obsolete URL(s). Run npm run cache:live to verify.`);
