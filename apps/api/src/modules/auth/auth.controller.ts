import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { ErrorCode } from "@qltv/shared";
import { ApiResponse } from "@qltv/shared";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.register(req.body);
      const response: ApiResponse = { data: result, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.login(req.body);
      const response: ApiResponse = { data: result, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: any, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.getMe(req.user.userId);
      const response: ApiResponse = { data: result, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}


