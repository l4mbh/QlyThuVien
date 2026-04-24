import { api } from "@/services/api";
import { type ApiResponse } from "@/types/response.type";
import { 
  type MonthlyReport,
  type InventoryReport,
  type ReaderActivityReport,
  type FineReport,
  type DailyOperation,
  type ActionableOverdue,
  type CollectionHealth,
  type FinancialLedgerEntry
} from "@/types/report/report.entity";

export const reportService = {
  async getMonthlyReport(month: string): Promise<MonthlyReport> {
    const response = await api.get<ApiResponse<MonthlyReport>>(`/reports/monthly?month=${month}`);
    return response.data.data!;
  },

  async getInventoryReport(): Promise<InventoryReport> {
    const response = await api.get<ApiResponse<InventoryReport>>("/reports/inventory");
    return response.data.data!;
  },

  async getReaderActivityReport(): Promise<ReaderActivityReport> {
    const response = await api.get<ApiResponse<ReaderActivityReport>>("/reports/readers");
    return response.data.data!;
  },

  async getFineReport(): Promise<FineReport> {
    const response = await api.get<ApiResponse<FineReport>>("/reports/fines");
    return response.data.data!;
  },

  async getDailyOperations(): Promise<DailyOperation[]> {
    const response = await api.get<ApiResponse<DailyOperation[]>>("/reports/daily-operations");
    return response.data.data!;
  },

  async getActionableOverdue(): Promise<ActionableOverdue[]> {
    const response = await api.get<ApiResponse<ActionableOverdue[]>>("/reports/actionable-overdue");
    return response.data.data!;
  },

  async getCollectionHealth(): Promise<CollectionHealth> {
    const response = await api.get<ApiResponse<CollectionHealth>>("/reports/collection-health");
    return response.data.data!;
  },

  async getFinancialLedger(): Promise<FinancialLedgerEntry[]> {
    const response = await api.get<ApiResponse<FinancialLedgerEntry[]>>("/reports/financial-ledger");
    return response.data.data!;
  }
};

