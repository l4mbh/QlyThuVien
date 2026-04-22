import { 
  FileText, 
  BookCopy, 
  CheckCircle2, 
  AlertCircle, 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight 
} from "lucide-react";
import { type MonthlyReport } from "@/types/report/report.entity";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface MonthlyPreviewProps {
  data: MonthlyReport;
}

export const MonthlyPreview = ({ data }: MonthlyPreviewProps) => {
  const { summary, topBooks, period, generatedAt } = data;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="p-8 space-y-10 bg-white print:p-0">
      {/* Report Header (Print friendly) */}
      <div className="flex justify-between items-start border-b pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 uppercase">Monthly Library Report</h2>
          <p className="text-slate-500 font-medium">Period: {period}</p>
        </div>
        <div className="text-right text-xs text-slate-400">
          <p>Generated At: {new Date(generatedAt).toLocaleString()}</p>
          <p>System: LibMgnt v1.0</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard 
          title="Total Borrows" 
          value={summary.totalBorrows} 
          icon={BookCopy} 
          color="blue"
        />
        <MetricCard 
          title="Total Returns" 
          value={summary.totalReturns} 
          icon={CheckCircle2} 
          color="emerald"
          subValue={`Rate: ${(summary.returnRate * 100).toFixed(1)}%`}
          subIcon={summary.returnRate > 0.5 ? TrendingUp : TrendingDown}
        />
        <MetricCard 
          title="Overdue phát sinh" 
          value={summary.overdueCases} 
          icon={AlertCircle} 
          color="red"
          subValue={`Rate: ${(summary.overdueRate * 100).toFixed(1)}%`}
          isNegative
        />
      </div>

      {/* Financial Summary */}
      <div className="bg-slate-50 p-6 rounded-2xl flex items-center justify-between border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Fines Collected</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(summary.totalFinesCollected)}</p>
          </div>
        </div>
        <ArrowUpRight className="h-6 w-6 text-slate-300" />
      </div>

      {/* Top Books Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Top Borrowed Books (Monthly)
        </h3>
        <div className="border rounded-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Book Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="text-right">Borrows</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topBooks.map((book, index) => (
                <TableRow key={book.id}>
                  <TableCell className="font-bold text-slate-400">#{index + 1}</TableCell>
                  <TableCell className="font-semibold text-slate-700">{book.title}</TableCell>
                  <TableCell className="text-slate-500">{book.author}</TableCell>
                  <TableCell className="text-right font-medium">{book.borrowCount}</TableCell>
                </TableRow>
              ))}
              {topBooks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-400">
                    No borrowing activity recorded for this month.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: any;
  color: "blue" | "emerald" | "red" | "indigo";
  subValue?: string;
  subIcon?: any;
  isNegative?: boolean;
}

const MetricCard = ({ title, value, icon: Icon, color, subValue, subIcon: SubIcon, isNegative }: MetricCardProps) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    red: "bg-red-50 text-red-600 border-red-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100"
  };

  return (
    <div className={cn("p-6 rounded-2xl border bg-white shadow-sm space-y-3", colors[color])}>
      <div className="flex justify-between items-start">
        <p className="text-sm font-semibold opacity-80 uppercase tracking-wider">{title}</p>
        <Icon className="h-5 w-5 opacity-70" />
      </div>
      <div className="flex items-baseline gap-3">
        <h4 className="text-3xl font-black">{value}</h4>
        {subValue && (
          <div className={cn(
            "flex items-center text-xs font-bold px-2 py-0.5 rounded-full",
            isNegative ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
          )}>
            {SubIcon && <SubIcon className="h-3 w-3 mr-1" />}
            {subValue}
          </div>
        )}
      </div>
    </div>
  );
};
