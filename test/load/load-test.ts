import http from "http";

const BASE_URL = "http://localhost:8000";
const DEFAULT_CONCURRENCY = 10;
const DEFAULT_DURATION_MS = 10_000;

interface EndpointResult {
  endpoint: string;
  totalRequests: number;
  errors: number;
  minLatency: number;
  maxLatency: number;
  avgLatency: number;
  requestsPerSec: number;
}

function httpGet(path: string): Promise<{ statusCode: number; latency: number }> {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    const req = http.get(`${BASE_URL}${path}`, (res) => {
      res.resume();
      res.on("end", () => {
        resolve({ statusCode: res.statusCode ?? 0, latency: performance.now() - start });
      });
    });
    req.on("error", (err) => reject(err));
    req.setTimeout(5000, () => {
      req.destroy(new Error("Request timed out"));
    });
  });
}

async function checkServerReachable(): Promise<boolean> {
  try {
    await httpGet("/teams");
    return true;
  } catch {
    return false;
  }
}

async function runEndpointTest(
  path: string,
  concurrency: number,
  durationMs: number
): Promise<EndpointResult> {
  const latencies: number[] = [];
  let errors = 0;
  let totalRequests = 0;
  const deadline = Date.now() + durationMs;

  while (Date.now() < deadline) {
    const batch = Array.from({ length: concurrency }, () =>
      httpGet(path)
        .then(({ statusCode, latency }) => {
          if (statusCode >= 400 || statusCode === 0) errors++;
          latencies.push(latency);
        })
        .catch(() => {
          errors++;
          latencies.push(5000); // count timeout as 5s latency
        })
    );
    await Promise.all(batch);
    totalRequests += concurrency;
  }

  const min = Math.min(...latencies);
  const max = Math.max(...latencies);
  const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const rps = (totalRequests / durationMs) * 1000;

  return {
    endpoint: path,
    totalRequests,
    errors,
    minLatency: Math.round(min),
    maxLatency: Math.round(max),
    avgLatency: Math.round(avg),
    requestsPerSec: Math.round(rps * 10) / 10,
  };
}

function printTable(results: EndpointResult[]): void {
  const col = {
    endpoint: Math.max(8, ...results.map((r) => r.endpoint.length)),
    totalRequests: 8,
    rps: 10,
    avgLatency: 11,
    minLatency: 10,
    maxLatency: 10,
    errors: 7,
  };

  const pad = (s: string | number, n: number) => String(s).padEnd(n);
  const header = [
    pad("Endpoint", col.endpoint),
    pad("Requests", col.totalRequests),
    pad("Req/sec", col.rps),
    pad("Avg lat(ms)", col.avgLatency),
    pad("Min lat(ms)", col.minLatency),
    pad("Max lat(ms)", col.maxLatency),
    pad("Errors", col.errors),
  ].join(" | ");

  const separator = "-".repeat(header.length);

  console.log("\n=== Load Test Results ===\n");
  console.log(header);
  console.log(separator);

  for (const r of results) {
    console.log(
      [
        pad(r.endpoint, col.endpoint),
        pad(r.totalRequests, col.totalRequests),
        pad(r.requestsPerSec, col.rps),
        pad(r.avgLatency, col.avgLatency),
        pad(r.minLatency, col.minLatency),
        pad(r.maxLatency, col.maxLatency),
        pad(r.errors, col.errors),
      ].join(" | ")
    );
  }

  console.log(separator);
  console.log();
}

async function main() {
  const concurrency = parseInt(process.env.CONCURRENCY ?? "", 10) || DEFAULT_CONCURRENCY;
  const durationMs = parseInt(process.env.DURATION_MS ?? "", 10) || DEFAULT_DURATION_MS;

  console.log(`Load test config: concurrency=${concurrency}, duration=${durationMs}ms`);
  console.log(`Target: ${BASE_URL}\n`);

  console.log("Checking server reachability...");
  const reachable = await checkServerReachable();
  if (!reachable) {
    console.error(
      `\nERROR: Server at ${BASE_URL} is not reachable.\n` +
        "Please start the server before running the load test:\n" +
        "  npm run dev\n"
    );
    process.exit(1);
  }
  console.log("Server is up.\n");

  const endpoints = [
    "/teams",
    "/matches?page=1&limit=10",
    "/matches?page=2&limit=10",
    "/matches?page=3&limit=5",
    "/draw",
    "/draw/statistics",
  ];

  const results: EndpointResult[] = [];

  for (const endpoint of endpoints) {
    process.stdout.write(`Testing ${endpoint} ... `);
    const result = await runEndpointTest(endpoint, concurrency, durationMs);
    results.push(result);
    console.log(`done (${result.totalRequests} reqs, ${result.requestsPerSec} req/s)`);
  }

  printTable(results);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
