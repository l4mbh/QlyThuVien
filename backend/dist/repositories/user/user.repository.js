"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const db_1 = __importDefault(require("../../config/db/db"));
class UserRepository {
    async findAll(filter = {}) {
        return db_1.default.user.findMany({
            where: filter
        });
    }
    async findById(id) {
        return db_1.default.user.findUnique({
            where: { id },
            include: {
                borrowRecords: {
                    include: {
                        borrowItems: {
                            include: {
                                book: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async findByEmail(email) {
        return db_1.default.user.findUnique({ where: { email } });
    }
    async create(data) {
        return db_1.default.user.create({ data });
    }
    async update(id, data) {
        return db_1.default.user.update({ where: { id }, data });
    }
    async updateStatus(id, status) {
        return db_1.default.user.update({ where: { id }, data: { status } });
    }
    async updateBorrowCount(id, increment) {
        return db_1.default.user.update({
            where: { id },
            data: {
                currentBorrowCount: {
                    increment: increment,
                },
            },
        });
    }
}
exports.UserRepository = UserRepository;
