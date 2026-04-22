import { api } from "@/services/api";
import { type ApiResponse } from "@/types/response.type";
import { 
  type DashboardSummary, 
  type BorrowTrend, 
  type TopBook, 
  type OverdueDetail 
} from "@/types/report/report.entity";

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const response = await api.get<ApiResponse<DashboardSummary>>("/reports/summary");
    return response.data.data!;
  },

  async getBorrowTrends(range: string = "7d"): Promise<BorrowTrend[]> {
    const response = await api.get<ApiResponse<BorrowTrend[]>>(`/reports/borrow-trends?range=${range}`);
    return response.data.data!;
  },

  async getTopBooks(limit: number = 5): Promise<TopBook[]> {
    const response = await api.get<ApiResponse<TopBook[]>>(`/reports/top-books?limit=${limit}`);
    return response.data.data!;
  },

  async getOverdueItems(): Promise<OverdueDetail[]> {
    const response = await api.get<ApiResponse<OverdueDetail[]>>("/reports/overdue");
    return response.data.data!;
  },
};
