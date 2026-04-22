import { useState, useEffect } from "react";
import { BookOpen, BookCopy, AlertCircle, Coins, CheckCircle2 } from "lucide-react";
import { dashboardService } from "../dashboard.service";
import { 
  type DashboardSummary, 
  type BorrowTrend, 
  type TopBook, 
  type OverdueDetail 
} from "@/types/report/report.entity";
import { StatsCard } from "../components/stats-card";
import { BorrowTrendChart } from "../components/borrow-trend-chart";
import { OverdueTable } from "../components/overdue-table";
import { TopBooksList } from "../components/top-books-list";
import { useAuth } from "@/features/auth/auth.hook";
import { UserRole } from "@/types/auth/user.entity";

export const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState<{
    summary: DashboardSummary | null;
    trends: BorrowTrend[];
    topBooks: TopBook[];
    overdue: OverdueDetail[];
  }>({
    summary: null,
    trends: [],
    topBooks: [],
    overdue: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [summary, trends, topBooks, overdue] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getBorrowTrends(),
          dashboardService.getTopBooks(),
          dashboardService.getOverdueItems()
        ]);
        setData({ summary, trends, topBooks, overdue });
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
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Library Insights</h1>
        <p className="text-lg text-slate-500">Welcome back, {user?.name}. Here's what's happening today.</p>
      </div>

      {/* Hero Stats Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-white/50 animate-pulse rounded-2xl ring-1 ring-slate-100" />
          ))
        ) : (
          <>
            <StatsCard 
              title="Total Books" 
              value={data.summary?.totalBooks || 0} 
              icon={BookOpen} 
              description="Books in repository"
              iconClassName="bg-blue-50 text-blue-600"
            />
            <StatsCard 
              title="Available" 
              value={data.summary?.availableBooks || 0} 
              icon={CheckCircle2} 
              description="Ready to borrow"
              iconClassName="bg-emerald-50 text-emerald-600"
            />
            <StatsCard 
              title="Active Borrows" 
              value={data.summary?.activeBorrows || 0} 
              icon={BookCopy} 
              description="Currently with readers"
              iconClassName="bg-amber-50 text-amber-600"
            />
            <StatsCard 
              title="Overdue" 
              value={data.summary?.overdueCount || 0} 
              icon={AlertCircle} 
              description="Needs attention"
              className="ring-1 ring-red-100"
              iconClassName="bg-red-50 text-red-600"
            />
          </>
        )}
      </div>

      {/* Admin Specific Stats */}
      {!isLoading && user?.role === UserRole.ADMIN && data.summary?.totalFines !== null && (
        <div className="grid gap-6 md:grid-cols-1">
          <StatsCard 
            title="Total Fines Collected" 
            value={formatCurrency(data.summary?.totalFines || 0)} 
            icon={Coins} 
            description="Revenue from penalties"
            className="bg-indigo-900 text-white shadow-indigo-200"
            iconClassName="bg-white/10 text-white"
          />
        </div>
      )}

      {/* Charts & Details Section */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {isLoading ? (
            <div className="h-[420px] bg-white/50 animate-pulse rounded-2xl" />
          ) : (
            <BorrowTrendChart data={data.trends} />
          )}
        </div>
        
        <div className="lg:col-span-4 space-y-8">
          {isLoading ? (
            <div className="h-[420px] bg-white/50 animate-pulse rounded-2xl" />
          ) : (
            <>
              <TopBooksList data={data.topBooks} />
              <OverdueTable data={data.overdue} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
