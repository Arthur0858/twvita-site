import { chromium } from "playwright";

const baseUrl = process.env.LAYOUT_BASE_URL ?? "https://twvita.com.tw";
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

const browser = await chromium.launch({ headless: true });

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });

  for (const path of paths) {
    const url = `${baseUrl}${path}`;
    const response = await page.goto(url, { waitUntil: "networkidle" });
    if (!response || response.status() !== 200) {
      issues.push(`${viewport.name} ${url}: expected HTTP 200, got ${response?.status() ?? "no response"}`);
      continue;
    }

    const initialResult = await page.evaluate(() => {
      const skip = document.querySelector(".skip-link");
      const skipBefore = skip?.getBoundingClientRect();
      skip?.focus();
      const skipAfter = skip?.getBoundingClientRect();
      return {
        htmlClass: document.documentElement.className,
        skipText: skip?.textContent?.trim() ?? "",
        skipHref: skip?.getAttribute("href") ?? "",
        mainExists: Boolean(document.querySelector("#main")),
        skipActive: document.activeElement === skip,
        skipBeforeTop: skipBefore?.top ?? 0,
        skipAfterTop: skipAfter?.top ?? 0,
        skipAfterHeight: skipAfter?.height ?? 0,
      };
    });

    if (initialResult.htmlClass.includes("no-js")) {
      issues.push(`${viewport.name} ${url}: no-js class should be removed after JavaScript initializes`);
    }
    if (
      initialResult.skipText !== "跳到主要內容" ||
      initialResult.skipHref !== "#main" ||
      !initialResult.mainExists
    ) {
      issues.push(`${viewport.name} ${url}: skip link should target the main content landmark`);
    }
    if (
      !initialResult.skipActive ||
      initialResult.skipBeforeTop >= 0 ||
      initialResult.skipAfterTop < 0 ||
      initialResult.skipAfterTop + initialResult.skipAfterHeight > viewport.height
    ) {
      issues.push(`${viewport.name} ${url}: skip link should move into the viewport when focused`);
    }

    await page.evaluate(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "instant",
      });
    });
    await page.waitForTimeout(100);

    const result = await page.evaluate(() => {
      const sticky = document.querySelector(".sticky-contact");
      const footer = document.querySelector(".site-footer");
      const footerPhone = footer?.querySelector('a[href="tel:+886228120021"]');
      const footerEmailText = footer?.querySelector("[data-email-text]")?.textContent?.trim() ?? "";
      const ctaPhoneLabels = [...document.querySelectorAll('.cta-actions a[href="tel:+886228120021"]')]
        .map((link) => link.textContent?.trim());
      const emailLinks = [...document.querySelectorAll('a[href^="mailto:"]')]
        .map((link) => ({
          text: link.textContent?.trim() ?? "",
          href: link.getAttribute("href") ?? "",
          inContactInfo: Boolean(link.closest(".contact-list")),
          inCta: Boolean(link.closest(".cta-actions")),
          inSticky: Boolean(link.closest(".sticky-contact")),
        }));
      const brokenImages = [...document.images]
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src || image.alt || "unknown image");
      const footerPhoneRect = footerPhone?.getBoundingClientRect();
      const stickyRect = sticky?.getBoundingClientRect();

      return {
        bodyScrollWidth: document.body.scrollWidth,
        documentScrollWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        brokenImages,
        stickyExists: Boolean(sticky),
        stickyTagName: sticky?.tagName ?? "",
        stickyLabel: sticky?.getAttribute("aria-label") ?? "",
        stickyText: sticky?.textContent?.replace(/\s+/g, " ").trim() ?? "",
        stickyDisplay: sticky ? getComputedStyle(sticky).display : "",
        footerPhoneText: footerPhone?.textContent?.trim() ?? "",
        footerEmailText,
        ctaPhoneLabels,
        emailLinks,
        footerPhoneBottom: footerPhoneRect?.bottom ?? 0,
        stickyTop: stickyRect?.top ?? window.innerHeight,
        stickyHeight: stickyRect?.height ?? 0,
        footerPhoneVisible: Boolean(
          footerPhoneRect &&
            footerPhoneRect.width > 0 &&
            footerPhoneRect.height > 0
        ),
      };
    });

    const maxScrollWidth = Math.max(result.bodyScrollWidth, result.documentScrollWidth);
    if (maxScrollWidth > result.viewportWidth + 1) {
      issues.push(`${viewport.name} ${url}: horizontal overflow ${maxScrollWidth}px > ${result.viewportWidth}px`);
    }
    if (result.brokenImages.length > 0) {
      issues.push(`${viewport.name} ${url}: broken images ${result.brokenImages.join(", ")}`);
    }
    if (path !== "/contact" && (result.stickyTagName !== "NAV" || result.stickyLabel !== "快速聯絡")) {
      issues.push(`${viewport.name} ${url}: sticky contact should be nav[aria-label="快速聯絡"]`);
    }
    if (url.endsWith("/contact")) {
      if (result.stickyExists) {
        issues.push(`${viewport.name} ${url}: contact page should not include sticky contact over company information`);
      }
    } else if (result.stickyDisplay === "none" || !result.stickyText.includes("來電洽詢") || !result.stickyText.includes("Email 洽詢")) {
      issues.push(`${viewport.name} ${url}: sticky contact should be visible and show 來電洽詢 / Email 洽詢`);
    }
    if (result.footerPhoneText !== "(02)2812-0021" || !result.footerPhoneVisible) {
      issues.push(`${viewport.name} ${url}: footer phone should be visible as (02)2812-0021`);
    }
    if (result.footerEmailText !== "vitawaterproof@gmail.com") {
      issues.push(`${viewport.name} ${url}: footer Email should be initialized as vitawaterproof@gmail.com`);
    }
    for (const emailLink of result.emailLinks) {
      if (
        !emailLink.href.startsWith("mailto:vitawaterproof@gmail.com?") ||
        !emailLink.href.includes("subject=") ||
        !emailLink.href.includes("body=") ||
        !emailLink.href.includes("%E4%BD%BF%E7%94%A8%E9%99%90%E5%88%B6")
      ) {
        issues.push(`${viewport.name} ${url}: Email link should include the initialized mailto template`);
      }
    }
    if (path === "/contact") {
      const hasContactInquiryPhone = result.ctaPhoneLabels.includes("來電洽詢");
      if (!hasContactInquiryPhone) {
        issues.push(`${viewport.name} ${url}: contact lower phone action should display 來電洽詢`);
      }
      if (!result.emailLinks.some((link) => link.inContactInfo && link.text === "vitawaterproof@gmail.com")) {
        issues.push(`${viewport.name} ${url}: contact Email row should display the real Email address after initialization`);
      }
    } else if (result.ctaPhoneLabels.some((label) => label !== "來電洽詢")) {
      issues.push(`${viewport.name} ${url}: non-contact phone CTA labels should be 來電洽詢`);
    }
    if (path !== "/contact" && result.footerPhoneBottom > result.stickyTop - 8) {
      issues.push(`${viewport.name} ${url}: footer phone overlaps sticky contact`);
    }

    if (viewport.name === "mobile") {
      const menuResult = await page.evaluate(async () => {
        const button = document.querySelector("[data-menu-button]");
        const nav = document.querySelector("[data-site-nav]");
        if (!button || !nav) {
          return { missing: true };
        }
        const before = {
          expanded: button.getAttribute("aria-expanded"),
          label: button.getAttribute("aria-label"),
          hidden: nav.getAttribute("aria-hidden"),
          inert: nav.hasAttribute("inert"),
          open: nav.classList.contains("is-open"),
        };
        button.click();
        await new Promise((resolve) => requestAnimationFrame(resolve));
        const opened = {
          expanded: button.getAttribute("aria-expanded"),
          label: button.getAttribute("aria-label"),
          hidden: nav.getAttribute("aria-hidden"),
          inert: nav.hasAttribute("inert"),
          open: nav.classList.contains("is-open"),
        };
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        await new Promise((resolve) => requestAnimationFrame(resolve));
        const closed = {
          expanded: button.getAttribute("aria-expanded"),
          label: button.getAttribute("aria-label"),
          hidden: nav.getAttribute("aria-hidden"),
          inert: nav.hasAttribute("inert"),
          open: nav.classList.contains("is-open"),
        };
        return { before, opened, closed };
      });

      if (menuResult.missing) {
        issues.push(`${viewport.name} ${url}: mobile menu button or navigation is missing`);
      } else {
        if (
          menuResult.before.expanded !== "false" ||
          menuResult.before.hidden !== "true" ||
          menuResult.before.inert !== true ||
          menuResult.before.open !== false
        ) {
          issues.push(`${viewport.name} ${url}: mobile menu should start closed, hidden, and inert`);
        }
        if (
          menuResult.opened.expanded !== "true" ||
          menuResult.opened.label !== "關閉選單" ||
          menuResult.opened.hidden !== "false" ||
          menuResult.opened.inert !== false ||
          menuResult.opened.open !== true
        ) {
          issues.push(`${viewport.name} ${url}: mobile menu button should open the navigation accessibly`);
        }
        if (
          menuResult.closed.expanded !== "false" ||
          menuResult.closed.label !== "開啟選單" ||
          menuResult.closed.hidden !== "true" ||
          menuResult.closed.inert !== true ||
          menuResult.closed.open !== false
        ) {
          issues.push(`${viewport.name} ${url}: Escape should close the mobile menu and restore inert state`);
        }
      }
    }
  }

  await page.close();
}

