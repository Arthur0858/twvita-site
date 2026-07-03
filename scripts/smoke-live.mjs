import { obsoleteAssets } from "./cache-assets.mjs";

const baseUrl = process.env.SMOKE_BASE_URL ?? "https://twvita.com.tw";
const requireRemovedAssets =
  process.env.SMOKE_REQUIRE_REMOVED_ASSETS === "1" ||
  baseUrl.endsWith(".pages.dev");

const checks = [
  { path: "/", status: 200, mustContain: ["20260617-audit96", '<html lang="zh-Hant-TW" class="no-js">', "目前服務範圍：雙北地區", "雙北地區專業防水公司", "先看現場條件，再安排合適工法。", "節點處理清楚，後續維護才有依據。", "小型案場，更需要把細節說清楚。", "(02)2812-0021", 'hreflang="zh-Hant-TW"', 'hreflang="x-default"', '"@type": "WebPage"', '"@type": "SiteNavigationElement"', '"@id": "https://twvita.com.tw/#site-navigation"', '"hasOfferCatalog"', "屋頂與設備周邊防水工程", "水塔、水箱與池體防水工程", '"knowsAbout"', "PVC 防水膜", "mailto:vitawaterproof@gmail.com"] },
  { path: "/about", status: 200, mustContain: ["20260617-audit96", "把公共工程的施工紀律，用在民間防水需求。", "民間修繕服務", "來電說明案場類型、使用限制與大約範圍", '"foundingDate": "1990"'] },
  { path: "/roof-waterproofing", status: 200, mustContain: ["20260617-audit96", "屋頂、女兒牆與設備周邊防水工程", "服務雙北地區，針對屋面老化", "屋頂反覆滲水，先說明發生時機。", "雨後、連續降雨、冷氣排水或清洗後才出現水痕", "雙北地區屋頂、店面後場、廠辦屋面與設備周邊防水工程", "https://twvita.com.tw/roof-waterproofing#webpage", "https://twvita.com.tw/roof-waterproofing#service"] },
  { path: "/tank-pool-waterproofing", status: 200, mustContain: ["20260617-audit96", "水塔、水箱與池體防水工程", "服務雙北地區，針對蓄水空間", "雙北地區水塔、水箱與小型池體防水工程", "https://twvita.com.tw/tank-pool-waterproofing#webpage", "https://twvita.com.tw/tank-pool-waterproofing#service"] },
  { path: "/projects", status: 200, mustContain: ["20260617-audit96", "工程實績", "大型案場訓練的是判斷順序", "需要初步判斷案場處理方式？", "請描述滲漏時機與已做過的修補方式", "/assets/images/site-roof-detail.jpg"] },
  { path: "/contact", status: 200, mustContain: ["20260617-audit96", "(02)2812-0021", "防水工程洽詢與現場資料整理", "詢問時先說明建築類型、位置、現況與可施工限制", "雙北地區防水工程洽詢，請先說明建築類型、滲漏位置、現況與可施工限制。", "目前服務範圍為雙北地區", "讓我們更快判斷的資訊", "照片與尺寸：全景、細部、長寬高或大約面積", "使用限制：可施工時段", "Email 可補充現場資料", "mailto:vitawaterproof@gmail.com"] },
  { path: "/404", status: 404, mustContain: ["20260617-audit96", "找不到這個頁面"], xRobotsTag: "noindex, nofollow", cacheControl: "no-store" },
  { path: "/404.html", status: 404, mustContain: ["20260617-audit96", "找不到這個頁面"], xRobotsTag: "noindex, nofollow", cacheControl: "no-store" },
  { path: "/not-a-real-page", status: 404, mustContain: ["頁面不存在"], xRobotsTag: "noindex, nofollow" },
  { path: "/assets/does-not-exist.css", status: 404, mustContain: ["20260617-audit96", "找不到這個頁面"], xRobotsTag: "noindex, nofollow", cacheControl: "no-store" },
  { path: "/llms.txt", status: 200, mustContain: ["電話：(02)2812-0021", "vitawaterproof [at] gmail.com", "服務雙北地區專業防水工程", "目前服務範圍為雙北地區", "工程經驗重點", "HTML 原始碼中即提供可用的 mailto 備援", "使用限制、可聯絡時間"] },
  {
    path: "/robots.txt",
    status: 200,
    mustContain: ["Sitemap: https://twvita.com.tw/sitemap.xml"],
    checkSecurityHeaders: false,
    cacheControl: baseUrl.endsWith(".pages.dev") ? "public, max-age=3600, must-revalidate" : undefined,
    contentLanguage: baseUrl.endsWith(".pages.dev") ? "zh-Hant-TW" : undefined,
  },
  { path: "/sitemap.xml", status: 200, mustContain: ["https://twvita.com.tw/contact"] },
  { path: "/assets/styles-20260617-audit96.css", status: 200, minBytes: 15000, mustContain: [".site-header", "@media (prefers-reduced-motion: reduce)", "transition-duration: 0.01ms !important", "@media (forced-colors: active)", "background: ButtonFace", "width: 46px", "height: 46px", "min-height: 44px", "bottom: calc(10px + env(safe-area-inset-bottom, 0px))", "min-height: 48px", "padding-bottom: calc(12rem + env(safe-area-inset-bottom, 0px))", "padding: 1.45rem 1rem 1.55rem", "line-height: 1.62", "padding: 2.2rem 0 2.6rem"], checkContentLanguage: false },
  { path: "/assets/site.js?v=20260617-audit96", status: 200, minBytes: 1800, mustContain: ["data-email-link", "臺灣耘達防水工程評估", "使用限制：", "可聯絡時間：", "aria-hidden", "desktopQuery.matches", "setAttribute(\"inert\"", "removeAttribute(\"inert\")", ".sticky-contact a[href='tel:+886228120021']", "link.textContent = \"來電洽詢\""], checkContentLanguage: false },
];

