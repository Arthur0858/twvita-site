import { chromium } from "playwright";

const baseUrl = process.env.ASSETS_BASE_URL ?? "https://twvita.com.tw";

const assets = [
  { path: "/assets/images/vita-icon.png?v=20260617-audit96", type: "image/png", width: 512, height: 512, minBytes: 5000, maxBytes: 13000, cache: "immutable" },
  { path: "/apple-touch-icon.png?v=20260617-audit96", type: "image/png", width: 180, height: 180, minBytes: 2000, maxBytes: 6000, cache: "max-age=86400" },
  { path: "/favicon.ico", type: "image/vnd.microsoft.icon", minBytes: 5000, maxBytes: 13000, cache: "max-age=86400" },
  { path: "/assets/images/twvita-social-card-20260617.jpg", type: "image/jpeg", width: 1200, height: 630, minBytes: 70000, maxBytes: 110000, cache: "immutable" },
  { path: "/assets/images/private-rooftop-repair-720.webp", type: "image/webp", width: 720, height: 540, minBytes: 25000, maxBytes: 45000, cache: "immutable" },
  { path: "/assets/images/private-rooftop-repair-1200.webp", type: "image/webp", width: 1200, height: 900, minBytes: 60000, maxBytes: 90000, cache: "immutable" },
  { path: "/assets/images/private-shop-roof-720.webp", type: "image/webp", width: 720, height: 540, minBytes: 25000, maxBytes: 45000, cache: "immutable" },
  { path: "/assets/images/private-shop-roof-1200.webp", type: "image/webp", width: 1200, height: 900, minBytes: 65000, maxBytes: 95000, cache: "immutable" },
  { path: "/assets/images/private-tank-lining-720.webp", type: "image/webp", width: 720, height: 540, minBytes: 15000, maxBytes: 26000, cache: "immutable" },
  { path: "/assets/images/private-tank-lining-1200.webp", type: "image/webp", width: 1200, height: 900, minBytes: 35000, maxBytes: 55000, cache: "immutable" },
  { path: "/assets/images/site-roof-detail-720.webp", type: "image/webp", width: 720, height: 480, minBytes: 18000, maxBytes: 34000, cache: "immutable" },
  { path: "/assets/images/site-roof-detail-1200.webp", type: "image/webp", width: 1200, height: 800, minBytes: 50000, maxBytes: 80000, cache: "immutable" },
  { path: "/assets/images/roof-waterproof-surface-720.webp", type: "image/webp", width: 720, height: 405, minBytes: 35000, maxBytes: 54000, cache: "immutable" },
  { path: "/assets/images/roof-waterproof-surface-1200.webp", type: "image/webp", width: 1200, height: 675, minBytes: 70000, maxBytes: 105000, cache: "immutable" },
];

const pages = [
  { path: "/", hero: "/assets/images/private-rooftop-repair-720.webp", imageBase: "private-rooftop-repair" },
  { path: "/about", hero: "/assets/images/private-rooftop-repair-720.webp", imageBase: "private-rooftop-repair" },
  { path: "/roof-waterproofing", hero: "/assets/images/private-shop-roof-720.webp", imageBase: "private-shop-roof" },
  { path: "/tank-pool-waterproofing", hero: "/assets/images/private-tank-lining-720.webp", imageBase: "private-tank-lining" },
  { path: "/projects", hero: "/assets/images/site-roof-detail-720.webp", imageBase: "site-roof-detail" },
];

const issues = [];
const browser = await chromium.launch({ headless: true });
const imagePage = await browser.newPage();

