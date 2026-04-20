import { Request, Response } from "express";
import { CategoryService } from "../../services/category/category.service";
import { ErrorCode } from "../../constants/errors/error.enum";
import { ErrorMessages } from "../../constants/errors/error.messages";
import { createCategorySchema, updateCategorySchema } from "../../schemas/category/category.schema";

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  getAllCategories = async (req: Request, res: Response) => {
    try {
      const { search, page, limit } = req.query;
      const categories = await this.categoryService.getAllCategories({
        search: search as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      });
      res.json({ data: categories, code: ErrorCode.SUCCESS });
    } catch (error: any) {
      res.json({
        error: { msg: error.message || ErrorMessages[ErrorCode.INTERNAL_SERVER_ERROR] },
        code: error.errorCode || ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  };

  createCategory = async (req: Request, res: Response) => {
    try {
      const validation = createCategorySchema.safeParse(req.body);
      if (!validation.success) {
        return res.json({
          error: { msg: validation.error.issues[0].message },
          code: ErrorCode.VALIDATION_ERROR,
        });
      }

      const category = await this.categoryService.createCategory(validation.data);
      res.json({ data: category, code: ErrorCode.SUCCESS });
    } catch (error: any) {
      res.json({
        error: { msg: error.message || ErrorMessages[ErrorCode.INTERNAL_SERVER_ERROR] },
        code: error.errorCode || ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  };

  updateCategory = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const validation = updateCategorySchema.safeParse(req.body);
      if (!validation.success) {
        return res.json({
          error: { msg: validation.error.issues[0].message },
          code: ErrorCode.VALIDATION_ERROR,
        });
      }

      const category = await this.categoryService.updateCategory(id, validation.data);
      res.json({ data: category, code: ErrorCode.SUCCESS });
    } catch (error: any) {
      res.json({
        error: { msg: error.message || ErrorMessages[ErrorCode.INTERNAL_SERVER_ERROR] },
        code: error.errorCode || ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  };

  deleteCategory = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      await this.categoryService.deleteCategory(id);
      res.json({ data: { success: true }, code: ErrorCode.SUCCESS });
    } catch (error: any) {
      res.json({
        error: { msg: error.message || ErrorMessages[ErrorCode.INTERNAL_SERVER_ERROR] },
        code: error.errorCode || ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  };

  bulkDelete = async (req: Request, res: Response) => {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.json({
          error: { msg: "Invalid or empty IDs list" },
          code: ErrorCode.VALIDATION_ERROR,
        });
      }

      await this.categoryService.deleteCategories(ids);
      res.json({ data: { success: true }, code: ErrorCode.SUCCESS });
    } catch (error: any) {
      res.json({
        error: { msg: error.message || ErrorMessages[ErrorCode.INTERNAL_SERVER_ERROR] },
        code: error.errorCode || ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  };
}
