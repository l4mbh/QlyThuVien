import { Request, Response, NextFunction } from "express";
import { UserService } from "../../services/user/user.service";
import { ErrorCode } from "@qltv/shared";
import { ApiResponse } from "@qltv/shared";
import { AppError } from "../../utils/app-error";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role } = req.query;
      const users = await this.userService.getAllUsers(role ? { role } : {});
      const response: ApiResponse = { data: users, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(req.params.id as string);
      const response: ApiResponse = { data: user, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.createUser(req.body);
      const response: ApiResponse = { data: user, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.updateUser(req.params.id as string, req.body);
      const response: ApiResponse = { data: user, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  blockUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.blockUser(req.params.id as string);
      const response: ApiResponse = { data: user, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  lookupUserByPhone = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phone } = req.query;
      if (!phone) {
        throw new AppError(ErrorCode.BAD_REQUEST, "Phone is required");
      }
      const user = await this.userService.getUserByPhone(phone as string);
      const response: ApiResponse = { data: user, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}


