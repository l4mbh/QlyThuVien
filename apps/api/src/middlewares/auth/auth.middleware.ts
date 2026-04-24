import { Request, Response, NextFunction } from "express";
import { ErrorCode } from "@qltv/shared";
import { verifyToken } from "../../utils/jwt.util";
import { UserRole } from "@prisma/client";
import { AppError } from "../../utils/app-error";

export const authMiddleware = (
  req: any, // Use any to attach user property
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(ErrorCode.UNAUTHORIZED, "No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error instanceof AppError) {
      return next(error);
    }

    let code: string = ErrorCode.UNAUTHORIZED;
    let message = error.message;

    if (error.name === "TokenExpiredError") {
      code = ErrorCode.TOKEN_EXPIRED;
      message = "Session expired";
    } else if (error.name === "JsonWebTokenError") {
      code = ErrorCode.TOKEN_INVALID;
      message = "Invalid token";
    }

    
    next(new AppError(code, message));
  }
};

export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError(ErrorCode.FORBIDDEN, "Forbidden: Insufficient permissions"));
    }
    next();
  };
};


