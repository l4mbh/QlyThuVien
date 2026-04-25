import { Request, Response, NextFunction } from "express";
import { categoryService } from "../../services/category/category.service";
import { ErrorCode, ErrorMessage } from "@qltv/shared";
import { createCategorySchema, updateCategorySchema } from "../../schemas/category/category.schema";
import { AppError } from "../../utils/app-error";

export class CategoryController {
  constructor() {}

  getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, page, limit } = req.query;
      const categories = await categoryService.getAllCategories({
        search: search as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      });
      res.json({ data: categories, code: ErrorCode.SUCCESS });
    } catch (error: any) {
      next(error);
    }
  };

  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validation = createCategorySchema.safeParse(req.body);
      if (!validation.success) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, validation.error.issues[0].message);
      }
      const userId = (req as any).user.userId;
      const category = await categoryService.createCategory(validation.data, userId);
      res.json({ data: category, code: ErrorCode.SUCCESS });
    } catch (error: any) {
      next(error);
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const validation = updateCategorySchema.safeParse(req.body);
      if (!validation.success) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, validation.error.issues[0].message);
      }
      const userId = (req as any).user.userId;
      const category = await categoryService.updateCategory(id, validation.data, userId);
      res.json({ data: category, code: ErrorCode.SUCCESS });
    } catch (error: any) {
      next(error);
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const userId = (req as any).user.userId;
      await categoryService.deleteCategory(id, userId);
      res.json({ data: { success: true }, code: ErrorCode.SUCCESS });
    } catch (error: any) {
      next(error);
    }
  };

  bulkDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, ErrorMessage.INVALID_ID_LIST);
      }

      const userId = (req as any).user.userId;
      await categoryService.deleteCategories(ids, userId);
      res.json({ data: { success: true }, code: ErrorCode.SUCCESS });
    } catch (error: any) {
      next(error);
    }
  };
}


