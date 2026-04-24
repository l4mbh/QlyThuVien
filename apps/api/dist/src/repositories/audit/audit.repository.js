"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditRepository = void 0;
const db_1 = __importDefault(require("../../config/db/db"));
const pagination_helper_1 = require("../../utils/pagination.helper");
class AuditRepository {
    async create(data) {
        return db_1.default.auditLog.create({
            data: {
                action: data.action,
                entityType: data.entityType,
                entityId: data.entityId,
                userId: data.userId,
                metadata: data.metadata || {},
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }
    async findAll(page = 1, limit = 20) {
        return (0, pagination_helper_1.paginate)(db_1.default.auditLog, {
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        }, { page, limit });
    }
    async findByEntity(entityType, entityId) {
        return db_1.default.auditLog.findMany({
            where: {
                entityType,
                entityId,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }
}
exports.AuditRepository = AuditRepository;
