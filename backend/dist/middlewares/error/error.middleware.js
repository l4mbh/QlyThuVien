"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const error_enum_1 = require("../../constants/errors/error.enum");
const error_messages_1 = require("../../constants/errors/error.messages");
const errorMiddleware = (err, req, res, next) => {
    console.error("Error caught by global handler:", err);
    const errorCode = err.errorCode || error_enum_1.ErrorCode.INTERNAL_SERVER_ERROR;
    const status = 200; // Always return 200 as per project rule
    const response = {
        code: errorCode,
        error: {
            msg: err.message || error_messages_1.ErrorMessages[errorCode] || "Internal server error",
        },
    };
    res.status(status).json(response);
};
exports.errorMiddleware = errorMiddleware;
