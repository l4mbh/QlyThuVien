"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowController = void 0;
const borrow_service_1 = require("../../services/borrow/borrow.service");
const shared_1 = require("@qltv/shared");
class BorrowController {
    constructor() {
        this.getAllBorrows = async (req, res, next) => {
            try {
                const borrows = await this.borrowService.getAllBorrows();
                const response = { data: borrows, code: shared_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.getBorrowById = async (req, res, next) => {
            try {
                const borrow = await this.borrowService.getBorrowById(req.params.id);
                const response = { data: borrow, code: shared_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.createBorrow = async (req, res, next) => {
            try {
                const performerId = req.user.userId;
                const borrow = await this.borrowService.createBorrow(req.body, performerId);
                const response = { data: borrow, code: shared_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.returnBook = async (req, res, next) => {
            try {
                const performerId = req.user.userId;
                const result = await this.borrowService.returnBook(req.body, performerId);
                const response = { data: result, code: shared_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.borrowService = new borrow_service_1.BorrowService();
    }
}
exports.BorrowController = BorrowController;
