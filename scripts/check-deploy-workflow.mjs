import { readFileSync } from "node:fs";

const workflow = readFileSync(".github/workflows/deploy.yml", "utf8");
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const issues = [];
const requireCheck = (condition, message) => {
  if (!condition) issues.push(message);
};

// Inspect top-level trigger keys and the production job using indentation.
const triggers = workflow.match(/^on:\s*\n((?:^[ \t]+.*\n|^\s*\n)*)/m)?.[1] ?? "";
const triggerNames = [...triggers.matchAll(/^  ([\w-]+):/gm)].map((match) => match[1]);
requireCheck(
  triggerNames.length === 2 && new Set(triggerNames).size === 2 &&
    triggerNames.includes("pull_request") && triggerNames.includes("workflow_dispatch"),
  "Workflow triggers must be only pull_request and workflow_dispatch.",
);
const job = workflow.match(/^  deploy-production:\s*\n((?:(?:^ {4,}.*|^\s*)\n?)*)/m)?.[1] ?? "";
requireCheck(/^    if:\s*(?:\$\{\{\s*)?github\.event_name\s*==\s*['"]workflow_dispatch['"]\s*(?:\}\})?\s*$/m.test(job), "Production job must be limited to workflow_dispatch.");
requireCheck(/^    environment:\s*(?:production\s*$|\n      name:\s*production\s*$)/m.test(job), "Production job must use the production environment.");
const concurrency = job.match(/^    concurrency:\s*\n((?:^ {6,}.*\n?)*)/m)?.[1] ?? "";
const group = concurrency.match(/^      group:\s*["']?([^\s"']+)["']?\s*$/m)?.[1];
requireCheck(Boolean(group) && !group.includes("${{") && !group.includes("github.ref"), "Production concurrency group must be fixed.");
requireCheck(/^      cancel-in-progress:\s*false\s*$/m.test(concurrency), "Production concurrency must not cancel in-progress deployments.");
requireCheck(/\bnpx\s+--no-install\s+wrangler\s+pages\s+deploy\b/.test(job), "Production deployment must use locally installed Wrangler.");
requireCheck(pkg.devDependencies?.wrangler === "4.157.0", "Wrangler must be an exact 4.157.0 devDependency.");

if (issues.length) {
  for (const issue of issues) console.error(`Deploy workflow check: ${issue}`);
  process.exitCode = 1;
} else {
  console.log("Deploy workflow check passed.");
}
