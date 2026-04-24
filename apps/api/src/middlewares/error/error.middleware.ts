import { Request, Response, NextFunction } from "express";
import { ErrorCode } from "@qltv/shared";
import { ApiResponse } from "@qltv/shared";
import { AppError } from "../../utils/app-error";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error caught by global handler:", err);

  // Default to system error
  let code: string = ErrorCode.INTERNAL_SERVER_ERROR;
  let message: string = "Internal server error";

  // If it's a new AppError
  if (err instanceof AppError) {
    code = err.code;
    message = err.message || "Operation failed";
  } 
  // For other unexpected errors
  else {
    message = err.message || "An unexpected error occurred";
  }

  const response: ApiResponse = {
    code: code,
    error: {
      msg: message,
    },
  };

  // Always return HTTP 200 per project rules
  res.status(200).json(response);

};



