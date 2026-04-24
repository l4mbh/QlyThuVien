"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCallNumber = generateCallNumber;
const db_1 = __importDefault(require("../config/db/db"));
async function generateCallNumber(author, publishedYear, categoryCode) {
    const authorCode = author.slice(0, 3).toUpperCase();
    const year = publishedYear || new Date().getFullYear();
    const base = `${categoryCode}.${authorCode}${year}`;
    // Count existing books with same base to create suffix
    const count = await db_1.default.book.count({
        where: { callNumber: { startsWith: base } },
    });
    const suffix = count > 0 ? `.${count}` : '';
    return base + suffix;
}
