import { chromium } from "playwright";

const baseUrl = process.env.CONSOLE_BASE_URL ?? "https://twvita.com.tw";
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
  { name: "tablet", width: 768, height: 1024 },
  { name: "narrow-desktop", width: 1024, height: 900 },
  { name: "desktop", width: 1440, height: 1000 },
];
const issues = [];

const ignoredUrl = (url) =>
  url.includes("/cdn-cgi/") ||
  url.includes("cloudflareinsights.com") ||
  url.includes("static.cloudflareinsights.com");

const browser = await chromium.launch({ headless: true });

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  const pageIssues = [];

  page.on("console", (message) => {
    if (message.type() !== "error") {
      return;
    }
    const text = message.text();
    if (ignoredUrl(text)) {
      return;
    }
    pageIssues.push(`${message.type()}: ${text}`);
  });

  page.on("pageerror", (error) => {
    pageIssues.push(`pageerror: ${error.message}`);
  });

  page.on("requestfailed", (request) => {
    const url = request.url();
    if (ignoredUrl(url)) {
      return;
    }
    const failure = request.failure();
    pageIssues.push(`requestfailed: ${request.method()} ${url} ${failure?.errorText ?? "unknown error"}`);
  });

  page.on("response", (response) => {
    const url = response.url();
    const status = response.status();
    if (ignoredUrl(url) || status < 400) {
      return;
    }
    pageIssues.push(`response: ${status} ${url}`);
  });

  for (const path of paths) {
    pageIssues.length = 0;
    const url = `${baseUrl}${path}`;
    const response = await page.goto(url, { waitUntil: "networkidle" });
    if (!response || response.status() !== 200) {
      issues.push(`${viewport.name} ${url}: expected HTTP 200, got ${response?.status() ?? "no response"}`);
      continue;
    }

    await page.waitForTimeout(250);

    const runtimeState = await page.evaluate(() => ({
      noJs: document.documentElement.classList.contains("no-js"),
      emailPlaceholders: [...document.querySelectorAll("[data-email-text], [data-email-link]")]
        .filter((node) => node.textContent?.includes("[at]"))
        .length,
      cspMetaCount: document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').length,
    }));

    if (runtimeState.noJs) {
      pageIssues.push("runtime: no-js class was not removed");
    }
    if (runtimeState.emailPlaceholders > 0) {
      pageIssues.push(`runtime: ${runtimeState.emailPlaceholders} Email placeholder(s) were not initialized`);
    }
    if (runtimeState.cspMetaCount > 0) {
      pageIssues.push("runtime: page should rely on HTTP CSP, not inline CSP meta");
    }

    if (pageIssues.length > 0) {
      issues.push(`${viewport.name} ${url}: ${pageIssues.join(" | ")}`);
    }
  }

  await page.close();
}

await browser.close();

if (issues.length > 0) {
  console.error(`Console/runtime check failed for ${baseUrl}:`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Console/runtime check passed for ${baseUrl}: ${paths.length} pages across ${viewports.length} viewports.`);
