const baseUrl = process.env.STRUCTURED_BASE_URL ?? "https://twvita.com.tw";

const pages = [
  {
    path: "/",
    required: ["WebPage", "WebSite", "LocalBusiness", "SiteNavigationElement"],
    pageId: "https://twvita.com.tw/#homepage",
    primaryImage: "https://twvita.com.tw/assets/images/private-rooftop-repair.jpg",
  },
  {
    path: "/about",
    required: ["AboutPage", "WebSite", "LocalBusiness", "BreadcrumbList", "SiteNavigationElement"],
    pageId: "https://twvita.com.tw/about#page",
    breadcrumbId: "https://twvita.com.tw/about#breadcrumb",
    breadcrumbName: "公司簡介",
    primaryImage: "https://twvita.com.tw/assets/images/private-rooftop-repair.jpg",
  },
  {
    path: "/roof-waterproofing",
    required: ["WebPage", "WebSite", "Service", "BreadcrumbList", "SiteNavigationElement", "FAQPage"],
    pageId: "https://twvita.com.tw/roof-waterproofing#webpage",
    serviceId: "https://twvita.com.tw/roof-waterproofing#service",
    breadcrumbId: "https://twvita.com.tw/roof-waterproofing#breadcrumb",
    breadcrumbName: "屋頂防水",
    primaryImage: "https://twvita.com.tw/assets/images/private-shop-roof.jpg",
    faqCount: 3,
  },
  {
    path: "/tank-pool-waterproofing",
    required: ["WebPage", "WebSite", "Service", "BreadcrumbList", "SiteNavigationElement", "FAQPage"],
    pageId: "https://twvita.com.tw/tank-pool-waterproofing#webpage",
    serviceId: "https://twvita.com.tw/tank-pool-waterproofing#service",
    breadcrumbId: "https://twvita.com.tw/tank-pool-waterproofing#breadcrumb",
    breadcrumbName: "水塔水池",
    primaryImage: "https://twvita.com.tw/assets/images/private-tank-lining.jpg",
    faqCount: 3,
  },
  {
    path: "/projects",
    required: ["CollectionPage", "ItemList", "WebSite", "LocalBusiness", "BreadcrumbList", "SiteNavigationElement"],
    pageId: "https://twvita.com.tw/projects#page",
    itemListId: "https://twvita.com.tw/projects#project-categories",
    breadcrumbId: "https://twvita.com.tw/projects#breadcrumb",
    breadcrumbName: "工程實績",
    itemCount: 5,
  },
  {
    path: "/contact",
    required: ["ContactPage", "WebSite", "LocalBusiness", "BreadcrumbList", "SiteNavigationElement"],
    pageId: "https://twvita.com.tw/contact#page",
    breadcrumbId: "https://twvita.com.tw/contact#breadcrumb",
    breadcrumbName: "聯絡我們",
    primaryImage: "https://twvita.com.tw/assets/images/twvita-social-card-20260617.jpg",
  },
];

const issues = [];
const graphNodes = (value) => Array.isArray(value?.["@graph"]) ? value["@graph"] : [value].filter(Boolean);

