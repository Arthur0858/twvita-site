import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const workerPath = path.join(publicDir, "_worker.js");
const issues = [];

const canonicalRoutes = new Map([
  ["/", "index.html"],
  ["/about", "about"],
  ["/roof-waterproofing", "roof-waterproofing"],
  ["/tank-pool-waterproofing", "tank-pool-waterproofing"],
  ["/projects", "projects"],
  ["/contact", "contact"],
  ["/404.html", "404.html"],
]);

const pageSeoExpectations = {
  "index.html": {
    canonical: "https://twvita.com.tw/",
    currentNav: "首頁",
    title: "臺灣耘達股份有限公司 | 雙北專業防水公司",
    description: "臺灣耘達股份有限公司為服務雙北地區的專業防水公司，承接屋頂、水塔水池、設備基座與管線周邊防水工程，依水路、基層與細部收邊規劃修繕。",
    h1: "雙北地區專業防水公司",
    ogDescription: "服務雙北地區的專業防水公司，以水路判斷、基層檢查、細部收邊與施工條件評估屋頂、水塔水池及設備周邊防水工程。",
  },
  "about": {
    canonical: "https://twvita.com.tw/about",
    currentNav: "公司簡介",
    title: "公司簡介 | 臺灣耘達股份有限公司",
    description: "臺灣耘達股份有限公司具30年以上防水施工經驗，將公共工程案場累積的材料判斷、接縫處理與現場協調能力，轉化為雙北地區民間防水工程服務。",
    h1: "把公共工程的施工紀律，用在民間防水需求。",
    ogDescription: "30年以上防水施工經驗，將公共工程建立的施工紀律，落實在雙北住家、社區、店面與小型廠辦防水工程。",
  },
  "about.html": {
    canonical: "https://twvita.com.tw/about",
    currentNav: "公司簡介",
    title: "公司簡介 | 臺灣耘達股份有限公司",
    description: "臺灣耘達股份有限公司具30年以上防水施工經驗，將公共工程案場累積的材料判斷、接縫處理與現場協調能力，轉化為雙北地區民間防水工程服務。",
    h1: "把公共工程的施工紀律，用在民間防水需求。",
    ogDescription: "30年以上防水施工經驗，將公共工程建立的施工紀律，落實在雙北住家、社區、店面與小型廠辦防水工程。",
  },
  "roof-waterproofing": {
    canonical: "https://twvita.com.tw/roof-waterproofing",
    currentNav: "屋頂防水",
    title: "屋頂與設備周邊防水 | 臺灣耘達股份有限公司",
    description: "雙北地區頂樓、鐵皮屋、店面後場與小型廠辦屋面防水工程，依排水、基層與設備節點規劃施工。",
    h1: "屋頂、女兒牆與設備周邊防水工程",
    ogDescription: "雙北地區屋頂、店面後場、廠辦屋面與設備周邊防水工程，依排水與細部收邊規劃。",
  },
  "roof-waterproofing.html": {
    canonical: "https://twvita.com.tw/roof-waterproofing",
    currentNav: "屋頂防水",
    title: "屋頂與設備周邊防水 | 臺灣耘達股份有限公司",
    description: "雙北地區頂樓、鐵皮屋、店面後場與小型廠辦屋面防水工程，依排水、基層與設備節點規劃施工。",
    h1: "屋頂、女兒牆與設備周邊防水工程",
    ogDescription: "雙北地區屋頂、店面後場、廠辦屋面與設備周邊防水工程，依排水與細部收邊規劃。",
  },
  "tank-pool-waterproofing": {
    canonical: "https://twvita.com.tw/tank-pool-waterproofing",
    currentNav: "水塔水池",
    title: "水塔、水箱與池體防水 | 臺灣耘達股份有限公司",
    description: "雙北地區水塔、水箱、蓄水池與小型池體防水工程，依池體材質、滲漏位置、清潔維護與可施工時段規劃。",
    h1: "水塔、水箱與池體防水工程",
    ogDescription: "雙北地區水塔、水箱與小型池體防水工程，先確認池體條件、滲水位置與後續維護方式。",
  },
  "tank-pool-waterproofing.html": {
    canonical: "https://twvita.com.tw/tank-pool-waterproofing",
    currentNav: "水塔水池",
    title: "水塔、水箱與池體防水 | 臺灣耘達股份有限公司",
    description: "雙北地區水塔、水箱、蓄水池與小型池體防水工程，依池體材質、滲漏位置、清潔維護與可施工時段規劃。",
    h1: "水塔、水箱與池體防水工程",
    ogDescription: "雙北地區水塔、水箱與小型池體防水工程，先確認池體條件、滲水位置與後續維護方式。",
  },
  "projects": {
    canonical: "https://twvita.com.tw/projects",
    currentNav: "工程實績",
    title: "施作工程實績 | 臺灣耘達股份有限公司",
    description: "臺灣耘達歷年案場包含捷運、隧道、蓄水池、環保場域與屋面工程，說明公司在防水層連續性、接縫與現場協調上的經驗。",
    h1: "用過往案場，說明我們重視的細節。",
    ogDescription: "歷年屋面、蓄水池、隧道、捷運與環保場域經驗，重點在防水層連續性、接縫、收邊與現場協調。",
  },
  "projects.html": {
    canonical: "https://twvita.com.tw/projects",
    currentNav: "工程實績",
    title: "施作工程實績 | 臺灣耘達股份有限公司",
    description: "臺灣耘達歷年案場包含捷運、隧道、蓄水池、環保場域與屋面工程，說明公司在防水層連續性、接縫與現場協調上的經驗。",
    h1: "用過往案場，說明我們重視的細節。",
    ogDescription: "歷年屋面、蓄水池、隧道、捷運與環保場域經驗，重點在防水層連續性、接縫、收邊與現場協調。",
  },
  "contact": {
    canonical: "https://twvita.com.tw/contact",
    currentNav: "聯絡我們",
    title: "聯絡我們 | 臺灣耘達股份有限公司",
    description: "聯絡臺灣耘達股份有限公司，洽詢雙北地區屋頂、水塔水池與設備周邊防水工程；請先說明建築類型、位置、現況與可施工限制。",
    h1: "防水工程洽詢與現場資料整理",
    ogDescription: "雙北地區防水工程洽詢，請先說明建築類型、滲漏位置、現況與可施工限制。",
  },
  "contact.html": {
    canonical: "https://twvita.com.tw/contact",
    currentNav: "聯絡我們",
    title: "聯絡我們 | 臺灣耘達股份有限公司",
    description: "聯絡臺灣耘達股份有限公司，洽詢雙北地區屋頂、水塔水池與設備周邊防水工程；請先說明建築類型、位置、現況與可施工限制。",
    h1: "防水工程洽詢與現場資料整理",
    ogDescription: "雙北地區防水工程洽詢，請先說明建築類型、滲漏位置、現況與可施工限制。",
  },
  "404.html": {
    canonical: "",
    currentNav: "",
    title: "找不到頁面 | 臺灣耘達股份有限公司",
    description: "此頁面不存在，請回到臺灣耘達股份有限公司首頁或聯絡我們。",
    h1: "找不到這個頁面",
  },
};

const htmlFiles = [
  "index.html",
  "about",
  "about.html",
  "roof-waterproofing",
  "roof-waterproofing.html",
  "tank-pool-waterproofing",
  "tank-pool-waterproofing.html",
  "projects",
  "projects.html",
  "contact",
  "contact.html",
  "404.html",
];

const mirroredHtmlPairs = [
  ["about", "about.html"],
  ["roof-waterproofing", "roof-waterproofing.html"],
  ["tank-pool-waterproofing", "tank-pool-waterproofing.html"],
  ["projects", "projects.html"],
  ["contact", "contact.html"],
];

const sitemapExpectations = [
  { loc: "https://twvita.com.tw/", priority: "1.0" },
  { loc: "https://twvita.com.tw/about", priority: "0.8" },
  { loc: "https://twvita.com.tw/roof-waterproofing", priority: "0.9" },
  { loc: "https://twvita.com.tw/tank-pool-waterproofing", priority: "0.9" },
  { loc: "https://twvita.com.tw/projects", priority: "0.8" },
  { loc: "https://twvita.com.tw/contact", priority: "0.8" },
];

const redirectExpectations = [
  ["/membranes.html", "/", "301"],
  ["/home", "/", "301"],
  ["/company", "/about", "301"],
  ["/roof", "/roof-waterproofing", "301"],
  ["/tank", "/tank-pool-waterproofing", "301"],
  ["/pool", "/tank-pool-waterproofing", "301"],
  ["/works", "/projects", "301"],
  ["/membranes", "/", "301"],
  ["/spec", "/", "301"],
  ["/contact-us", "/contact", "301"],
];

const allowedExternalUrls = new Set([
  "https://schema.org",
  "https://twvita.com.tw/",
  "https://twvita.com.tw/about",
  "https://twvita.com.tw/roof-waterproofing",
  "https://twvita.com.tw/tank-pool-waterproofing",
  "https://twvita.com.tw/projects",
  "https://twvita.com.tw/contact",
  "https://twvita.com.tw/sitemap.xml",
  "https://twvita.com.tw/#business",
  "https://twvita.com.tw/#website",
  "https://twvita.com.tw/assets/images/private-rooftop-repair.jpg",
  "https://twvita.com.tw/assets/images/private-shop-roof.jpg",
  "https://twvita.com.tw/assets/images/private-tank-lining.jpg",
  "https://twvita.com.tw/assets/images/site-roof-detail.jpg",
  "https://twvita.com.tw/assets/images/twvita-social-card-20260617.jpg",
]);

const priorityImageExpectations = {
  "about": {
    preload: '<link rel="preload" as="image" href="/assets/images/private-rooftop-repair-720.webp"',
    image: 'src="/assets/images/private-rooftop-repair.jpg"',
    alt: 'alt="頂樓防水完工後檢查"',
  },
  "about.html": {
    preload: '<link rel="preload" as="image" href="/assets/images/private-rooftop-repair-720.webp"',
    image: 'src="/assets/images/private-rooftop-repair.jpg"',
    alt: 'alt="頂樓防水完工後檢查"',
  },
  "roof-waterproofing": {
    preload: '<link rel="preload" as="image" href="/assets/images/private-shop-roof-720.webp"',
    image: 'src="/assets/images/private-shop-roof.jpg"',
    alt: 'alt="屋頂設備基座與管線周邊防水處理"',
  },
  "roof-waterproofing.html": {
    preload: '<link rel="preload" as="image" href="/assets/images/private-shop-roof-720.webp"',
    image: 'src="/assets/images/private-shop-roof.jpg"',
    alt: 'alt="屋頂設備基座與管線周邊防水處理"',
  },
  "tank-pool-waterproofing": {
    preload: '<link rel="preload" as="image" href="/assets/images/private-tank-lining-720.webp"',
    image: 'src="/assets/images/private-tank-lining.jpg"',
    alt: 'alt="水箱與池體內襯防水處理"',
  },
  "tank-pool-waterproofing.html": {
    preload: '<link rel="preload" as="image" href="/assets/images/private-tank-lining-720.webp"',
    image: 'src="/assets/images/private-tank-lining.jpg"',
    alt: 'alt="水箱與池體內襯防水處理"',
  },
  "projects": {
    preload: '<link rel="preload" as="image" href="/assets/images/site-roof-detail-720.webp"',
    image: 'src="/assets/images/site-roof-detail.jpg"',
    alt: 'alt="防水收邊與屋面細部檢查"',
  },
  "projects.html": {
    preload: '<link rel="preload" as="image" href="/assets/images/site-roof-detail-720.webp"',
    image: 'src="/assets/images/site-roof-detail.jpg"',
    alt: 'alt="防水收邊與屋面細部檢查"',
  },
};