const htmlPaths = new Set([
  "/",
  "/about",
  "/roof-waterproofing",
  "/tank-pool-waterproofing",
  "/projects",
  "/contact",
  "/404",
  "/404.html",
  "/not-a-real-page",
]);

const nonContactHtmlPaths = new Set([...htmlPaths].filter((path) => path !== "/contact"));

const staleMarkers = [
  "20260617-audit93",
  "20260617-audit92",
  "20260617-audit91",
  "20260617-audit90",
  "20260617-audit89",
  "20260617-audit88",
  "20260617-audit87",
  "20260617-audit86",
  "20260617-audit85",
  "20260617-audit84",
  "20260617-audit83",
  "20260617-audit82",
  "20260617-audit81",
  "20260617-audit80",
  "20260617-audit79",
  "20260617-audit78",
  "20260617-audit77",
  "20260617-audit76",
  "20260617-audit75",
  "20260617-audit74",
  "20260617-audit73",
  "20260617-audit72",
  "20260617-audit71",
  "20260617-audit70",
  "20260617-audit69",
  "20260617-audit68",
  "20260617-audit67",
  "20260617-audit66",
  "20260617-audit65",
  "20260617-audit64",
  "20260617-audit63",
  "20260617-audit62",
  "20260617-audit61",
  "20260617-audit60",
  "20260617-audit59",
  "20260617-audit58",
  "20260617-audit57",
  "20260617-audit56",
  "20260617-audit55",
  "20260617-audit54",
  "20260617-audit53",
  "20260617-audit52",
  "20260617-audit51",
  "20260617-audit50",
  "20260617-audit49",
  "20260617-audit48",
  "20260617-audit47",
  "20260617-audit46",
  "20260617-audit45",
  "20260617-audit44",
  "20260617-audit43",
  "20260617-audit42",
  "20260617-audit41",
  "20260617-audit40",
  "20260617-audit39",
  "20260617-audit38",
  "20260617-audit37",
  "20260617-audit36",
  "20260617-audit35",
  "20260617-audit34",
  "20260617-audit33",
  "20260617-audit32",
  "20260617-audit31",
  "Google Sites",
  "lin.ee",
];

