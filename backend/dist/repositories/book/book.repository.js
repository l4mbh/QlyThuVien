"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRepository = void 0;
const db_1 = __importDefault(require("../../config/db/db"));
const pagination_helper_1 = require("../../utils/pagination.helper");
class BookRepository {
    async findAll(filter = {}) {
        const { search, categoryId, available, sort, page, limit } = filter;
        const where = { isArchived: false };
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { author: { contains: search, mode: 'insensitive' } },
                { isbn: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (available !== undefined) {
            if (available) {
                where.availableQuantity = { gt: 0 };
            }
            else {
                where.availableQuantity = 0;
            }
        }
        const orderBy = {};
        if (sort === 'az') {
            orderBy.title = 'asc';
        }
        else if (sort === 'author') {
            orderBy.author = 'asc';
        }
        else {
            orderBy.createdAt = 'desc';
        }
        return (0, pagination_helper_1.paginate)(db_1.default.book, {
            where,
            orderBy,
            include: { category: true },
        }, { page: page || 1, limit: limit || 10 });
    }
    async findById(id) {
        return db_1.default.book.findUnique({
            where: { id },
            include: { category: true }
        });
    }
    async findByIsbn(isbn) {
        return db_1.default.book.findUnique({ where: { isbn } });
    }
    async create(data) {
        const { publishedYear, categoryId, ...createData } = data;
        return db_1.default.book.create({
            data: {
                ...createData,
                availableQuantity: data.totalQuantity,
                category: categoryId ? { connect: { id: categoryId } } : undefined,
            },
            include: { category: true }
        });
    }
    async update(id, data) {
        const { categoryId, ...updateData } = data;
        return db_1.default.book.update({
            where: { id },
            data: {
                ...updateData,
                category: categoryId ? { connect: { id: categoryId } } : undefined,
            },
            include: { category: true }
        });
    }
    async softDelete(id) {
        return db_1.default.book.update({
            where: { id },
            data: { isArchived: true },
        });
    }
    async bulkDelete(ids) {
        return db_1.default.book.updateMany({
            where: { id: { in: ids } },
            data: { isArchived: true },
        });
    }
    async updateAvailableQuantity(id, increment) {
        return db_1.default.book.update({
            where: { id },
            data: {
                availableQuantity: {
                    increment: increment,
                },
            },
        });
    }
}
exports.BookRepository = BookRepository;
