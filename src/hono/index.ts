import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const app = new Hono();

app.get("/", (c) => c.text("Hello World"));

app.get("/json", (c) => c.json({ message: "Hello World" }));

app.get("/user/:id", (c) => {
  const id = c.req.param("id");
  return c.json({ id });
});

app.post("/data", async (c) => {
  const body = await c.req.json();
  return c.json(body);
});

app.get("/db/user/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  return c.json(user || { error: "Not found" });
});

app.post("/db/user", async (c) => {
  const body = await c.req.json();
  const result = await db.insert(users).values(body).returning();
  return c.json(result[0]);
});

const PORT = Number(process.env.PORT) || 3000;
console.log(`Hono server listening on port ${PORT}`);

serve({
  fetch: app.fetch,
  port: PORT,
});
