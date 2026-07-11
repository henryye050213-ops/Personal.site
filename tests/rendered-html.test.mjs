import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders Henry Ye's finished personal site", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="zh-CN">/i);
  assert.match(html, /<title>Henry Ye｜连续创业者 · AI 产品商业化实践者<\/title>/);
  assert.match(html, /单月六位数/);
  assert.match(html, /全球年轻行动者社群/);
  assert.match(html, /\/assets\/wechat-qr\.jpg/);
  assert.match(html, /\/assets\/ray-review-qr\.jpg/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Codex is working/i);
});

test("contains the deployable Sites output and required static assets", async () => {
  const hosting = JSON.parse(
    await readFile(new URL("../dist/.openai/hosting.json", import.meta.url), "utf8"),
  );

  assert.match(hosting.project_id, /^appgprj_/);
  assert.equal(hosting.d1, null);
  assert.equal(hosting.r2, null);

  await Promise.all([
    access(new URL("../dist/server/index.js", import.meta.url)),
    access(new URL("../dist/client/assets/henry-avatar.png", import.meta.url)),
    access(new URL("../dist/client/assets/ink-landscape.png", import.meta.url)),
    access(new URL("../dist/client/assets/direction-illustrations.png", import.meta.url)),
    access(new URL("../dist/client/assets/wechat-qr.jpg", import.meta.url)),
    access(new URL("../dist/client/assets/ray-review-qr.jpg", import.meta.url)),
  ]);
});