const breadcrumbExpectations = {
  about: {
    pageId: "https://twvita.com.tw/about#page",
    breadcrumbId: "https://twvita.com.tw/about#breadcrumb",
    currentName: "公司簡介",
    currentUrl: "https://twvita.com.tw/about",
  },
  "about.html": {
    pageId: "https://twvita.com.tw/about#page",
    breadcrumbId: "https://twvita.com.tw/about#breadcrumb",
    currentName: "公司簡介",
    currentUrl: "https://twvita.com.tw/about",
  },
  "roof-waterproofing": {
    pageId: "https://twvita.com.tw/roof-waterproofing#webpage",
    breadcrumbId: "https://twvita.com.tw/roof-waterproofing#breadcrumb",
    currentName: "屋頂防水",
    currentUrl: "https://twvita.com.tw/roof-waterproofing",
  },
  "roof-waterproofing.html": {
    pageId: "https://twvita.com.tw/roof-waterproofing#webpage",
    breadcrumbId: "https://twvita.com.tw/roof-waterproofing#breadcrumb",
    currentName: "屋頂防水",
    currentUrl: "https://twvita.com.tw/roof-waterproofing",
  },
  "tank-pool-waterproofing": {
    pageId: "https://twvita.com.tw/tank-pool-waterproofing#webpage",
    breadcrumbId: "https://twvita.com.tw/tank-pool-waterproofing#breadcrumb",
    currentName: "水塔水池",
    currentUrl: "https://twvita.com.tw/tank-pool-waterproofing",
  },
  "tank-pool-waterproofing.html": {
    pageId: "https://twvita.com.tw/tank-pool-waterproofing#webpage",
    breadcrumbId: "https://twvita.com.tw/tank-pool-waterproofing#breadcrumb",
    currentName: "水塔水池",
    currentUrl: "https://twvita.com.tw/tank-pool-waterproofing",
  },
  projects: {
    pageId: "https://twvita.com.tw/projects#page",
    breadcrumbId: "https://twvita.com.tw/projects#breadcrumb",
    currentName: "工程實績",
    currentUrl: "https://twvita.com.tw/projects",
  },
  "projects.html": {
    pageId: "https://twvita.com.tw/projects#page",
    breadcrumbId: "https://twvita.com.tw/projects#breadcrumb",
    currentName: "工程實績",
    currentUrl: "https://twvita.com.tw/projects",
  },
  contact: {
    pageId: "https://twvita.com.tw/contact#page",
    breadcrumbId: "https://twvita.com.tw/contact#breadcrumb",
    currentName: "聯絡我們",
    currentUrl: "https://twvita.com.tw/contact",
  },
  "contact.html": {
    pageId: "https://twvita.com.tw/contact#page",
    breadcrumbId: "https://twvita.com.tw/contact#breadcrumb",
    currentName: "聯絡我們",
    currentUrl: "https://twvita.com.tw/contact",
  },
};

const pagePrimaryImageExpectations = {
  "index.html": {
    pageId: "https://twvita.com.tw/#homepage",
    image: "https://twvita.com.tw/assets/images/private-rooftop-repair.jpg",
  },
  about: {
    pageId: "https://twvita.com.tw/about#page",
    image: "https://twvita.com.tw/assets/images/private-rooftop-repair.jpg",
  },
  "about.html": {
    pageId: "https://twvita.com.tw/about#page",
    image: "https://twvita.com.tw/assets/images/private-rooftop-repair.jpg",
  },
  contact: {
    pageId: "https://twvita.com.tw/contact#page",
    image: "https://twvita.com.tw/assets/images/twvita-social-card-20260617.jpg",
  },
  "contact.html": {
    pageId: "https://twvita.com.tw/contact#page",
    image: "https://twvita.com.tw/assets/images/twvita-social-card-20260617.jpg",
  },
};

const stalePatterns = [
  /服務範圍：台北市、新北市/,
  /Google Sites/i,
  /sites\.google/i,
  /LINE/,
  /lin\.ee/i,
  /防水膜規格/,
  /撥打/,
  /電話諮詢/,
  /撥打臺灣耘達/,
  /民間小案服務/,
  /自己的案場/,
  /全部打掉重做/,
  /20260617-audit92/,
  /20260617-audit91/,
  /20260617-audit90/,
  /20260617-audit89/,
  /20260617-audit88/,
  /20260617-audit87/,
  /20260617-audit86/,
  /20260617-audit85/,
  /20260617-audit84/,
  /20260617-audit83/,
  /20260617-audit82/,
  /20260617-audit81/,
  /20260617-audit80/,
  /20260617-audit79/,
  /20260617-audit78/,
  /20260617-audit77/,
  /20260617-audit76/,
  /20260617-audit75/,
  /20260617-audit74/,
  /20260617-audit73/,
  /20260617-audit72/,
  /20260617-audit71/,
  /20260617-audit70/,
  /20260617-audit69/,
  /20260617-audit68/,
  /20260617-audit67/,
  /20260617-audit66/,
  /20260617-audit65/,
  /20260617-audit64/,
  /20260617-audit63/,
  /20260617-audit62/,
  /20260617-audit61/,
  /20260617-audit60/,
  /20260617-audit59/,
  /20260617-audit58/,
  /20260617-audit57/,
  /20260617-audit56/,
  /20260617-audit55/,
  /20260617-audit54/,
  /20260617-audit53/,
  /20260617-audit52/,
  /20260617-audit51/,
  /20260617-audit50/,
  /20260617-audit49/,
  /20260617-audit48/,
  /20260617-audit47/,
  /20260617-audit46/,
  /20260617-audit45/,
  /20260617-audit44/,
  /20260617-audit43/,
  /20260617-audit42/,
  /20260617-audit41/,
  /20260617-audit40/,
  /20260617-audit39/,
  /20260617-audit38/,
  /20260617-audit37/,
  /20260617-audit36/,
  /20260617-audit35/,
  /20260617-audit34/,
  /20260617-audit33/,
  /20260617-audit32/,
  /20260617-audit31/,
  /20260617-audit30/,
];

