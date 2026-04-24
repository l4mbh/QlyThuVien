import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../../services/category/category.service";
import { ErrorCode } from "@shared/constants/error-codes";
import { createCategorySchema, updateCategorySchema } from "../../schemas/category/category.schema";
import { AppError } from "../../utils/app-error";

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, page, limit } = req.query;
      const categories = await this.categoryService.getAllCategories({
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

      const category = await this.categoryService.createCategory(validation.data);
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

      const category = await this.categoryService.updateCategory(id, validation.data);
      res.json({ data: category, code: ErrorCode.SUCCESS });
    } catch (error: any) {
      next(error);
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      await this.categoryService.deleteCategory(id);
      res.json({ data: { success: true }, code: ErrorCode.SUCCESS });
    } catch (error: any) {
      next(error);
    }
  };

  bulkDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid or empty IDs list");
      }

      await this.categoryService.deleteCategories(ids);
      res.json({ data: { success: true }, code: ErrorCode.SUCCESS });
    } catch (error: any) {
      next(error);
    }
  };
}

