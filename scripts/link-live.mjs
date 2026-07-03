const baseUrl = process.env.LINK_BASE_URL ?? "https://twvita.com.tw";

const sourcePages = [
  { path: "/", status: 200 },
  { path: "/about", status: 200 },
  { path: "/roof-waterproofing", status: 200 },
  { path: "/tank-pool-waterproofing", status: 200 },
  { path: "/projects", status: 200 },
  { path: "/contact", status: 200 },
  { path: "/404", status: 404 },
];

const issues = [];
const internalUrls = new Map();

const decodeAttribute = (value) => value
  .replace(/&amp;/g, "&")
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .trim();

const addInternalUrl = (sourcePath, rawValue) => {
  const value = decodeAttribute(rawValue);
  if (!value || value.startsWith("data:") || value.startsWith("tel:") || value.startsWith("mailto:") || value.startsWith("#")) {
    return;
  }
  let url;
  try {
    url = new URL(value, `${baseUrl}${sourcePath}`);
  } catch {
    issues.push(`${sourcePath}: invalid URL ${value}`);
    return;
  }
  if (url.origin !== baseUrl) {
    issues.push(`${sourcePath}: unexpected external URL ${value}`);
    return;
  }
  url.hash = "";
  const normalized = url.toString();
  if (!internalUrls.has(normalized)) {
    internalUrls.set(normalized, new Set());
  }
  internalUrls.get(normalized).add(sourcePath);
};

const parseSrcset = (value) => value
  .split(",")
  .map((candidate) => candidate.trim().split(/\s+/)[0])
  .filter(Boolean);

const validateMailto = (sourcePath, rawValue) => {
  const value = decodeAttribute(rawValue);
  const decoded = decodeURIComponent(value);
  if (!decoded.startsWith("mailto:vitawaterproof@gmail.com?")) {
    issues.push(`${sourcePath}: mailto should target vitawaterproof@gmail.com: ${value}`);
  }
  for (const required of ["subject=臺灣耘達防水工程評估", "建築類型：", "問題位置：", "目前狀況：", "照片或尺寸：", "使用限制：", "可聯絡時間："]) {
    if (!decoded.includes(required)) {
      issues.push(`${sourcePath}: mailto missing ${required}`);
    }
  }
};

const validateTel = (sourcePath, value) => {
  if (value !== "tel:+886228120021") {
    issues.push(`${sourcePath}: telephone link should use tel:+886228120021, found ${value}`);
  }
};

const stripTags = (value) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const extractLinks = (html, protocol) => [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)]
  .map((match) => {
    const attributes = match[1];
    const href = match[1].match(/\bhref="([^"]+)"/)?.[1] ?? "";
    return {
      attributes,
      href: decodeAttribute(href),
      text: stripTags(match[2]),
    };
  })
  .filter((link) => link.href.startsWith(protocol));

const countEmailInquiryLinks = (html) => [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)]
  .filter((match) => {
    const attributes = match[1];
    const href = decodeAttribute(attributes.match(/\bhref="([^"]+)"/)?.[1] ?? "");
    return attributes.includes("data-email-link") &&
      (href.startsWith("mailto:") || href.startsWith("/cdn-cgi/l/email-protection"));
  })
  .length;

const validateContactLabels = (sourcePath, html) => {
  const telLinks = extractLinks(html, "tel:");
  const mailLinkCount = countEmailInquiryLinks(html);
  const footerPhoneLinks = telLinks.filter((link) => link.text === "(02)2812-0021");
  const inquiryPhoneLinks = telLinks.filter((link) => link.text === "來電洽詢");

  if (mailLinkCount < 1) {
    issues.push(`${sourcePath}: should keep at least one Email inquiry link`);
  }

  if (sourcePath === "/contact") {
    if (inquiryPhoneLinks.length < 1) {
      issues.push(`${sourcePath}: contact page lower phone action should use 來電洽詢`);
    }
    if (footerPhoneLinks.length < 2) {
      issues.push(`${sourcePath}: contact page should show direct phone number in contact info and footer`);
    }
    if (html.includes('class="sticky-contact"')) {
      issues.push(`${sourcePath}: contact page should not render the mobile sticky contact bar`);
    }
    return;
  }

  if (inquiryPhoneLinks.length < 1) {
    issues.push(`${sourcePath}: non-contact pages should label primary phone CTAs as 來電洽詢`);
  }
  if (footerPhoneLinks.length < 1) {
    issues.push(`${sourcePath}: footer should display direct phone number`);
  }
};

for (const page of sourcePages) {
  const url = `${baseUrl}${page.path}`;
  const response = await fetch(url, { redirect: "manual", headers: { "cache-control": "no-cache" } });
  const html = await response.text();

  if (response.status !== page.status) {
    issues.push(`${url}: expected ${page.status}, got ${response.status}`);
    continue;
  }

  validateContactLabels(page.path, html);

  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const value = decodeAttribute(match[1]);
    if (value.startsWith("tel:")) {
      validateTel(page.path, value);
    } else if (value.startsWith("mailto:")) {
      validateMailto(page.path, value);
    } else {
      addInternalUrl(page.path, value);
    }
  }

  for (const match of html.matchAll(/<meta\b[^>]*(?:property|name)="(?:og:url|og:image|og:image:secure_url|twitter:image)"[^>]*content="([^"]+)"[^>]*>/g)) {
    addInternalUrl(page.path, match[1]);
  }

  for (const match of html.matchAll(/\b(?:srcset|imagesrcset)="([^"]+)"/g)) {
    for (const candidate of parseSrcset(decodeAttribute(match[1]))) {
      addInternalUrl(page.path, candidate);
    }
  }

  for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) {
    const targetId = match[1];
    if (!html.includes(`id="${targetId}"`)) {
      issues.push(`${page.path}: in-page anchor #${targetId} has no matching id`);
    }
  }
}

for (const [url, sources] of internalUrls) {
  if (url.startsWith(`${baseUrl}/cdn-cgi/`)) {
    continue;
  }
  const response = await fetch(url, { redirect: "manual", headers: { "cache-control": "no-cache" } });
  if (response.status !== 200) {
    issues.push(`${url}: expected 200, got ${response.status}; referenced from ${[...sources].join(", ")}`);
    continue;
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (url.endsWith(".css") && !contentType.includes("text/css")) {
    issues.push(`${url}: stylesheet response content-type should be text/css, got ${contentType}`);
  }
  if (url.endsWith(".js") && !contentType.includes("javascript")) {
    issues.push(`${url}: script response content-type should be JavaScript, got ${contentType}`);
  }
  if (/\.(?:png|jpe?g|webp|ico)(?:$|\?)/.test(url) && !contentType.startsWith("image/")) {
    issues.push(`${url}: image response content-type should be image/*, got ${contentType}`);
  }
}

if (issues.length > 0) {
  console.error(`Live link check failed for ${baseUrl} with ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Live link check passed for ${baseUrl}: ${sourcePages.length} pages and ${internalUrls.size} internal URLs.`);
