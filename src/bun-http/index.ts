import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const PORT = Number(process.env.PORT) || 3000;

// @ts-ignore
const server = Bun.serve({
  port: PORT,
  async fetch(req: any) {
    const url = new URL(req.url);
    const method = req.method;

    if (method === "GET" && url.pathname === "/") {
      return new Response("Hello World", {
        headers: { "Content-Type": "text/plain" },
      });
    }

    if (method === "GET" && url.pathname === "/json") {
      return Response.json({ message: "Hello World" });
    }

    if (method === "GET" && url.pathname.startsWith("/user/")) {
      const id = url.pathname.split("/")[2];
      return Response.json({ id });
    }

    if (method === "POST" && url.pathname === "/data") {
      try {
        const body = await req.json();
        return Response.json(body);
      } catch (e) {
        return Response.json({ error: "Invalid JSON" }, { status: 400 });
      }
    }

    if (method === "GET" && url.pathname.startsWith("/db/user/")) {
      const idStr = url.pathname.split("/")[3];
      const id = parseInt(idStr);
      if (isNaN(id)) {
        return Response.json({ error: "Invalid ID" }, { status: 400 });
      }
      const user = await db.query.users.findFirst({
        where: eq(users.id, id),
      });
      if (!user) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }
      return Response.json(user);
    }

    if (method === "POST" && url.pathname === "/db/user") {
      try {
        const { name, email } = await req.json();
        const result = await db
          .insert(users)
          .values({ name, email })
          .returning();
        return Response.json(result[0]);
      } catch (e) {
        return Response.json(
          { error: "Invalid JSON or database error" },
          { status: 400 },
        );
      }
    }

    return new Response("Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    });
  },
});

console.log(`Bun HTTP server listening on port ${PORT}`);
