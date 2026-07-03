const baseUrl = process.env.PERF_BASE_URL ?? "https://twvita.com.tw";

const budgets = [
  { path: "/", status: 200, maxBytes: 26000, contentType: "text/html", cacheIncludes: "max-age=0" },
  { path: "/about", status: 200, maxBytes: 22000, contentType: "text/html", cacheIncludes: "max-age=0" },
  { path: "/roof-waterproofing", status: 200, maxBytes: 24000, contentType: "text/html", cacheIncludes: "max-age=0" },
  { path: "/tank-pool-waterproofing", status: 200, maxBytes: 24000, contentType: "text/html", cacheIncludes: "max-age=0" },
  { path: "/projects", status: 200, maxBytes: 24000, contentType: "text/html", cacheIncludes: "max-age=0" },
  { path: "/contact", status: 200, maxBytes: 18000, contentType: "text/html", cacheIncludes: "max-age=0" },
  { path: "/assets/styles-20260617-audit96.css", status: 200, maxBytes: 22000, contentType: "text/css", cacheIncludes: "immutable" },
  { path: "/assets/site.js?v=20260617-audit96", status: 200, maxBytes: 4000, contentType: "javascript", cacheIncludes: "immutable" },
  { path: "/assets/images/vita-icon.png?v=20260617-audit96", status: 200, maxBytes: 13000, contentType: "image/png", cacheIncludes: "immutable" },
  { path: "/assets/images/twvita-social-card-20260617.jpg", status: 200, maxBytes: 110000, contentType: "image/jpeg", cacheIncludes: "immutable" },
  { path: "/assets/images/private-rooftop-repair-720.webp", status: 200, maxBytes: 45000, contentType: "image/webp", cacheIncludes: "immutable" },
  { path: "/assets/images/private-shop-roof-720.webp", status: 200, maxBytes: 45000, contentType: "image/webp", cacheIncludes: "immutable" },
  { path: "/assets/images/private-tank-lining-720.webp", status: 200, maxBytes: 26000, contentType: "image/webp", cacheIncludes: "immutable" },
  { path: "/assets/images/site-roof-detail-720.webp", status: 200, maxBytes: 34000, contentType: "image/webp", cacheIncludes: "immutable" },
  { path: "/assets/images/roof-waterproof-surface-720.webp", status: 200, maxBytes: 54000, contentType: "image/webp", cacheIncludes: "immutable" },
];

const issues = [];
let totalCriticalBytes = 0;

for (const budget of budgets) {
  const url = `${baseUrl}${budget.path}`;
  const response = await fetch(url, {
    redirect: "manual",
    headers: { "cache-control": "no-cache" },
  });
  const body = new Uint8Array(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") ?? "";
  const cacheControl = response.headers.get("cache-control") ?? "";

  if (response.status !== budget.status) {
    issues.push(`${url}: expected status ${budget.status}, got ${response.status}`);
  }
  if (body.byteLength > budget.maxBytes) {
    issues.push(`${url}: expected <= ${budget.maxBytes} bytes, got ${body.byteLength}`);
  }
  if (!contentType.includes(budget.contentType)) {
    issues.push(`${url}: expected content-type including ${budget.contentType}, got ${contentType || "none"}`);
  }
  if (!cacheControl.includes(budget.cacheIncludes)) {
    issues.push(`${url}: expected cache-control including ${budget.cacheIncludes}, got ${cacheControl || "none"}`);
  }
  if (["/", "/assets/styles-20260617-audit96.css", "/assets/site.js?v=20260617-audit96", "/assets/images/private-rooftop-repair-720.webp"].includes(budget.path)) {
    totalCriticalBytes += body.byteLength;
  }
}

if (totalCriticalBytes > 90000) {
  issues.push(`homepage critical HTML/CSS/JS/hero image budget expected <= 90000 bytes, got ${totalCriticalBytes}`);
}

if (issues.length > 0) {
  console.error(`Performance budget failed for ${baseUrl} with ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Performance budget passed for ${baseUrl}: ${budgets.length} URLs, critical homepage bytes ${totalCriticalBytes}.`);
