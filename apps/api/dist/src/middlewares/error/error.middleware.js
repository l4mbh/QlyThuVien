"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const shared_1 = require("@qltv/shared");
const app_error_1 = require("../../utils/app-error");
const errorMiddleware = (err, req, res, next) => {
    console.error("Error caught by global handler:", err);
    // Default to system error
    let code = shared_1.ErrorCode.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    // If it's a new AppError
    if (err instanceof app_error_1.AppError) {
        code = err.code;
        message = err.message || "Operation failed";
    }
    // For other unexpected errors
    else {
        message = err.message || "An unexpected error occurred";
    }
    const response = {
        code: code,
        error: {
            msg: message,
        },
    };
    // Always return HTTP 200 per project rules
    res.status(200).json(response);
};
exports.errorMiddleware = errorMiddleware;
