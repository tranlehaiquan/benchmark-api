import autocannon from "autocannon";
import { spawn } from "child_process";
import fs from "node:fs/promises";

const args = process.argv.slice(2);
const runTime = args[0] || "node";

const frameworks = [
  { name: "Node Http", path: `${__dirname}/node-http/index.js` },
  { name: "Express", path: `${__dirname}/express/index.js` },
  { name: "Hono", path: `${__dirname}/hono/index.js` },
  { name: "NestJS", path: `${__dirname}/nest/main.js` },
];

const scenarios = [
  { name: "Hello World", path: "/" },
  { name: "JSON", path: "/json" },
  { name: "Route Params", path: "/user/123" },
  {
    name: "JSON Body",
    path: "/data",
    method: "POST" as const,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "John Doe", email: "john@example.com" }),
  },
  { name: "Database Read", path: "/db/user/1" },
  {
    name: "Database Write",
    path: "/db/user",
    method: "POST" as const,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "New User", email: "new@example.com" }),
  },
];

async function runBenchmark(framework: { name: string; path: string }) {
  let log = `🚀 Benchmarking ${framework.name}... \n`;
  console.log(`🚀 Benchmarking ${framework.name}...`);

  const server = spawn(runTime, [framework.path], {
    env: { ...process.env, PORT: "3000" },
    detached: true,
  });

  // Wait for server to start
  await new Promise((resolve) => setTimeout(resolve, 5000));

  for (const scenario of scenarios) {
    log += `  🔹 Scenario: ${scenario.name} \n`;
    console.log(`  🔹 Scenario: ${scenario.name}`);
    const result = await autocannon({
      url: `http://localhost:3000${scenario.path}`,
      connections: 100,
      duration: 10,
      method: (scenario as any).method || "GET",
      headers: (scenario as any).headers,
      body: (scenario as any).body,
    });
    console.log(`     Requests/sec: ${result.requests.average}`);
    console.log(`     Latency (ms): ${result.latency.average}`);

    log += `     Requests/sec: ${result.requests.average} \n`;
    log += `     Latency (ms): ${result.latency.average} \n`;
  }

  // Kill the server process group
  try {
    process.kill(-server.pid!);
  } catch (e) {
    console.log(e);
  }
  return log;
}

async function main() {
  console.log(`Runtime ${runTime} \n`);
  let logs = [];
  for (const framework of frameworks) {
    try {
      const log = await runBenchmark(framework);
      logs.push(log);
    } catch (e) {
      console.error(`Error benchmarking ${framework.name}:`, e);
    }
  }

  await fs.writeFile(`log-${runTime}.txt`, logs.join("\n---\n"));
}

main();
