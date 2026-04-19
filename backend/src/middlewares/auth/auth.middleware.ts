import { Request, Response, NextFunction } from "express";
import { ErrorCode } from "../../constants/errors/error.enum";
import { verifyToken } from "../../utils/jwt.util";
import { UserRole } from "@prisma/client";

export const authMiddleware = (
  req: any, // Use any to attach user property
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("No token provided") as any;
      error.errorCode = ErrorCode.UNAUTHORIZED;
      throw error;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      error.errorCode = ErrorCode.TOKEN_EXPIRED;
    } else if (error.name === "JsonWebTokenError") {
      error.errorCode = ErrorCode.TOKEN_INVALID;
    } else if (!error.errorCode) {
      error.errorCode = ErrorCode.UNAUTHORIZED;
    }
    next(error);
  }
};

export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      const error = new Error("Forbidden: Insufficient permissions") as any;
      error.errorCode = ErrorCode.FORBIDDEN;
      return next(error);
    }
    next();
  };
};
