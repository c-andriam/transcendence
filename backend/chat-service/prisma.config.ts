import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // ✅ Cette ligne est obligatoire pour prisma migrate
    url: process.env.CHAT_DATABASE_URL,
  },
});
