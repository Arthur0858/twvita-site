import { chromium } from "playwright";

const baseUrl = process.env.INTERACTION_BASE_URL ?? "https://twvita.com.tw";
const paths = [
  "/",
  "/about",
  "/roof-waterproofing",
  "/tank-pool-waterproofing",
  "/projects",
  "/contact",
];
const faqPaths = ["/roof-waterproofing", "/tank-pool-waterproofing"];
const issues = [];

const hasVisibleFocus = (style) =>
  style.outlineStyle !== "none" ||
  style.boxShadow !== "none" ||
  style.borderColor === "rgb(193, 139, 47)";

const browser = await chromium.launch({ headless: true });

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "narrow-desktop", width: 1024, height: 900 },
  { name: "desktop", width: 1440, height: 1000 },
]) {
  const page = await browser.newPage({ viewport });

  for (const path of paths) {
    const url = `${baseUrl}${path}`;
    const response = await page.goto(url, { waitUntil: "networkidle" });
    if (!response || response.status() !== 200) {
      issues.push(`${viewport.name} ${url}: expected HTTP 200, got ${response?.status() ?? "no response"}`);
      continue;
    }

    await page.keyboard.press("Tab");
    const firstFocus = await page.evaluate(() => {
      const active = document.activeElement;
      const style = getComputedStyle(active);
      return {
        tag: active?.tagName ?? "",
        className: active?.className?.toString() ?? "",
        text: active?.textContent?.replace(/\s+/g, " ").trim() ?? "",
        href: active?.getAttribute?.("href") ?? "",
        outlineStyle: style.outlineStyle,
        boxShadow: style.boxShadow,
        borderColor: style.borderColor,
      };
    });
    if (firstFocus.className !== "skip-link" || firstFocus.href !== "#main" || !hasVisibleFocus(firstFocus)) {
      issues.push(`${viewport.name} ${url}: first Tab should focus a visibly styled skip link`);
    }

    await page.keyboard.press("Enter");
    const skipTarget = await page.evaluate(() => ({
      hash: location.hash,
      mainId: document.activeElement?.id ?? "",
      mainTabIndex: document.querySelector("#main")?.getAttribute("tabindex") ?? "",
    }));
    if (skipTarget.hash !== "#main" || skipTarget.mainId !== "main" || skipTarget.mainTabIndex !== "-1") {
      issues.push(`${viewport.name} ${url}: activating skip link should move focus to main[tabindex="-1"]`);
    }

    const focusableResult = await page.evaluate(() => {
      const selector = [
        "a[href]",
        "button:not([disabled])",
        "summary",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[tabindex]:not([tabindex='-1'])",
      ].join(",");
      return [...document.querySelectorAll(selector)]
        .filter((node) => {
          const style = getComputedStyle(node);
          const rect = node.getBoundingClientRect();
          return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0 && !node.closest("[inert]");
        })
        .slice(0, 14)
        .map((node) => ({
          tag: node.tagName,
          text: node.textContent?.replace(/\s+/g, " ").trim() ?? "",
          href: node.getAttribute("href") ?? "",
          ariaLabel: node.getAttribute("aria-label") ?? "",
          tabIndex: node.getAttribute("tabindex") ?? "",
        }));
    });
    if (focusableResult.length < 5) {
      issues.push(`${viewport.name} ${url}: page should expose enough keyboard-focusable controls`);
    }
    if (focusableResult.some((item) => item.tabIndex && Number(item.tabIndex) > 0)) {
      issues.push(`${viewport.name} ${url}: positive tabindex should not be used`);
    }

    if (viewport.width <= 900) {
      const mobileMenu = await page.evaluate(async () => {
        const button = document.querySelector("[data-menu-button]");
        const nav = document.querySelector("[data-site-nav]");
        const firstLink = nav?.querySelector("a[href='/about']") ?? nav?.querySelector("a[href]");
        if (!button || !nav || !firstLink) {
          return { missing: true };
        }
        button.focus();
        button.click();
        await new Promise((resolve) => requestAnimationFrame(resolve));
        const opened = {
          expanded: button.getAttribute("aria-expanded"),
          hidden: nav.getAttribute("aria-hidden"),
          inert: nav.hasAttribute("inert"),
          focusInNavPossible: !nav.hasAttribute("inert"),
        };
        firstLink.addEventListener("click", (event) => event.preventDefault(), { once: true });
        firstLink.click();
        await new Promise((resolve) => requestAnimationFrame(resolve));
        const closedAfterLink = {
          expanded: button.getAttribute("aria-expanded"),
          hidden: nav.getAttribute("aria-hidden"),
          inert: nav.hasAttribute("inert"),
          open: nav.classList.contains("is-open"),
        };
        button.click();
        await new Promise((resolve) => requestAnimationFrame(resolve));
        document.body.click();
        await new Promise((resolve) => requestAnimationFrame(resolve));
        const closedAfterOutside = {
          expanded: button.getAttribute("aria-expanded"),
          hidden: nav.getAttribute("aria-hidden"),
          inert: nav.hasAttribute("inert"),
          open: nav.classList.contains("is-open"),
        };
        return { opened, closedAfterLink, closedAfterOutside };
      });
      if (mobileMenu.missing) {
        issues.push(`${viewport.name} ${url}: mobile menu controls should be present`);
      } else {
        if (mobileMenu.opened.expanded !== "true" || mobileMenu.opened.hidden !== "false" || mobileMenu.opened.inert !== false || mobileMenu.opened.focusInNavPossible !== true) {
          issues.push(`${viewport.name} ${url}: mobile menu should open accessibly for keyboard and screen-reader users`);
        }
        for (const [label, state] of [
          ["link click", mobileMenu.closedAfterLink],
          ["outside click", mobileMenu.closedAfterOutside],
        ]) {
          if (state.expanded !== "false" || state.hidden !== "true" || state.inert !== true || state.open !== false) {
            issues.push(`${viewport.name} ${url}: mobile menu should close after ${label}`);
          }
        }
      }
    } else {
      const desktopNav = await page.evaluate(() => {
        const button = document.querySelector("[data-menu-button]");
        const nav = document.querySelector("[data-site-nav]");
        const links = [...(nav?.querySelectorAll("a[href]") ?? [])];
        const buttonStyle = button ? getComputedStyle(button) : null;
        const navStyle = nav ? getComputedStyle(nav) : null;
        return {
          missing: !button || !nav,
          buttonDisplay: buttonStyle?.display ?? "",
          navDisplay: navStyle?.display ?? "",
          navHidden: nav?.getAttribute("aria-hidden") ?? "",
          navInert: nav?.hasAttribute("inert") ?? true,
          linkCount: links.length,
          visibleLinks: links.filter((link) => {
            const rect = link.getBoundingClientRect();
            const style = getComputedStyle(link);
            return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
          }).length,
        };
      });
      if (desktopNav.missing) {
        issues.push(`${viewport.name} ${url}: desktop navigation controls should be present`);
      } else if (desktopNav.buttonDisplay !== "none" || desktopNav.navDisplay === "none" || desktopNav.navHidden !== "false" || desktopNav.navInert !== false || desktopNav.visibleLinks !== desktopNav.linkCount || desktopNav.linkCount < 6) {
        issues.push(`${viewport.name} ${url}: desktop navigation should be visible, non-inert, and expose all links`);
      }
    }
  }

  for (const path of faqPaths) {
    const url = `${baseUrl}${path}`;
    await page.goto(url, { waitUntil: "networkidle" });
    const faqResult = await page.evaluate(async () => {
      const summary = document.querySelector(".faq-list details summary");
      const details = summary?.closest("details");
      if (!summary || !details) {
        return { missing: true };
      }
      summary.focus();
      const style = getComputedStyle(summary);
      const before = details.open;
      summary.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      summary.click();
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const afterEnter = details.open;
      summary.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
      summary.click();
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const afterSpace = details.open;
      return {
        before,
        afterEnter,
        afterSpace,
        outlineStyle: style.outlineStyle,
        boxShadow: style.boxShadow,
        borderColor: style.borderColor,
      };
    });
    if (faqResult.missing) {
      issues.push(`${viewport.name} ${url}: FAQ summary should be present`);
    } else {
      if (!hasVisibleFocus(faqResult)) {
        issues.push(`${viewport.name} ${url}: focused FAQ summary should have visible focus styling`);
      }
      if (faqResult.afterEnter === faqResult.before || faqResult.afterSpace === faqResult.afterEnter) {
        issues.push(`${viewport.name} ${url}: FAQ summary should toggle with keyboard activation`);
      }
    }
  }

  await page.close();
}

await browser.close();

if (issues.length > 0) {
  console.error(`Interaction check failed for ${baseUrl} with ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Interaction check passed for ${baseUrl}: ${paths.length} pages across 4 viewports.`);
