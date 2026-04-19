import { Request, Response } from "express";
import { IsbnService } from "./isbn.service";
import { mapCategory } from "../../utils/mapCategory";
import { generateCallNumber } from "../../utils/generateCallNumber";
import { ErrorCode } from "../../constants/errors/error.enum";
import { ErrorMessages } from "../../constants/errors/error.messages";


export class IsbnController {
  private isbnService: IsbnService;

  constructor() {
    this.isbnService = new IsbnService();
  }

  fetchBookByIsbn = async (req: Request, res: Response) => {
    try {
      const { isbn } = req.body;
      if (!isbn) {
        return res.json({ 
          error: { msg: ErrorMessages[ErrorCode.VALIDATION_ERROR] }, 
          code: ErrorCode.VALIDATION_ERROR 
        });
      }

      const bookInfo = await this.isbnService.fetchBookByIsbn(isbn);
      
      // Auto-suggest category
      const suggestedCategory = mapCategory(bookInfo.category);
      
      // Auto-generate call number (mocking for suggest)
      const callNumber = await generateCallNumber(
        bookInfo.author,
        bookInfo.publishedYear,
        suggestedCategory.code
      );

      res.json({
        data: {
          ...bookInfo,
          suggestedCategory,
          callNumber
        },
        code: 0
      });
    } catch (error: any) {
      res.json({ 
        error: { msg: error.message || ErrorMessages[ErrorCode.ISBN_FETCH_FAILED] }, 
        code: error.errorCode || ErrorCode.ISBN_FETCH_FAILED 
      });
    }
  };
}
