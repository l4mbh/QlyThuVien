import { Request, Response, NextFunction } from "express";
import { isbnService } from "./isbn.service";
import { mapCategory } from "../../utils/mapCategory";
import { generateCallNumber } from "../../utils/generateCallNumber";
import { ErrorCode, ErrorMessage } from "@qltv/shared";
import { AppError } from "../../utils/app-error";


export class IsbnController {
  constructor() {}

  fetchBookByIsbn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { isbn } = req.body;
      if (!isbn) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, ErrorMessage.ISBN_REQUIRED);
      }

      const bookInfo = await isbnService.fetchBookByIsbn(isbn);
      
      // Auto-suggest category
      const suggestedCategory = mapCategory(bookInfo.category);
      
      // Auto-generate call number (mocking for suggest)
      const callNumber = await generateCallNumber(
        bookInfo.author,
        bookInfo.publishedYear as number,
        suggestedCategory.code
      );

      res.json({
        data: {
          ...bookInfo,
          suggestedCategory,
          callNumber
        },
        code: ErrorCode.SUCCESS
      });
    } catch (error: any) {
      next(error);
    }
  };
}


