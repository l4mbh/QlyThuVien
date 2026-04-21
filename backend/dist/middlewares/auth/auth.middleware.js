"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = exports.authMiddleware = void 0;
const error_enum_1 = require("../../constants/errors/error.enum");
const jwt_util_1 = require("../../utils/jwt.util");
const authMiddleware = (req, // Use any to attach user property
res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            const error = new Error("No token provided");
            error.errorCode = error_enum_1.ErrorCode.UNAUTHORIZED;
            throw error;
        }
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_util_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            error.errorCode = error_enum_1.ErrorCode.TOKEN_EXPIRED;
        }
        else if (error.name === "JsonWebTokenError") {
            error.errorCode = error_enum_1.ErrorCode.TOKEN_INVALID;
        }
        else if (!error.errorCode) {
            error.errorCode = error_enum_1.ErrorCode.UNAUTHORIZED;
        }
        next(error);
    }
};
exports.authMiddleware = authMiddleware;
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            const error = new Error("Forbidden: Insufficient permissions");
            error.errorCode = error_enum_1.ErrorCode.FORBIDDEN;
            return next(error);
        }
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
