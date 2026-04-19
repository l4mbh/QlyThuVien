import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL || "",
  NODE_ENV: process.env.NODE_ENV || "development",
};

if (!ENV.DATABASE_URL) {
  console.error("CRITICAL: DATABASE_URL is not defined in .env file");
}
