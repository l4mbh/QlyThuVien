import { api } from "@/services/api";
import { type ApiResponse } from "@/types/response.type";
import { 
  type MonthlyReport,
  type InventoryReport,
  type ReaderActivityReport,
  type FineReport
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
  }
};
