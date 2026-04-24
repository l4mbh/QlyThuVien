"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const db_1 = __importDefault(require("../../config/db/db"));
const pagination_helper_1 = require("../../utils/pagination.helper");
class CategoryRepository {
    async findAll(filter = {}) {
        const { search, page, limit } = filter;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
            ];
        }
        return (0, pagination_helper_1.paginate)(db_1.default.category, {
            where,
            orderBy: { createdAt: "desc" },
        }, { page: page || 1, limit: limit || 10 });
    }
    async findById(id) {
        return db_1.default.category.findUnique({
            where: { id },
        });
    }
    async findByName(name) {
        return db_1.default.category.findFirst({
            where: { name },
        });
    }
    async findByNameExcludeId(name, excludeId) {
        return db_1.default.category.findFirst({
            where: {
                name,
                NOT: { id: excludeId }
            },
        });
    }
    async findByIdWithCount(id) {
        return db_1.default.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { books: true }
                }
            }
        });
    }
    async findByIdsWithCount(ids) {
        return db_1.default.category.findMany({
            where: { id: { in: ids } },
            include: {
                _count: {
                    select: { books: true }
                }
            }
        });
    }
    async create(data) {
        return db_1.default.category.create({
            data: {
                name: data.name,
                code: data.code || null,
            },
        });
    }
    async update(id, data) {
        return db_1.default.category.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        await db_1.default.category.delete({
            where: { id },
        });
    }
    async deleteMany(ids) {
        await db_1.default.category.deleteMany({
            where: { id: { in: ids } },
        });
    }
}
exports.CategoryRepository = CategoryRepository;
