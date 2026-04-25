import React, { useState } from 'react';
import { useMyBorrowed } from '../../../hooks/useBorrow';
import { useMyReservations } from '../../../hooks/useReservations';
import { MyBorrowedList } from '../components/MyBorrowedList';
import { ReservationList } from '../components/ReservationList';
import { Skeleton } from '../../../components/ui/Skeleton';
import { cn } from '../../../lib/utils';
import { BookMarked, Clock } from 'lucide-react';

export const MyBooksPage = () => {
  const [activeTab, setActiveTab] = useState<'loans' | 'reservations'>('loans');
  const { data: borrowed, isLoading: isLoansLoading } = useMyBorrowed();
  const { data: reservations, isLoading: isResLoading } = useMyReservations();

  const isLoading = activeTab === 'loans' ? isLoansLoading : isResLoading;

  return (
    <div className="pt-4 space-y-6">
      {/* Header */}
      <div className="space-y-1 px-1">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Library Shelf</h2>
        <p className="text-sm font-bold text-slate-500">Manage your active loans and reservations</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex p-1.5 bg-slate-100 rounded-[24px] gap-1.5">
        <button
          onClick={() => setActiveTab('loans')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all",
            activeTab === 'loans' 
              ? "bg-white text-slate-900 shadow-xl shadow-slate-200/50" 
              : "text-slate-500 hover:bg-white/50"
          )}
        >
          <BookMarked size={16} />
          Active Loans
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all",
            activeTab === 'reservations' 
              ? "bg-white text-slate-900 shadow-xl shadow-slate-200/50" 
              : "text-slate-500 hover:bg-white/50"
          )}
        >
          <Clock size={16} />
          Reservations
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32 w-full rounded-[32px]" />
            ))}
          </div>
        ) : activeTab === 'loans' ? (
          <MyBorrowedList items={borrowed || []} />
        ) : (
          <ReservationList items={reservations || []} />
        )}
      </div>
    </div>
  );
};
