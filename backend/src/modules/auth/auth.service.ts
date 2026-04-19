import { AuthRepository } from "./auth.repository";
import { LoginDTO, RegisterDTO, AuthResponse, AuthUser } from "./auth.types";
import { hashPassword, comparePassword } from "../../utils/hash.util";
import { generateToken } from "../../utils/jwt.util";
import { ErrorCode } from "../../constants/errors/error.enum";

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const existingUser = await this.authRepository.findByEmail(data.email);
    if (existingUser) {
      const error = new Error("Email already registered") as any;
      error.errorCode = ErrorCode.USER_ALREADY_EXISTS;
      throw error;
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
      const error = new Error("Invalid credentials") as any;
      error.errorCode = ErrorCode.INVALID_CREDENTIALS;
      throw error;
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid credentials") as any;
      error.errorCode = ErrorCode.INVALID_CREDENTIALS;
      throw error;
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
      const error = new Error("User not found") as any;
      error.errorCode = ErrorCode.USER_NOT_FOUND;
      throw error;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