const requiredHtmlContactMarkup = [
  '<nav class="sticky-contact" aria-label="快速聯絡">',
  '<a href="tel:+886228120021" aria-label="來電洽詢臺灣耘達防水工程">來電洽詢</a>',
  'TEL：<a href="tel:+886228120021" aria-label="臺灣耘達電話 (02)2812-0021">(02)2812-0021</a>',
];
const requiredInquiryPhoneButton = '<a class="button" href="tel:+886228120021" aria-label="來電洽詢臺灣耘達防水工程">來電洽詢</a>';

const expectedCspParts = [
  "default-src 'self'",
  "script-src 'self' 'sha256-",
  "script-src-attr 'none'",
  "style-src-attr 'none'",
  "manifest-src 'self'",
  "frame-src 'none'",
  "media-src 'none'",
  "worker-src 'none'",
  "https://static.cloudflareinsights.com",
  "connect-src 'self' https://cloudflareinsights.com",
];

const requiredHeaders = {
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "x-content-type-options": "nosniff",
  "x-frame-options": "SAMEORIGIN",
  "x-permitted-cross-domain-policies": "none",
};

const redirectChecks = [
  { path: "/index.html", status: 301, location: `${baseUrl}/` },
  { path: "/about.html", status: 301, location: `${baseUrl}/about` },
  { path: "/roof-waterproofing.html", status: 301, location: `${baseUrl}/roof-waterproofing` },
  { path: "/tank-pool-waterproofing.html", status: 301, location: `${baseUrl}/tank-pool-waterproofing` },
  { path: "/projects.html", status: 301, location: `${baseUrl}/projects` },
  { path: "/contact.html", status: 301, location: `${baseUrl}/contact` },
  { path: "/about/", status: 301, location: `${baseUrl}/about` },
  { path: "/contact/", status: 301, location: `${baseUrl}/contact` },
  { path: "/home", status: 301, location: "/" },
  { path: "/company", status: 301, location: "/about" },
  { path: "/roof", status: 301, location: "/roof-waterproofing" },
  { path: "/tank", status: 301, location: "/tank-pool-waterproofing" },
  { path: "/pool", status: 301, location: "/tank-pool-waterproofing" },
  { path: "/works", status: 301, location: "/projects" },
  { path: "/contact-us", status: 301, location: "/contact" },
  { path: "/membranes", status: 301, location: "/" },
  { path: "/membranes.html", status: 301, location: "/" },
  { path: "/spec", status: 301, location: "/" },
];

const assetChecks = [
  {
    path: "/manifest.webmanifest",
    status: 200,
    contentType: "application/manifest+json",
    cacheControl: "public, max-age=3600, must-revalidate",
    minBytes: 500,
    mustContain: ["雙北地區", "專業防水工程", "洽詢時請說明現況、位置與可施工限制", "20260617-audit96", "\"id\": \"https://twvita.com.tw/\"", "\"lang\": \"zh-Hant-TW\"", "\"categories\"", "\"shortcuts\"", "\"url\": \"/contact\"", "\"url\": \"/roof-waterproofing\"", "\"url\": \"/tank-pool-waterproofing\""],
  },
  {
    path: "/assets/images/twvita-social-card-20260617.jpg",
    status: 200,
    contentType: "image/jpeg",
    cacheControl: "immutable",
    minBytes: 50000,
  },
  {
    path: "/assets/images/vita-icon.png?v=20260617-audit96",
    status: 200,
    contentType: "image/png",
    cacheControl: "immutable",
    minBytes: 5000,
  },
  {
    path: "/apple-touch-icon.png?v=20260617-audit96",
    status: 200,
    contentType: "image/png",
    cacheControl: "public, max-age=86400, must-revalidate",
    minBytes: 2000,
  },
  {
    path: "/favicon.ico",
    status: 200,
    contentType: "image/vnd.microsoft.icon",
    cacheControl: "public, max-age=86400, must-revalidate",
    minBytes: 5000,
  },
  {
    path: "/assets/images/private-rooftop-repair-720.webp",
    status: 200,
    contentType: "image/webp",
    cacheControl: "immutable",
    minBytes: 20000,
  },
  {
    path: "/assets/images/site-roof-detail-720.webp",
    status: 200,
    contentType: "image/webp",
    cacheControl: "immutable",
    minBytes: 15000,
  },
];

