import React from "react";
import {
  BookPlus,
  BookUp,
  BookX,
  UserPlus,
  UserCog,
  UserX,
  RotateCcw,
  BookOpen,
  LayoutGrid,
  RefreshCw,
  History,
  Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { type AuditLog, AuditAction } from "@/types/audit.type";
import { cn } from "@/lib/utils";

interface RecentActivitiesProps {
  activities: AuditLog[];
  isLoading?: boolean;
}

const getActionConfig = (action: AuditAction) => {
  switch (action) {
    case AuditAction.CREATE_BOOK:
      return { icon: BookPlus, color: "text-blue-500", bg: "bg-blue-50", label: "Added new book" };
    case AuditAction.UPDATE_BOOK:
      return { icon: BookUp, color: "text-amber-500", bg: "bg-amber-50", label: "Updated book" };
    case AuditAction.DELETE_BOOK:
      return { icon: BookX, color: "text-red-500", bg: "bg-red-50", label: "Deleted book" };
    case AuditAction.BORROW_CREATED:
      return { icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-50", label: "Borrowed books" };
    case AuditAction.RETURN_COMPLETED:
      return { icon: RotateCcw, color: "text-purple-500", bg: "bg-purple-50", label: "Returned books" };
    case AuditAction.INVENTORY_ADJUSTED:
      return { icon: RefreshCw, color: "text-orange-500", bg: "bg-orange-50", label: "Adjusted inventory" };
    case AuditAction.USER_CREATED:
      return { icon: UserPlus, color: "text-indigo-500", bg: "bg-indigo-50", label: "Created account" };
    case AuditAction.USER_UPDATED:
      return { icon: UserCog, color: "text-slate-500", bg: "bg-slate-50", label: "Updated profile" };
    case AuditAction.USER_BLOCKED:
      return { icon: UserX, color: "text-rose-500", bg: "bg-rose-50", label: "Blocked user" };
    case AuditAction.CREATE_CATEGORY:
      return { icon: LayoutGrid, color: "text-cyan-500", bg: "bg-cyan-50", label: "New category" };
    default:
      return { icon: History, color: "text-slate-400", bg: "bg-slate-50", label: "System event" };
  }
};

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, isLoading }) => {
  return (
    <div className="p-1 bg-slate-50 rounded-xl ring-1 ring-slate-200">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6 space-y-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-tight">
          Recent Activities
        </h3>

        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 bg-slate-100 rounded w-3/4" />
                  <div className="h-2 bg-slate-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-6 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
            {activities.map((activity) => {
              const config = getActionConfig(activity.action);
              const Icon = config.icon;

              return (
                <div key={activity.id} className="relative flex gap-4 group">
                  <div className={cn(
                    "relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white transition-transform group-hover:scale-110",
                    config.bg,
                    config.color
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {config.label}
                      </p>
                      <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 shrink-0 uppercase tracking-tighter">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      <span className="font-semibold text-slate-700">{(activity as any).user?.name || "System"}</span>
                      {" "}{activity.metadata?.title || activity.metadata?.name || ""}
                    </p>
                    {activity.metadata?.change && (
                      <p className={cn(
                        "text-[10px] font-bold mt-1 inline-flex px-1.5 py-0.5 rounded",
                        activity.metadata.change > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      )}>
                        {activity.metadata.change > 0 ? "+" : ""}{activity.metadata.change} items
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xs text-slate-400 italic">No recent activities found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
