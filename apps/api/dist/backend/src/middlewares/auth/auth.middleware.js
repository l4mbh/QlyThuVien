"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = exports.authMiddleware = void 0;
const error_codes_1 = require("@shared/constants/error-codes");
const jwt_util_1 = require("../../utils/jwt.util");
const app_error_1 = require("../../utils/app-error");
const authMiddleware = (req, // Use any to attach user property
res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new app_error_1.AppError(error_codes_1.ErrorCode.UNAUTHORIZED, "No token provided");
        }
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_util_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof app_error_1.AppError) {
            return next(error);
        }
        let code = error_codes_1.ErrorCode.UNAUTHORIZED;
        let message = error.message;
        if (error.name === "TokenExpiredError") {
            code = error_codes_1.ErrorCode.TOKEN_EXPIRED;
            message = "Session expired";
        }
        else if (error.name === "JsonWebTokenError") {
            code = error_codes_1.ErrorCode.TOKEN_INVALID;
            message = "Invalid token";
        }
        next(new app_error_1.AppError(code, message));
    }
};
exports.authMiddleware = authMiddleware;
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return next(new app_error_1.AppError(error_codes_1.ErrorCode.FORBIDDEN, "Forbidden: Insufficient permissions"));
        }
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
