# Benchmark HTTP Libraries

This project aims to benchmark popular Node.js/TypeScript HTTP libraries to compare their performance in terms of throughput, latency, and resource efficiency.

## 🚀 Objectives

- Compare **Express**, **Hono**, and **NestJS**.
- Measure throughput (Requests per second) using `autocannon`.
- Analyze latency distribution.
- Evaluate performance across different scenarios (Plain text, JSON, Routing).

## 🛠 Tooling

- **Load Testing**: [autocannon](https://github.com/mcollina/autocannon)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM with a focus on performance and type safety.
- **Frameworks**:
  - [Express](https://expressjs.com/) - The classic Node.js framework.
  - [Hono](https://hono.dev/) - Ultrafast web framework for any JavaScript runtime.
  - [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- **Runtime**: Node.js
- **Package Manager**: pnpm

## 📊 Benchmark Scenarios

1. **Hello World**: A simple `GET /` returning "Hello World" in plain text.
2. **JSON Response**: A `GET /json` returning a small JSON object.
3. **Route Params**: A `GET /user/:id` returning the ID in a JSON object.
4. **JSON Body**: A `POST /data` receiving a JSON body and returning it.
5. **Database Read**: A `GET /db/user/:id` fetching a user from the database using Drizzle.
6. **Database Write**: A `POST /db/user` creating a new user in the database.

## 📂 Project Structure

```text
benchmark-api/
├── src/
│   ├── express/      # Express implementation
│   ├── hono/         # Hono implementation
│   ├── nest/         # NestJS implementation
│   └── bench.js      # Main benchmarking script using autocannon
├── results/          # Stored benchmark results
└── package.json
```

## 📈 Planned Workflow

1. **Setup**: Implement identical endpoints across all selected frameworks.
2. **Execution**: Run each server in isolation and execute `autocannon` against it.
3. **Data Collection**: Capture results in JSON/Markdown format.
4. **Analysis**: Generate comparison charts and tables.

## 🏃 How to Run (Proposed)

```bash
# Install dependencies
pnpm install

# Run all benchmarks
pnpm run bench
```

### Result

Running on my Macbook: M3 Pro 36 GB

```
🚀 Benchmarking Express...
  🔹 Scenario: Hello World
     Requests/sec: 56225.46
     Latency (ms): 1.1
  🔹 Scenario: JSON
     Requests/sec: 54785.46
     Latency (ms): 1.12
  🔹 Scenario: Route Params
     Requests/sec: 53662.55
     Latency (ms): 1.09

🚀 Benchmarking Hono...
  🔹 Scenario: Hello World
     Requests/sec: 88288
     Latency (ms): 0.98
  🔹 Scenario: JSON
     Requests/sec: 81835.64
     Latency (ms): 1.01
  🔹 Scenario: Route Params
     Requests/sec: 80322.91
     Latency (ms): 1.02

🚀 Benchmarking NestJS...
  🔹 Scenario: Hello World
     Requests/sec: 52650.19
     Latency (ms): 1.16
  🔹 Scenario: JSON
     Requests/sec: 51838.55
     Latency (ms): 1.1
  🔹 Scenario: Route Params
     Requests/sec: 48440.73
     Latency (ms): 1.61
```
