import React from 'react';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface BorrowedItem {
  id: string;
  title: string;
  author: string;
  dueDate: string;
  status: 'normal' | 'due_soon' | 'overdue';
  daysLeft: number;
}

interface MyBorrowedListProps {
  items: BorrowedItem[];
}

export const MyBorrowedList: React.FC<MyBorrowedListProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">Your shelf is empty</h3>
          <p className="text-sm text-slate-500">Visit the library to start mượn sách!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isOverdue = item.status === 'overdue';
        const isDueSoon = item.status === 'due_soon';
        
        return (
          <div 
            key={item.id}
            className={cn(
              "p-5 rounded-[24px] border transition-all flex flex-col gap-4",
              isOverdue 
                ? "bg-red-50/50 border-red-100" 
                : isDueSoon 
                  ? "bg-amber-50/50 border-amber-100" 
                  : "bg-white border-slate-100 shadow-sm hover:shadow-md"
            )}
          >
            <div className="flex items-start gap-4">
               {/* Mini Cover Placeholder */}
              <div className={cn(
                "w-12 h-16 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-300 shadow-sm",
                isOverdue && "bg-red-100 text-red-300",
                isDueSoon && "bg-amber-100 text-amber-300"
              )}>
                <div className="w-6 h-8 border-2 border-current rounded-sm" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={cn(
                    "px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider",
                    isOverdue ? "bg-red-500 text-white" : isDueSoon ? "bg-amber-500 text-white" : "bg-primary/10 text-primary"
                  )}>
                    {item.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    ID: #{item.id.slice(0, 4)}
                  </span>
                </div>
                <h4 className="text-base font-black text-slate-900 truncate leading-none mb-1">
                  {item.title}
                </h4>
                <p className="text-xs font-medium text-slate-500 truncate">{item.author}</p>
              </div>
            </div>

            {/* Progress & Info */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Due Date</span>
                <span className={cn(
                  "text-sm font-black",
                  isOverdue ? "text-red-600" : "text-slate-700"
                )}>
                  {item.dueDate}
                </span>
              </div>
              
              <div className="flex flex-col items-end text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {isOverdue ? "Overdue by" : "Remaining"}
                </span>
                <div className="flex items-center gap-1.5">
                  {isOverdue ? (
                    <AlertCircle size={14} className="text-red-500" />
                  ) : (
                    <Clock size={14} className={cn(isDueSoon ? "text-amber-500" : "text-primary")} />
                  )}
                  <span className={cn(
                    "text-sm font-black",
                    isOverdue ? "text-red-600" : isDueSoon ? "text-amber-600" : "text-primary"
                  )}>
                    {Math.abs(item.daysLeft)} {Math.abs(item.daysLeft) === 1 ? 'day' : 'days'}
                  </span>
                </div>
              </div>
            </div>
            
            {isOverdue && (
              <div className="p-3 bg-red-100/50 rounded-xl flex items-center gap-2">
                <AlertCircle size={16} className="text-red-600" />
                <p className="text-[11px] font-bold text-red-700">
                  Please return this book immediately and settle the fine at the library.
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
