import { chromium } from "playwright";

const baseUrl = process.env.DOM_BASE_URL ?? "https://twvita.com.tw";
const paths = [
  "/",
  "/about",
  "/roof-waterproofing",
  "/tank-pool-waterproofing",
  "/projects",
  "/contact",
];
const issues = [];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

for (const path of paths) {
  const url = `${baseUrl}${path}`;
  const response = await page.goto(url, { waitUntil: "networkidle" });
  if (!response || response.status() !== 200) {
    issues.push(`${url}: expected HTTP 200, got ${response?.status() ?? "no response"}`);
    continue;
  }

  const result = await page.evaluate((currentPath) => {
    const localIssues = [];
    const visible = (node) => {
      if (!node) {
        return false;
      }
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    };
    const text = (node) => node?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const accessibleName = (node) => (node.getAttribute("aria-label") || text(node)).trim();
    const idExists = (id) => Boolean(id && document.getElementById(id));

    if (document.documentElement.lang !== "zh-Hant-TW") {
      localIssues.push("html lang should be zh-Hant-TW");
    }
    if (document.querySelectorAll("main#main").length !== 1) {
      localIssues.push("page should have exactly one main#main landmark");
    }
    const visibleH1 = [...document.querySelectorAll("h1")].filter(visible);
    if (visibleH1.length !== 1) {
      localIssues.push(`page should have exactly one visible h1, found ${visibleH1.length}`);
    }
    if (document.querySelector(".skip-link")?.getAttribute("href") !== "#main") {
      localIssues.push("skip link should point to #main");
    }

    const ids = [...document.querySelectorAll("[id]")].map((node) => node.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      localIssues.push(`duplicate id(s): ${[...new Set(duplicateIds)].join(", ")}`);
    }

    for (const node of document.querySelectorAll("[aria-controls]")) {
      if (!idExists(node.getAttribute("aria-controls"))) {
        localIssues.push(`aria-controls target missing: ${node.getAttribute("aria-controls")}`);
      }
    }
    for (const attr of ["aria-labelledby", "aria-describedby"]) {
      for (const node of document.querySelectorAll(`[${attr}]`)) {
        const missing = node.getAttribute(attr).split(/\s+/).filter((id) => !idExists(id));
        if (missing.length > 0) {
          localIssues.push(`${attr} target missing: ${missing.join(", ")}`);
        }
      }
    }

    const navs = [...document.querySelectorAll("nav")].map((nav) => nav.getAttribute("aria-label") ?? "");
    for (const requiredNav of ["主選單"]) {
      if (!navs.includes(requiredNav)) {
        localIssues.push(`missing nav landmark: ${requiredNav}`);
      }
    }
    if (currentPath !== "/contact" && !navs.includes("快速聯絡")) {
      localIssues.push("non-contact page should include bottom quick-contact nav");
    }
    if (currentPath === "/contact" && navs.includes("快速聯絡")) {
      localIssues.push("contact page should not include bottom quick-contact nav");
    }

    const currentNavLinks = [...document.querySelectorAll(".site-nav a[aria-current='page']")];
    if (currentNavLinks.length !== 1) {
      localIssues.push(`page should mark exactly one current nav link, found ${currentNavLinks.length}`);
    }
    if (currentNavLinks[0]?.getAttribute("href") !== currentPath) {
      localIssues.push(`current nav link should point to ${currentPath}`);
    }

    const brand = document.querySelector("a.brand[href='/']");
    if (accessibleName(brand) !== "臺灣耘達首頁") {
      localIssues.push("brand link should have the expected accessible name");
    }
    const menuButton = document.querySelector("[data-menu-button]");
    if (menuButton?.tagName !== "BUTTON" || menuButton.getAttribute("type") !== "button") {
      localIssues.push("menu control should be a type=button button");
    }
    for (const button of document.querySelectorAll("button")) {
      if (!accessibleName(button)) {
        localIssues.push("button missing accessible name");
      }
      if (!button.getAttribute("type")) {
        localIssues.push(`button missing explicit type: ${text(button) || button.outerHTML.slice(0, 80)}`);
      }
    }

    for (const link of document.querySelectorAll("a")) {
      const href = link.getAttribute("href") ?? "";
      if (!href || href === "#") {
        localIssues.push(`link should not use an empty or placeholder href: ${text(link)}`);
      }
      if (!accessibleName(link)) {
        localIssues.push(`link missing accessible name for href ${href}`);
      }
    }
    for (const nested of document.querySelectorAll("a a, a button, button a, button button")) {
      localIssues.push(`nested interactive control found: ${nested.tagName.toLowerCase()}`);
    }

    for (const image of document.querySelectorAll("img")) {
      const alt = image.getAttribute("alt");
      const width = image.getAttribute("width");
      const height = image.getAttribute("height");
      if (alt === null) {
        localIssues.push(`image missing alt: ${image.currentSrc || image.src}`);
      }
      if (!width || !height) {
        localIssues.push(`image missing intrinsic dimensions: ${image.currentSrc || image.src}`);
      }
      if (alt === "" && image.getAttribute("aria-hidden") !== "true") {
        localIssues.push(`decorative image with empty alt should be aria-hidden: ${image.currentSrc || image.src}`);
      }
      if (alt && image.getAttribute("aria-hidden") === "true") {
        localIssues.push(`informative image should not be aria-hidden: ${image.currentSrc || image.src}`);
      }
    }

    const footerPhone = document.querySelector(".site-footer a[href='tel:+886228120021']");
    if (text(footerPhone) !== "(02)2812-0021") {
      localIssues.push("footer phone should display (02)2812-0021");
    }
    const stickyPhone = document.querySelector(".sticky-contact a[href='tel:+886228120021']");
    if (currentPath === "/contact") {
      const contactPhones = [...document.querySelectorAll(".contact-list a[href='tel:+886228120021'], .contact-panel .cta-actions a[href='tel:+886228120021']")]
        .map(text);
      if (!contactPhones.includes("(02)2812-0021")) {
        localIssues.push("contact page company/action phone should display (02)2812-0021");
      }
    } else {
      if (text(stickyPhone) !== "來電洽詢") {
        localIssues.push("bottom quick-contact phone should display 來電洽詢");
      }
      const ctaPhoneLabels = [...document.querySelectorAll(".cta-actions a[href='tel:+886228120021']")].map(text);
      if (ctaPhoneLabels.some((label) => label !== "來電洽詢")) {
        localIssues.push(`non-bottom phone CTA labels should be 來電洽詢: ${ctaPhoneLabels.join(", ")}`);
      }
    }

    if (currentPath === "/contact" && document.body.className !== "contact-page") {
      localIssues.push("contact page should use only the contact-page body class");
    }
    if (currentPath !== "/contact" && document.body.className.includes("contact-page")) {
      localIssues.push("non-contact page should not use contact-page body class");
    }

    return localIssues;
  }, path);

  for (const issue of result) {
    issues.push(`${url}: ${issue}`);
  }
}

await page.close();
await browser.close();

if (issues.length > 0) {
  console.error(`DOM structure check failed for ${baseUrl}:`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`DOM structure check passed for ${baseUrl}: ${paths.length} pages.`);
