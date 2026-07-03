import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.DRIFT_BASE_URL ?? "https://twvita.com.tw";
const root = process.cwd();

const checks = [
  { urlPath: "/", localPath: "public/index.html", status: 200, type: "text/html" },
  { urlPath: "/about", localPath: "public/about", status: 200, type: "text/html" },
  { urlPath: "/roof-waterproofing", localPath: "public/roof-waterproofing", status: 200, type: "text/html" },
  { urlPath: "/tank-pool-waterproofing", localPath: "public/tank-pool-waterproofing", status: 200, type: "text/html" },
  { urlPath: "/projects", localPath: "public/projects", status: 200, type: "text/html" },
  { urlPath: "/contact", localPath: "public/contact", status: 200, type: "text/html" },
  { urlPath: "/assets/styles-20260617-audit96.css", localPath: "public/assets/styles-20260617-audit96.css", status: 200, type: "text/css" },
  { urlPath: "/assets/site.js?v=20260617-audit96", localPath: "public/assets/site.js", status: 200, type: "javascript" },
  { urlPath: "/assets/images/vita-icon.png?v=20260617-audit96", localPath: "public/assets/images/vita-icon.png", status: 200, type: "image/png" },
  { urlPath: "/assets/images/twvita-social-card-20260617.jpg", localPath: "public/assets/images/twvita-social-card-20260617.jpg", status: 200, type: "image/jpeg" },
  { urlPath: "/assets/images/private-rooftop-repair-720.webp", localPath: "public/assets/images/private-rooftop-repair-720.webp", status: 200, type: "image/webp" },
  { urlPath: "/assets/images/private-shop-roof-720.webp", localPath: "public/assets/images/private-shop-roof-720.webp", status: 200, type: "image/webp" },
  { urlPath: "/assets/images/private-tank-lining-720.webp", localPath: "public/assets/images/private-tank-lining-720.webp", status: 200, type: "image/webp" },
  { urlPath: "/assets/images/site-roof-detail-720.webp", localPath: "public/assets/images/site-roof-detail-720.webp", status: 200, type: "image/webp" },
  { urlPath: "/assets/images/roof-waterproof-surface-720.webp", localPath: "public/assets/images/roof-waterproof-surface-720.webp", status: 200, type: "image/webp" },
];

const sha256 = (buffer) => crypto.createHash("sha256").update(buffer).digest("hex");
const issues = [];

for (const check of checks) {
  const response = await fetch(`${baseUrl}${check.urlPath}`, {
    redirect: "manual",
    headers: { "cache-control": "no-cache" },
  });
  const remote = Buffer.from(await response.arrayBuffer());
  const local = await fs.readFile(path.join(root, check.localPath));
  const contentType = response.headers.get("content-type") ?? "";

  if (response.status !== check.status) {
    issues.push(`${check.urlPath}: expected status ${check.status}, got ${response.status}`);
  }
  if (!contentType.includes(check.type)) {
    issues.push(`${check.urlPath}: expected content-type including ${check.type}, got ${contentType || "none"}`);
  }
  const remoteHash = sha256(remote);
  const localHash = sha256(local);
  if (remoteHash !== localHash) {
    issues.push(`${check.urlPath}: production/local hash mismatch ${remoteHash.slice(0, 12)} != ${localHash.slice(0, 12)} (${remote.length}/${local.length} bytes)`);
  }
}

if (issues.length > 0) {
  console.error(`Production drift check failed for ${baseUrl} with ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Production drift check passed for ${baseUrl}: ${checks.length} files match local public assets.`);
