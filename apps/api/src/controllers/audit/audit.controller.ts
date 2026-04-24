import { Request, Response, NextFunction } from "express";
import { auditService } from "../../services/audit/audit.service";
import { ErrorCode, ApiResponse } from "@qltv/shared";

export class AuditController {
  getRecentActivities = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      const activities = await auditService.getRecentActivities(page, limit);
      const response: ApiResponse = { data: activities, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getEntityHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const type = req.params.type as string;
      const id = req.params.id as string;
      const history = await auditService.getEntityHistory(type, id);
      const response: ApiResponse = { data: history, code: ErrorCode.SUCCESS };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}
