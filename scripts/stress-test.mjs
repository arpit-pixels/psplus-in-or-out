const url = process.argv[2] || "https://psplus-poll.vercel.app";
const concurrency = Number(process.argv[3] || 50);

const before = await fetch(`${url}/api/counts`).then((r) => r.json());
console.log(`Before: in=${before.in}, out=${before.out}`);

const t0 = Date.now();
const promises = [];
const results = { ok: 0, fail: 0, latencies: [] };

for (let i = 0; i < concurrency; i++) {
  const side = i % 2 === 0 ? "out" : "in";
  const t1 = Date.now();
  promises.push(
    fetch(`${url}/api/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ side }),
    })
      .then(async (r) => {
        const lat = Date.now() - t1;
        results.latencies.push(lat);
        if (r.ok) results.ok++;
        else results.fail++;
      })
      .catch(() => results.fail++)
  );
}

await Promise.all(promises);
const elapsed = Date.now() - t0;

const lats = results.latencies.sort((a, b) => a - b);
const p50 = lats[Math.floor(lats.length * 0.5)];
const p95 = lats[Math.floor(lats.length * 0.95)];
const p99 = lats[Math.floor(lats.length * 0.99)];
const max = lats[lats.length - 1];

console.log(`${concurrency} concurrent votes in ${elapsed}ms`);
console.log(`OK: ${results.ok}  Fail: ${results.fail}`);
console.log(`Latency p50=${p50}ms p95=${p95}ms p99=${p99}ms max=${max}ms`);

const after = await fetch(`${url}/api/counts`).then((r) => r.json());
console.log(`After: in=${after.in}, out=${after.out}`);
console.log(`Delta: in +${after.in - before.in}, out +${after.out - before.out}`);
