const baseUrl = process.env.HEADERS_BASE_URL ?? "https://twvita.com.tw";
const isPreview = baseUrl.endsWith(".pages.dev");

const securityHeaders = {
  "content-security-policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "img-src 'self' data:",
    "script-src 'self' 'sha256-",
    "script-src-attr 'none'",
    "style-src 'self'",
    "style-src-attr 'none'",
    "font-src 'self'",
    "manifest-src 'self'",
    "frame-src 'none'",
    "media-src 'none'",
    "worker-src 'none'",
    "connect-src 'self' https://cloudflareinsights.com",
    "upgrade-insecure-requests",
  ],
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "x-content-type-options": "nosniff",
  "x-frame-options": "SAMEORIGIN",
  "x-permitted-cross-domain-policies": "none",
};

const resources = [
  { path: "/", status: 200, type: "text/html", cache: "public, max-age=0, must-revalidate, no-transform", language: "zh-Hant-TW", indexable: true },
  { path: "/about", status: 200, type: "text/html", cache: "public, max-age=0, must-revalidate, no-transform", language: "zh-Hant-TW", indexable: true },
  { path: "/roof-waterproofing", status: 200, type: "text/html", cache: "public, max-age=0, must-revalidate, no-transform", language: "zh-Hant-TW", indexable: true },
  { path: "/tank-pool-waterproofing", status: 200, type: "text/html", cache: "public, max-age=0, must-revalidate, no-transform", language: "zh-Hant-TW", indexable: true },
  { path: "/projects", status: 200, type: "text/html", cache: "public, max-age=0, must-revalidate, no-transform", language: "zh-Hant-TW", indexable: true },
  { path: "/contact", status: 200, type: "text/html", cache: "public, max-age=0, must-revalidate, no-transform", language: "zh-Hant-TW", indexable: true },
  { path: "/404", status: 404, type: "text/html", cache: "no-store", language: "zh-Hant-TW", robots: "noindex, nofollow" },
  { path: "/not-a-real-page", status: 404, type: "text/html", language: "zh-Hant-TW", robots: "noindex, nofollow" },
  { path: "/robots.txt", status: 200, type: "text/plain", cache: isPreview ? "public, max-age=3600, must-revalidate, no-transform" : undefined, language: isPreview ? "zh-Hant-TW" : undefined, security: isPreview },
  { path: "/sitemap.xml", status: 200, type: "application/xml", cache: "public, max-age=3600, must-revalidate", language: "zh-Hant-TW" },
  { path: "/manifest.webmanifest", status: 200, type: "application/manifest+json", cache: "public, max-age=3600, must-revalidate", language: "zh-Hant-TW" },
  { path: "/llms.txt", status: 200, type: "text/plain", cache: "public, max-age=3600, must-revalidate", language: "zh-Hant-TW" },
  { path: "/assets/styles-20260617-audit96.css", status: 200, type: "text/css", cache: "public, max-age=31536000, immutable", asset: true },
  { path: "/assets/site.js?v=20260617-audit96", status: 200, type: "javascript", cache: "public, max-age=31536000, immutable", asset: true },
  { path: "/assets/images/vita-icon.png?v=20260617-audit96", status: 200, type: "image/png", cache: "public, max-age=31536000, immutable", asset: true },
  ...(isPreview ? [
    { path: "/assets/styles-20260617-audit92.css", status: 404, type: "text/plain", cache: "public, max-age=0, must-revalidate, no-transform", language: "zh-Hant-TW", robots: "noindex, nofollow" },
  ] : []),
];

const issues = [];

function expectHeader(response, path, header, expected) {
  const value = response.headers.get(header);
  if (value !== expected) {
    issues.push(`${path}: ${header}=${value} expected ${expected}`);
  }
}

function expectHeaderIncludes(response, path, header, expected) {
  const value = response.headers.get(header) ?? "";
  if (!value.includes(expected)) {
    issues.push(`${path}: ${header}=${value || "none"} expected to include ${expected}`);
  }
}

function checkSecurityHeaders(response, path) {
  for (const [header, expected] of Object.entries(securityHeaders)) {
    if (Array.isArray(expected)) {
      for (const part of expected) {
        expectHeaderIncludes(response, path, header, part);
      }
      const csp = response.headers.get(header) ?? "";
      if (csp.includes("unsafe-inline") || csp.includes("unsafe-eval")) {
        issues.push(`${path}: CSP must not allow unsafe-inline or unsafe-eval`);
      }
    } else {
      expectHeader(response, path, header, expected);
    }
  }
  if (response.headers.has("access-control-allow-origin")) {
    issues.push(`${path}: access-control-allow-origin should be omitted`);
  }
}

for (const resource of resources) {
  const response = await fetch(`${baseUrl}${resource.path}`, {
    redirect: "manual",
    headers: { "cache-control": "no-cache" },
  });
  const path = resource.path;

  if (response.status !== resource.status) {
    issues.push(`${path}: status=${response.status} expected ${resource.status}`);
  }
  expectHeaderIncludes(response, path, "content-type", resource.type);
  if (resource.cache) {
    expectHeaderIncludes(response, path, "cache-control", resource.cache);
  }
  if (resource.language) {
    expectHeader(response, path, "content-language", resource.language);
  }
  if (resource.robots) {
    expectHeader(response, path, "x-robots-tag", resource.robots);
  }
  if (!isPreview && resource.indexable && response.headers.has("x-robots-tag")) {
    issues.push(`${path}: indexable page should not send x-robots-tag=${response.headers.get("x-robots-tag")}`);
  }
  if (resource.security !== false) {
    checkSecurityHeaders(response, path);
  }
}

if (baseUrl === "https://twvita.com.tw") {
  const www = await fetch("https://www.twvita.com.tw/", { redirect: "manual" });
  if (www.status !== 301 || www.headers.get("location") !== "https://twvita.com.tw/") {
    issues.push(`www redirect: expected 301 to https://twvita.com.tw/, got ${www.status} ${www.headers.get("location")}`);
  }
  checkSecurityHeaders(www, "www redirect");
}

if (issues.length > 0) {
  console.error(`Header check failed for ${baseUrl}:`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Header check passed for ${baseUrl}: ${resources.length} resources.`);
