import { Request, Response, NextFunction } from "express";
import { UserService } from "../../services/user/user.service";
import { ErrorCode } from "../../constants/errors/error.enum";
import { ApiResponse } from "../../types/shared/response.type";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUsers();
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
}
