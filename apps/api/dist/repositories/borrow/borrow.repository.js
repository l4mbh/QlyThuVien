"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowRepository = void 0;
const db_1 = __importDefault(require("../../config/db/db"));
class BorrowRepository {
    async findAllRecords() {
        return db_1.default.borrowRecord.findMany({
            include: {
                user: true,
                borrowItems: {
                    include: {
                        book: true,
                    },
                },
            },
        });
    }
    async findRecordById(id) {
        return db_1.default.borrowRecord.findUnique({
            where: { id },
            include: {
                user: true,
                borrowItems: {
                    include: {
                        book: true,
                    },
                },
            },
        });
    }
    async findItemById(id) {
        return db_1.default.borrowItem.findUnique({ where: { id } });
    }
}
exports.BorrowRepository = BorrowRepository;
