import { Request, Response } from "express";
import { CategoryService } from "./category.service";
import { ErrorCode } from "../../constants/errors/error.enum";
import { ErrorMessages } from "../../constants/errors/error.messages";


export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  getAllCategories = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.json({ data: categories, code: 0 });
    } catch (error: any) {
      res.json({ 
        error: { msg: error.message || ErrorMessages[ErrorCode.INTERNAL_SERVER_ERROR] }, 
        code: error.errorCode || ErrorCode.INTERNAL_SERVER_ERROR 
      });
    }
  };

  getCategoryById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const category = await this.categoryService.getCategoryById(id);
      if (!category) {
        return res.json({ 
          error: { msg: ErrorMessages[ErrorCode.CATEGORY_NOT_FOUND] }, 
          code: ErrorCode.CATEGORY_NOT_FOUND 
        });
      }
      res.json({ data: category, code: 0 });
    } catch (error: any) {
      res.json({ 
        error: { msg: error.message || ErrorMessages[ErrorCode.INTERNAL_SERVER_ERROR] }, 
        code: error.errorCode || ErrorCode.INTERNAL_SERVER_ERROR 
      });
    }
  };

  createCategory = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      res.json({ data: category, code: 0 });
    } catch (error: any) {
      res.json({ 
        error: { msg: error.message || ErrorMessages[ErrorCode.INTERNAL_SERVER_ERROR] }, 
        code: error.errorCode || ErrorCode.INTERNAL_SERVER_ERROR 
      });
    }
  };
}
