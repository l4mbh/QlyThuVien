"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.ENV = {
    PORT: process.env.PORT || 3000,
    DATABASE_URL: process.env.DATABASE_URL || "",
    NODE_ENV: process.env.NODE_ENV || "development",
    JWT_SECRET: process.env.JWT_SECRET || "default_secret_key_change_me",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
    GOOGLE_BOOKS_API_KEY: process.env.GOOGLE_BOOKS_API_KEY || "",
};
if (!exports.ENV.DATABASE_URL) {
    console.error("CRITICAL: DATABASE_URL is not defined in .env file");
}
