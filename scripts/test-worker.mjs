import assert from "node:assert/strict";
import { test } from "node:test";
import worker from "../public/_worker.js";

console.log("Unit tests: Worker behavior");

const request = (path) => new Request(`https://twvita.com.tw${path}`);
const assets = (fetch) => ({ ASSETS: { fetch } });
const unused = assets(() => { throw new Error("Unexpected asset fetch"); });

for (const [url, location] of [
  ["https://www.twvita.com.tw/about?x=1", "https://twvita.com.tw/about?x=1"],
  ["https://twvita.com.tw/about.html?x=1", "https://twvita.com.tw/about?x=1"],
  ["https://twvita.com.tw/about///?x=1", "https://twvita.com.tw/about?x=1"],
  ["https://twvita.com.tw/case?x=1", "https://twvita.com.tw/projects?x=1"],
  ["https://twvita.com.tw/case/", "https://twvita.com.tw/projects"],
]) {
  test(`redirect ${url}`, async () => {
    const response = await worker.fetch(new Request(url), unused);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get("location"), location);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  });
}

for (const route of ["/format", "/format/", "/format.html"]) {
  test(`gone ${route}`, async () => {
    const response = await worker.fetch(request(route), unused);
    assert.equal(response.status, 410);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.match(await response.text(), /<meta name="robots" content="noindex">/);
  });
}

test("unknown asset 404 preserves cache policy and adds security and robots headers", async () => {
  const response = await worker.fetch(request("/unknown"), assets(async () => new Response("missing", {
    status: 404, headers: { "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*" },
  })));
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
  assert.equal(response.headers.get("x-frame-options"), "SAMEORIGIN");
  assert.ok(response.headers.has("content-security-policy"));
  assert.equal(response.headers.has("access-control-allow-origin"), false);
});

test("robots receives content type, cache and security headers", async () => {
  const response = await worker.fetch(request("/robots.txt"), assets(async () => new Response("User-agent: *")));
  assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
  assert.match(response.headers.get("cache-control"), /max-age=3600/);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
});

test("asset fetch errors propagate", async () => {
  const error = new Error("asset failure");
  await assert.rejects(worker.fetch(request("/unknown"), assets(async () => { throw error; })), error);
});

test("asset 5xx responses retain status and gain security headers", async () => {
  const response = await worker.fetch(request("/unknown"), assets(async () => new Response("failure", { status: 503 })));
  assert.equal(response.status, 503);
  assert.equal(await response.text(), "failure");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
});
