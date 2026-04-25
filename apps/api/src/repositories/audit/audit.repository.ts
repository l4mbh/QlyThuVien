import prisma from "../../config/db/db";
import { Prisma } from "@prisma/client";
import { CreateAuditLogDto, AuditLog } from "@qltv/shared";
import { paginate } from "../../utils/pagination.helper";
import { PaginatedData } from "@qltv/shared";

export class AuditRepository {
  async create(data: CreateAuditLogDto, tx?: Prisma.TransactionClient): Promise<AuditLog> {
    const client = tx || prisma;
    return client.auditLog.create({
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
    }) as unknown as AuditLog;
  }

  async findAll(page: number = 1, limit: number = 20): Promise<PaginatedData<AuditLog>> {
    return paginate<AuditLog>(
      prisma.auditLog,
      {
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
      },
      { page, limit }
    );
  }

  async findByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    return prisma.auditLog.findMany({
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
    }) as unknown as AuditLog[];
  }
}
