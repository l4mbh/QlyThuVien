"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const report_service_1 = require("../../services/report/report.service");
class ReportController {
    constructor() {
        this.getSummary = async (req, res, next) => {
            try {
                const userRole = req.user?.role || 'STAFF';
                const data = await this.reportService.getSummary(userRole);
                res.json({ data, code: 0 });
            }
            catch (error) {
                next(error);
            }
        };
        this.getBorrowTrends = async (req, res, next) => {
            try {
                const { range } = req.query;
                const data = await this.reportService.getBorrowTrends(range);
                res.json({ data, code: 0 });
            }
            catch (error) {
                next(error);
            }
        };
        this.getTopBooks = async (req, res, next) => {
            try {
                const { limit } = req.query;
                const data = await this.reportService.getTopBooks(Number(limit) || 5);
                res.json({ data, code: 0 });
            }
            catch (error) {
                next(error);
            }
        };
        this.getOverdueItems = async (req, res, next) => {
            try {
                const data = await this.reportService.getOverdueItems();
                res.json({ data, code: 0 });
            }
            catch (error) {
                next(error);
            }
        };
        this.getLowStockBooks = async (req, res, next) => {
            try {
                const { threshold } = req.query;
                const data = await this.reportService.getLowStockBooks(Number(threshold) || 3);
                res.json({ data, code: 0 });
            }
            catch (error) {
                next(error);
            }
        };
        this.getMonthlyReport = async (req, res, next) => {
            try {
                const { month } = req.query; // Expects YYYY-MM
                if (!month) {
                    return res.status(200).json({ error: { msg: "Month is required" }, code: 1001 });
                }
                const data = await this.reportService.getMonthlyReport(month);
                res.json({ data, code: 0 });
            }
            catch (error) {
                next(error);
            }
        };
        this.getInventoryReport = async (req, res, next) => {
            try {
                const data = await this.reportService.getInventoryReport();
                res.json({ data, code: 0 });
            }
            catch (error) {
                next(error);
            }
        };
        this.getReaderActivityReport = async (req, res, next) => {
            try {
                const data = await this.reportService.getReaderActivityReport();
                res.json({ data, code: 0 });
            }
            catch (error) {
                next(error);
            }
        };
        this.getFineReport = async (req, res, next) => {
            try {
                const data = await this.reportService.getFineReport();
                res.json({ data, code: 0 });
            }
            catch (error) {
                next(error);
            }
        };
        // --- LIBRARIAN COMMAND CENTER (V2) ---
        this.getDailyOperations = async (req, res, next) => {
            try {
                const data = await this.reportService.getDailyOperations();
                res.json({ data, code: 0 });
            }
            catch (error) {
                next(error);
            }
        };
        this.getActionableOverdue = async (req, res, next) => {
            try {
                const data = await this.reportService.getActionableOverdue();
                res.json({ data, code: 0 });
            }
            catch (error) {
                next(error);
            }
        };
        this.getCollectionHealth = async (req, res, next) => {
            try {
                const data = await this.reportService.getCollectionHealth();
                res.json({ data, code: 0 });
            }
            catch (error) {
                next(error);
            }
        };
        this.getFinancialLedger = async (req, res, next) => {
            try {
                const data = await this.reportService.getFinancialLedger();
                res.json({ data, code: 0 });
            }
            catch (error) {
                next(error);
            }
        };
        this.reportService = new report_service_1.ReportService();
    }
}
exports.ReportController = ReportController;
