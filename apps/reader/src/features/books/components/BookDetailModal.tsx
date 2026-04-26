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
  const isLoggedIn = !!localStorage.getItem('reader_token');

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
      await createReservation.mutateAsync({ 
        bookId: bookId!
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
      await createReservation.mutateAsync({ 
        bookId: bookId!
      });
      toast.success('Successfully joined the queue!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to join queue');
    }
  };

  return (
    <Drawer.Root open={!!bookId} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]" />
        <Drawer.Content className="bg-background flex flex-col rounded-t-3xl h-[90%] mt-24 fixed bottom-0 left-0 right-0 z-50 focus:outline-none max-w-2xl mx-auto shadow-2xl">
          <div className="p-4 rounded-t-3xl flex-1 overflow-y-auto no-scrollbar">
            <div className="mx-auto w-10 h-1 flex-shrink-0 rounded-full bg-border mb-6" />
            
            {isLoading ? (
              <div className="space-y-6 animate-pulse">
                <div className="aspect-[16/10] w-full bg-muted rounded-2xl" />
                <div className="space-y-3">
                  <div className="h-7 bg-muted rounded-lg w-3/4" />
                  <div className="h-4 bg-muted rounded-lg w-1/2" />
                </div>
              </div>
            ) : book ? (
              <div className="space-y-5 pb-24">
                {/* Cover */}
                <div className="relative aspect-[16/10] bg-muted rounded-2xl overflow-hidden">
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                      <BookOpen size={56} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-2.5 py-1 bg-white/15 backdrop-blur-md text-white text-[10px] font-semibold rounded-lg uppercase tracking-wider border border-white/15">
                      {book.category?.name || 'General'}
                    </span>
                  </div>
                  <button 
                    onClick={onClose}
                    className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-black/15 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/30 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Title and Author */}
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-2xl font-bold text-foreground leading-tight tracking-tight">
                      {book.title}
                    </h2>
                    <div className={cn(
                      "px-3 py-1 text-[10px] font-semibold rounded-lg uppercase flex-shrink-0",
                      (book.effectiveAvailable ?? book.availableQuantity) > 0 
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                    )}>
                      {(book.effectiveAvailable ?? book.availableQuantity) > 0 ? 'Available' : 'Limited Stock'}
                    </div>
                  </div>
                  <p className="text-base text-muted-foreground">
                    by <span className="text-primary font-medium">{book.author}</span>
                  </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center justify-center p-3.5 glass-subtle rounded-2xl border border-border/40">
                    <Hash size={16} className="text-primary mb-1.5" />
                    <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">Call No.</span>
                    <span className="text-xs font-semibold text-foreground mt-0.5 truncate w-full text-center">{book.callNumber || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3.5 glass-subtle rounded-2xl border border-border/40">
                    <Clock size={16} className="text-primary mb-1.5" />
                    <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">Period</span>
                    <span className="text-xs font-semibold text-foreground mt-0.5">14 Days</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3.5 glass-subtle rounded-2xl border border-border/40">
                    <MapPin size={16} className="text-primary mb-1.5" />
                    <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">Location</span>
                    <span className="text-xs font-semibold text-foreground mt-0.5">Main Hall</span>
                  </div>
                </div>

                {/* Synopsis */}
                <div className="space-y-2 glass-subtle p-5 rounded-2xl border border-border/40">
                  <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <Bookmark size={12} className="text-primary" />
                    Synopsis
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {book.description || "Explore this fascinating title at our library. No digital description available yet."}
                  </p>
                  {book.queueCount && book.queueCount > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">In Queue</span>
                      <span className="text-xs font-bold text-amber-600">{book.queueCount} people waiting</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-border/40 max-w-2xl mx-auto">
                  {(book.effectiveAvailable ?? book.availableQuantity) > 0 ? (
                    <button 
                      className="w-full py-4 bg-primary text-white rounded-2xl font-semibold transition-all shadow-lg shadow-primary/20 active:scale-[0.98] hover:shadow-xl hover:shadow-primary/25"
                      onClick={handleBorrow}
                    >
                      {isLoggedIn ? 'Borrow this Book' : 'Sign in to Borrow'}
                    </button>
                  ) : (
                    <button 
                      className={cn(
                        "w-full py-4 rounded-2xl font-semibold transition-all active:scale-[0.98]",
                        isReserved 
                          ? "bg-muted text-muted-foreground cursor-not-allowed" 
                          : "bg-amber-500 text-white shadow-lg shadow-amber-500/15 hover:shadow-xl hover:shadow-amber-500/20"
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
    </Drawer.Root>
  );
};
