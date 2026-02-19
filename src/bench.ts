import autocannon from "autocannon";
import { spawn } from "child_process";
import path from "path";

const frameworks = [
  { name: "Express", path: "src/express/index.ts" },
  { name: "Hono", path: "src/hono/index.ts" },
  { name: "NestJS", path: "src/nest/main.ts" },
];

const scenarios = [
  { name: "Hello World", path: "/" },
  { name: "JSON", path: "/json" },
  { name: "Route Params", path: "/user/123" },
];

async function runBenchmark(framework: { name: string; path: string }) {
  console.log(`
🚀 Benchmarking ${framework.name}...`);

  const server = spawn("npx", ["ts-node", framework.path], {
    env: { ...process.env, PORT: "3000" },
    detached: true,
  });

  // Wait for server to start
  await new Promise((resolve) => setTimeout(resolve, 5000));

  for (const scenario of scenarios) {
    console.log(`  🔹 Scenario: ${scenario.name}`);
    const result = await autocannon({
      url: `http://localhost:3000${scenario.path}`,
      connections: 100,
      duration: 10,
    });
    console.log(`     Requests/sec: ${result.requests.average}`);
    console.log(`     Latency (ms): ${result.latency.average}`);
  }

  // Kill the server process group
  process.kill(-server.pid!);
}

async function main() {
  for (const framework of frameworks) {
    try {
      await runBenchmark(framework);
    } catch (e) {
      console.error(`Error benchmarking ${framework.name}:`, e);
    }
  }
}

main();
