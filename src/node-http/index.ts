import http from "node:http";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  if (method === "GET" && url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello World");
    return;
  }

  if (method === "GET" && url === "/json") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Hello World" }));
    return;
  }

  if (method === "GET" && url?.startsWith("/user/")) {
    const id = url.split("/")[2];
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ id }));
    return;
  }

  if (method === "POST" && url === "/data") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(body);
    });
    return;
  }

  if (method === "GET" && url?.startsWith("/db/user/")) {
    const id = parseInt(url.split("/")[3]);
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    res.writeHead(user ? 200 : 404, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user || { error: "Not found" }));
    return;
  }

  if (method === "POST" && url === "/db/user") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const { name, email } = JSON.parse(body);
        const result = await db.insert(users).values({ name, email }).returning();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result[0]));
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log(`Node HTTP server listening on port ${PORT}`);
});
