"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowController = void 0;
const borrow_service_1 = require("../../services/borrow/borrow.service");
const error_codes_1 = require("@shared/constants/error-codes");
class BorrowController {
    constructor() {
        this.getAllBorrows = async (req, res, next) => {
            try {
                const borrows = await this.borrowService.getAllBorrows();
                const response = { data: borrows, code: error_codes_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.getBorrowById = async (req, res, next) => {
            try {
                const borrow = await this.borrowService.getBorrowById(req.params.id);
                const response = { data: borrow, code: error_codes_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.createBorrow = async (req, res, next) => {
            try {
                const borrow = await this.borrowService.createBorrow(req.body);
                const response = { data: borrow, code: error_codes_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.returnBook = async (req, res, next) => {
            try {
                const result = await this.borrowService.returnBook(req.body);
                const response = { data: result, code: error_codes_1.ErrorCode.SUCCESS };
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
