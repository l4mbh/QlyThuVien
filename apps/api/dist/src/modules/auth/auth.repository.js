"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const db_1 = __importDefault(require("../../config/db/db"));
class AuthRepository {
    async findByEmail(email) {
        return db_1.default.user.findUnique({
            where: { email },
        });
    }
    async createUser(data) {
        return db_1.default.user.create({
            data: {
                ...data,
                role: "STAFF", // Default role
            },
        });
    }
    async findById(id) {
        return db_1.default.user.findUnique({
            where: { id },
        });
    }
}
exports.AuthRepository = AuthRepository;