for (const asset of assets) {
  const url = `${baseUrl}${asset.path}`;
  const response = await fetch(url, {
    redirect: "manual",
    headers: { "cache-control": "no-cache" },
  });
  const body = new Uint8Array(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") ?? "";
  const cacheControl = response.headers.get("cache-control") ?? "";

  if (response.status !== 200) {
    issues.push(`${url}: expected HTTP 200, got ${response.status}`);
    continue;
  }
  if (!contentType.includes(asset.type)) {
    issues.push(`${url}: expected content-type including ${asset.type}, got ${contentType || "none"}`);
  }
  if (!cacheControl.includes(asset.cache)) {
    issues.push(`${url}: expected cache-control including ${asset.cache}, got ${cacheControl || "none"}`);
  }
  if (body.byteLength < asset.minBytes || body.byteLength > asset.maxBytes) {
    issues.push(`${url}: expected ${asset.minBytes}-${asset.maxBytes} bytes, got ${body.byteLength}`);
  }

  if (asset.width && asset.height) {
    await imagePage.goto(url, { waitUntil: "load" });
    const dimensions = await imagePage.evaluate(() => {
      const image = document.querySelector("img");
      return {
        width: image?.naturalWidth ?? 0,
        height: image?.naturalHeight ?? 0,
      };
    });

    if (dimensions.width !== asset.width || dimensions.height !== asset.height) {
      issues.push(`${url}: expected ${asset.width}x${asset.height}, got ${dimensions.width}x${dimensions.height}`);
    }
  }
}

await imagePage.close();

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "narrow-desktop", width: 1024, height: 900 },
  { name: "desktop", width: 1440, height: 1000 },
]) {
  const page = await browser.newPage({ viewport });

  for (const expected of pages) {
    const url = `${baseUrl}${expected.path}`;
    const response = await page.goto(url, { waitUntil: "networkidle" });
    if (!response || response.status() !== 200) {
      issues.push(`${viewport.name} ${url}: expected HTTP 200, got ${response?.status() ?? "no response"}`);
      continue;
    }

    const result = await page.evaluate(() => {
      const preload = document.querySelector('link[rel="preload"][as="image"]');
      const firstPictureImage = document.querySelector("main picture img");
      const images = [...document.images].map((image) => ({
        src: image.getAttribute("src") ?? "",
        currentSrc: image.currentSrc,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        complete: image.complete,
        fetchPriority: image.getAttribute("fetchpriority") ?? "",
        loading: image.getAttribute("loading") ?? "",
        alt: image.getAttribute("alt") ?? "",
      }));
      return {
        preloadHref: preload?.getAttribute("href") ?? "",
        preloadSrcset: preload?.getAttribute("imagesrcset") ?? "",
        firstCurrentSrc: firstPictureImage?.currentSrc ?? "",
        firstFetchPriority: firstPictureImage?.getAttribute("fetchpriority") ?? "",
        firstLoading: firstPictureImage?.getAttribute("loading") ?? "",
        images,
      };
    });

    if (result.preloadHref !== expected.hero) {
      issues.push(`${viewport.name} ${url}: hero preload should be ${expected.hero}, got ${result.preloadHref || "none"}`);
    }
    if (!result.preloadSrcset.includes(`${expected.imageBase}-720.webp 720w`) || !result.preloadSrcset.includes(`${expected.imageBase}-1200.webp 1200w`)) {
      issues.push(`${viewport.name} ${url}: hero preload srcset should include 720w and 1200w WebP variants`);
    }
    if (!result.firstCurrentSrc.includes(`${expected.imageBase}-720.webp`) && !result.firstCurrentSrc.includes(`${expected.imageBase}-1200.webp`)) {
      issues.push(`${viewport.name} ${url}: rendered hero should use a WebP responsive source, got ${result.firstCurrentSrc || "none"}`);
    }
    if (result.firstFetchPriority !== "high" || result.firstLoading === "lazy") {
      issues.push(`${viewport.name} ${url}: hero image should be high priority and not lazy-loaded`);
    }

    for (const image of result.images) {
      if (image.loading === "lazy" && !image.complete) {
        continue;
      }
      if (!image.complete || image.naturalWidth === 0 || image.naturalHeight === 0) {
        issues.push(`${viewport.name} ${url}: image failed to load ${image.src || image.currentSrc}`);
      }
      if (image.currentSrc && image.currentSrc.includes("/assets/images/") && image.src !== "/assets/images/vita-icon.png?v=20260617-audit96" && !image.currentSrc.includes(".webp")) {
        issues.push(`${viewport.name} ${url}: content images should render WebP sources, got ${image.currentSrc}`);
      }
      if (image.loading === "lazy" && image.fetchPriority === "high") {
        issues.push(`${viewport.name} ${url}: lazy image should not also use high fetch priority: ${image.alt}`);
      }
    }
  }

  await page.close();
}

await browser.close();

if (issues.length > 0) {
  console.error(`Asset check failed for ${baseUrl} with ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Asset check passed for ${baseUrl}: ${assets.length} files and ${pages.length} pages across 4 viewports.`);
