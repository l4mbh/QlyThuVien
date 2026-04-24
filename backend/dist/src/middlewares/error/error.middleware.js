"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const error_codes_1 = require("@shared/constants/error-codes");
const app_error_1 = require("../../utils/app-error");
const errorMiddleware = (err, req, res, next) => {
    console.error("Error caught by global handler:", err);
    // Mặc định là lỗi hệ thống
    let code = error_codes_1.ErrorCode.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    // Nếu là AppError mới
    if (err instanceof app_error_1.AppError) {
        code = err.code;
        message = err.message || "Operation failed";
    }
    // Nếu là các lỗi khác
    else {
        message = err.message || "An unexpected error occurred";
    }
    const response = {
        code: code,
        error: {
            msg: message,
        },
    };
    // Luôn trả về 200 theo rule của dự án
    res.status(200).json(response);
};
exports.errorMiddleware = errorMiddleware;
