import express from "express";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/json", (req, res) => {
  res.json({ message: "Hello World" });
});

app.get("/user/:id", (req, res) => {
  res.json({ id: req.params.id });
});

app.post("/data", (req, res) => {
  res.json(req.body);
});

app.get("/db/user/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  res.json(user || { error: "Not found" });
});

app.post("/db/user", async (req, res) => {
  const { name, email } = req.body;
  const result = await db.insert(users).values({ name, email }).returning();
  res.json(result[0]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
