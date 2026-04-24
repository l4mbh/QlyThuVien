"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const db_1 = __importDefault(require("../../config/db/db"));
const user_repository_1 = require("../../repositories/user/user.repository");
const shared_1 = require("@qltv/shared");
const app_error_1 = require("../../utils/app-error");
const client_1 = require("@prisma/client");
const hash_util_1 = require("../../utils/hash.util");
class UserService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    async getAllUsers(filter = {}) {
        const users = await db_1.default.user.findMany({
            where: filter,
            include: {
                borrowRecords: {
                    where: {
                        borrowItems: {
                            some: {
                                status: { not: "RETURNED" }
                            }
                        }
                    },
                    include: {
                        borrowItems: {
                            where: {
                                status: { not: "RETURNED" }
                            }
                        }
                    }
                }
            }
        });
        const now = new Date();
        return users.map((user) => {
            const hasOverdueBooks = user.borrowRecords.some((record) => new Date(record.dueDate) < now);
            // Clean up the response (remove the include data if not needed by all callers)
            const { borrowRecords, ...userWithoutRecords } = user;
            return {
                ...userWithoutRecords,
                hasOverdueBooks
            };
        });
    }
    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new app_error_1.AppError(shared_1.ErrorCode.USER_NOT_FOUND, "User not found");
        }
        // Compute dynamic stats
        let totalFine = 0;
        let overdueCount = 0;
        const now = new Date();
        user.borrowRecords?.forEach((record) => {
            const dueDate = new Date(record.dueDate);
            record.borrowItems?.forEach((item) => {
                // Sum finalized fines from returned items
                if (item.fineAmount) {
                    totalFine += item.fineAmount;
                }
                // Count items currently borrowing that are overdue
                if (item.status !== "RETURNED" && now > dueDate) {
                    overdueCount++;
                }
            });
        });
        return {
            ...user,
            totalFine,
            overdueCount,
        };
    }
    async createUser(data) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new app_error_1.AppError(shared_1.ErrorCode.USER_ALREADY_EXISTS, "Email already registered");
        }
        const password = data.password || "123456";
        const hashedPassword = await (0, hash_util_1.hashPassword)(password);
        return this.userRepository.create({
            ...data,
            password: hashedPassword,
        });
    }
    async updateUser(id, data) {
        await this.getUserById(id);
        return this.userRepository.update(id, data);
    }
    async blockUser(id) {
        await this.getUserById(id);
        return this.userRepository.updateStatus(id, client_1.UserStatus.BLOCKED);
    }
}
exports.UserService = UserService;
