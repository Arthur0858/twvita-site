const baseUrl = process.env.DISCOVERY_BASE_URL ?? "https://twvita.com.tw";

const expectedSitemap = [
  { loc: "https://twvita.com.tw/", priority: "1.0" },
  { loc: "https://twvita.com.tw/about", priority: "0.8" },
  { loc: "https://twvita.com.tw/roof-waterproofing", priority: "0.9" },
  { loc: "https://twvita.com.tw/tank-pool-waterproofing", priority: "0.9" },
  { loc: "https://twvita.com.tw/projects", priority: "0.8" },
  { loc: "https://twvita.com.tw/contact", priority: "0.8" },
];

const issues = [];

const textResponse = async (path) => {
  const response = await fetch(`${baseUrl}${path}`, {
    redirect: "manual",
    headers: { "cache-control": "no-cache" },
  });
  return { response, text: await response.text() };
};

const robots = await textResponse("/robots.txt");
if (robots.response.status !== 200) {
  issues.push(`/robots.txt: expected 200, got ${robots.response.status}`);
}
if (!robots.text.includes("Sitemap: https://twvita.com.tw/sitemap.xml")) {
  issues.push("/robots.txt: missing canonical sitemap declaration");
}
if (!robots.text.includes("User-agent: *") || !robots.text.includes("Allow: /")) {
  issues.push("/robots.txt: should allow general crawling with User-agent: * and Allow: /");
}

const sitemap = await textResponse("/sitemap.xml");
if (sitemap.response.status !== 200) {
  issues.push(`/sitemap.xml: expected 200, got ${sitemap.response.status}`);
}
if (!((sitemap.response.headers.get("content-type") ?? "").includes("application/xml"))) {
  issues.push(`/sitemap.xml: expected application/xml, got ${sitemap.response.headers.get("content-type") ?? "none"}`);
}
const sitemapBlocks = [...sitemap.text.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
if (sitemapBlocks.length !== expectedSitemap.length) {
  issues.push(`/sitemap.xml: expected ${expectedSitemap.length} URLs, found ${sitemapBlocks.length}`);
}
for (const expected of expectedSitemap) {
  const block = sitemapBlocks.find((candidate) => candidate.includes(`<loc>${expected.loc}</loc>`));
  if (!block) {
    issues.push(`/sitemap.xml: missing ${expected.loc}`);
    continue;
  }
  for (const required of ["<lastmod>2026-06-17</lastmod>", "<changefreq>monthly</changefreq>", `<priority>${expected.priority}</priority>`]) {
    if (!block.includes(required)) {
      issues.push(`/sitemap.xml: ${expected.loc} missing ${required}`);
    }
  }
}

for (const expected of expectedSitemap) {
  const response = await fetch(expected.loc, {
    redirect: "manual",
    headers: { "cache-control": "no-cache" },
  });
  const html = await response.text();
  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1] ?? "";
  if (response.status !== 200) {
    issues.push(`${expected.loc}: expected 200, got ${response.status}`);
  }
  if (canonical !== expected.loc) {
    issues.push(`${expected.loc}: canonical should be ${expected.loc}, got ${canonical || "none"}`);
  }
  if (response.headers.get("x-robots-tag")) {
    issues.push(`${expected.loc}: indexable sitemap page should not send x-robots-tag=${response.headers.get("x-robots-tag")}`);
  }
}

const manifestResponse = await fetch(`${baseUrl}/manifest.webmanifest`, {
  redirect: "manual",
  headers: { "cache-control": "no-cache" },
});
const manifestText = await manifestResponse.text();
if (manifestResponse.status !== 200) {
  issues.push(`/manifest.webmanifest: expected 200, got ${manifestResponse.status}`);
}
if (!((manifestResponse.headers.get("content-type") ?? "").includes("application/manifest+json"))) {
  issues.push(`/manifest.webmanifest: expected application/manifest+json, got ${manifestResponse.headers.get("content-type") ?? "none"}`);
}
try {
  const manifest = JSON.parse(manifestText);
  if (manifest.id !== "https://twvita.com.tw/" || manifest.start_url !== "/" || manifest.scope !== "/" || manifest.lang !== "zh-Hant-TW") {
    issues.push("/manifest.webmanifest: id/start_url/scope/lang should match the canonical site");
  }
  const shortcuts = manifest.shortcuts ?? [];
  for (const shortcutUrl of ["/contact", "/roof-waterproofing", "/tank-pool-waterproofing"]) {
    if (!shortcuts.some((shortcut) => shortcut.url === shortcutUrl)) {
      issues.push(`/manifest.webmanifest: missing shortcut ${shortcutUrl}`);
    }
  }
  const iconSrcs = [
    ...(manifest.icons ?? []).map((icon) => icon.src),
    ...shortcuts.flatMap((shortcut) => (shortcut.icons ?? []).map((icon) => icon.src)),
  ];
  for (const iconSrc of new Set(iconSrcs)) {
    const iconResponse = await fetch(new URL(iconSrc, baseUrl), { redirect: "manual" });
    if (iconResponse.status !== 200 || !(iconResponse.headers.get("content-type") ?? "").startsWith("image/")) {
      issues.push(`/manifest.webmanifest: icon ${iconSrc} should return an image 200`);
    }
  }
} catch (error) {
  issues.push(`/manifest.webmanifest: invalid JSON ${error.message}`);
}

if (issues.length > 0) {
  console.error(`Discovery check failed for ${baseUrl} with ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Discovery check passed for ${baseUrl}: ${expectedSitemap.length} sitemap URLs, robots, and manifest.`);
