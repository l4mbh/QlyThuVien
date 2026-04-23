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

  getLowStockBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { threshold } = req.query;
      const data = await this.reportService.getLowStockBooks(Number(threshold) || 3);
      res.json({ data, code: 0 });
    } catch (error) {
      next(error);
    }
  };

  getMonthlyReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { month } = req.query; // Expects YYYY-MM
      if (!month) {
        return res.status(200).json({ error: { msg: "Month is required" }, code: 1001 });
      }
      const data = await this.reportService.getMonthlyReport(month as string);
      res.json({ data, code: 0 });
    } catch (error) {
      next(error);
    }
  };

  getInventoryReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.reportService.getInventoryReport();
      res.json({ data, code: 0 });
    } catch (error) {
      next(error);
    }
  };

  getReaderActivityReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.reportService.getReaderActivityReport();
      res.json({ data, code: 0 });
    } catch (error) {
      next(error);
    }
  };

  getFineReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.reportService.getFineReport();
      res.json({ data, code: 0 });
    } catch (error) {
      next(error);
    }
  };

  // --- LIBRARIAN COMMAND CENTER (V2) ---

  getDailyOperations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.reportService.getDailyOperations();
      res.json({ data, code: 0 });
    } catch (error) {
      next(error);
    }
  };

  getActionableOverdue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.reportService.getActionableOverdue();
      res.json({ data, code: 0 });
    } catch (error) {
      next(error);
    }
  };

  getCollectionHealth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.reportService.getCollectionHealth();
      res.json({ data, code: 0 });
    } catch (error) {
      next(error);
    }
  };

  getFinancialLedger = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.reportService.getFinancialLedger();
      res.json({ data, code: 0 });
    } catch (error) {
      next(error);
    }
  };
}
