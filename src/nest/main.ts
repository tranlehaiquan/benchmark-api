import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import {
  Module,
  Controller,
  Get,
  Post,
  Param,
  Body,
} from "@nestjs/common";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

@Controller()
class AppController {
  @Get()
  getHello(): string {
    return "Hello World";
  }

  @Get("json")
  getJson() {
    return { message: "Hello World" };
  }

  @Get("user/:id")
  getUser(@Param("id") id: string) {
    return { id };
  }

  @Post("data")
  postData(@Body() body: any) {
    return body;
  }

  @Get("db/user/:id")
  async getDbUser(@Param("id") id: string) {
    const userId = parseInt(id);
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    return user || { error: "Not found" };
  }

  @Post("db/user")
  async postDbUser(@Body() body: { name: string; email: string }) {
    const result = await db.insert(users).values(body).returning();
    return result[0];
  }
}

@Module({
  controllers: [AppController],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`NestJS server listening on port ${PORT}`);
}
bootstrap();