const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const existsPublic = (relativePath) => fs.existsSync(path.join(publicDir, relativePath.replace(/^\//, "")));
const textFromHtml = (value) => value
  .replace(/<[^>]*>/g, " ")
  .replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/\s+/g, " ")
  .trim();
const flattenJsonLd = (value) => {
  if (!value || typeof value !== "object") {
    return [];
  }
  if (Array.isArray(value["@graph"])) {
    return value["@graph"];
  }
  return [value];
};
const extractVisibleFaq = (html) => [...html.matchAll(/<details>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/g)]
  .map((match) => ({
    question: textFromHtml(match[1]),
    answer: textFromHtml(match[2]),
  }));
const localAssetPath = (url) => {
  if (!url || !url.startsWith("/")) {
    return "";
  }
  return url.split("?")[0].replace(/^\//, "");
};
const parseSrcset = (value) => value
  .split(",")
  .map((candidate) => candidate.trim())
  .filter(Boolean)
  .map((candidate) => {
    const [src, widthDescriptor] = candidate.split(/\s+/);
    return {
      src,
      width: widthDescriptor?.endsWith("w") ? Number(widthDescriptor.slice(0, -1)) : null,
    };
  });
const readImageSize = (() => {
  const cache = new Map();
  return (assetPath) => {
    if (cache.has(assetPath)) {
      return cache.get(assetPath);
    }
    const fullPath = path.join(publicDir, assetPath);
    if (!fs.existsSync(fullPath)) {
      cache.set(assetPath, null);
      return null;
    }
    const buffer = fs.readFileSync(fullPath);
    let size = null;
    if (buffer.length >= 24 && buffer.toString("ascii", 1, 4) === "PNG") {
      size = { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
    } else if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
      const chunk = buffer.toString("ascii", 12, 16);
      if (chunk === "VP8 " && buffer.length >= 30) {
        size = {
          width: buffer.readUInt16LE(26) & 0x3fff,
          height: buffer.readUInt16LE(28) & 0x3fff,
        };
      } else if (chunk === "VP8X" && buffer.length >= 30) {
        size = {
          width: 1 + buffer.readUIntLE(24, 3),
          height: 1 + buffer.readUIntLE(27, 3),
        };
      } else if (chunk === "VP8L" && buffer.length >= 25) {
        const bits = buffer.readUInt32LE(21);
        size = {
          width: 1 + (bits & 0x3fff),
          height: 1 + ((bits >> 14) & 0x3fff),
        };
      }
    } else if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
      let offset = 2;
      while (offset + 9 < buffer.length) {
        if (buffer[offset] !== 0xff) {
          offset += 1;
          continue;
        }
        const marker = buffer[offset + 1];
        const segmentLength = buffer.readUInt16BE(offset + 2);
        if ((marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) || (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf)) {
          size = {
            width: buffer.readUInt16BE(offset + 7),
            height: buffer.readUInt16BE(offset + 5),
          };
          break;
        }
        offset += 2 + segmentLength;
      }
    }
    cache.set(assetPath, size);
    return size;
  };
})();

const worker = read("public/_worker.js");
const siteJs = read("public/assets/site.js");
const styles = read("public/assets/styles-20260617-audit96.css");

function cssBraceSummary(css) {
  let depth = 0;
  let minDepth = 0;
  let openCount = 0;
  let closeCount = 0;
  for (const char of css) {
    if (char === "{") {
      depth += 1;
      openCount += 1;
    } else if (char === "}") {
      depth -= 1;
      closeCount += 1;
      minDepth = Math.min(minDepth, depth);
    }
  }
  return { depth, minDepth, openCount, closeCount };
}

function cssBlock(css, blockStart) {
  const start = css.indexOf(blockStart);
  if (start === -1) {
    return "";
  }
  const open = css.indexOf("{", start);
  if (open === -1) {
    return "";
  }
  let depth = 0;
  for (let index = open; index < css.length; index += 1) {
    if (css[index] === "{") {
      depth += 1;
    } else if (css[index] === "}") {
      depth -= 1;
      if (depth === 0) {
        return css.slice(start, index + 1);
      }
    }
  }
  return "";
}

if (fs.existsSync(path.join(publicDir, "assets", "styles.css"))) {
  issues.push("assets: unversioned styles.css should not be published");
}
const versionedStylesheets = fs
  .readdirSync(path.join(publicDir, "assets"))
  .filter((fileName) => /^styles-20260617-audit\d+\.css$/.test(fileName));
if (versionedStylesheets.length !== 1 || versionedStylesheets[0] !== "styles-20260617-audit96.css") {
  issues.push(`assets: expected only styles-20260617-audit96.css, found ${versionedStylesheets.join(", ")}`);
}
if (worker.includes("unsafe-inline")) {
  issues.push("_worker.js: CSP must not contain unsafe-inline");
}
if (!worker.includes("https://static.cloudflareinsights.com")) {
  issues.push("_worker.js: CSP missing Cloudflare Insights script allowlist");
}
if (!worker.includes("https://cloudflareinsights.com")) {
  issues.push("_worker.js: CSP missing Cloudflare Insights connect allowlist");
}
if (!worker.includes('headers.set("X-Robots-Tag", "noindex, nofollow")')) {
  issues.push("_worker.js: 404 responses should set X-Robots-Tag noindex, nofollow");
}
if (!worker.includes('headers.delete("Access-Control-Allow-Origin")')) {
  issues.push("_worker.js: HTML responses should remove wildcard Access-Control-Allow-Origin from Pages assets");
}
if (!worker.includes('headers.set("Content-Language", "zh-Hant-TW")')) {
  issues.push("_worker.js: text responses should declare Content-Language zh-Hant-TW");
}
if (!worker.includes('url.pathname === "/assets/styles.css"') || !worker.includes("styles-20260617-audit(?:6[2-9]|7[0-9]|8[0-9]|9[0-5])") || !worker.includes('"Cache-Control": "public, max-age=0, must-revalidate, no-transform"')) {
  issues.push("_worker.js: obsolete versioned stylesheets should be intercepted with an uncached 404");
}
if (!worker.includes('url.pathname === "/robots.txt"') || !worker.includes('"Cache-Control", "public, max-age=3600, must-revalidate, no-transform"')) {
  issues.push("_worker.js: robots.txt should receive explicit short cache and language headers");
}
for (const requiredCspDirective of [
  "script-src-attr 'none'",
  "style-src-attr 'none'",
  "manifest-src 'self'",
  "frame-src 'none'",
  "media-src 'none'",
  "worker-src 'none'",
]) {
  if (!worker.includes(requiredCspDirective)) {
    issues.push(`_worker.js: CSP missing hardened directive ${requiredCspDirective}`);
  }
}
if (!worker.includes('url.pathname === "/404" || url.pathname === "/404.html"') || !worker.includes('status: 404') || !worker.includes('headers.set("Cache-Control", "no-store")')) {
  issues.push("_worker.js: direct /404 and /404.html should return a no-store 404 response");
}
if (!siteJs.includes("event.target.closest(\"[data-site-nav]\")") || !siteJs.includes("matchMedia(\"(min-width: 901px)\")")) {
  issues.push("site.js: mobile menu should close on outside click and desktop resize");
}
if (!siteJs.includes('nav.setAttribute("aria-hidden"') || !siteJs.includes('desktopQuery.matches') || !siteJs.includes('setMenuState(nav.classList.contains("is-open"))')) {
  issues.push("site.js: mobile menu should keep aria-hidden synchronized with the visual menu state");
}
if (!siteJs.includes('nav.setAttribute("inert", "")') || !siteJs.includes("nav.removeAttribute(\"inert\")")) {
  issues.push("site.js: hidden mobile navigation should use inert to prevent offscreen interaction");
}
for (const requiredReducedMotionCss of [
  "@media (prefers-reduced-motion: reduce)",
  "scroll-behavior: auto",
  "transition-duration: 0.01ms !important",
  "animation-duration: 0.01ms !important",
  "animation-iteration-count: 1 !important",
]) {
  if (!styles.includes(requiredReducedMotionCss)) {
    issues.push(`styles.css: missing reduced-motion support ${requiredReducedMotionCss}`);
  }
}
const braceSummary = cssBraceSummary(styles);
if (braceSummary.depth !== 0 || braceSummary.minDepth < 0 || braceSummary.openCount !== braceSummary.closeCount) {
  issues.push(`styles.css: unbalanced CSS braces open=${braceSummary.openCount} close=${braceSummary.closeCount} depth=${braceSummary.depth}`);
}
const expectedMediaOrder = [
  "@media (max-width: 900px)",
  "@media (max-width: 560px)",
  "@media (prefers-reduced-motion: reduce)",
  "@media (forced-colors: active)",
  "@media print",
];
const mediaPositions = expectedMediaOrder.map((media) => ({ media, index: styles.indexOf(media) }));
for (const { media, index } of mediaPositions) {
  if (index === -1) {
    issues.push(`styles.css: missing media block ${media}`);
  }
}
for (let index = 1; index < mediaPositions.length; index += 1) {
  const previous = mediaPositions[index - 1];
  const current = mediaPositions[index];
  if (previous.index !== -1 && current.index !== -1 && previous.index >= current.index) {
    issues.push(`styles.css: media block ${previous.media} should appear before ${current.media}`);
  }
}
const smallScreenCss = cssBlock(styles, "@media (max-width: 560px)");
for (const smallScreenOnlyCss of [
  "padding: 1.45rem 1rem 1.55rem",
  "line-height: 1.62",
  "bottom: calc(10px + env(safe-area-inset-bottom, 0px))",
  "padding-bottom: calc(12rem + env(safe-area-inset-bottom, 0px))",
]) {
  if (!smallScreenCss.includes(smallScreenOnlyCss)) {
    issues.push(`styles.css: expected small-screen rule inside @media (max-width: 560px): ${smallScreenOnlyCss}`);
  }
}
for (const requiredForcedColorsCss of [
  "@media (forced-colors: active)",
  "border: 1px solid CanvasText",
  "background: ButtonFace",
  "color: ButtonText",
  "outline: 2px solid Highlight",
]) {
  if (!styles.includes(requiredForcedColorsCss)) {
    issues.push(`styles.css: missing forced-colors support ${requiredForcedColorsCss}`);
  }
}
for (const requiredMobileStickyCss of [
  "width: 46px",
  "height: 46px",
  "min-height: 44px",
  "bottom: calc(10px + env(safe-area-inset-bottom, 0px))",
  "min-height: 48px",
  "padding-bottom: calc(12rem + env(safe-area-inset-bottom, 0px))",
  "padding: 1.45rem 1rem 1.55rem",
  "line-height: 1.62",
  "padding: 2.2rem 0 2.6rem",
]) {
  if (!styles.includes(requiredMobileStickyCss)) {
    issues.push(`styles.css: missing mobile sticky contact support ${requiredMobileStickyCss}`);
  }
}
if (styles.includes("@media (max-width: 560px)") && styles.includes(".sticky-contact {\n    display: none;")) {
  issues.push("styles.css: mobile sticky contact should remain visible on small screens");
}
if (/(^|\n)\s*([.#][\w-]+),\n\s*\2,/m.test(styles)) {
  issues.push("styles.css: contains adjacent duplicate selectors in a grouped rule");
}
for (const requiredEmailTemplateText of ["臺灣耘達防水工程評估", "建築類型：", "問題位置：", "使用限制：", "可聯絡時間："]) {
  if (!siteJs.includes(requiredEmailTemplateText)) {
    issues.push(`site.js: Email template missing ${requiredEmailTemplateText}`);
  }
}
const emailFallbackPattern = /<a\b(?=[^>]*\bdata-email-link\b)[^>]*href="mailto:vitawaterproof@gmail\.com\?subject=[^"]*body=[^"]*%E4%BD%BF%E7%94%A8%E9%99%90%E5%88%B6%EF%BC%9A/;

const versionMatches = new Set();
const jsonLdHashes = new Set();

for (const [canonicalFile, htmlFile] of mirroredHtmlPairs) {
  const canonicalHtml = read(`public/${canonicalFile}`);
  const duplicateHtml = read(`public/${htmlFile}`);
  if (canonicalHtml !== duplicateHtml) {
    issues.push(`${canonicalFile} and ${htmlFile}: mirrored route files must stay byte-identical`);
  }
}

for (const file of htmlFiles) {
  const fullPath = path.join(publicDir, file);
  if (!fs.existsSync(fullPath)) {
    issues.push(`${file}: missing HTML route file`);
    continue;
  }

  const html = fs.readFileSync(fullPath, "utf8");
  if (!html.startsWith('<!doctype html>\n<html lang="zh-Hant-TW" class="no-js">')) {
    issues.push(`${file}: document should start with zh-Hant-TW HTML doctype`);
  }
  if (!html.includes('<meta name="viewport" content="width=device-width, initial-scale=1">')) {
    issues.push(`${file}: missing responsive viewport meta`);
  }
  if (!html.includes('<meta name="format-detection" content="telephone=no">')) {
    issues.push(`${file}: mobile browsers should not auto-detect incidental phone-like text`);
  }
  const titleMatches = [...html.matchAll(/<title>([^<]+)<\/title>/g)].map((match) => match[1].trim());
  if (titleMatches.length !== 1 || titleMatches[0].length < 8 || titleMatches[0].length > 70) {
    issues.push(`${file}: should have exactly one concise title, found ${titleMatches.length ? titleMatches.join(" | ") : "none"}`);
  }
  const descriptionMatches = [...html.matchAll(/<meta name="description" content="([^"]+)">/g)].map((match) => match[1].trim());
  if (descriptionMatches.length !== 1 || descriptionMatches[0].length < 20 || descriptionMatches[0].length > 120) {
    issues.push(`${file}: should have exactly one useful meta description, found ${descriptionMatches.length ? descriptionMatches.join(" | ") : "none"}`);
  }
  const h1Matches = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((match) => match[1].replace(/<[^>]+>/g, "").trim());
  if (h1Matches.length !== 1 || h1Matches[0].length < 4) {
    issues.push(`${file}: should have exactly one meaningful H1, found ${h1Matches.length ? h1Matches.join(" | ") : "none"}`);
  }
	  const seoExpectation = pageSeoExpectations[file];
	  if (!seoExpectation) {
	    issues.push(`${file}: missing SEO expectation`);
	  } else {
	    if (seoExpectation.title && (titleMatches.length !== 1 || titleMatches[0] !== seoExpectation.title)) {
	      issues.push(`${file}: title should be ${seoExpectation.title}, found ${titleMatches.join(" | ") || "none"}`);
	    }
	    if (seoExpectation.description && (descriptionMatches.length !== 1 || descriptionMatches[0] !== seoExpectation.description)) {
	      issues.push(`${file}: meta description should be ${seoExpectation.description}, found ${descriptionMatches.join(" | ") || "none"}`);
	    }
	    if (seoExpectation.h1 && (h1Matches.length !== 1 || h1Matches[0] !== seoExpectation.h1)) {
	      issues.push(`${file}: H1 should be ${seoExpectation.h1}, found ${h1Matches.join(" | ") || "none"}`);
	    }
	    const canonicalMatches = [...html.matchAll(/<link rel="canonical" href="([^"]+)">/g)].map((match) => match[1]);
	    if (seoExpectation.canonical) {
      if (canonicalMatches.length !== 1 || canonicalMatches[0] !== seoExpectation.canonical) {
        issues.push(`${file}: canonical should be ${seoExpectation.canonical}, found ${canonicalMatches.join(", ") || "none"}`);
      }
      const alternateMatches = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)]
        .map((match) => ({ hreflang: match[1], href: match[2] }));
      const expectedAlternates = new Map([
        ["zh-Hant-TW", seoExpectation.canonical],
        ["x-default", seoExpectation.canonical],
      ]);
      if (alternateMatches.length !== expectedAlternates.size) {
        issues.push(`${file}: should have zh-Hant-TW and x-default alternate links`);
      }
      for (const [hreflang, href] of expectedAlternates) {
        if (!alternateMatches.some((alternate) => alternate.hreflang === hreflang && alternate.href === href)) {
          issues.push(`${file}: alternate ${hreflang} should point to ${href}`);
        }
      }
      const ogUrlMatches = [...html.matchAll(/<meta property="og:url" content="([^"]+)">/g)].map((match) => match[1]);
	      if (file !== "404.html" && (ogUrlMatches.length !== 1 || ogUrlMatches[0] !== seoExpectation.canonical)) {
	        issues.push(`${file}: og:url should match canonical ${seoExpectation.canonical}`);
	      }
	      const ogTitleMatches = [...html.matchAll(/<meta property="og:title" content="([^"]+)">/g)].map((match) => match[1]);
	      if (ogTitleMatches.length !== 1 || ogTitleMatches[0] !== seoExpectation.title) {
	        issues.push(`${file}: og:title should match the page title ${seoExpectation.title}`);
	      }
	      const twitterTitleMatches = [...html.matchAll(/<meta name="twitter:title" content="([^"]+)">/g)].map((match) => match[1]);
	      if (twitterTitleMatches.length !== 1 || twitterTitleMatches[0] !== seoExpectation.title) {
	        issues.push(`${file}: twitter:title should match the page title ${seoExpectation.title}`);
	      }
	      const ogDescriptionMatches = [...html.matchAll(/<meta property="og:description" content="([^"]+)">/g)].map((match) => match[1]);
	      if (ogDescriptionMatches.length !== 1 || ogDescriptionMatches[0] !== seoExpectation.ogDescription) {
	        issues.push(`${file}: og:description should be ${seoExpectation.ogDescription}`);
	      }
	      const twitterDescriptionMatches = [...html.matchAll(/<meta name="twitter:description" content="([^"]+)">/g)].map((match) => match[1]);
	      if (twitterDescriptionMatches.length !== 1 || twitterDescriptionMatches[0] !== seoExpectation.ogDescription) {
	        issues.push(`${file}: twitter:description should match og:description`);
	      }
	      for (const requiredSocialMeta of [
        '<meta property="og:locale" content="zh_TW">',
        '<meta property="og:site_name" content="臺灣耘達股份有限公司">',
        '<meta property="og:image" content="https://twvita.com.tw/assets/images/twvita-social-card-20260617.jpg">',
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        '<meta property="og:image:alt" content="臺灣耘達防水工程公司分享圖">',
        '<meta name="twitter:card" content="summary_large_image">',
        '<meta name="twitter:image" content="https://twvita.com.tw/assets/images/twvita-social-card-20260617.jpg">',
        '<meta name="twitter:image:alt" content="臺灣耘達防水工程公司分享圖">',
      ]) {
        if (!html.includes(requiredSocialMeta)) {
          issues.push(`${file}: missing social metadata ${requiredSocialMeta}`);
        }
      }
      if (!html.includes('<meta property="og:image:secure_url" content="https://twvita.com.tw/assets/images/twvita-social-card-20260617.jpg">')) {
        issues.push(`${file}: Open Graph image should expose secure_url for social card compatibility`);
      }
      if (!html.includes('<meta property="og:image:type" content="image/jpeg">')) {
        issues.push(`${file}: Open Graph image should declare image/jpeg type`);
      }
    } else if (canonicalMatches.length > 0) {
      issues.push(`${file}: should not have a canonical URL`);
    } else if (html.includes('rel="alternate"')) {
      issues.push(`${file}: non-indexable page should not have alternate hreflang links`);
    }
    const currentNavMatches = [...html.matchAll(/<a\b[^>]*aria-current="page"[^>]*>([\s\S]*?)<\/a>/g)].map((match) => match[1].replace(/<[^>]+>/g, "").trim());
    if (seoExpectation.currentNav) {
      if (currentNavMatches.length !== 1 || currentNavMatches[0] !== seoExpectation.currentNav) {
        issues.push(`${file}: aria-current nav should be ${seoExpectation.currentNav}, found ${currentNavMatches.join(", ") || "none"}`);
      }
    } else if (currentNavMatches.length > 0) {
      issues.push(`${file}: should not mark a nav item as current`);
    }
  }
  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    const tag = match[0];
    if (!/\brel="[^"]*\bnoopener\b[^"]*"/.test(tag)) {
      issues.push(`${file}: target=_blank link missing rel=noopener: ${tag}`);
    }
  }
  for (const stale of stalePatterns) {
    if (stale.test(html)) {
      issues.push(`${file}: stale text or asset version matched ${stale}`);
    }
  }

  for (const match of html.matchAll(/20260617-audit\d+/g)) {
    versionMatches.add(match[0]);
  }

  if (!html.includes('<a class="brand" href="/" aria-label="臺灣耘達首頁">')) {
    issues.push(`${file}: brand home link missing aria-label`);
  }
  if (!html.includes('<span class="service-area">目前服務範圍：雙北地區</span>')) {
    issues.push(`${file}: header should show current service area as 雙北地區`);
  }
  if (!html.includes('<main id="main" tabindex="-1">')) {
    issues.push(`${file}: skip-link target should be main#main with tabindex=-1`);
  }
  if (!html.includes('TEL：<a href="tel:+886228120021" aria-label="臺灣耘達電話 (02)2812-0021">(02)2812-0021</a>')) {
    issues.push(`${file}: footer should display the phone number directly`);
  }
  const isContactPage = file === "contact" || file === "contact.html";
  if (!isContactPage && !/<nav class="sticky-contact" aria-label="快速聯絡">\s*<a href="tel:\+886228120021" aria-label="來電洽詢臺灣耘達防水工程">來電洽詢<\/a>/.test(html)) {
    issues.push(`${file}: bottom sticky phone contact should use the short 來電洽詢 label`);
  }
  if (isContactPage && !html.includes('<body class="contact-page">')) {
    issues.push(`${file}: contact page should use contact-page body class`);
  }
  if (html.includes('<div class="sticky-contact"')) {
    issues.push(`${file}: sticky contact should use nav instead of div so it is inside a landmark`);
  }
  const stickyNavOpenCount = [...html.matchAll(/<nav class="sticky-contact" aria-label="快速聯絡">/g)].length;
  if (isContactPage) {
    if (stickyNavOpenCount !== 0) {
      issues.push(`${file}: contact page should not include redundant sticky contact navigation`);
    }
  } else if (stickyNavOpenCount !== 1 || !/<nav class="sticky-contact" aria-label="快速聯絡">[\s\S]*?<\/nav>\s*<footer class="site-footer">/.test(html)) {
    issues.push(`${file}: sticky contact navigation should have one opening nav and close before the footer`);
  }
  if (html.includes('<section class="cta-band">') && !html.includes('<a class="button" href="tel:+886228120021" aria-label="來電洽詢臺灣耘達防水工程">來電洽詢</a>')) {
    issues.push(`${file}: non-footer inquiry phone button should use the short 來電洽詢 CTA label`);
  }
  if (!html.includes('<link rel="icon" href="/favicon.ico" sizes="any">')) {
    issues.push(`${file}: missing explicit favicon.ico link`);
  }
  if (!html.includes('<link rel="stylesheet" href="/assets/styles-20260617-audit96.css">')) {
    issues.push(`${file}: should use the cache-fresh stylesheet file`);
  }
  if (file === "404.html" && !html.includes('<meta name="robots" content="noindex, nofollow">')) {
    issues.push("404.html: meta robots should match the noindex, nofollow HTTP header");
  }

  if (file === "contact" || file === "contact.html") {
    if (!html.includes('"@type": "ContactPage"')) {
      issues.push(`${file}: contact page JSON-LD missing ContactPage`);
    }
    if (html.includes('"@id": "https://twvita.com.tw/#business",\n        "name": "臺灣耘達股份有限公司",\n        "url": "https://twvita.com.tw/contact"')) {
      issues.push(`${file}: LocalBusiness URL should remain the homepage, not the contact page`);
    }
    if (!html.includes("點選 Email 洽詢會先帶入資料欄位")) {
      issues.push(`${file}: contact page should explain the Email inquiry template`);
    }
    if (!html.includes("讓我們更快判斷的資訊") || !html.includes("使用限制：可施工時段")) {
      issues.push(`${file}: contact page should ask for practical job constraints`);
    }
    if (!html.includes("照片與尺寸：全景、細部、長寬高或大約面積")) {
      issues.push(`${file}: contact checklist should use the clearer photo and dimensions wording`);
    }
    if (!html.includes("目前服務範圍為雙北地區")) {
      issues.push(`${file}: contact page should state the current service range`);
    }
    if (!html.includes("詢問時先說明建築類型、位置、現況與可施工限制") || !html.includes("Email 可補充現場資料")) {
      issues.push(`${file}: contact page should use the refined inquiry wording`);
    }
    for (const staleContactCopy of [
      "詢問防水工程前不需要準備完整規格，先提供照片、位置、尺寸與使用限制",
      "Email 可附照片",
      "請盡量附上全景、滲漏位置、排水口或設備周邊照片",
    ]) {
      if (html.includes(staleContactCopy)) {
        issues.push(`${file}: contact page still contains repeated or stale inquiry copy: ${staleContactCopy}`);
      }
    }
    if (!html.includes('<li><strong>電話</strong><br><a href="tel:+886228120021" aria-label="臺灣耘達電話 (02)2812-0021">(02)2812-0021</a></li>')) {
      issues.push(`${file}: contact company information should display the phone number directly`);
    }
    if (!html.includes('<div class="cta-actions">\n            <a class="button" href="tel:+886228120021" aria-label="來電洽詢臺灣耘達防水工程">來電洽詢</a>\n            <a class="button secondary" href="mailto:')) {
      issues.push(`${file}: contact lower phone button should use the short 來電洽詢 label before the Email action`);
    }
    if (!html.includes('property="og:description" content="雙北地區防水工程洽詢，請先說明建築類型、滲漏位置、現況與可施工限制。"')) {
      issues.push(`${file}: contact Open Graph description should match the current inquiry guidance`);
    }
    if (!html.includes('name="twitter:description" content="雙北地區防水工程洽詢，請先說明建築類型、滲漏位置、現況與可施工限制。"')) {
      issues.push(`${file}: contact Twitter description should match the current inquiry guidance`);
    }
  }

  if (html.includes("data-email-link") && !emailFallbackPattern.test(html)) {
    issues.push(`${file}: Email links should have a no-JavaScript mailto fallback with the 使用限制 field`);
  }

  if (file === "tank-pool-waterproofing" || file === "tank-pool-waterproofing.html") {
    for (const staleTankCopy of [
      "蓄水空間修繕，需先確認使用與停用條件。",
      "蓄水空間要兼顧安全使用與停用時間。",
      "水塔、水池修繕前，先確認使用與停水限制。",
      "水池修繕前需要停水多久？",
    ]) {
      if (html.includes(staleTankCopy)) {
        issues.push(`${file}: tank/pool page still contains repeated or stale planning copy: ${staleTankCopy}`);
      }
    }
    for (const requiredTankCopy of [
      "蓄水空間要先看結構、表面與可施工條件。",
      "池體修繕要兼顧使用安全、耐久與維護。",
      "施工窗口",
      "可先準備照片與尺寸資料。",
    ]) {
      if (!html.includes(requiredTankCopy)) {
        issues.push(`${file}: tank/pool page missing refined professional copy: ${requiredTankCopy}`);
      }
    }
  }

  if (file === "projects" || file === "projects.html") {
    for (const requiredProjectCopy of [
      "實績不只看案名，也要看收邊與維護條件。",
      "大型案場訓練的是判斷順序",
      "/assets/images/site-roof-detail.jpg",
      "防水收邊與屋面細部檢查",
    ]) {
      if (!html.includes(requiredProjectCopy)) {
        issues.push(`${file}: projects page missing visual proof section or primary image data: ${requiredProjectCopy}`);
      }
    }
  }

  const servicePageExpectations = {
    "roof-waterproofing": {
      pageId: "https://twvita.com.tw/roof-waterproofing#webpage",
      serviceId: "https://twvita.com.tw/roof-waterproofing#service",
      image: "https://twvita.com.tw/assets/images/private-shop-roof.jpg",
    },
    "roof-waterproofing.html": {
      pageId: "https://twvita.com.tw/roof-waterproofing#webpage",
      serviceId: "https://twvita.com.tw/roof-waterproofing#service",
      image: "https://twvita.com.tw/assets/images/private-shop-roof.jpg",
    },
    "tank-pool-waterproofing": {
      pageId: "https://twvita.com.tw/tank-pool-waterproofing#webpage",
      serviceId: "https://twvita.com.tw/tank-pool-waterproofing#service",
      image: "https://twvita.com.tw/assets/images/private-tank-lining.jpg",
    },
    "tank-pool-waterproofing.html": {
      pageId: "https://twvita.com.tw/tank-pool-waterproofing#webpage",
      serviceId: "https://twvita.com.tw/tank-pool-waterproofing#service",
      image: "https://twvita.com.tw/assets/images/private-tank-lining.jpg",
    },
  };

  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    issues.push(`${file}: duplicate ids ${[...new Set(duplicateIds)].join(", ")}`);
  }

  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    const attrs = match[1];
    const body = match[2];
    if (attrs.includes("application/ld+json")) {
      try {
        JSON.parse(body);
      } catch (error) {
        issues.push(`${file}: invalid JSON-LD: ${error.message}`);
      }
      const hash = `sha256-${crypto.createHash("sha256").update(body, "utf8").digest("base64")}`;
      jsonLdHashes.add(hash);
      if (!worker.includes(hash)) {
        issues.push(`${file}: CSP missing JSON-LD hash ${hash}`);
      }
    } else if (!attrs.includes("src=")) {
      issues.push(`${file}: unexpected inline script without JSON-LD type`);
    }
  }

  const jsonLdNodes = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
    .filter((match) => match[1].includes("application/ld+json"))
    .flatMap((match) => {
      try {
        return flattenJsonLd(JSON.parse(match[2]));
      } catch {
        return [];
      }
    });
  for (const node of jsonLdNodes) {
    if (["WebPage", "AboutPage", "CollectionPage", "ContactPage", "WebSite", "LocalBusiness", "Service", "BreadcrumbList", "SiteNavigationElement", "FAQPage", "ItemList"].includes(node["@type"]) && node.inLanguage !== "zh-Hant-TW") {
      issues.push(`${file}: ${node["@type"]} JSON-LD should declare zh-Hant-TW`);
    }
  }
  const breadcrumbExpectation = breadcrumbExpectations[file];
  if (breadcrumbExpectation) {
    const pageNode = jsonLdNodes.find((node) => node["@id"] === breadcrumbExpectation.pageId);
    const breadcrumbNode = jsonLdNodes.find((node) => node["@id"] === breadcrumbExpectation.breadcrumbId);
    if (!pageNode || pageNode.breadcrumb?.["@id"] !== breadcrumbExpectation.breadcrumbId) {
      issues.push(`${file}: page JSON-LD should link to its stable breadcrumb id`);
    }
    if (!breadcrumbNode || breadcrumbNode["@type"] !== "BreadcrumbList" || breadcrumbNode.inLanguage !== "zh-Hant-TW") {
      issues.push(`${file}: BreadcrumbList should have a stable id and zh-Hant-TW language`);
    } else {
      const items = breadcrumbNode.itemListElement ?? [];
      const first = items[0] ?? {};
      const second = items[1] ?? {};
      if (
        items.length !== 2 ||
        first["@type"] !== "ListItem" ||
        first.position !== 1 ||
        first.name !== "首頁" ||
        first.item !== "https://twvita.com.tw/" ||
        second["@type"] !== "ListItem" ||
        second.position !== 2 ||
        second.name !== breadcrumbExpectation.currentName ||
        second.item !== breadcrumbExpectation.currentUrl
      ) {
        issues.push(`${file}: BreadcrumbList should contain homepage and the current canonical page`);
      }
    }
  }
  const primaryImageExpectation = pagePrimaryImageExpectations[file];
  if (primaryImageExpectation) {
    const pageNode = jsonLdNodes.find((node) => node["@id"] === primaryImageExpectation.pageId);
    if (!pageNode || pageNode.primaryImageOfPage?.["@id"] !== primaryImageExpectation.image) {
      issues.push(`${file}: page JSON-LD should expose the expected primaryImageOfPage`);
    }
  }
  if (file === "index.html") {
    if (html.includes("主要服務項目")) {
      issues.push("index.html: homepage service heading should avoid repeated template wording");
    }
    if (!html.includes("先看現場條件，再安排合適工法。")) {
      issues.push("index.html: homepage service section missing professional waterproof company heading");
    }
    for (const repeatedHomepagePhrase of ["先釐清滲漏原因，再決定施作方式。", "有照片與位置資訊，就能先整理初步方向。"]) {
      if (html.includes(repeatedHomepagePhrase)) {
        issues.push(`index.html: homepage still contains repeated template-like phrase ${repeatedHomepagePhrase}`);
      }
    }
    if (!html.includes("雙北地區專業防水公司")) {
      issues.push("index.html: homepage should position the company as a professional waterproof company in the current service area");
    }
    for (const lazyImageSrc of [
      "/assets/images/private-shop-roof.jpg",
      "/assets/images/private-tank-lining.jpg",
      "/assets/images/site-roof-detail.jpg",
      "/assets/images/roof-waterproof-surface.jpg",
    ]) {
      const imageTags = [...html.matchAll(/<img\b[^>]*>/g)]
        .map((match) => match[0])
        .filter((imageTag) => imageTag.includes(`src="${lazyImageSrc}"`));
      if (imageTags.length === 0) {
        issues.push(`index.html: missing homepage content image ${lazyImageSrc}`);
      }
      for (const imageTag of imageTags) {
        if (!imageTag.includes('loading="lazy"') || !imageTag.includes('fetchpriority="low"')) {
          issues.push(`index.html: below-fold homepage image should lazy-load with low priority: ${lazyImageSrc}`);
        }
      }
    }
    const nodeTypes = new Set(jsonLdNodes.map((node) => node["@type"]));
    for (const requiredType of ["WebPage", "WebSite", "LocalBusiness"]) {
      if (!nodeTypes.has(requiredType)) {
        issues.push(`index.html: homepage JSON-LD missing ${requiredType}`);
      }
    }
    const website = jsonLdNodes.find((node) => node["@id"] === "https://twvita.com.tw/#website");
    if (!website || website.url !== "https://twvita.com.tw/") {
      issues.push("index.html: WebSite URL should be https://twvita.com.tw/");
    }
    const business = jsonLdNodes.find((node) => node["@id"] === "https://twvita.com.tw/#business");
    if (!business || business.url !== "https://twvita.com.tw/") {
      issues.push("index.html: LocalBusiness URL should be https://twvita.com.tw/");
    }
  }
  const websiteNode = jsonLdNodes.find((node) => node["@id"] === "https://twvita.com.tw/#website");
  if (websiteNode) {
    if (websiteNode.inLanguage !== "zh-Hant-TW" || websiteNode.publisher?.["@id"] !== "https://twvita.com.tw/#business") {
      issues.push(`${file}: WebSite JSON-LD should declare zh-Hant-TW and the stable business publisher`);
    }
    if (seoExpectation?.canonical && websiteNode.hasPart?.["@id"] !== "https://twvita.com.tw/#site-navigation") {
      issues.push(`${file}: WebSite JSON-LD should reference the main site navigation`);
    }
  }
  if (seoExpectation?.canonical) {
    const navigationNode = jsonLdNodes.find((node) => node["@id"] === "https://twvita.com.tw/#site-navigation" && node["@type"] === "SiteNavigationElement");
    if (!navigationNode) {
      issues.push(`${file}: JSON-LD missing SiteNavigationElement`);
    } else {
      if (navigationNode.inLanguage !== "zh-Hant-TW") {
        issues.push(`${file}: SiteNavigationElement should declare zh-Hant-TW`);
      }
      const navigationUrls = (navigationNode.hasPart ?? []).map((item) => item.url);
      for (const requiredUrl of [
        "https://twvita.com.tw/",
        "https://twvita.com.tw/about",
        "https://twvita.com.tw/roof-waterproofing",
        "https://twvita.com.tw/tank-pool-waterproofing",
        "https://twvita.com.tw/projects",
        "https://twvita.com.tw/contact",
      ]) {
        if (!navigationUrls.includes(requiredUrl)) {
          issues.push(`${file}: SiteNavigationElement missing ${requiredUrl}`);
        }
      }
    }
  }
  const businessNode = jsonLdNodes.find((node) => node["@id"] === "https://twvita.com.tw/#business" && node["@type"] === "LocalBusiness");
  const providerBusinessNode = jsonLdNodes.find((node) => node["@type"] === "Service")?.provider;
  const pageBusiness = businessNode ?? providerBusinessNode;
  if (pageBusiness) {
    if (pageBusiness.inLanguage !== "zh-Hant-TW") {
      issues.push(`${file}: LocalBusiness JSON-LD should declare zh-Hant-TW`);
    }
    if (
      pageBusiness.logo?.["@type"] !== "ImageObject" ||
      pageBusiness.logo?.url !== "https://twvita.com.tw/assets/images/vita-icon.png" ||
      pageBusiness.logo?.width !== 512 ||
      pageBusiness.logo?.height !== 512
    ) {
      issues.push(`${file}: LocalBusiness JSON-LD should expose the VITA logo image object`);
    }
    if (pageBusiness.image !== "https://twvita.com.tw/assets/images/twvita-social-card-20260617.jpg") {
      issues.push(`${file}: LocalBusiness JSON-LD should use the canonical brand social image`);
    }
    const knowsAbout = pageBusiness.knowsAbout ?? [];
    for (const requiredTopic of ["屋頂防水工程", "水塔水池防水工程", "PVC 防水膜", "TPO 防水膜", "HDPE 防水襯裡", "接縫焊接與細部收邊"]) {
      if (!knowsAbout.includes(requiredTopic)) {
        issues.push(`${file}: LocalBusiness JSON-LD missing professional topic ${requiredTopic}`);
      }
    }
    if (pageBusiness.foundingDate !== "1990") {
      issues.push(`${file}: LocalBusiness JSON-LD should keep foundingDate 1990`);
    }
    if (pageBusiness.contactPoint?.availableLanguage?.[0] !== "zh-Hant-TW") {
      issues.push(`${file}: LocalBusiness JSON-LD should include zh-Hant-TW contactPoint`);
    }
    const offerItems = pageBusiness.hasOfferCatalog?.itemListElement ?? [];
    const offeredServices = offerItems
      .map((offer) => offer?.itemOffered)
      .filter(Boolean);
    const offeredNames = offeredServices.map((service) => service.name);
    for (const requiredService of ["屋頂與設備周邊防水工程", "水塔、水箱與池體防水工程"]) {
      if (!offeredNames.includes(requiredService)) {
        issues.push(`${file}: LocalBusiness JSON-LD service catalog missing ${requiredService}`);
      }
    }
    for (const service of offeredServices) {
      if (service.inLanguage !== "zh-Hant-TW") {
        issues.push(`${file}: LocalBusiness JSON-LD service catalog should declare zh-Hant-TW`);
      }
      if (!Array.isArray(service.areaServed) || !service.areaServed.includes("台北市") || !service.areaServed.includes("新北市")) {
        issues.push(`${file}: LocalBusiness JSON-LD service catalog should keep the 雙北 service area`);
      }
    }
  }
  if ((file === "about" || file === "about.html") && !html.includes("把公共工程的施工紀律，用在民間防水需求。")) {
    issues.push(`${file}: about page should align public-project background with current waterproof engineering positioning`);
  }
  if ((file === "about" || file === "about.html") && (!html.includes("需要釐清滲漏原因或施作範圍嗎？") || !html.includes("來電說明案場類型、使用限制與大約範圍"))) {
    issues.push(`${file}: about CTA should use the refined non-template wording`);
  }
  if ((file === "roof-waterproofing" || file === "roof-waterproofing.html") && !html.includes("屋頂、女兒牆與設備周邊防水工程")) {
    issues.push(`${file}: roof page H1 should use professional waterproof engineering positioning`);
  }
  if ((file === "roof-waterproofing" || file === "roof-waterproofing.html") && (!html.includes("屋頂反覆滲水，先說明發生時機。") || !html.includes("雨後、連續降雨、冷氣排水或清洗後才出現水痕"))) {
    issues.push(`${file}: roof CTA should use the refined timing-and-context wording`);
  }
  if ((file === "roof-waterproofing" || file === "roof-waterproofing.html") && !html.includes("服務雙北地區，針對屋面老化")) {
    issues.push(`${file}: roof page visible service-area copy should use 雙北地區`);
  }
  if ((file === "roof-waterproofing" || file === "roof-waterproofing.html") && !html.includes('content="雙北地區屋頂、店面後場、廠辦屋面與設備周邊防水工程，依排水與細部收邊規劃。"')) {
    issues.push(`${file}: roof social descriptions should use the current 雙北地區 wording`);
  }
  if ((file === "roof-waterproofing" || file === "roof-waterproofing.html") && html.includes("設備周邊滲漏處理，依排水與細部收邊規劃。")) {
    issues.push(`${file}: roof social descriptions should use waterproof engineering wording, not older repair wording`);
  }
  if ((file === "tank-pool-waterproofing" || file === "tank-pool-waterproofing.html") && !html.includes("水塔、水箱與池體防水工程")) {
    issues.push(`${file}: tank/pool page H1 should use professional waterproof engineering positioning`);
  }
  if ((file === "tank-pool-waterproofing" || file === "tank-pool-waterproofing.html") && !html.includes("服務雙北地區，針對蓄水空間")) {
    issues.push(`${file}: tank/pool visible service-area copy should use 雙北地區`);
  }
  if ((file === "tank-pool-waterproofing" || file === "tank-pool-waterproofing.html") && !html.includes('content="雙北地區水塔、水箱與小型池體防水工程，先確認池體條件、滲水位置與後續維護方式。"')) {
    issues.push(`${file}: tank/pool social descriptions should use the current 雙北地區 wording`);
  }
  if ((file === "projects" || file === "projects.html") && !html.includes("請描述滲漏時機與已做過的修補方式")) {
    issues.push(`${file}: projects CTA should use the refined inquiry wording`);
  }
  if (file === "projects" || file === "projects.html") {
    const collectionPage = jsonLdNodes.find((node) => node["@id"] === "https://twvita.com.tw/projects#page");
    if (collectionPage?.mainEntity?.["@id"] !== "https://twvita.com.tw/projects#project-categories") {
      issues.push(`${file}: projects CollectionPage should link to the project category ItemList`);
    }
    const projectList = jsonLdNodes.find((node) => node["@id"] === "https://twvita.com.tw/projects#project-categories");
    const visibleProjectCategories = [...html.matchAll(/<article class="project-category(?: wide)?">[\s\S]*?<h3>([\s\S]*?)<\/h3>[\s\S]*?<p>([\s\S]*?)<\/p>/g)]
      .map((match) => ({
        name: textFromHtml(match[1]),
        description: textFromHtml(match[2]),
      }));
    if (!projectList || projectList["@type"] !== "ItemList" || projectList.inLanguage !== "zh-Hant-TW" || projectList.numberOfItems !== 5) {
      issues.push(`${file}: projects page should expose a zh-Hant-TW ItemList for representative experience categories`);
    }
    if (!Array.isArray(projectList?.itemListElement) || projectList.itemListElement.length !== visibleProjectCategories.length || visibleProjectCategories.length !== 5) {
      issues.push(`${file}: project category ItemList should contain the five visible project categories`);
    } else {
      projectList.itemListElement.forEach((item, index) => {
        const visibleCategory = visibleProjectCategories[index];
        if (item["@type"] !== "ListItem" || item.position !== index + 1) {
          issues.push(`${file}: project category ItemList item ${index + 1} should keep ListItem type and position`);
        }
        if (item.name !== visibleCategory.name || item.description !== visibleCategory.description) {
          issues.push(`${file}: project category ItemList item ${index + 1} should match visible project category text`);
        }
      });
    }
  }
  for (const staleSharedCta of [
    "屋頂反覆滲水，可先提供現場照片。",
    "可先提供照片、尺寸與目前使用限制",
    "可先提供照片與滲漏情形",
  ]) {
    if (html.includes(staleSharedCta)) {
      issues.push(`${file}: page still contains repeated CTA wording: ${staleSharedCta}`);
    }
  }
  const serviceExpectation = servicePageExpectations[file];
  if (serviceExpectation) {
    for (const node of jsonLdNodes) {
      if (["WebPage", "WebSite", "Service", "BreadcrumbList", "SiteNavigationElement", "FAQPage"].includes(node["@type"]) && node.inLanguage !== "zh-Hant-TW") {
        issues.push(`${file}: ${node["@type"]} JSON-LD should declare zh-Hant-TW`);
      }
    }
    const nodeTypes = new Set(jsonLdNodes.map((node) => node["@type"]));
    for (const requiredType of ["WebPage", "WebSite", "Service", "BreadcrumbList", "FAQPage"]) {
      if (!nodeTypes.has(requiredType)) {
        issues.push(`${file}: service page JSON-LD missing ${requiredType}`);
      }
    }
    const webpage = jsonLdNodes.find((node) => node["@id"] === serviceExpectation.pageId);
    if (!webpage || webpage.mainEntity?.["@id"] !== serviceExpectation.serviceId || webpage.primaryImageOfPage?.["@id"] !== serviceExpectation.image) {
      issues.push(`${file}: WebPage JSON-LD should link to the service and primary image`);
    }
    const service = jsonLdNodes.find((node) => node["@id"] === serviceExpectation.serviceId);
    if (!service || service.provider?.["@id"] !== "https://twvita.com.tw/#business") {
      issues.push(`${file}: Service JSON-LD should use stable service id and business provider id`);
    }
    if (service && service.inLanguage !== "zh-Hant-TW") {
      issues.push(`${file}: Service JSON-LD should declare zh-Hant-TW`);
    }
    if (service?.provider?.inLanguage !== "zh-Hant-TW") {
      issues.push(`${file}: Service provider JSON-LD should declare zh-Hant-TW`);
    }
    const website = jsonLdNodes.find((node) => node["@id"] === "https://twvita.com.tw/#website");
    if (!website || website.url !== "https://twvita.com.tw/") {
      issues.push(`${file}: service page WebSite URL should be https://twvita.com.tw/`);
    }
    const faqPage = jsonLdNodes.find((node) => node["@type"] === "FAQPage");
    const visibleFaq = extractVisibleFaq(html);
    if (!faqPage || faqPage.inLanguage !== "zh-Hant-TW") {
      issues.push(`${file}: FAQPage JSON-LD should declare zh-Hant-TW`);
    }
    if (!Array.isArray(faqPage?.mainEntity) || faqPage.mainEntity.length !== visibleFaq.length || visibleFaq.length !== 3) {
      issues.push(`${file}: visible FAQ and FAQPage JSON-LD should both contain 3 questions`);
    } else {
      faqPage.mainEntity.forEach((question, index) => {
        const visible = visibleFaq[index];
        const answer = question.acceptedAnswer;
        if (question["@type"] !== "Question" || question.inLanguage !== "zh-Hant-TW") {
          issues.push(`${file}: FAQ question ${index + 1} should be a zh-Hant-TW Question`);
        }
        if (answer?.["@type"] !== "Answer" || answer.inLanguage !== "zh-Hant-TW") {
          issues.push(`${file}: FAQ answer ${index + 1} should be a zh-Hant-TW Answer`);
        }
        if (question.name !== visible.question || answer?.text !== visible.answer) {
          issues.push(`${file}: FAQPage JSON-LD question ${index + 1} should match visible FAQ text`);
        }
      });
    }
    if ((file === "roof-waterproofing" || file === "roof-waterproofing.html") && (!html.includes("屋頂上有水塔或冷氣設備，可以只處理局部嗎？") || html.includes("PVC/TPO 防水膜適合哪些屋頂？"))) {
      issues.push(`${file}: roof FAQ should focus on practical equipment-node repair, not material-spec wording`);
    }
    if ((file === "tank-pool-waterproofing" || file === "tank-pool-waterproofing.html") && (!html.includes("修繕後後續要怎麼檢查？") || html.includes("防水膜後續可以維修嗎？"))) {
      issues.push(`${file}: tank/pool FAQ should focus on follow-up inspection, not material-spec wording`);
    }
  }

	  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
	    const tag = match[0];
	    if (!/\bwidth="\d+"/.test(tag) || !/\bheight="\d+"/.test(tag)) {
	      issues.push(`${file}: image missing width or height: ${tag}`);
	    }
	    const src = tag.match(/\bsrc="([^"]+)"/)?.[1] ?? "";
	    const width = Number(tag.match(/\bwidth="(\d+)"/)?.[1] ?? 0);
	    const height = Number(tag.match(/\bheight="(\d+)"/)?.[1] ?? 0);
	    const assetPath = localAssetPath(src);
	    if (assetPath) {
	      const imageSize = readImageSize(assetPath);
	      if (!imageSize) {
	        issues.push(`${file}: image source missing or unsupported: ${src}`);
	      } else if (width && height && (imageSize.width !== width || imageSize.height !== height)) {
	        issues.push(`${file}: image dimensions for ${src} should be ${imageSize.width}x${imageSize.height}, found ${width}x${height}`);
	      }
	    }
	    if (tag.includes('loading="lazy"') && !tag.includes('fetchpriority="low"')) {
	      issues.push(`${file}: lazy image missing fetchpriority=low`);
	    }
	  }
	  for (const match of html.matchAll(/<source\b[^>]*\bsrcset="([^"]+)"[^>]*>/g)) {
	    const sourceTag = match[0];
	    if (!sourceTag.includes('type="image/webp"')) {
	      issues.push(`${file}: responsive picture source should declare image/webp type`);
	    }
	    if (!sourceTag.includes('sizes="')) {
	      issues.push(`${file}: responsive picture source missing sizes attribute`);
	    }
	    for (const candidate of parseSrcset(match[1])) {
	      const assetPath = localAssetPath(candidate.src);
	      const imageSize = assetPath ? readImageSize(assetPath) : null;
	      if (!assetPath || !imageSize) {
	        issues.push(`${file}: srcset image missing or unsupported: ${candidate.src}`);
	      } else if (candidate.width !== imageSize.width) {
	        issues.push(`${file}: srcset descriptor for ${candidate.src} should be ${imageSize.width}w, found ${candidate.width ?? "none"}`);
	      }
	    }
	  }
	  for (const match of html.matchAll(/<link\b[^>]*\brel="preload"[^>]*\bas="image"[^>]*>/g)) {
	    const preloadTag = match[0];
	    const href = preloadTag.match(/\bhref="([^"]+)"/)?.[1] ?? "";
	    const hrefAssetPath = localAssetPath(href);
	    if (!hrefAssetPath || !readImageSize(hrefAssetPath)) {
	      issues.push(`${file}: image preload href missing or unsupported: ${href || preloadTag}`);
	    }
	    const imageSrcset = preloadTag.match(/\bimagesrcset="([^"]+)"/)?.[1] ?? "";
	    if (!imageSrcset) {
	      issues.push(`${file}: image preload missing imagesrcset`);
	    }
	    if (!preloadTag.includes('imagesizes="')) {
	      issues.push(`${file}: image preload missing imagesizes`);
	    }
	    if (!preloadTag.includes('type="image/webp"')) {
	      issues.push(`${file}: image preload should declare image/webp type`);
	    }
	    if (!preloadTag.includes('fetchpriority="high"')) {
	      issues.push(`${file}: image preload should use high fetch priority`);
	    }
	    for (const candidate of parseSrcset(imageSrcset)) {
	      const assetPath = localAssetPath(candidate.src);
	      const imageSize = assetPath ? readImageSize(assetPath) : null;
	      if (!assetPath || !imageSize) {
	        issues.push(`${file}: preload srcset image missing or unsupported: ${candidate.src}`);
	      } else if (candidate.width !== imageSize.width) {
	        issues.push(`${file}: preload srcset descriptor for ${candidate.src} should be ${imageSize.width}w, found ${candidate.width ?? "none"}`);
	      }
	    }
	  }

  if (file === "index.html") {
    const heroImage = html.match(/<div class="hero-media">[\s\S]*?<img\b[^>]*>/)?.[0] ?? "";
    if (!heroImage.includes('fetchpriority="high"')) {
      issues.push("index.html: hero image missing fetchpriority=high");
    }
  }

  const priorityImageExpectation = priorityImageExpectations[file];
  if (priorityImageExpectation) {
    if (!html.includes(priorityImageExpectation.preload) || !html.includes('imagesrcset=') || !html.includes('fetchpriority="high">')) {
      issues.push(`${file}: first representative image should be preloaded with high fetch priority`);
    }
    const priorityImage = [...html.matchAll(/<img\b[^>]*>/g)]
      .map((match) => match[0])
      .find((tag) => tag.includes(priorityImageExpectation.image));
    if (!priorityImage) {
      issues.push(`${file}: missing first representative image ${priorityImageExpectation.image}`);
    } else {
      if (!priorityImage.includes(priorityImageExpectation.alt)) {
        issues.push(`${file}: first representative image alt text changed unexpectedly`);
      }
      if (!priorityImage.includes('fetchpriority="high"') || priorityImage.includes('loading="lazy"')) {
        issues.push(`${file}: first representative image should be eager/high priority, not lazy`);
      }
    }
  }

	  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
	    const value = match[1];
	    if (value.startsWith("tel:")) {
	      if (value !== "tel:+886228120021") {
	        issues.push(`${file}: telephone link should use tel:+886228120021, found ${value}`);
	      }
	      continue;
	    }
	    if (value.startsWith("mailto:")) {
	      const decodedMailto = decodeURIComponent(value.replace(/&amp;/g, "&"));
	      if (!decodedMailto.startsWith("mailto:vitawaterproof@gmail.com?")) {
	        issues.push(`${file}: Email link should target vitawaterproof@gmail.com, found ${value}`);
	      }
	      for (const requiredEmailField of ["subject=臺灣耘達防水工程評估", "建築類型：", "問題位置：", "目前狀況：", "照片或尺寸：", "使用限制：", "可聯絡時間："]) {
	        if (!decodedMailto.includes(requiredEmailField)) {
	          issues.push(`${file}: Email link missing inquiry field ${requiredEmailField}`);
	        }
	      }
	      continue;
	    }
	    if (value.startsWith("#") || value.startsWith("data:")) {
	      continue;
	    }
    if (value.startsWith("https://")) {
      const cleanUrl = value.split("?")[0];
      if (!allowedExternalUrls.has(cleanUrl)) {
        issues.push(`${file}: unexpected external URL ${value}`);
      }
      continue;
    }
    if (value.startsWith("http://")) {
      issues.push(`${file}: insecure URL ${value}`);
      continue;
    }

    const cleanPath = value.split("?")[0];
    if (canonicalRoutes.has(cleanPath)) {
      continue;
    }
    if (!existsPublic(cleanPath)) {
      issues.push(`${file}: missing local asset or route ${value}`);
    }
  }

  for (const match of html.matchAll(/<meta\b[^>]*(?:property|name)="(?:og:image|twitter:image)"[^>]*content="([^"]+)"[^>]*>/g)) {
    const value = match[1];
    if (!value.startsWith("https://twvita.com.tw/")) {
      issues.push(`${file}: social image should use canonical HTTPS origin: ${value}`);
      continue;
    }
    const localPath = value.replace("https://twvita.com.tw/", "/");
    if (!existsPublic(localPath)) {
      issues.push(`${file}: missing social image asset ${value}`);
    }
  }

  for (const match of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const candidate of match[1].split(",")) {
      const candidatePath = candidate.trim().split(/\s+/)[0];
      if (candidatePath.startsWith("/") && !existsPublic(candidatePath)) {
        issues.push(`${file}: missing srcset candidate ${candidatePath}`);
      }
    }
  }
}

