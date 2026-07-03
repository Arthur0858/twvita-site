import { spawnSync } from "node:child_process";

const baseUrl = process.env.A11Y_BASE_URL ?? "https://twvita.com.tw";
const paths = [
  "/",
  "/about",
  "/roof-waterproofing",
  "/tank-pool-waterproofing",
  "/projects",
  "/contact",
];
const urls = paths.map((path) => `${baseUrl}${path}`);
const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 1000 },
];

for (const viewport of viewports) {
  console.log(`\n== axe ${viewport.name} ${viewport.width}x${viewport.height} ==`);
  const result = spawnSync("npx", [
    "--yes",
    "@axe-core/cli",
    ...urls,
    "--exit",
    `--chrome-options=--window-size=${viewport.width},${viewport.height}`,
  ], {
    stdio: "inherit",
  });

  if (result.error) {
    console.error(`Unable to run axe-core: ${result.error.message}`);
    process.exit(1);
  }
  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`Axe accessibility check passed for ${baseUrl}: ${paths.length} pages across ${viewports.length} viewports.`);
