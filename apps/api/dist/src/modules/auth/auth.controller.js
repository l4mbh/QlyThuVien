"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const shared_1 = require("@qltv/shared");
class AuthController {
    constructor() {
        this.register = async (req, res, next) => {
            try {
                const result = await this.authService.register(req.body);
                const response = { data: result, code: shared_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.login = async (req, res, next) => {
            try {
                const result = await this.authService.login(req.body);
                const response = { data: result, code: shared_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.getMe = async (req, res, next) => {
            try {
                const result = await this.authService.getMe(req.user.userId);
                const response = { data: result, code: shared_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.authService = new auth_service_1.AuthService();
    }
}
exports.AuthController = AuthController;
