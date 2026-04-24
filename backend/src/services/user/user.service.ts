import prisma from "../../config/db/db";
import { UserRepository } from "../../repositories/user/user.repository";
import { CreateUserDTO, UpdateUserDTO, UserEntity } from "../../types/user/user.entity";
import { ErrorCode } from "@shared/constants/error-codes";
import { AppError } from "../../utils/app-error";
import { UserStatus } from "@prisma/client";
import { hashPassword } from "../../utils/hash.util";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(filter: { role?: any } = {}): Promise<any[]> {
    const users = await prisma.user.findMany({
      where: filter,
      include: {
        borrowRecords: {
          where: {
            borrowItems: {
              some: {
                status: { not: "RETURNED" }
              }
            }
          },
          include: {
            borrowItems: {
              where: {
                status: { not: "RETURNED" }
              }
            }
          }
        }
      }
    });

    const now = new Date();
    return users.map((user: any) => {
      const hasOverdueBooks = user.borrowRecords.some((record: any) =>
        new Date(record.dueDate) < now
      );

      // Clean up the response (remove the include data if not needed by all callers)
      const { borrowRecords, ...userWithoutRecords } = user;
      return {
        ...userWithoutRecords,
        hasOverdueBooks
      };
    });
  }



  async getUserById(id: string): Promise<any> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(ErrorCode.USER_NOT_FOUND, "User not found");
    }

    // Compute dynamic stats
    let totalFine = 0;
    let overdueCount = 0;
    const now = new Date();

    user.borrowRecords?.forEach((record: any) => {
      const dueDate = new Date(record.dueDate);
      record.borrowItems?.forEach((item: any) => {
        // Sum finalized fines from returned items
        if (item.fineAmount) {
          totalFine += item.fineAmount;
        }

        // Count items currently borrowing that are overdue
        if (item.status !== "RETURNED" && now > dueDate) {
          overdueCount++;
        }
      });
    });

    return {
      ...user,
      totalFine,
      overdueCount,
    };
  }

  async createUser(data: CreateUserDTO): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(ErrorCode.USER_ALREADY_EXISTS, "Email already registered");
    }
    const password = data.password || "123456";
    const hashedPassword = await hashPassword(password);

    return this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
  }

  async updateUser(id: string, data: UpdateUserDTO): Promise<UserEntity> {
    await this.getUserById(id);
    return this.userRepository.update(id, data);
  }

  async blockUser(id: string): Promise<UserEntity> {
    await this.getUserById(id);
    return this.userRepository.updateStatus(id, UserStatus.BLOCKED);
  }
}
