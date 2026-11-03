const { test, before, after } = require("node:test");
const assert = require("node:assert");
const { spawn } = require("node:child_process");

let server;
before(async () => {
  server = spawn("node", ["server.js"], { env: { ...process.env, PORT: "5055", API_SECRET_KEY: "test-key" } });
  await new Promise((resolve) => setTimeout(resolve, 1500));
});
after(() => server.kill());

test("health endpoint returns 200", async () => {
  const res = await fetch("http://localhost:5055/api/health");
  assert.strictEqual(res.status, 200);
});

test("cart validation rejects a missing API key", async () => {
  const res = await fetch("http://localhost:5055/api/cart/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: [] }),
  });
  assert.strictEqual(res.status, 401);
});

test("metrics endpoint exposes Prometheus data", async () => {
  const res = await fetch("http://localhost:5055/metrics");
  assert.strictEqual(res.status, 200);
  assert.match(await res.text(), /http_request_duration_seconds/);
});
