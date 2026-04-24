"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const isbn_controller_1 = require("./isbn.controller");
const auth_middleware_1 = require("../../middlewares/auth/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const isbnController = new isbn_controller_1.IsbnController();
// Use POST /books/fetch-isbn as requested
router.post("/fetch-isbn", auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)([client_1.UserRole.ADMIN, client_1.UserRole.STAFF]), isbnController.fetchBookByIsbn);
exports.default = router;
