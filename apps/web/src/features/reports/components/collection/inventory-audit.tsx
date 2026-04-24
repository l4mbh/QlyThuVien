import { 
  CheckCircle2, 
  BookOpen, 
  AlertCircle, 
  Settings 
} from "lucide-react";
import type { CollectionHealth } from "@/types/report/report.entity";

interface InventoryAuditProps {
  data: CollectionHealth;
}

export const InventoryAudit = ({ data }: InventoryAuditProps) => {
  const { statusBreakdown } = data;
  
  const stats = [
    { 
      label: "Available", 
      value: statusBreakdown.available, 
      icon: CheckCircle2, 
      color: "text-green-600", 
      bgColor: "bg-green-50" 
    },
    { 
      label: "Borrowed", 
      value: statusBreakdown.borrowed, 
      icon: BookOpen, 
      color: "text-blue-600", 
      bgColor: "bg-blue-50" 
    },
    { 
      label: "Damaged", 
      value: statusBreakdown.damaged, 
      icon: Settings, 
      color: "text-orange-600", 
      bgColor: "bg-orange-50" 
    },
    { 
      label: "Lost", 
      value: statusBreakdown.lost, 
      icon: AlertCircle, 
      color: "text-red-600", 
      bgColor: "bg-red-50" 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            className={`p-4 rounded-xl border border-slate-100 ${stat.bgColor} flex flex-col gap-2`}
          >
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs font-medium text-slate-500 uppercase">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-slate-700">Stock Distribution</h4>
          <span className="text-xs text-slate-500">Total: {data.totalBooks} items</span>
        </div>
        <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-green-500" 
            style={{ width: `${(statusBreakdown.available / data.totalBooks) * 100}%` }} 
          />
          <div 
            className="h-full bg-blue-500" 
            style={{ width: `${(statusBreakdown.borrowed / data.totalBooks) * 100}%` }} 
          />
          <div 
            className="h-full bg-orange-500" 
            style={{ width: `${(statusBreakdown.damaged / data.totalBooks) * 100}%` }} 
          />
          <div 
            className="h-full bg-red-500" 
            style={{ width: `${(statusBreakdown.lost / data.totalBooks) * 100}%` }} 
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2">
           <div className="flex items-center gap-2 text-[10px]">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-slate-600">Available ({((statusBreakdown.available / data.totalBooks) * 100).toFixed(1)}%)</span>
           </div>
           <div className="flex items-center gap-2 text-[10px]">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-slate-600">Borrowed ({((statusBreakdown.borrowed / data.totalBooks) * 100).toFixed(1)}%)</span>
           </div>
           <div className="flex items-center gap-2 text-[10px]">
              <div className="h-2 w-2 rounded-full bg-orange-500" />
              <span className="text-slate-600">Damaged ({((statusBreakdown.damaged / data.totalBooks) * 100).toFixed(1)}%)</span>
           </div>
           <div className="flex items-center gap-2 text-[10px]">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-slate-600">Lost ({((statusBreakdown.lost / data.totalBooks) * 100).toFixed(1)}%)</span>
           </div>
        </div>
      </div>
    </div>
  );
};

