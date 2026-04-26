import prisma from "../../config/db/db";
import { BorrowRecordEntity, BorrowItemEntity } from "../../types/borrow/borrow.entity";
import { BorrowItemStatus } from "@prisma/client";

export class BorrowRepository {
  async findAllRecords(filters: { userId?: string; status?: any } = {}): Promise<any[]> {
    return prisma.borrowRecord.findMany({
      where: filters,
      include: {
        user: true,
        borrowItems: {
          include: {
            book: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findRecordById(id: string): Promise<any | null> {
    return prisma.borrowRecord.findUnique({
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

  async findRecordsByUserId(userId: string): Promise<any[]> {
    return prisma.borrowRecord.findMany({
      where: { userId },
      include: {
        borrowItems: {
          include: {
            book: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findItemById(id: string): Promise<BorrowItemEntity | null> {
    return prisma.borrowItem.findUnique({ where: { id } });
  }

  // Transactional logic will be mostly in the Service layer using prisma.$transaction
  // but we can have specialized methods here if needed.
}

