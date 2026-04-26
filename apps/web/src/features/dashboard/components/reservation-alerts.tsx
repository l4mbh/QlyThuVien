import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Clock, AlertTriangle, ArrowRight, User, Book as BookIcon, CalendarCheck } from "lucide-react";
import { formatDistanceToNow, isBefore } from "date-fns";
import { dashboardService } from "../dashboard.service";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ReservationAlert {
  id: string;
  userId: string;
  bookId: string;
  status: string;
  expiresAt: string;
  user: {
    name: string;
  };
  book: {
    title: string;
  };
}

export const ReservationAlerts: React.FC = () => {
  const navigate = useNavigate();
  const { data: alerts, isLoading } = useQuery({
    queryKey: ["dashboard", "urgent-reservations"],
    queryFn: () => dashboardService.getUrgentReservations(5),
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm animate-pulse">
        <div className="h-6 w-48 bg-slate-100 rounded" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-50 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-bottom border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <Clock size={18} />
          </div>
          <h3 className="font-bold text-slate-800">Urgent Pickup Queue</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs font-bold text-primary hover:bg-primary/5 gap-1"
          onClick={() => navigate("/reservations")}
        >
          View all <ArrowRight size={14} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {alerts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 italic">
            No urgent pickup alerts
          </div>
        ) : (
          alerts.map((alert: ReservationAlert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))
        )}
      </div>
    </div>
  );
};

const AlertItem: React.FC<{ alert: ReservationAlert }> = ({ alert }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const expiry = new Date(alert.expiresAt);
      const now = new Date();

      if (isBefore(expiry, now)) {
        setTimeLeft("Expired");
        setIsCritical(true);
        return;
      }

      const diffMs = expiry.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      setTimeLeft(formatDistanceToNow(expiry, { addSuffix: true }));
      setIsUrgent(diffHours < 24);
      setIsCritical(diffHours < 2);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [alert.expiresAt]);

  const handleClick = () => {
    navigate(`/reservations?id=${alert.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "p-3 rounded-xl border transition-all cursor-pointer group relative overflow-hidden",
        isCritical
          ? "bg-red-50 border-red-100 hover:border-red-200 animate-in fade-in slide-in-from-right-2"
          : isUrgent
            ? "bg-orange-50 border-orange-100 hover:border-orange-200"
            : "bg-slate-50 border-slate-100 hover:border-slate-200"
      )}
    >
      {isCritical && (
        <div className="absolute top-0 right-0 p-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 truncate max-w-[70%]">
            <User size={14} className="text-slate-400" />
            {alert.user.name}
          </div>
          <div className={cn(
            "text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-1",
            isCritical ? "text-red-600 bg-red-100" : isUrgent ? "text-orange-600 bg-orange-100" : "text-slate-500 bg-slate-200"
          )}>
            {isCritical ? <AlertTriangle size={10} /> : <Clock size={10} />}
            {isCritical ? "Urgent" : "Warning"}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
          <BookIcon size={14} className="text-slate-400 shrink-0" />
          <span className="truncate">{alert.book.title}</span>
        </div>

        <div className={cn(
          "text-[11px] font-bold mt-1",
          isCritical ? "text-red-500" : isUrgent ? "text-orange-500" : "text-slate-400"
        )}>
          Expires {timeLeft}
        </div>
      </div>
    </div>
  );
};
