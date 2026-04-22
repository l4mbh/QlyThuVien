import { Request, Response, NextFunction } from "express";
import { ReportService } from "../../services/report/report.service";

export class ReportController {
  private reportService: ReportService;

  constructor() {
    this.reportService = new ReportService();
  }

  getSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = (req as any).user?.role || 'STAFF';
      const data = await this.reportService.getSummary(userRole);
      res.json({ data, code: 0 });
    } catch (error) {
      next(error);
    }
  };

  getBorrowTrends = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { range } = req.query;
      const data = await this.reportService.getBorrowTrends(range as string);
      res.json({ data, code: 0 });
    } catch (error) {
      next(error);
    }
  };

  getTopBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit } = req.query;
      const data = await this.reportService.getTopBooks(Number(limit) || 5);
      res.json({ data, code: 0 });
    } catch (error) {
      next(error);
    }
  };

  getOverdueItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.reportService.getOverdueItems();
      res.json({ data, code: 0 });
    } catch (error) {
      next(error);
    }
  };
}
