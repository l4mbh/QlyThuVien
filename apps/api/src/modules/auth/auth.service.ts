import { AuthRepository } from "./auth.repository";
import { LoginDTO, RegisterDTO, AuthResponse, AuthUser } from "./auth.types";
import { hashPassword, comparePassword } from "../../utils/hash.util";
import { generateToken } from "../../utils/jwt.util";
import { ErrorCode, SettingKey, UserRole } from "@qltv/shared";
import { AppError } from "../../utils/app-error";
import { settingService } from "../../services/settings/setting.service";

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const existingUser = await this.authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(ErrorCode.USER_ALREADY_EXISTS, "Email already registered");
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await this.authRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = generateToken({ userId: user.id, role: user.role });

    return { user: authUser, token };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await this.authRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, "Invalid credentials");
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, "Invalid credentials");
    }

    // Block non-admin users during maintenance
    const isMaintenance = await settingService.get<boolean>(SettingKey.MAINTENANCE_MODE);
    if (isMaintenance && user.role !== UserRole.ADMIN) {
      throw new AppError(ErrorCode.MAINTENANCE_MODE, "System is under maintenance. Only administrators can sign in.");
    }

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = generateToken({ userId: user.id, role: user.role });

    return { user: authUser, token };
  }

  async getMe(userId: string): Promise<AuthUser> {
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new AppError(ErrorCode.USER_NOT_FOUND, "User not found");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}