if (versionMatches.size !== 1 || !versionMatches.has("20260617-audit96")) {
  issues.push(`public pages: expected only 20260617-audit96, found ${[...versionMatches].join(", ")}`);
}

for (const hash of jsonLdHashes) {
  if (!worker.includes(`'${hash}'`)) {
    issues.push(`_worker.js: CSP hash is not quoted for ${hash}`);
  }
}

try {
  const manifest = JSON.parse(read("public/manifest.webmanifest"));
  if (!manifest.description?.includes("雙北地區") || !manifest.description?.includes("專業防水工程") || !manifest.description?.includes("洽詢時請說明現況、位置與可施工限制")) {
    issues.push("manifest.webmanifest: description should match the current inquiry guidance");
  }
  if (manifest.id !== "https://twvita.com.tw/" || manifest.start_url !== "/" || manifest.scope !== "/") {
    issues.push("manifest.webmanifest: should keep stable site id, start_url, and scope");
  }
  if (manifest.lang !== "zh-Hant-TW") {
    issues.push("manifest.webmanifest: lang should match the site language zh-Hant-TW");
  }
  if (!Array.isArray(manifest.categories) || !manifest.categories.includes("business") || !manifest.categories.includes("utilities")) {
    issues.push("manifest.webmanifest: should include conservative business/utilities categories");
  }
	  const shortcutUrls = (manifest.shortcuts ?? []).map((shortcut) => shortcut.url);
	  for (const requiredShortcut of ["/contact", "/roof-waterproofing", "/tank-pool-waterproofing"]) {
	    if (!shortcutUrls.includes(requiredShortcut)) {
	      issues.push(`manifest.webmanifest: missing shortcut ${requiredShortcut}`);
	    }
	  }
	  for (const shortcutUrl of shortcutUrls) {
	    if (!shortcutUrl.startsWith("/") || shortcutUrl.includes(".html")) {
	      issues.push(`manifest.webmanifest: shortcut should use a clean local route, found ${shortcutUrl}`);
	    } else if (!canonicalRoutes.has(shortcutUrl) && !existsPublic(shortcutUrl)) {
	      issues.push(`manifest.webmanifest: shortcut route missing locally: ${shortcutUrl}`);
	    }
	  }
	} catch (error) {
  issues.push(`manifest.webmanifest: invalid JSON: ${error.message}`);
}

