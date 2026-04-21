"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("../../repositories/user/user.repository");
const error_enum_1 = require("../../constants/errors/error.enum");
const client_1 = require("@prisma/client");
const hash_util_1 = require("../../utils/hash.util");
class UserService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    async getAllUsers(filter = {}) {
        return this.userRepository.findAll(filter);
    }
    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            const error = new Error("User not found");
            error.errorCode = error_enum_1.ErrorCode.USER_NOT_FOUND;
            throw error;
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
            const error = new Error("Email already registered");
            error.errorCode = error_enum_1.ErrorCode.USER_ALREADY_EXISTS;
            throw error;
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
