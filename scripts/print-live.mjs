import { chromium } from "playwright";

const baseUrl = process.env.PRINT_BASE_URL ?? "https://twvita.com.tw";
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
const page = await browser.newPage({ viewport: { width: 1024, height: 1400 } });
await page.emulateMedia({ media: "print" });

for (const path of paths) {
  const url = `${baseUrl}${path}`;
  const response = await page.goto(url, { waitUntil: "networkidle" });
  if (!response || response.status() !== 200) {
    issues.push(`${url}: expected HTTP 200, got ${response?.status() ?? "no response"}`);
    continue;
  }

  const result = await page.evaluate(() => {
    const styles = (selector) => {
      const node = document.querySelector(selector);
      if (!node) {
        return null;
      }
      const computed = getComputedStyle(node);
      return {
        display: computed.display,
        position: computed.position,
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        width: node.getBoundingClientRect().width,
        height: node.getBoundingClientRect().height,
        text: node.textContent?.replace(/\s+/g, " ").trim() ?? "",
      };
    };

    const hiddenSelectors = [
      ".site-nav",
      ".menu-button",
      ".sticky-contact",
      ".hero-actions",
      ".cta-actions",
      ".media-badge",
      ".hero-media",
    ];

    return {
      media: matchMedia("print").matches,
      body: styles("body"),
      header: styles(".site-header"),
      main: styles("main"),
      footer: styles(".site-footer"),
      footerPhone: styles('.site-footer a[href="tel:+886228120021"]'),
      footerEmail: styles(".site-footer [data-email-text]"),
      brand: styles(".brand"),
      h1: styles("h1"),
      hidden: Object.fromEntries(hiddenSelectors.map((selector) => [selector, styles(selector)])),
      visibleImages: [...document.images].filter((image) => getComputedStyle(image).display !== "none" && image.getBoundingClientRect().height > 0).length,
      visiblePictures: [...document.querySelectorAll("picture")].filter((picture) => getComputedStyle(picture).display !== "none" && picture.getBoundingClientRect().height > 0).length,
      cardsAvoidBreak: [...document.querySelectorAll(".card, .contact-panel, .project-category, .faq-list details")]
        .every((node) => getComputedStyle(node).breakInside === "avoid"),
    };
  });

  if (!result.media) {
    issues.push(`${url}: print media emulation did not activate`);
  }
  if (result.body?.backgroundColor !== "rgb(255, 255, 255)" || result.body?.color !== "rgb(0, 0, 0)") {
    issues.push(`${url}: print body should be black text on white background`);
  }
  if (result.header?.position !== "static") {
    issues.push(`${url}: header should not remain sticky in print`);
  }
  for (const [selector, style] of Object.entries(result.hidden)) {
    if (style && style.display !== "none") {
      issues.push(`${url}: ${selector} should be hidden in print`);
    }
  }
  if (!result.brand || result.brand.height <= 0) {
    issues.push(`${url}: brand should remain visible in print`);
  }
  if (!result.h1 || result.h1.height <= 0) {
    issues.push(`${url}: h1 should remain visible in print`);
  }
  if (!result.footer || result.footer.height <= 0) {
    issues.push(`${url}: footer should remain visible in print`);
  }
  if (result.footerPhone?.text !== "(02)2812-0021") {
    issues.push(`${url}: footer phone should print as (02)2812-0021`);
  }
  if (result.footerEmail?.text !== "vitawaterproof@gmail.com") {
    issues.push(`${url}: footer Email should print as vitawaterproof@gmail.com after initialization`);
  }
  if (result.visibleImages > 1 || result.visiblePictures > 0) {
    issues.push(`${url}: print layout should suppress decorative/content images, got ${result.visibleImages} visible images and ${result.visiblePictures} visible pictures`);
  }
  if (!result.cardsAvoidBreak) {
    issues.push(`${url}: cards and panels should avoid page breaks inside`);
  }
}

await browser.close();

if (issues.length > 0) {
  console.error(`Print check failed for ${baseUrl}:`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Print check passed for ${baseUrl}: ${paths.length} pages.`);