const sitemap = read("public/sitemap.xml");
if (!sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
  issues.push("sitemap.xml: missing expected XML declaration or urlset namespace");
}
if (sitemap.includes(".html") || sitemap.includes("www.twvita.com.tw") || sitemap.includes("sites.google")) {
  issues.push("sitemap.xml: should only list canonical apex URLs");
}
const sitemapUrlBlocks = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
if (sitemapUrlBlocks.length !== sitemapExpectations.length) {
  issues.push(`sitemap.xml: expected ${sitemapExpectations.length} URLs, found ${sitemapUrlBlocks.length}`);
}
for (const expected of sitemapExpectations) {
  const block = sitemapUrlBlocks.find((candidate) => candidate.includes(`<loc>${expected.loc}</loc>`));
  if (!block) {
    issues.push(`sitemap.xml: missing ${expected.loc}`);
    continue;
  }
  for (const requiredText of [
    "<lastmod>2026-06-17</lastmod>",
    "<changefreq>monthly</changefreq>",
    `<priority>${expected.priority}</priority>`,
  ]) {
    if (!block.includes(requiredText)) {
      issues.push(`sitemap.xml: ${expected.loc} missing ${requiredText}`);
    }
  }
}

const robots = read("public/robots.txt");
if (!robots.includes("User-agent: *") || !robots.includes("Allow: /")) {
  issues.push("robots.txt: should allow all crawlers");
}
if (!robots.includes("Sitemap: https://twvita.com.tw/sitemap.xml")) {
  issues.push("robots.txt: missing sitemap declaration");
}
if (robots.includes("Disallow:") || robots.includes("sites.google") || robots.includes("www.twvita.com.tw")) {
  issues.push("robots.txt: contains stale or blocking crawler directive");
}

