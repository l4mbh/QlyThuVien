import prisma from "../../config/db/db";
import { RegisterDTO } from "./auth.types";
import { User } from "@prisma/client";

export class AuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: RegisterDTO & { password: string }): Promise<User> {
    return prisma.user.create({
      data: {
        ...data,
        role: "STAFF", // Default role
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }
}

