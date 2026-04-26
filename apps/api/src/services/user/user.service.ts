import prisma from "../../config/db/db";
import { UserRepository } from "../../repositories/user/user.repository";
import { CreateUserDTO, UpdateUserDTO, UserEntity } from "../../types/user/user.entity";
import { ErrorCode, SettingKey, ErrorMessage } from "@qltv/shared";
import { AppError } from "../../utils/app-error";
import { UserStatus } from "@prisma/client";
import { hashPassword } from "../../utils/hash.util";
import { settingService } from "../settings/setting.service";
import { normalizePhone } from "@qltv/shared";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async findOrCreateReader(phone: string, name?: string): Promise<any> {
    const normalized = normalizePhone(phone);
    
    // Explicitly check first to avoid any upsert quirks
    const existing = await this.userRepository.findByPhoneNormalized(normalized);
    if (existing) {
      return this.getUserById(existing.id);
    }

    const user = await this.userRepository.upsertReader({
      phoneRaw: phone,
      phoneNormalized: normalized,
      name,
    });

    return this.getUserById(user.id);
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
    const globalBorrowLimit = await settingService.get<number>(SettingKey.BORROW_LIMIT);

    return users.map((user: any) => {
      const hasOverdueBooks = user.borrowRecords.some((record: any) =>
        new Date(record.dueDate) < now
      );

      // Nếu hạn mức user đang ở mức mặc định (5), ưu tiên dùng giá trị từ Setting mới
      const effectiveBorrowLimit = user.borrowLimit === 5 ? globalBorrowLimit : user.borrowLimit;

      const { borrowRecords, ...userWithoutRecords } = user;
      return {
        ...userWithoutRecords,
        borrowLimit: effectiveBorrowLimit,
        hasOverdueBooks
      };
    });
  }

  async getUserById(id: string): Promise<any> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(ErrorCode.USER_NOT_FOUND, ErrorMessage.USER_NOT_FOUND);
    }

    const globalBorrowLimit = await settingService.get<number>(SettingKey.BORROW_LIMIT);
    const effectiveBorrowLimit = user.borrowLimit === 5 ? globalBorrowLimit : user.borrowLimit;

    // Compute dynamic stats
    let totalFine = 0;
    let overdueCount = 0;
    const now = new Date();

    user.borrowRecords?.forEach((record: any) => {
      const dueDate = new Date(record.dueDate);
      record.borrowItems?.forEach((item: any) => {
        if (item.fineAmount) {
          totalFine += item.fineAmount;
        }

        if (item.status !== "RETURNED" && now > dueDate) {
          overdueCount++;
        }
      });
    });

    return {
      ...user,
      borrowLimit: effectiveBorrowLimit,
      totalFine,
      overdueCount,
    };
  }

  async createUser(data: CreateUserDTO): Promise<UserEntity> {
    if (data.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new AppError(ErrorCode.USER_ALREADY_EXISTS, ErrorMessage.USER_ALREADY_EXISTS);
      }
    }

    // Always normalize phone if provided
    if (data.phoneRaw) {
      data.phoneNormalized = normalizePhone(data.phoneRaw);
      
      const existingPhone = await this.userRepository.findByPhoneNormalized(data.phoneNormalized);
      if (existingPhone) {
        throw new AppError(ErrorCode.USER_ALREADY_EXISTS, "User with this phone number already exists.");
      }
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

    // Always normalize phone if updating
    if (data.phoneRaw) {
      data.phoneNormalized = normalizePhone(data.phoneRaw);
      
      const existingPhone = await this.userRepository.findByPhoneNormalized(data.phoneNormalized);
      if (existingPhone && existingPhone.id !== id) {
        throw new AppError(ErrorCode.USER_ALREADY_EXISTS, "This phone number is already taken by another user.");
      }
    }

    return this.userRepository.update(id, data);
  }

  async blockUser(id: string): Promise<UserEntity> {
    await this.getUserById(id);
    return this.userRepository.updateStatus(id, UserStatus.BLOCKED);
  }

  async getUserByPhone(phone: string): Promise<any | null> {
    const normalized = normalizePhone(phone);
    const user = await this.userRepository.findByPhoneNormalized(normalized);
    if (!user) return null;
    return this.getUserById(user.id);
  }
}

export const userService = new UserService();