const removedAssetChecks = obsoleteAssets;

const issues = [];

for (const check of checks) {
  const url = `${baseUrl}${check.path}`;
  const response = await fetch(url, { redirect: "manual" });
  const text = await response.text();
  const byteLength = new TextEncoder().encode(text).byteLength;

  if (response.status !== check.status) {
    issues.push(`${url}: expected status ${check.status}, got ${response.status}`);
  }
  if (check.minBytes && byteLength < check.minBytes) {
    issues.push(`${url}: expected at least ${check.minBytes} bytes, got ${byteLength}`);
  }

  for (const expectedText of check.mustContain) {
    if (!text.includes(expectedText)) {
      issues.push(`${url}: missing text ${expectedText}`);
    }
  }

  if (check.xRobotsTag && response.headers.get("x-robots-tag") !== check.xRobotsTag) {
    issues.push(`${url}: x-robots-tag=${response.headers.get("x-robots-tag")} expected ${check.xRobotsTag}`);
  }
  if (check.cacheControl && !(response.headers.get("cache-control") ?? "").includes(check.cacheControl)) {
    issues.push(`${url}: cache-control=${response.headers.get("cache-control")} expected to include ${check.cacheControl}`);
  }
  if (check.contentLanguage && response.headers.get("content-language") !== check.contentLanguage) {
    issues.push(`${url}: content-language=${response.headers.get("content-language")} expected ${check.contentLanguage}`);
  }
  if (baseUrl === "https://twvita.com.tw" && check.path === "/" && response.headers.get("x-robots-tag")) {
    issues.push(`${url}: homepage must not send x-robots-tag=${response.headers.get("x-robots-tag")}`);
  }

  const staleMarker = staleMarkers.find((marker) => text.includes(marker));
  if (staleMarker) {
    issues.push(`${url}: stale content marker found: ${staleMarker}`);
  }

  if (htmlPaths.has(check.path)) {
    const contactMarkup = check.path === "/contact"
      ? requiredHtmlContactMarkup.filter((markup) => !markup.includes("sticky-contact") && !markup.includes("來電洽詢"))
      : requiredHtmlContactMarkup;
    for (const expectedMarkup of contactMarkup) {
      if (!text.includes(expectedMarkup)) {
        issues.push(`${url}: missing direct phone display markup ${expectedMarkup}`);
      }
    }
    if (check.path === "/contact" && !text.includes('<body class="contact-page">')) {
      issues.push(`${url}: contact page should carry contact-page class`);
    }
    if (check.path === "/contact" && text.includes('<nav class="sticky-contact" aria-label="快速聯絡">')) {
      issues.push(`${url}: contact page should not include redundant sticky contact navigation`);
    }
    if (nonContactHtmlPaths.has(check.path) && !text.includes('<nav class="sticky-contact" aria-label="快速聯絡">')) {
      issues.push(`${url}: non-contact page should include sticky contact navigation`);
    }
    if (text.includes('<section class="cta-band">') && !text.includes(requiredInquiryPhoneButton)) {
      issues.push(`${url}: non-footer inquiry phone button should use the short 來電洽詢 CTA label`);
    }
  }

  if (check.checkSecurityHeaders === false) {
    continue;
  }

  const csp = response.headers.get("content-security-policy") ?? "";
  if (csp.includes("unsafe-inline")) {
    issues.push(`${url}: CSP still contains unsafe-inline`);
  }
  for (const cspPart of expectedCspParts) {
    if (!csp.includes(cspPart)) {
      issues.push(`${url}: CSP missing ${cspPart}`);
    }
  }

  for (const [header, expectedValue] of Object.entries(requiredHeaders)) {
    const value = response.headers.get(header);
    if (value !== expectedValue) {
      issues.push(`${url}: ${header}=${value} expected ${expectedValue}`);
    }
  }
  if (check.checkContentLanguage !== false && response.headers.get("content-language") !== "zh-Hant-TW") {
    issues.push(`${url}: content-language=${response.headers.get("content-language")} expected zh-Hant-TW`);
  }
  if (response.headers.has("access-control-allow-origin")) {
    issues.push(`${url}: access-control-allow-origin should be omitted on public HTML responses`);
  }
}

