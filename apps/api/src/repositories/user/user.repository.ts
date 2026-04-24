import prisma from "../../config/db/db";
import { CreateUserDTO, UpdateUserDTO, UserEntity } from "../../types/user/user.entity";
import { UserStatus } from "@prisma/client";

export class UserRepository {
  async findAll(filter: { role?: any } = {}): Promise<UserEntity[]> {
    return prisma.user.findMany({
      where: filter
    });
  }

  async findById(id: string): Promise<any | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        borrowRecords: {
          include: {
            borrowItems: {
              include: {
                book: true,
              },
            },
          },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: CreateUserDTO): Promise<UserEntity> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: UpdateUserDTO): Promise<UserEntity> {
    return prisma.user.update({ where: { id }, data });
  }

  async updateStatus(id: string, status: UserStatus): Promise<UserEntity> {
    return prisma.user.update({ where: { id }, data: { status } });
  }

  async updateBorrowCount(id: string, increment: number): Promise<UserEntity> {
    return prisma.user.update({
      where: { id },
      data: {
        currentBorrowCount: {
          increment: increment,
        },
      },
    });
  }
}

