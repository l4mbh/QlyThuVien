import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "default_secret_key_change_me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
};

if (!ENV.DATABASE_URL) {
  console.error("CRITICAL: DATABASE_URL is not defined in .env file");
}
