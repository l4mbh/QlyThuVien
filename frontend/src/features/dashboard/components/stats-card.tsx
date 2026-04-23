import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number | string;
    isUp?: boolean;
    label?: string;
  };
  subText?: string;
  subTextClassName?: string;
  isDark?: boolean;
  className?: string;
  iconClassName?: string;
}

export const StatsCard = (props: StatsCardProps) => {
  const {
    title,
    value,
    icon: Icon,
    description,
    trend,
    subText,
    subTextClassName,
    className,
    iconClassName,
    isDark
  } = props;

  return (
    <Card 
      data-dark={isDark}
      className={cn("group overflow-hidden border-none shadow-md bg-white/70 backdrop-blur-md hover:shadow-lg transition-all duration-300", className)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500 group-data-[dark=true]:text-slate-400">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 group-data-[dark=true]:text-white">{value}</h3>
              {trend && (
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5",
                  trend.isUp === true ? "bg-emerald-100 text-emerald-700" : 
                  trend.isUp === false ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
                )}>
                  {trend.isUp === true && "↑"}
                  {trend.isUp === false && "↓"}
                  {trend.value}
                  {trend.label && <span className="ml-1 font-medium opacity-80">{trend.label}</span>}
                </span>
              )}
            </div>
            {subText && (
              <p className={cn("text-[10px] font-medium text-slate-400 group-data-[dark=true]:text-slate-300", subTextClassName)}>{subText}</p>
            )}
            {description && (
              <p className="text-xs text-slate-400 mt-1 group-data-[dark=true]:text-slate-400/80">{description}</p>
            )}
          </div>
          <div className={cn("p-3 rounded-xl bg-primary/5 text-primary", iconClassName)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