const noJsPage = await browser.newPage({
  viewport: { width: 390, height: 844 },
  javaScriptEnabled: false,
});

for (const path of paths) {
  const url = `${baseUrl}${path}`;
  const response = await noJsPage.goto(url, { waitUntil: "networkidle" });
  if (!response || response.status() !== 200) {
    issues.push(`no-js mobile ${url}: expected HTTP 200, got ${response?.status() ?? "no response"}`);
    continue;
  }

  const noJsResult = await noJsPage.evaluate(() => {
    const nav = document.querySelector("[data-site-nav]");
    const menu = document.querySelector("[data-menu-button]");
    const footerEmailText = document.querySelector(".site-footer [data-email-text]")?.textContent?.trim() ?? "";
    const fallbackEmailLinks = [...document.querySelectorAll("a[data-email-link]")]
      .map((link) => link.getAttribute("href") ?? "");
    return {
      htmlClass: document.documentElement.className,
      menuDisplay: menu ? getComputedStyle(menu).display : "",
      navDisplay: nav ? getComputedStyle(nav).display : "",
      navHidden: nav?.getAttribute("aria-hidden") ?? "",
      navInert: nav?.hasAttribute("inert") ?? false,
      footerEmailText,
      fallbackEmailLinks,
      maxScrollWidth: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
      viewportWidth: window.innerWidth,
    };
  });

  if (!noJsResult.htmlClass.includes("no-js")) {
    issues.push(`no-js mobile ${url}: no-js class should remain when JavaScript is disabled`);
  }
  if (noJsResult.menuDisplay !== "none") {
    issues.push(`no-js mobile ${url}: menu button should be hidden when navigation is always visible`);
  }
  if (noJsResult.navDisplay === "none" || noJsResult.navHidden || noJsResult.navInert) {
    issues.push(`no-js mobile ${url}: navigation should remain visible and interactive`);
  }
  if (noJsResult.footerEmailText !== "vitawaterproof [at] gmail.com") {
    issues.push(`no-js mobile ${url}: footer Email should retain the non-JavaScript obfuscated text`);
  }
  for (const href of noJsResult.fallbackEmailLinks) {
    if (
      !href.startsWith("mailto:vitawaterproof@gmail.com?") ||
      !href.includes("subject=") ||
      !href.includes("body=") ||
      !href.includes("%E4%BD%BF%E7%94%A8%E9%99%90%E5%88%B6")
    ) {
      issues.push(`no-js mobile ${url}: Email links should keep a complete fallback mailto template`);
    }
  }
  if (noJsResult.maxScrollWidth > noJsResult.viewportWidth + 1) {
    issues.push(`no-js mobile ${url}: horizontal overflow ${noJsResult.maxScrollWidth}px > ${noJsResult.viewportWidth}px`);
  }
}

await noJsPage.close();

await browser.close();

if (issues.length > 0) {
  console.error(`Live layout check failed with ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Layout passed for ${baseUrl}: ${paths.length} pages across ${viewports.length} viewports.`);
