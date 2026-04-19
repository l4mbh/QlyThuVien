import { Request, Response, NextFunction } from "express";
import { ErrorCode } from "../../constants/errors/error.enum";
import { ErrorMessages } from "../../constants/errors/error.messages";
import { ApiResponse } from "../../types/shared/response.type";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error caught by global handler:", err);

  const errorCode = err.errorCode || ErrorCode.INTERNAL_SERVER_ERROR;
  const status = 200; // Always return 200 as per project rule

  const response: ApiResponse = {
    code: errorCode,
    error: {
      msg: err.message || ErrorMessages[errorCode as ErrorCode] || "Internal server error",
    },
  };

  res.status(status).json(response);
};
