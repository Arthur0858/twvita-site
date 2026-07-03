import fs from "node:fs";

const files = [
  "public/index.html",
  "public/about.html",
  "public/roof-waterproofing.html",
  "public/tank-pool-waterproofing.html",
  "public/projects.html",
  "public/contact.html",
];

const issues = [];
const bannedTerms = [
  "AI",
  "智慧防水",
  "革命性",
  "最頂級",
  "最佳解決方案",
  "一站式",
  "全方位解決方案",
  "LINE",
  "line://",
  "lin.ee",
  "防水膜規格",
  "趕時間或正在漏水",
  "小型民間案件",
  "民間小案",
  "全部打掉重做",
];

const stripHtml = (html) => html
  .replace(/<script[\s\S]*?<\/script>/g, " ")
  .replace(/<style[\s\S]*?<\/style>/g, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/\s+/g, " ")
  .trim();

const mainHtml = (html) => html.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? "";
const sentences = (text) => text
  .split(/[。！？?；;]/)
  .map((sentence) => sentence.replace(/\s+/g, " ").trim())
  .filter((sentence) => sentence.length >= 14);

const sharedFooterOrContact = (sentence) =>
  sentence.includes("臺灣耘達股份有限公司 11172 台北市士林區永平街9巷16號") ||
  sentence.includes("來電洽詢 Email 洽詢") ||
  sentence.includes("TEL： (02)2812-0021");

const sentenceOwners = new Map();
const totalText = [];

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const visibleMain = stripHtml(mainHtml(html));
  totalText.push(visibleMain);

  for (const term of bannedTerms) {
    if (html.includes(term)) {
      issues.push(`${file}: banned or stale copy term found: ${term}`);
    }
  }

  for (const sentence of sentences(visibleMain)) {
    if (sharedFooterOrContact(sentence)) {
      continue;
    }
    const normalized = sentence.replace(/\s/g, "");
    const owners = sentenceOwners.get(normalized) ?? [];
    owners.push(file);
    sentenceOwners.set(normalized, owners);
  }
}

for (const [sentence, owners] of sentenceOwners) {
  const uniqueOwners = [...new Set(owners)];
  if (uniqueOwners.length > 1) {
    issues.push(`duplicate visible sentence across pages (${uniqueOwners.join(", ")}): ${sentence}`);
  }
}

const combinedText = totalText.join("");
const termLimits = new Map([
  ["防水工程", 14],
  ["專業", 12],
  ["判斷", 22],
  ["施工", 32],
  ["現場", 22],
  ["設備", 34],
  ["Email", 18],
]);

for (const [term, limit] of termLimits) {
  const count = (combinedText.match(new RegExp(term, "g")) ?? []).length;
  if (count > limit) {
    issues.push(`visible copy uses "${term}" ${count} times; expected <= ${limit}`);
  }
}

if (!combinedText.includes("公共工程的施工紀律") || !combinedText.includes("民間修繕服務")) {
  issues.push("visible copy should keep the public-project experience to private repair positioning");
}
if (!combinedText.includes("目前服務範圍為雙北地區") && !combinedText.includes("目前服務範圍：雙北地區")) {
  issues.push("visible copy should keep the current service area clear");
}
if (!combinedText.includes("(02)2812-0021") || !combinedText.includes("vitawaterproof")) {
  issues.push("visible copy should expose phone and Email contact information");
}

if (issues.length > 0) {
  console.error(`Copy quality check failed with ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Copy quality check passed: ${files.length} pages, ${sentenceOwners.size} visible sentence candidates.`);
