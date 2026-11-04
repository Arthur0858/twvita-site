import assert from "node:assert/strict";
import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve("public");
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const file = path.resolve(root, `.${pathname === "/" ? "/index.html" : pathname}`);
    if (!file.startsWith(`${root}${path.sep}`)) throw new Error("Invalid path");
    const body = await readFile(file);
    const ext = path.extname(file);
    res.setHeader("Content-Type", ({ ".html": "text/html", ".js": "text/javascript", ".css": "text/css" })[ext] || "application/octet-stream");
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
let browser;
try {
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.route(/.*/, (route) => new URL(route.request().url()).hostname === "127.0.0.1" ? route.continue() : route.abort());
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  const toggle = page.locator("[data-menu-button]");
  const nav = page.locator("[data-site-nav]");
  await toggle.click();
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement === document.querySelector('[data-site-nav] a')), true);
  await page.keyboard.press("Escape");
  assert.equal(await toggle.getAttribute("aria-expanded"), "false");
  assert.equal(await nav.getAttribute("aria-hidden"), "true");
  assert.equal(await nav.evaluate((el) => el.inert), true);
  assert.equal(await toggle.evaluate((el) => document.activeElement === el), true);
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => { const el = document.activeElement; return el !== document.body && !!el.getClientRects().length && !el.closest('[inert]'); }), true);
  await toggle.click();
  const outside = page.locator("[data-email-link]").first();
  await outside.scrollIntoViewIfNeeded();
  await outside.click({ trial: true });
  await outside.evaluate((el) => { el.addEventListener("click", (event) => event.preventDefault(), { once: true }); });
  await outside.click();
  assert.equal(await toggle.getAttribute("aria-expanded"), "false");
  assert.equal(await toggle.evaluate((el) => document.activeElement === el), false);
  for (const [width, visible, inert] of [[900, true, true], [901, false, false]]) {
    await page.setViewportSize({ width, height: 844 });
    await page.waitForFunction((expected) => document.querySelector('[data-site-nav]').inert === expected, inert);
    assert.equal(await toggle.isVisible(), visible);
    assert.equal(await nav.evaluate((el) => el.inert), inert);
  }
  console.log("Browser menu focus tests passed.");
} finally {
  await browser?.close();
  if (server.listening) await new Promise((resolve) => server.close(resolve));
}
