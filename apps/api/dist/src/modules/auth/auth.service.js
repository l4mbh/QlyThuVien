"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const auth_repository_1 = require("./auth.repository");
const hash_util_1 = require("../../utils/hash.util");
const jwt_util_1 = require("../../utils/jwt.util");
const shared_1 = require("@qltv/shared");
const app_error_1 = require("../../utils/app-error");
class AuthService {
    constructor() {
        this.authRepository = new auth_repository_1.AuthRepository();
    }
    async register(data) {
        const existingUser = await this.authRepository.findByEmail(data.email);
        if (existingUser) {
            throw new app_error_1.AppError(shared_1.ErrorCode.USER_ALREADY_EXISTS, "Email already registered");
        }
        const hashedPassword = await (0, hash_util_1.hashPassword)(data.password);
        const user = await this.authRepository.createUser({
            ...data,
            password: hashedPassword,
        });
        const authUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        const token = (0, jwt_util_1.generateToken)({ userId: user.id, role: user.role });
        return { user: authUser, token };
    }
    async login(data) {
        const user = await this.authRepository.findByEmail(data.email);
        if (!user) {
            throw new app_error_1.AppError(shared_1.ErrorCode.INVALID_CREDENTIALS, "Invalid credentials");
        }
        const isPasswordValid = await (0, hash_util_1.comparePassword)(data.password, user.password);
        if (!isPasswordValid) {
            throw new app_error_1.AppError(shared_1.ErrorCode.INVALID_CREDENTIALS, "Invalid credentials");
        }
        const authUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        const token = (0, jwt_util_1.generateToken)({ userId: user.id, role: user.role });
        return { user: authUser, token };
    }
    async getMe(userId) {
        const user = await this.authRepository.findById(userId);
        if (!user) {
            throw new app_error_1.AppError(shared_1.ErrorCode.USER_NOT_FOUND, "User not found");
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }
}
exports.AuthService = AuthService;
