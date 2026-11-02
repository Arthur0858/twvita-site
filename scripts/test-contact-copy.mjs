import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { test } from "node:test";

const source = fs.readFileSync("public/assets/contact-copy-20261102.js", "utf8");
const html = fs.readFileSync("public/contact.html", "utf8");
const body = html.match(/<textarea id="inquiry-template"[^>]*>([\s\S]*?)<\/textarea>/)?.[1];
const href = html.match(/href="(mailto:[^"]+)" data-email-link/)?.[1].replaceAll("&amp;", "&");

test("manual fallback preserves the complete mailto template and address", () => {
  const url = new URL(href);
  assert.equal(body, url.searchParams.get("body"));
  assert.ok(html.includes(`value="${url.pathname}" readonly`));
  assert.equal(html, fs.readFileSync("public/contact", "utf8"));
});

async function exercise(writeText, value) {
  let handler;
  let selected = false;
  const field = { value, focus() {}, select() { selected = true; } };
  const status = { textContent: "" };
  const button = { dataset: { copyInquiry: "inquiry-template" }, hidden: true, addEventListener(_, cb) { handler = cb; } };
  const document = { querySelectorAll: () => [button], querySelector: () => status, getElementById: () => field };
  vm.runInNewContext(source, { document, navigator: { clipboard: writeText ? { writeText } : undefined } });
  assert.equal(button.hidden, false);
  await handler();
  return { status: status.textContent, selected };
}

test("clipboard success preserves newlines and special characters without claiming delivery", async () => {
  const input = "照片 & 尺寸：2×3\n位置：A/B?";
  let copied;
  const result = await exercise(async (value) => { copied = value; }, input);
  assert.equal(copied, input);
  assert.match(result.status, /尚未寄出/);
  assert.equal(result.selected, false);
});

test("clipboard rejection or missing API leaves text selectable", async () => {
  for (const write of [async () => { throw new Error("denied"); }, undefined]) {
    const result = await exercise(write, body);
    assert.match(result.status, /手動複製/);
    assert.equal(result.selected, true);
  }
});