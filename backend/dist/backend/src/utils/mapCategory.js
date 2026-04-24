"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCategory = mapCategory;
const categoryMap_json_1 = __importDefault(require("../config/category/categoryMap.json"));
function mapCategory(externalCategory) {
    if (!externalCategory) {
        return { name: "Unknown", code: "000" };
    }
    const key = externalCategory.toLowerCase();
    const map = categoryMap_json_1.default;
    for (const term in map) {
        if (key.includes(term)) {
            return map[term];
        }
    }
    return { name: "Unknown", code: "000" };
}
