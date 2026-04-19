import { UserRepository } from "../../repositories/user/user.repository";
import { CreateUserDTO, UpdateUserDTO, UserEntity } from "../../types/user/user.entity";
import { ErrorCode } from "../../constants/errors/error.enum";
import { UserStatus } from "@prisma/client";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      const error = new Error("User not found") as any;
      error.errorCode = ErrorCode.USER_NOT_FOUND;
      throw error;
    }
    return user;
  }

  async createUser(data: CreateUserDTO): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      const error = new Error("Email already registered") as any;
      error.errorCode = ErrorCode.USER_ALREADY_EXISTS;
      throw error;
    }
    return this.userRepository.create(data);
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