const redirects = read("public/_redirects");
const redirectLines = redirects.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
if (redirectLines.length !== redirectExpectations.length) {
  issues.push(`_redirects: expected ${redirectExpectations.length} rules, found ${redirectLines.length}`);
}
for (const [from, to, status] of redirectExpectations) {
  const expectedLine = `${from} ${to} ${status}`;
  if (!redirectLines.includes(expectedLine)) {
    issues.push(`_redirects: missing ${expectedLine}`);
  }
}
if (redirectLines.some((line) => line.includes("sites.google") || line.includes("lin.ee"))) {
  issues.push("_redirects: contains stale external redirect target");
}

const headers = read("public/_headers");
for (const requiredHeadersText of [
  "/favicon.ico\n  Cache-Control: public, max-age=86400, must-revalidate",
  "/apple-touch-icon.png\n  Cache-Control: public, max-age=86400, must-revalidate",
  "/assets/*\n  Cache-Control: public, max-age=31536000, immutable",
]) {
  if (!headers.includes(requiredHeadersText)) {
    issues.push(`_headers: missing expected cache rule ${requiredHeadersText.split("\n")[0]}`);
  }
}

const llms = read("public/llms.txt");
for (const requiredLlmsText of [
  "工程經驗重點",
  "服務雙北地區專業防水工程",
  "目前服務範圍為雙北地區",
  "專業防水工程與修繕需求",
  "水路、基層、接縫、設備穿孔",
  "大型案場累積的是施工紀律與判斷順序",
  "並會預先帶入",
  "HTML 原始碼中即提供可用的 mailto 備援",
  "建築類型、問題位置、目前狀況、照片或尺寸、使用限制、可聯絡時間",
  "首頁：https://twvita.com.tw/",
  "公司簡介：https://twvita.com.tw/about",
  "屋頂防水：https://twvita.com.tw/roof-waterproofing",
  "水塔、水箱與池體防水：https://twvita.com.tw/tank-pool-waterproofing",
  "工程實績：https://twvita.com.tw/projects",
  "聯絡我們：https://twvita.com.tw/contact",
  "電話：(02)2812-0021",
  "Email：vitawaterproof [at] gmail.com",
  "地址：11172 台北市士林區永平街9巷16號",
  "網站目前不提供表單送出、即時通訊詢問、線上報價或電子商務功能。",
]) {
  if (!llms.includes(requiredLlmsText)) {
    issues.push(`llms.txt: missing updated public summary text: ${requiredLlmsText}`);
  }
}
if (llms.includes("LINE") || llms.includes("lin.ee") || llms.includes("sites.google") || llms.includes("防水膜規格")) {
  issues.push("llms.txt: contains stale channel, old host, or removed page wording");
}
if (llms.includes("vitawaterproof@gmail.com")) {
  issues.push("llms.txt: should keep Email obfuscated as vitawaterproof [at] gmail.com");
}

