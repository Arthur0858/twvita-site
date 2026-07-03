const baseUrl = process.env.METADATA_BASE_URL ?? "https://twvita.com.tw";
const canonicalBaseUrl = process.env.METADATA_CANONICAL_BASE_URL ?? "https://twvita.com.tw";

const pages = [
  {
    path: "/",
    title: "臺灣耘達股份有限公司 | 雙北專業防水公司",
    h1: "雙北地區專業防水公司",
    requiredDescriptionTerms: ["雙北地區", "專業防水公司", "屋頂", "水塔水池", "修繕"],
  },
  {
    path: "/about",
    title: "公司簡介 | 臺灣耘達股份有限公司",
    h1: "把公共工程的施工紀律，用在民間防水需求。",
    requiredDescriptionTerms: ["30年以上", "公共工程", "雙北地區", "民間防水", "施工經驗"],
  },
  {
    path: "/roof-waterproofing",
    title: "屋頂與設備周邊防水 | 臺灣耘達股份有限公司",
    h1: "屋頂、女兒牆與設備周邊防水工程",
    requiredDescriptionTerms: ["雙北地區", "屋面防水", "排水", "設備節點"],
  },
  {
    path: "/tank-pool-waterproofing",
    title: "水塔、水箱與池體防水 | 臺灣耘達股份有限公司",
    h1: "水塔、水箱與池體防水工程",
    requiredDescriptionTerms: ["雙北地區", "水塔", "水箱", "池體"],
  },
  {
    path: "/projects",
    title: "施作工程實績 | 臺灣耘達股份有限公司",
    h1: "用過往案場，說明我們重視的細節。",
    requiredDescriptionTerms: ["捷運", "隧道", "蓄水池", "屋面工程", "現場協調"],
  },
  {
    path: "/contact",
    title: "聯絡我們 | 臺灣耘達股份有限公司",
    h1: "防水工程洽詢與現場資料整理",
    requiredDescriptionTerms: ["雙北地區", "建築類型", "現況", "可施工限制"],
  },
];

const issues = [];
const seenTitles = new Map();
const seenDescriptions = new Map();

const attr = (html, selector) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.match(new RegExp(`<meta ${escaped} content="([^"]+)"`))?.[1] ?? "";
};
const linkHref = (html, rel) => html.match(new RegExp(`<link rel="${rel}" href="([^"]+)">`))?.[1] ?? "";
const titleText = (html) => html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
const h1Text = (html) => html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() ?? "";

const checkLength = (label, value, min, max) => {
  const length = [...value].length;
  if (length < min || length > max) {
    issues.push(`${label}: length ${length} should be between ${min} and ${max}`);
  }
};

for (const page of pages) {
  const fetchUrl = `${baseUrl}${page.path === "/" ? "/" : page.path}`;
  const expectedUrl = `${canonicalBaseUrl}${page.path === "/" ? "/" : page.path}`;
  const response = await fetch(fetchUrl, {
    redirect: "manual",
    headers: { "cache-control": "no-cache" },
  });
  const html = await response.text();
  if (response.status !== 200) {
    issues.push(`${fetchUrl}: expected HTTP 200, got ${response.status}`);
    continue;
  }

  const title = titleText(html);
  const description = attr(html, 'name="description"');
  const canonical = linkHref(html, "canonical");
  const ogTitle = attr(html, 'property="og:title"');
  const ogDescription = attr(html, 'property="og:description"');
  const ogUrl = attr(html, 'property="og:url"');
  const ogImage = attr(html, 'property="og:image"');
  const ogSecureImage = attr(html, 'property="og:image:secure_url"');
  const ogImageWidth = attr(html, 'property="og:image:width"');
  const ogImageHeight = attr(html, 'property="og:image:height"');
  const ogImageAlt = attr(html, 'property="og:image:alt"');
  const twitterCard = attr(html, 'name="twitter:card"');
  const twitterTitle = attr(html, 'name="twitter:title"');
  const twitterDescription = attr(html, 'name="twitter:description"');
  const twitterImage = attr(html, 'name="twitter:image"');
  const twitterImageAlt = attr(html, 'name="twitter:image:alt"');
  const h1 = h1Text(html);

  if (title !== page.title) {
    issues.push(`${fetchUrl}: title should be "${page.title}", got "${title}"`);
  }
  if (h1 !== page.h1) {
    issues.push(`${fetchUrl}: h1 should be "${page.h1}", got "${h1}"`);
  }
  checkLength(`${fetchUrl} title`, title, 10, 32);
  checkLength(`${fetchUrl} meta description`, description, 30, 85);
  checkLength(`${fetchUrl} og description`, ogDescription, 24, 65);

  for (const [label, value, map] of [
    ["title", title, seenTitles],
    ["meta description", description, seenDescriptions],
  ]) {
    if (map.has(value)) {
      issues.push(`${fetchUrl}: duplicate ${label} also used by ${map.get(value)}`);
    } else {
      map.set(value, fetchUrl);
    }
  }

  for (const term of page.requiredDescriptionTerms) {
    if (!description.includes(term)) {
      issues.push(`${fetchUrl}: meta description missing page-specific term "${term}"`);
    }
  }
  if (canonical !== expectedUrl) {
    issues.push(`${fetchUrl}: canonical should be ${expectedUrl}, got ${canonical || "none"}`);
  }
  if (ogUrl !== expectedUrl) {
    issues.push(`${fetchUrl}: og:url should be ${expectedUrl}, got ${ogUrl || "none"}`);
  }
  if (ogTitle !== title || twitterTitle !== title) {
    issues.push(`${fetchUrl}: OG/Twitter titles should match the document title`);
  }
  if (twitterDescription !== ogDescription) {
    issues.push(`${fetchUrl}: Twitter description should match OG description`);
  }
  if (description === ogDescription) {
    issues.push(`${fetchUrl}: meta description and OG description should not be identical`);
  }
  if (twitterCard !== "summary_large_image") {
    issues.push(`${fetchUrl}: twitter:card should be summary_large_image`);
  }
  if (
    ogImage !== "https://twvita.com.tw/assets/images/twvita-social-card-20260617.jpg" ||
    ogSecureImage !== ogImage ||
    twitterImage !== ogImage
  ) {
    issues.push(`${fetchUrl}: social image URLs should use the canonical 1200x630 card`);
  }
  if (ogImageWidth !== "1200" || ogImageHeight !== "630") {
    issues.push(`${fetchUrl}: social image dimensions should be 1200x630`);
  }
  if (ogImageAlt !== "臺灣耘達防水工程公司分享圖" || twitterImageAlt !== ogImageAlt) {
    issues.push(`${fetchUrl}: social image alt text should be consistent`);
  }
}

if (issues.length > 0) {
  console.error(`Metadata check failed for ${baseUrl} with ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Metadata check passed for ${baseUrl}: ${pages.length} pages with canonical base ${canonicalBaseUrl}.`);
