import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const baseUrl = process.env.A11Y_BASE_URL ?? "https://twvita.com.tw";
const paths = [
  "/",
  "/about",
  "/roof-waterproofing",
  "/tank-pool-waterproofing",
  "/projects",
  "/contact",
];
const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 1000 },
];

const browser = await chromium.launch({ headless: true });
const failures = [];
try {
  for (const viewport of viewports) {
    console.log(`\n== axe ${viewport.name} ${viewport.width}x${viewport.height} ==`);
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    try {
      for (const path of paths) {
        const page = await context.newPage();
        try {
          const url = `${baseUrl}${path}`;
          const response = await page.goto(url, { waitUntil: "domcontentloaded" });
          if (!response?.ok()) {
            failures.push({ viewport: viewport.name, path, error: `HTTP ${response?.status() ?? "no response"}` });
            continue;
          }
          const results = await new AxeBuilder({ page }).analyze();
          if (results.violations.length > 0) {
            failures.push({
              viewport: viewport.name,
              path,
              violations: results.violations.map((violation) => ({
                id: violation.id,
                impact: violation.impact,
                nodes: violation.nodes.length,
              })),
            });
          }
        } finally {
          await page.close();
        }
      }
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}

if (failures.length > 0) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}

console.log(
  `Axe accessibility check passed for ${baseUrl}: ${paths.length} pages across ${viewports.length} viewports.`,
);