for (const page of pages) {
  const url = `${baseUrl}${page.path}`;
  const response = await fetch(url, { headers: { "cache-control": "no-cache" } });
  const html = await response.text();
  if (response.status !== 200) {
    issues.push(`${url}: expected 200, got ${response.status}`);
    continue;
  }

  const nodes = [];
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      nodes.push(...graphNodes(JSON.parse(match[1])));
    } catch (error) {
      issues.push(`${url}: invalid JSON-LD ${error.message}`);
    }
  }

  const nodeTypes = new Set(nodes.map((node) => node["@type"]));
  for (const type of page.required) {
    if (!nodeTypes.has(type)) {
      issues.push(`${url}: missing ${type} JSON-LD`);
    }
  }
  for (const node of nodes) {
    if (page.required.includes(node["@type"]) && node.inLanguage !== "zh-Hant-TW") {
      issues.push(`${url}: ${node["@type"]} should declare zh-Hant-TW`);
    }
  }

  const pageNode = nodes.find((node) => node["@id"] === page.pageId);
  if (!pageNode) {
    issues.push(`${url}: missing page node ${page.pageId}`);
  } else if (page.primaryImage && pageNode.primaryImageOfPage?.["@id"] !== page.primaryImage) {
    issues.push(`${url}: primaryImageOfPage should be ${page.primaryImage}`);
  }

  const website = nodes.find((node) => node["@id"] === "https://twvita.com.tw/#website");
  if (!website || website.publisher?.["@id"] !== "https://twvita.com.tw/#business") {
    issues.push(`${url}: WebSite should reference the stable business publisher`);
  }

  const nav = nodes.find((node) => node["@id"] === "https://twvita.com.tw/#site-navigation");
  const navUrls = (nav?.hasPart ?? []).map((item) => item.url);
  for (const requiredUrl of ["https://twvita.com.tw/", "https://twvita.com.tw/about", "https://twvita.com.tw/roof-waterproofing", "https://twvita.com.tw/tank-pool-waterproofing", "https://twvita.com.tw/projects", "https://twvita.com.tw/contact"]) {
    if (!navUrls.includes(requiredUrl)) {
      issues.push(`${url}: SiteNavigationElement missing ${requiredUrl}`);
    }
  }

  if (page.breadcrumbId) {
    const breadcrumb = nodes.find((node) => node["@id"] === page.breadcrumbId);
    const items = breadcrumb?.itemListElement ?? [];
    if (!breadcrumb || items.length !== 2 || items[0]?.name !== "首頁" || items[0]?.item !== "https://twvita.com.tw/" || items[1]?.name !== page.breadcrumbName || items[1]?.item !== `${baseUrl}${page.path}`) {
      issues.push(`${url}: breadcrumb should contain homepage and ${page.breadcrumbName}`);
    }
    if (pageNode?.breadcrumb?.["@id"] !== page.breadcrumbId) {
      issues.push(`${url}: page node should link to ${page.breadcrumbId}`);
    }
  }

  const business = nodes.find((node) => node["@id"] === "https://twvita.com.tw/#business")
    ?? nodes.find((node) => node["@type"] === "Service")?.provider;
  if (business) {
    if (business.telephone !== "+886-2-2812-0021" || business.email !== "vitawaterproof@gmail.com") {
      issues.push(`${url}: business contact data should match current phone and Email`);
    }
    for (const city of ["台北市", "新北市"]) {
      if (!(business.areaServed ?? []).includes(city)) {
        issues.push(`${url}: business areaServed missing ${city}`);
      }
    }
  }

  if (page.serviceId) {
    const service = nodes.find((node) => node["@id"] === page.serviceId);
    if (!service || service.provider?.["@id"] !== "https://twvita.com.tw/#business") {
      issues.push(`${url}: Service should use stable provider id`);
    }
    const faq = nodes.find((node) => node["@type"] === "FAQPage");
    if (!faq || (faq.mainEntity ?? []).length !== page.faqCount) {
      issues.push(`${url}: FAQPage should contain ${page.faqCount} questions`);
    }
  }

  if (page.itemListId) {
    const itemList = nodes.find((node) => node["@id"] === page.itemListId);
    if (!itemList || itemList.numberOfItems !== page.itemCount || (itemList.itemListElement ?? []).length !== page.itemCount) {
      issues.push(`${url}: ItemList should contain ${page.itemCount} project categories`);
    }
    if (pageNode?.mainEntity?.["@id"] !== page.itemListId) {
      issues.push(`${url}: CollectionPage should link to project category ItemList`);
    }
  }
}

if (issues.length > 0) {
  console.error(`Structured data check failed for ${baseUrl} with ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Structured data check passed for ${baseUrl}: ${pages.length} pages.`);
