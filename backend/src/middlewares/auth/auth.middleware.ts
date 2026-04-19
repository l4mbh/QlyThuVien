import { Request, Response, NextFunction } from "express";
import { ErrorCode } from "../../constants/errors/error.enum";

// Placeholder for auth middleware
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // In a real app, you would verify JWT here
  // For now, we'll just let everything through
  next();
};

export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Placeholder for role-based access control
    next();
  };
};
