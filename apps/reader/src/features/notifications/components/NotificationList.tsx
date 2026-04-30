import React, { useState } from 'react';
import { Bell, Info, CheckCircle2, AlertTriangle, Calendar, BookOpen, Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { NotificationType } from '@qltv/shared';
import { format, isToday, isYesterday } from 'date-fns';
import { useMarkNotificationRead } from '../../../hooks/useNotifications';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationListProps {
  notifications: Notification[];
}

const typeIcons: Record<string, any> = {
  [NotificationType.BORROW_SUCCESS]: BookOpen,
  [NotificationType.RETURN_SUCCESS]: CheckCircle2,
  [NotificationType.OVERDUE]: AlertTriangle,
  [NotificationType.RESERVATION_READY]: Clock,
  [NotificationType.QUEUE_UPDATE]: Bell,
  [NotificationType.SYSTEM]: Info,
};

const typeColors: Record<string, string> = {
  [NotificationType.BORROW_SUCCESS]: "text-blue-500 bg-blue-50",
  [NotificationType.RETURN_SUCCESS]: "text-green-500 bg-green-50",
  [NotificationType.OVERDUE]: "text-red-500 bg-red-50",
  [NotificationType.RESERVATION_READY]: "text-emerald-500 bg-emerald-50",
  [NotificationType.QUEUE_UPDATE]: "text-amber-500 bg-amber-50",
  [NotificationType.SYSTEM]: "text-slate-500 bg-slate-50",
};

export const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const markRead = useMarkNotificationRead();

  if (!notifications || notifications.length === 0) {
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

  const handleNotificationClick = (id: string, isRead: boolean) => {
    // Toggle expand
    setExpandedId(prev => prev === id ? null : id);
    
    // Mark as read if not already
    if (!isRead) {
      markRead.mutate(id);
    }
  };

  // Group notifications by date
  const groups = notifications.reduce((acc, notif) => {
    const date = new Date(notif.createdAt);
    let group = format(date, 'MMM dd, yyyy');
    if (isToday(date)) group = 'Today';
    else if (isYesterday(date)) group = 'Yesterday';
    
    if (!acc[group]) acc[group] = [];
    acc[group].push(notif);
    return acc;
  }, {} as Record<string, Notification[]>);

  return (
    <div className="space-y-8 pb-10">
      {Object.entries(groups).map(([group, items]) => (
        <div key={group} className="space-y-4">
          <div className="flex items-center gap-2 px-1">
             <Calendar size={14} className="text-slate-400" />
             <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{group}</h3>
          </div>
          
          <div className="space-y-3">
            {items.map((notif) => {
              const Icon = typeIcons[notif.type] || Info;
              const colorClass = typeColors[notif.type] || "text-slate-500 bg-slate-50";
              const timestamp = format(new Date(notif.createdAt), 'HH:mm');
              const isExpanded = expandedId === notif.id;

              return (
                <div 
                  key={notif.id} 
                  onClick={() => handleNotificationClick(notif.id, notif.isRead)}
                  className={cn(
                    "p-4 rounded-[24px] flex gap-4 transition-all border",
                    isExpanded 
                      ? "bg-white border-blue-200 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/10 scale-[1.01] z-10" 
                      : (notif.isRead 
                          ? "bg-white border-slate-100 opacity-60" 
                          : "bg-white border-primary/15 shadow-sm shadow-primary/5")
                  )}
                >
                  <div className={cn(
                    "w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-opacity",
                    colorClass,
                    notif.isRead && !isExpanded && "opacity-50"
                  )}>
                    <Icon size={20} />
                  </div>

                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={cn(
                        "text-sm font-bold transition-colors",
                        isExpanded ? "text-slate-950" : (notif.isRead ? "text-slate-400" : "text-slate-900"),
                        !isExpanded && "truncate"
                      )}>
                        {notif.title}
                      </h4>
                      <span className={cn(
                        "text-[10px] font-bold whitespace-nowrap transition-colors",
                        isExpanded ? "text-slate-500" : "text-slate-400"
                      )}>
                        {timestamp}
                      </span>
                    </div>
                    <p className={cn(
                      "text-sm leading-snug transition-colors",
                      isExpanded ? "text-slate-900 font-medium" : "text-slate-500",
                      !isExpanded && "line-clamp-2",
                      notif.isRead && !isExpanded && "text-slate-400"
                    )}>
                      {notif.message}
                    </p>
                  </div>
                  
                  {!notif.isRead && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 flex-shrink-0 shadow-sm shadow-primary/50" />
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
