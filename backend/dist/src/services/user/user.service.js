"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("../../repositories/user/user.repository");
const error_codes_1 = require("@shared/constants/error-codes");
const app_error_1 = require("../../utils/app-error");
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
            throw new app_error_1.AppError(error_codes_1.ErrorCode.USER_NOT_FOUND, "User not found");
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
            throw new app_error_1.AppError(error_codes_1.ErrorCode.USER_ALREADY_EXISTS, "Email already registered");
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