const readme = read("README.md");
const packageJson = JSON.parse(read("package.json"));
if (packageJson.scripts?.["cache:purge:obsolete"] !== "node scripts/purge-obsolete-cache.mjs") {
  issues.push("package.json: missing cache:purge:obsolete script");
}
const smokeLive = read("scripts/smoke-live.mjs");
if (!smokeLive.includes('import { obsoleteAssets } from "./cache-assets.mjs"') || !smokeLive.includes("const removedAssetChecks = obsoleteAssets;")) {
  issues.push("smoke-live.mjs: removed asset checks should reuse cache-assets obsoleteAssets");
}
const layoutLive = read("scripts/layout-live.mjs");
for (const requiredViewport of ['name: "mobile"', 'name: "tablet"', 'name: "narrow-desktop"', 'name: "desktop"']) {
  if (!layoutLive.includes(requiredViewport)) {
    issues.push(`layout-live.mjs: missing responsive viewport ${requiredViewport}`);
  }
}
const interactionLive = read("scripts/interaction-live.mjs");
for (const requiredInteractionText of [
  'name: "mobile", width: 390, height: 844',
  'name: "tablet", width: 768, height: 1024',
  'name: "narrow-desktop", width: 1024, height: 900',
  'name: "desktop", width: 1440, height: 1000',
  "viewport.width <= 900",
  "desktop navigation should be visible, non-inert, and expose all links",
  "across 4 viewports",
]) {
  if (!interactionLive.includes(requiredInteractionText)) {
    issues.push(`interaction-live.mjs: missing responsive interaction check ${requiredInteractionText}`);
  }
}
const consoleLive = read("scripts/console-live.mjs");
for (const requiredConsoleText of [
  'name: "mobile", width: 390, height: 844',
  'name: "tablet", width: 768, height: 1024',
  'name: "narrow-desktop", width: 1024, height: 900',
  'name: "desktop", width: 1440, height: 1000',
  "Console/runtime check passed",
]) {
  if (!consoleLive.includes(requiredConsoleText)) {
    issues.push(`console-live.mjs: missing responsive runtime check ${requiredConsoleText}`);
  }
}
const assetsLive = read("scripts/assets-live.mjs");
for (const requiredAssetsText of [
  'name: "mobile", width: 390, height: 844',
  'name: "tablet", width: 768, height: 1024',
  'name: "narrow-desktop", width: 1024, height: 900',
  'name: "desktop", width: 1440, height: 1000',
  "Asset check passed",
  "across 4 viewports",
]) {
  if (!assetsLive.includes(requiredAssetsText)) {
    issues.push(`assets-live.mjs: missing responsive image check ${requiredAssetsText}`);
  }
}
const a11yLive = read("scripts/a11y-live.mjs");
for (const requiredA11yText of [
  'name: "mobile", width: 390, height: 844',
  'name: "desktop", width: 1440, height: 1000',
  "--chrome-options=--window-size=",
  "Axe accessibility check passed",
]) {
  if (!a11yLive.includes(requiredA11yText)) {
    issues.push(`a11y-live.mjs: missing multi-viewport axe check ${requiredA11yText}`);
  }
}
for (const requiredReadmeText of [
  "npm run audit:live",
  "npm run copy:check",
  "npm run drift:live",
  "npm run discovery:live",
  "npm run headers:live",
  "npm run interaction:live",
  "npm run dom:live",
  "npm run metadata:live",
  "METADATA_BASE_URL=https://<preview>.twvita.pages.dev METADATA_CANONICAL_BASE_URL=https://twvita.com.tw npm run metadata:live",
  "npm run assets:live",
  "npm run structured:live",
  "npm run console:live",
  "npm run print:live",
  "npm run cache:live",
  "npm run cache:purge:obsolete",
  "CACHE_PURGE_EXECUTE=1 CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ZONE_ID=... npm run cache:purge:obsolete",
  "npx wrangler pages deploy public --project-name=twvita --branch=main",
  "Current public asset version: `20260617-audit96`",
  "目前服務範圍：雙北地區",
  "Footer company information should display `(02)2812-0021` on every page.",
  "The contact page company phone row should display `(02)2812-0021`; the lower contact phone action should use `來電洽詢`.",
  "Non-contact inquiry CTAs and bottom quick-contact phone labels should use `來電洽詢`.",
  "vitawaterproof@gmail.com",
  "Do not change Cloudflare DNS, TISNet, registrar nameservers, Pages custom domains, or public traffic routing without action-time confirmation.",
]) {
  if (!readme.includes(requiredReadmeText)) {
    issues.push(`README.md: missing maintenance guidance ${requiredReadmeText}`);
  }
}

if (issues.length > 0) {
  console.error(`Validation failed with ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Validation passed: ${htmlFiles.length} HTML route files, ${jsonLdHashes.size} JSON-LD CSP hashes.`);
