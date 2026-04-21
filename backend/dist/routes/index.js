"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user/user.routes"));
const book_routes_1 = __importDefault(require("./book/book.routes"));
const borrow_routes_1 = __importDefault(require("./borrow/borrow.routes"));
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const category_routes_1 = __importDefault(require("./category/category.routes"));
const isbn_routes_1 = __importDefault(require("../modules/isbn/isbn.routes"));
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
router.use("/users", user_routes_1.default);
router.use("/books", book_routes_1.default);
router.use("/books", isbn_routes_1.default); // Mount isbn routes under /books to get /books/fetch-isbn
router.use("/categories", category_routes_1.default);
router.use("/borrow", borrow_routes_1.default);
exports.default = router;
