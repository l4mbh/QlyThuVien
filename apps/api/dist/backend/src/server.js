"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env/env");
const startServer = async () => {
    try {
        const port = env_1.ENV.PORT;
        app_1.default.listen(port, () => {
            console.log(`[Server]: Backend is running at http://localhost:${port}`);
            console.log(`[Server]: Environment: ${env_1.ENV.NODE_ENV}`);
        });
    }
    catch (error) {
        console.error("[Server]: Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