if (baseUrl === "https://twvita.com.tw") {
  const wwwResponse = await fetch("https://www.twvita.com.tw/", { redirect: "manual" });
  if (wwwResponse.status !== 301 || wwwResponse.headers.get("location") !== "https://twvita.com.tw/") {
    issues.push(`https://www.twvita.com.tw/: expected 301 to https://twvita.com.tw/, got ${wwwResponse.status} ${wwwResponse.headers.get("location")}`);
  }
}

for (const redirectCheck of redirectChecks) {
  const url = `${baseUrl}${redirectCheck.path}`;
  const response = await fetch(url, { redirect: "manual" });
  const location = response.headers.get("location");
  if (response.status !== redirectCheck.status || location !== redirectCheck.location) {
    issues.push(`${url}: expected ${redirectCheck.status} to ${redirectCheck.location}, got ${response.status} ${location}`);
  }
}

for (const assetCheck of assetChecks) {
  const url = `${baseUrl}${assetCheck.path}`;
  const response = await fetch(url, { redirect: "manual" });
  const contentType = response.headers.get("content-type") ?? "";
  const cacheControl = response.headers.get("cache-control") ?? "";
  const body = new Uint8Array(await response.arrayBuffer());
  const text = assetCheck.mustContain ? new TextDecoder().decode(body) : "";

  if (response.status !== assetCheck.status) {
    issues.push(`${url}: expected status ${assetCheck.status}, got ${response.status}`);
  }
  if (!contentType.includes(assetCheck.contentType)) {
    issues.push(`${url}: content-type=${contentType} expected to include ${assetCheck.contentType}`);
  }
  if (!cacheControl.includes(assetCheck.cacheControl)) {
    issues.push(`${url}: cache-control=${cacheControl} expected to include ${assetCheck.cacheControl}`);
  }
  if (body.byteLength < assetCheck.minBytes) {
    issues.push(`${url}: expected at least ${assetCheck.minBytes} bytes, got ${body.byteLength}`);
  }
  for (const expectedText of assetCheck.mustContain ?? []) {
    if (!text.includes(expectedText)) {
      issues.push(`${url}: missing asset text ${expectedText}`);
    }
  }
}

if (requireRemovedAssets) {
  for (const path of removedAssetChecks) {
    const url = `${baseUrl}${path}`;
    const response = await fetch(url, { redirect: "manual" });
    if (response.status !== 404) {
      issues.push(`${url}: obsolete stylesheet should return 404, got ${response.status}`);
    }
  }
}

if (issues.length > 0) {
  console.error(`Live smoke failed with ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Smoke passed for ${baseUrl}: ${checks.length} URLs, ${redirectChecks.length} redirects, ${assetChecks.length} assets${requireRemovedAssets ? `, ${removedAssetChecks.length} removed assets` : ""}${baseUrl === "https://twvita.com.tw" ? ", and www redirect" : ""}.`);
