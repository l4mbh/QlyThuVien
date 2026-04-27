import { AuthRepository } from "./auth.repository";
import { LoginDTO, RegisterDTO, AuthResponse, AuthUser } from "./auth.types";
import { hashPassword, comparePassword } from "../../utils/hash.util";
import { generateToken } from "../../utils/jwt.util";
import { ErrorCode, SettingKey, UserRole, ErrorMessage } from "@qltv/shared";
import { AppError } from "../../utils/app-error";
import { settingService } from "../../services/settings/setting.service";
import { userService } from "../../services/user/user.service";
import { normalizePhone } from "@qltv/shared";

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const existingUser = await this.authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(ErrorCode.USER_ALREADY_EXISTS, ErrorMessage.USER_ALREADY_EXISTS);
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
      phone: user.phoneRaw,
      role: user.role,
    };

    const token = generateToken({ userId: user.id, role: user.role });

    return { user: authUser, token };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await this.authRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, ErrorMessage.INVALID_CREDENTIALS);
    }

    if (!user.password) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, ErrorMessage.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, ErrorMessage.INVALID_CREDENTIALS);
    }

    // Block non-admin users during maintenance
    const isMaintenance = await settingService.get<boolean>(SettingKey.MAINTENANCE_MODE);
    if (isMaintenance && user.role !== UserRole.ADMIN) {
      throw new AppError(ErrorCode.MAINTENANCE_MODE, ErrorMessage.MAINTENANCE_MODE);
    }

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phoneRaw,
      role: user.role,
    };

    const token = generateToken({ userId: user.id, role: user.role });

    return { user: authUser, token };
  }

  async getMe(userId: string): Promise<AuthUser> {
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new AppError(ErrorCode.USER_NOT_FOUND, ErrorMessage.USER_NOT_FOUND);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phoneRaw,
      role: user.role,
    };
  }

  async readerLogin(phone: string): Promise<AuthResponse> {
    const user = await userService.findOrCreateReader(phone);

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phoneRaw || user.phoneNormalized,
      role: user.role,
    };

    const token = generateToken({ userId: user.id, role: user.role });

    return { user: authUser, token };
  }
}


