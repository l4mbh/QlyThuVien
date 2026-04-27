import React from 'react';
import { Clock, Ban, MapPin, Calendar, ArrowRight, X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { format } from 'date-fns';
import { useCancelReservation } from '../../../hooks/useReservations';
import { toast } from 'sonner';

interface ReservationCardProps {
  item: any;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({ item }) => {
  const cancelMutation = useCancelReservation();
  const status = item.status; // PENDING, READY, etc.

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await cancelMutation.mutateAsync(item.id);
      toast.success('Reservation cancelled');
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel');
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-5 relative overflow-hidden group">
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className={cn(
          "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
          status === 'READY'
            ? (item.book.availableQuantity > 0
              ? "bg-green-500 text-white animate-pulse"
              : "bg-amber-100 text-amber-600 border border-amber-200")
            : "bg-orange-100 text-orange-600"
        )}>
          {status === 'READY' ? (
            item.book.availableQuantity > 0 ? (
              <>
                <Clock size={12} className="animate-spin-slow" />
                Ready to Collect
              </>
            ) : (
              <>
                <Ban size={12} />
                No book available for now
              </>
            )
          ) : (
            <>
              <Clock size={12} />
              Waiting # {item.position}
            </>
          )}
        </div>

        {status !== 'READY' && (
          <button
            onClick={handleCancel}
            title='Cancel reservation'
            type='button'
            disabled={cancelMutation.isPending}
            className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Book Info */}
      <div className="flex gap-5">
        <div className="w-20 h-28 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner">
          {item.book.coverUrl ? (
            <img src={item.book.coverUrl} alt={item.book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <Calendar size={24} />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-1.5 min-w-0">
          <h3 className="text-lg font-black text-slate-900 leading-tight truncate">
            {item.book.title}
          </h3>
          <p className="text-sm font-bold text-slate-500 truncate">
            by <span className="text-primary">{item.book.author}</span>
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
              <MapPin size={12} className="text-primary" />
              Main Library
            </div>
          </div>
        </div>
      </div>

      {/* Expiration or Progress */}
      {status === 'READY' && (
        item.book.availableQuantity > 0 ? (
          item.expiresAt && (
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Pick up before</span>
                <span className="text-xs font-black text-green-700">{format(new Date(item.expiresAt), 'MMM dd, HH:mm')}</span>
              </div>
              <div className="w-full h-1.5 bg-green-200 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-green-600 rounded-full transition-all" style={{ width: '100%' }} />
              </div>
            </div>
          )
        ) : (
          <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100/50">
            <p className="text-[11px] font-bold text-amber-700 leading-relaxed">
              We're sorry! Someone just borrowed the last copy. You are still #1 in queue and will be notified as soon as a copy is returned.
            </p>
          </div>
        )
      )}

      {status === 'PENDING' && (
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
          <span>Position: {item.position}</span>
          <ArrowRight size={14} className="text-slate-200" />
        </div>
      )}
    </div>
  );
};

interface ReservationListProps {
  items: any[];
}

export const ReservationList: React.FC<ReservationListProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="bg-slate-50 rounded-[40px] p-12 text-center border-2 border-dashed border-slate-200 mt-4">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Clock size={32} className="text-slate-300" />
        </div>
        <h3 className="text-lg font-black text-slate-900">No Reservations</h3>
        <p className="text-sm font-medium text-slate-500 mt-1 px-4">
          Books you join the queue for will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {items.map((item) => (
        <ReservationCard key={item.id} item={item} />
      ))}
    </div>
  );
};
