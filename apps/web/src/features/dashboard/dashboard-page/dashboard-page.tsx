import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header/page-header";
import { BookOpen, BookCopy, AlertCircle, Coins, CheckCircle2 } from "lucide-react";
import { dashboardService } from "../dashboard.service";
import {
  type DashboardSummary,
  type BorrowTrend,
  type TopBook,
  type OverdueDetail,
  type LowStockBook
} from "@/types/report/report.entity";
import { cn } from "@/lib/utils";
import { StatsCard } from "../components/stats-card";
import { BorrowTrendChart } from "../components/borrow-trend-chart";
import { OverdueTable } from "../components/overdue-table";
import { TopBooksList } from "../components/top-books-list";
import { RecentActivities } from "../components/recent-activities";
import { ReservationAlerts } from "../components/reservation-alerts";
import { useAuth } from "@/features/auth/auth.hook";
import { UserRole } from "@/types/auth/user.entity";
import { type AuditLog } from "@/types/audit.type";

export const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState<{
    summary: DashboardSummary | null;
    trends: BorrowTrend[];
    topBooks: TopBook[];
    overdue: OverdueDetail[];
    lowStock: LowStockBook[];
    activities: AuditLog[];
  }>({
    summary: null,
    trends: [],
    topBooks: [],
    overdue: [],
    lowStock: [],
    activities: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [summary, trends, topBooks, overdue, lowStock, activities] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getBorrowTrends(),
          dashboardService.getTopBooks(),
          dashboardService.getOverdueItems(),
          dashboardService.getLowStockBooks(),
          dashboardService.getRecentActivities(1, 10)
        ]);
        setData({
          summary,
          trends,
          topBooks,
          overdue,
          lowStock,
          activities: activities.items
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader
        title="Command Center"
        description={`"The secret of a library is that it is a city of books." — Welcome back, ${user?.name}.`}
      />

      {/* Tầng 1: Summary Cards (Signals) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-white/50 animate-pulse rounded-2xl ring-1 ring-slate-100" />
          ))
        ) : (
          <>
            <StatsCard
              title="Total Collection"
              value={data.summary?.totalBooks || 0}
              icon={BookOpen}
              trend={data.summary?.booksDelta ? {
                value: data.summary.booksDelta,
                isUp: true,
                label: "this month"
              } : undefined}
              description="Physical books in library"
              iconClassName="bg-blue-50 text-blue-600"
            />
            <StatsCard
              title="Available Now"
              value={data.summary?.availableBooks || 0}
              icon={CheckCircle2}
              description="Ready for borrowing"
              iconClassName="bg-emerald-50 text-emerald-600"
            />
            <StatsCard
              title="Active Loans"
              value={data.summary?.activeBorrows || 0}
              icon={BookCopy}
              description="Currently with readers"
              iconClassName="bg-amber-50 text-amber-600"
            />
            <StatsCard
              title="Overdue Alerts"
              value={data.summary?.overdueCount || 0}
              icon={AlertCircle}
              description={data.summary?.overdueCount === 0 ? "All caught up! 🎉" : "Action required immediately"}
              className={cn(
                "ring-1 transition-all",
                (data.summary?.overdueCount || 0) > 0 ? "ring-red-200 bg-red-50/30" : "ring-slate-100"
              )}
              iconClassName={cn(
                (data.summary?.overdueCount || 0) > 0 ? "bg-red-100 text-red-600 animate-pulse" : "bg-slate-50 text-slate-400"
              )}
            />
          </>
        )}
      </div>

      {/* Tầng Phụ: Admin Fines */}
      {!isLoading && user?.role === UserRole.ADMIN && data.summary?.totalFines !== null && (
        <div className="animate-in slide-in-from-left-4 duration-700 delay-200">
          <StatsCard
            title="Revenue Insights"
            value={formatCurrency(data.summary?.totalFines || 0)}
            icon={Coins}
            isDark
            description="Total fines collected from reader penalties"
            className="bg-slate-900 shadow-xl shadow-slate-200"
            iconClassName="bg-white/10 text-white"
            subText="Manage finances in Reports section"
          />
        </div>
      )}

      {/* Tầng 2: Action Panels (Middle) */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        <div className="lg:col-span-8 space-y-8">
          <div className="p-1 bg-slate-50 rounded-xl ring-1 ring-slate-200">
            {isLoading ? (
              <div className="h-[400px] bg-white animate-pulse rounded-lg" />
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    Priority Overdue List
                  </h3>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Top 5 Urgent</span>
                </div>
                <OverdueTable data={data.overdue} />
                {data.overdue.length === 0 && (
                  <div className="p-10 text-center space-y-3">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <p className="text-slate-500 font-medium">No overdue books today. Great job! 🎉</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Borrow Trend */}
          <div className="p-1 bg-slate-50 rounded-xl ring-1 ring-slate-200">
            {isLoading ? (
              <div className="h-[300px] bg-white animate-pulse rounded-lg" />
            ) : (
              <BorrowTrendChart data={data.trends} />
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          {/* Urgent Pickups */}
          <ReservationAlerts />


          {/* Low Stock Panel */}
          <div className="p-1 bg-slate-50 rounded-xl ring-1 ring-slate-200">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6 space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-tight">
                Inventory Alerts
              </h3>
              {isLoading ? (
                Array(3).fill(0).map((_, i) => <div key={i} className="h-12 bg-slate-100 animate-pulse rounded" />)
              ) : (
                <div className="space-y-3">
                  {data.lowStock.length > 0 ? (
                    data.lowStock.map(book => (
                      <div key={book.id} className="flex items-center justify-between p-3 rounded-lg bg-orange-50/50 ring-1 ring-orange-100">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{book.title}</p>
                          <p className="text-[10px] text-orange-600 font-bold uppercase">{book.callNumber || "No Call #"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-extrabold text-orange-700">{book.availableQuantity} left</p>
                          <p className="text-[10px] text-slate-400">of {book.totalQuantity}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic text-center py-4">Inventory levels are healthy.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <TopBooksList data={data.topBooks} />

          {/* Recent Activities */}
          <RecentActivities activities={data.activities} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

