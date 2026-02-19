import autocannon from "autocannon";
import { spawn } from "child_process";

const frameworks = [
  { name: "Express", path: `${__dirname}/express/index.js` },
  { name: "Hono", path: `${__dirname}/hono/index.js` },
  { name: "NestJS", path: `${__dirname}/nest/main.js` },
];

const scenarios = [
  { name: "Hello World", path: "/" },
  { name: "JSON", path: "/json" },
  { name: "Route Params", path: "/user/123" },
];

async function runBenchmark(framework: { name: string; path: string }) {
  console.log(`
🚀 Benchmarking ${framework.name}...`);

  const server = spawn("node", [framework.path], {
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
