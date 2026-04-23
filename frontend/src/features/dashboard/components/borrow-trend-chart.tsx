import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { type BorrowTrend } from "@/types/report/report.entity";

interface BorrowTrendChartProps {
  data: BorrowTrend[];
  title?: string;
}

export const BorrowTrendChart = ({ data, title = "Borrowing Trends" }: BorrowTrendChartProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6 space-y-6">
      <div className="flex flex-row items-center justify-between">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-tight">
          {title}
        </h3>
        <div className="flex gap-2">
          <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-full uppercase">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />
            Loans / Day
          </span>
        </div>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f172a" stopOpacity={0.05}/>
                <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#1e293b'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#0f172a" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorCount)" 
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
