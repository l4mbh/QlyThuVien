import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { ENV } from "../env/env";

const pool = new pg.Pool({ connectionString: ENV.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"],
});

export default prisma;
