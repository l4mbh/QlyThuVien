import React from 'react';
import { Bell, Info, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  dateGroup: 'Today' | 'Yesterday' | 'Earlier';
}

interface NotificationListProps {
  notifications: Notification[];
}

const typeIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertTriangle,
};

const typeColors = {
  info: "text-blue-500 bg-blue-50",
  success: "text-green-500 bg-green-50",
  warning: "text-amber-500 bg-amber-50",
  error: "text-red-500 bg-red-50",
};

export const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
  if (notifications.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
          <Bell size={40} />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">All caught up!</h3>
          <p className="text-sm text-slate-500">You have no new notifications.</p>
        </div>
      </div>
    );
  }

  // Group notifications by dateGroup
  const groups = notifications.reduce((acc, notif) => {
    if (!acc[notif.dateGroup]) acc[notif.dateGroup] = [];
    acc[notif.dateGroup].push(notif);
    return acc;
  }, {} as Record<string, Notification[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groups).map(([group, items]) => (
        <div key={group} className="space-y-4">
          <div className="flex items-center gap-2 px-1">
             <Calendar size={14} className="text-slate-400" />
             <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{group}</h3>
          </div>
          
          <div className="space-y-3">
            {items.map((notif) => {
              const Icon = typeIcons[notif.type];
              return (
                <div 
                  key={notif.id} 
                  className={cn(
                    "p-4 rounded-[20px] flex gap-4 transition-all active:scale-[0.98] border",
                    notif.isRead 
                      ? "bg-white border-slate-100/60 opacity-80" 
                      : "bg-white border-primary/20 shadow-sm shadow-primary/5"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner",
                    typeColors[notif.type]
                  )}>
                    <Icon size={20} />
                  </div>

                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={cn(
                        "text-sm font-black truncate",
                        notif.isRead ? "text-slate-600" : "text-slate-900"
                      )}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 leading-snug line-clamp-3">
                      {notif.message}
                    </p>
                  </div>
                  
                  {!notif.isRead && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 flex-shrink-0 animate-pulse shadow-sm shadow-primary" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
