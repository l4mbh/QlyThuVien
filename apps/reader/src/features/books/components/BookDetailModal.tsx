import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, BookOpen, Clock, Tag, Hash, Bookmark } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface BookDetailModalProps {
  book: {
    id: string;
    title: string;
    author: string;
    coverUrl?: string;
    status: 'available' | 'out_of_stock';
    description?: string;
    category?: string;
    callNumber?: string; // New: Call Number
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, isOpen, onClose }) => {
  if (!book) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] p-0 animate-in zoom-in-95 duration-200 focus:outline-none">
          <div className="bg-white rounded-[24px] overflow-hidden shadow-2xl mx-4 flex flex-col max-h-[90vh]">
            {/* Header / Cover Area */}
            <div className="relative aspect-[16/10] bg-slate-100 flex-shrink-0">
              {book.coverUrl ? (
                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <BookOpen size={48} />
                </div>
              )}
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/40 transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                 <div className="flex flex-col gap-1">
                    <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded uppercase w-fit">
                      {book.category || 'General'}
                    </span>
                 </div>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="p-6 space-y-6 overflow-y-auto no-scrollbar">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">
                    {book.title}
                  </h2>
                  <div className={cn(
                    "px-3 py-1 text-[11px] font-black rounded-full uppercase flex-shrink-0 shadow-sm",
                    book.status === 'available' ? "bg-green-500 text-white" : "bg-slate-500 text-white"
                  )}>
                    {book.status === 'available' ? 'Available' : 'Out'}
                  </div>
                </div>
                <p className="text-base font-semibold text-slate-500">
                  by <span className="text-primary">{book.author}</span>
                </p>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <Hash size={16} className="text-primary mb-1" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Call Num</span>
                  <span className="text-xs font-bold text-slate-700 truncate w-full text-center">{book.callNumber || 'N/A'}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <Clock size={16} className="text-primary mb-1" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Return in</span>
                  <span className="text-xs font-bold text-slate-700">14 Days</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <Tag size={16} className="text-primary mb-1" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Fine Rate</span>
                  <span className="text-xs font-bold text-slate-700">$5/day</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Bookmark size={14} className="text-primary" />
                  Description
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  {book.description || "No description available for this book yet. Please visit the library for more details."}
                </p>
              </div>

              {/* Action Area */}
              <div className="pt-2 sticky bottom-0 bg-white">
                {book.status === 'available' ? (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 text-center font-medium">
                      This book is available. Please visit the library staff to borrow it.
                    </p>
                    <button 
                      className="w-full py-4 bg-primary text-white rounded-2xl font-black transition-all shadow-xl shadow-primary/30 active:scale-[0.98]"
                      onClick={onClose}
                    >
                      Visit Library to Borrow
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-100 rounded-2xl text-center">
                    <p className="text-sm font-bold text-slate-500">Currently out of stock</p>
                    <p className="text-[11px] text-slate-400">Ask staff for expected return date</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </Dialog.Root>
  );
};
