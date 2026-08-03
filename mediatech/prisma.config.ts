import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7: CLI configuration. Tells the CLI where the schema is and what URL to use for migrations.
export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: env("DIRECT_URL") ?? env("DATABASE_URL"),
  },
});
