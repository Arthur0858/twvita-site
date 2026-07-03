import { spawn } from "node:child_process";

const checks = [
  ["validate", ["run", "validate"]],
  ["copy:check", ["run", "copy:check"]],
  ["drift:live", ["run", "drift:live"]],
  ["discovery:live", ["run", "discovery:live"]],
  ["headers:live", ["run", "headers:live"]],
  ["links:live", ["run", "links:live"]],
  ["interaction:live", ["run", "interaction:live"]],
  ["dom:live", ["run", "dom:live"]],
  ["metadata:live", ["run", "metadata:live"]],
  ["assets:live", ["run", "assets:live"]],
  ["perf:live", ["run", "perf:live"]],
  ["structured:live", ["run", "structured:live"]],
  ["smoke:live", ["run", "smoke:live"]],
  ["console:live", ["run", "console:live"]],
  ["layout:live", ["run", "layout:live"]],
  ["print:live", ["run", "print:live"]],
  ["a11y:live", ["run", "a11y:live"]],
  ["cache:live", ["run", "cache:live"]],
];

const run = ([label, args]) => new Promise((resolve, reject) => {
  console.log(`\n== ${label} ==`);
  const child = spawn("npm", args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
  });
  child.on("error", reject);
  child.on("close", (code) => {
    if (code === 0) {
      resolve();
    } else {
      reject(new Error(`${label} failed with exit code ${code}`));
    }
  });
});

for (const check of checks) {
  await run(check);
}

console.log(`\nFull live audit passed: ${checks.length} checks completed.`);
