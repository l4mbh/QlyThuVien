import { UserRepository } from "../../repositories/user/user.repository";
import { CreateUserDTO, UpdateUserDTO, UserEntity } from "../../types/user/user.entity";
import { ErrorCode } from "../../constants/errors/error.enum";
import { UserStatus } from "@prisma/client";
import { hashPassword } from "../../utils/hash.util";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(filter: { role?: any } = {}): Promise<UserEntity[]> {
    return this.userRepository.findAll(filter);
  }

  async getUserById(id: string): Promise<any> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      const error = new Error("User not found") as any;
      error.errorCode = ErrorCode.USER_NOT_FOUND;
      throw error;
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
      const error = new Error("Email already registered") as any;
      error.errorCode = ErrorCode.USER_ALREADY_EXISTS;
      throw error;
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
