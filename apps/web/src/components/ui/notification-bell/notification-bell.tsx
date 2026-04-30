import React, { useEffect, useState } from "react";
import { Bell, Check, Clock, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { notificationService } from "@/services/notification.service";
import { type Notification, NotificationType } from "@/types/notification.type";
import { formatDistanceToNow, format } from "date-fns";
import { cn } from "@/lib/utils";

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const fetchNotifications = async () => {
    try {
      console.log("[NotificationBell] Fetching notifications...");
      const data = await notificationService.getNotifications();
      console.log("[NotificationBell] Received data:", data);
      setNotifications(data);
    } catch (error) {
      console.error("[NotificationBell] Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleNotificationClick = async (id: string, isRead: boolean) => {
    // 1. Expand/Collapse logic
    setExpandedId(prev => prev === id ? null : id);
    
    // 2. Mark as read if not already read
    if (!isRead) {
      await handleMarkAsRead(id);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const renderMessage = (notification: Notification) => {
    const { type, metadata, message } = notification;
    const meta = metadata as any;

    if (!meta || Object.keys(meta).length === 0) {
      return message || "New notification received";
    }

    switch (type) {
      case NotificationType.OVERDUE:
        return `The book "${meta.bookTitle}" is overdue since ${format(new Date(meta.dueDate), "MMM dd, yyyy")}. Please return it as soon as possible.`;
      
      case NotificationType.BORROW_SUCCESS:
        return `Successfully borrowed "${meta.bookTitle}". Due date: ${format(new Date(meta.dueDate), "MMM dd, yyyy")}.`;
      
      case NotificationType.RETURN_SUCCESS:
        return `You have successfully returned "${meta.bookTitle}". Thank you!`;
      
      case NotificationType.FINE_ASSIGNED:
        return `New fine assigned for "${meta.bookTitle}": ${meta.amount?.toLocaleString()} VND.`;
      
      case NotificationType.RESERVATION_READY:
        return `Your reserved book "${meta.bookTitle}" is ready! Please collect it by ${format(new Date(meta.expiresAt), "MMM dd, yyyy")}.`;
      
      default:
        return message || "New system notification.";
    }
  };

  const getTypeConfig = (type: NotificationType) => {
    switch (type) {
      case NotificationType.OVERDUE:
        return { icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-50" };
      case NotificationType.BORROW_SUCCESS:
        return { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" };
      case NotificationType.RETURN_SUCCESS:
        return { icon: Info, color: "text-blue-500", bg: "bg-blue-50" };
      case NotificationType.FINE_ASSIGNED:
        return { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" };
      case NotificationType.RESERVATION_READY:
        return { icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50" };
      case NotificationType.QUEUE_UPDATE:
        return { icon: Clock, color: "text-slate-500", bg: "bg-slate-50" };
      default:
        return { icon: Bell, color: "text-slate-500", bg: "bg-slate-50" };
    }
  };

  return (
    <DropdownMenu onOpenChange={(open) => open && fetchNotifications()}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-slate-100 rounded-full">
          <Bell className="h-5 w-5 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80 p-0 shadow-xl border-slate-200 z-[100] animate-in fade-in zoom-in duration-200"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h4 className="font-bold text-sm text-slate-800">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[400px]">
          {notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((notification) => {
                const config = getTypeConfig(notification.type);
                const Icon = config.icon;
                
                const isExpanded = expandedId === notification.id;
                
                return (
                  <div 
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id, notification.isRead)}
                    className={cn(
                      "flex gap-3 p-4 border-b border-slate-50 transition-all cursor-pointer hover:bg-slate-50",
                      !notification.isRead && "bg-blue-50/20",
                      isExpanded && "bg-white shadow-md border-l-4 border-l-blue-500 my-1 py-5"
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-1 transition-opacity",
                      config.bg,
                      config.color,
                      notification.isRead && !isExpanded ? "opacity-30" : "opacity-100"
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn(
                          "text-xs font-bold transition-colors",
                          isExpanded ? "text-slate-950" : (notification.isRead ? "text-slate-400 font-medium" : "text-blue-900"),
                          !isExpanded && "truncate"
                        )}>
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        )}
                      </div>
                      <p className={cn(
                        "text-[11px] leading-relaxed transition-colors",
                        isExpanded ? "text-slate-900 font-medium" : (notification.isRead ? "text-slate-400 line-clamp-2" : "text-slate-600")
                      )}>
                        {renderMessage(notification)}
                      </p>
                      <div className={cn(
                        "flex items-center gap-1 text-[10px] transition-opacity",
                        notification.isRead && !isExpanded ? "text-slate-300" : "text-slate-500"
                      )}>
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                <Bell className="h-6 w-6 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-500">No notifications yet</p>
              <p className="text-xs text-slate-400 mt-1">We'll notify you when something happens.</p>
            </div>
          )}
        </ScrollArea>
        
        <div className="p-2 border-top border-slate-100 bg-slate-50/50">
          <Button variant="ghost" className="w-full h-8 text-[11px] font-bold text-slate-500 hover:text-slate-700">
            View All Notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
