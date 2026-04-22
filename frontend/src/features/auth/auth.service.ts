import { api } from "@/services/api";
import { type ApiResponse } from "@/types/response.type";
import { type AuthResponse, type LoginRequest, type RegisterRequest } from "@/types/auth/auth.type";
import { type User } from "@/types/auth/user.entity";

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", data);
    return response.data.data!;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>("/auth/register", data);
    return response.data.data!;
  },

  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<User>>("/auth/me");
    return response.data.data!;
  },
};
