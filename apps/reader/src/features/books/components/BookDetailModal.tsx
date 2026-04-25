import React from 'react';
import { Drawer } from 'vaul';
import { X, BookOpen, Clock, Tag, Hash, Bookmark, MapPin } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useBookDetail } from '../../../hooks/useBooks';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useNavigate } from 'react-router-dom';
import { useCreateReservation, useMyReservations } from '../../../hooks/useReservations';
import { toast } from 'sonner';

interface BookDetailModalProps {
  bookId: string | null;
  onClose: () => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({ bookId, onClose }) => {
  const { data: book, isLoading } = useBookDetail(bookId);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('reader_phone');

  const { data: myReservations } = useMyReservations();
  const createReservation = useCreateReservation();

  const isReserved = myReservations?.some((r: any) => 
    r.bookId === bookId && (r.status === 'PENDING' || r.status === 'READY')
  );

  const handleBorrow = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    try {
      const phone = localStorage.getItem('reader_phone');
      await createReservation.mutateAsync({ 
        bookId: bookId!,
        phone: phone || undefined
      });
      toast.success('Reservation created! Please pick up at library.');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create reservation');
    }
  };

  const handleReserve = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    try {
      const phone = localStorage.getItem('reader_phone');
      await createReservation.mutateAsync({ 
        bookId: bookId!,
        phone: phone || undefined
      });
      toast.success('Successfully joined the queue!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to join queue');
    }
  };

  return (
    <Drawer.Root open={!!bookId} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[32px] h-[92%] mt-24 fixed bottom-0 left-0 right-0 z-50 focus:outline-none max-w-2xl mx-auto shadow-2xl">
          <div className="p-4 bg-white rounded-t-[32px] flex-1 overflow-y-auto no-scrollbar">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-200 mb-8" />
            
            {isLoading ? (
              <div className="space-y-8 animate-pulse">
                <div className="aspect-[16/10] w-full bg-slate-100 rounded-3xl" />
                <div className="space-y-4">
                  <div className="h-8 bg-slate-100 rounded-lg w-3/4" />
                  <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
                </div>
              </div>
            ) : book ? (
              <div className="space-y-8 pb-20">
                {/* Cover Area */}
                <div className="relative aspect-[16/10] bg-slate-100 rounded-3xl overflow-hidden shadow-sm">
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <BookOpen size={64} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black rounded-lg uppercase tracking-widest border border-white/20">
                      {book.category?.name || 'General'}
                    </span>
                  </div>
                  <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/40 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Title & Author */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">
                      {book.title}
                    </h2>
                    <div className={cn(
                      "px-4 py-1.5 text-[11px] font-black rounded-full uppercase flex-shrink-0 shadow-lg",
                      book.availableQuantity > 0 ? "bg-green-500 text-white shadow-green-500/20" : "bg-slate-500 text-white"
                    )}>
                      {book.availableQuantity > 0 ? 'Available' : 'Out of Stock'}
                    </div>
                  </div>
                  <p className="text-lg font-bold text-slate-500">
                    by <span className="text-primary">{book.author}</span>
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-[24px] border border-slate-100/50">
                    <Hash size={20} className="text-primary mb-2" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Call Num</span>
                    <span className="text-xs font-black text-slate-900 mt-1 truncate w-full text-center">{book.callNumber || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-[24px] border border-slate-100/50">
                    <Clock size={20} className="text-primary mb-2" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Period</span>
                    <span className="text-xs font-black text-slate-900 mt-1">14 Days</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-[24px] border border-slate-100/50">
                    <MapPin size={20} className="text-primary mb-2" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</span>
                    <span className="text-xs font-black text-slate-900 mt-1">Main Hall</span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3 bg-slate-50/50 p-6 rounded-[28px] border border-slate-100">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Bookmark size={14} className="text-primary" />
                    Synopsis
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {book.description || "Explore this fascinating title at our library. No digital description available yet."}
                  </p>
                </div>

                {/* Action Area */}
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 max-w-2xl mx-auto rounded-t-3xl">
                  {book.availableQuantity > 0 ? (
                    <button 
                      className="w-full py-5 bg-primary text-white rounded-2xl font-black transition-all shadow-xl shadow-primary/30 active:scale-[0.98] hover:bg-primary/90"
                      onClick={handleBorrow}
                    >
                      {isLoggedIn ? 'Borrow this Book' : 'Sign in to Borrow'}
                    </button>
                  ) : (
                    <button 
                      className={cn(
                        "w-full py-5 rounded-2xl font-black transition-all shadow-xl active:scale-[0.98]",
                        isReserved 
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" 
                          : "bg-orange-500 text-white shadow-orange-500/20 hover:bg-orange-600"
                      )}
                      onClick={handleReserve}
                      disabled={isReserved || createReservation.isPending}
                    >
                      {isReserved ? 'Already in Queue' : (isLoggedIn ? 'Join the Queue' : 'Sign in to Join Queue')}
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </Drawer.Root>
  );
};
