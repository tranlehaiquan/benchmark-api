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
│   ├── db/           # Drizzle schema and connection
│   ├── express/      # Express implementation
│   ├── hono/         # Hono implementation
│   ├── nest/         # NestJS implementation
│   ├── node-http/    # Node.js native http implementation
│   └── bench.ts      # Main benchmarking script using autocannon
├── log-node.txt      # Node.js benchmark results
├── log-bun.txt       # Bun benchmark results
└── package.json
```

## 📈 Planned Workflow

1. **Setup**: Implement identical endpoints across all selected frameworks.
2. **Execution**: Run each server in isolation and execute `autocannon` against it.
3. **Data Collection**: Capture results in JSON/Markdown format.
4. **Analysis**: Generate comparison charts and tables.

## 🏃 How to Run

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (latest LTS)
- [Bun](https://bun.sh/) (optional, for Bun benchmarks)
- [PostgreSQL](https://www.postgresql.org/) (for database benchmarks)

### 2. Setup

```bash
# Install dependencies
pnpm install

# Build the project
pnpm run build

# Setup environment variables (required for DB benchmarks)
cp .env.example .env
# Edit .env and set your DATABASE_URL
```

### 3. Run Benchmarks

You can run the benchmarks using Node.js or Bun as the server runtime. The orchestrator will start each server, run autocannon, and then stop it.

#### Using Node.js
```bash
pnpm run bench
```
Results will be saved to `log-node.txt`.

#### Using Bun
```bash
pnpm run bench:bun
```
Results will be saved to `log-bun.txt`.

### Result

Running on my Macbook: M3 Pro 36 GB in log-bun.txt and log-node.
