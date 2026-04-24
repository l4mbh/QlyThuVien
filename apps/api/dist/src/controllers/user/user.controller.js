"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../../services/user/user.service");
const shared_1 = require("@qltv/shared");
class UserController {
    constructor() {
        this.getAllUsers = async (req, res, next) => {
            try {
                const { role } = req.query;
                const users = await this.userService.getAllUsers(role ? { role } : {});
                const response = { data: users, code: shared_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.getUserById = async (req, res, next) => {
            try {
                const user = await this.userService.getUserById(req.params.id);
                const response = { data: user, code: shared_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.createUser = async (req, res, next) => {
            try {
                const user = await this.userService.createUser(req.body);
                const response = { data: user, code: shared_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateUser = async (req, res, next) => {
            try {
                const user = await this.userService.updateUser(req.params.id, req.body);
                const response = { data: user, code: shared_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.blockUser = async (req, res, next) => {
            try {
                const user = await this.userService.blockUser(req.params.id);
                const response = { data: user, code: shared_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.userService = new user_service_1.UserService();
    }
}
exports.UserController = UserController;
