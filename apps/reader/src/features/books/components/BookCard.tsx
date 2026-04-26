import React from 'react';
import { cn } from '../../../lib/utils';
import { BookOpen } from 'lucide-react';

interface BookCardProps {
  title: string;
  author: string;
  coverUrl?: string;
  status: 'available' | 'out_of_stock';
  queueCount?: number;
  onClick: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({ title, author, coverUrl, status, queueCount, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="flex flex-col gap-2.5 cursor-pointer group animate-in fade-in duration-300"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-muted/50 border border-border/40 transition-all duration-200 group-hover:shadow-lg group-hover:shadow-black/5 group-hover:-translate-y-0.5">
        {coverUrl ? (
          <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
            <BookOpen size={32} />
          </div>
        )}
        
        {/* Status badge */}
        <div className={cn(
          "absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider",
          status === 'available' 
            ? "bg-emerald-500/90 text-white backdrop-blur-sm" 
            : "bg-foreground/60 text-white backdrop-blur-sm"
        )}>
          {status === 'available' ? 'Available' : 'Out'}
        </div>
      </div>
      
      <div className="space-y-0.5 px-0.5">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground flex justify-between items-center">
          <span>{author}</span>
          {queueCount && queueCount > 0 ? (
            <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-full border border-orange-100 animate-in zoom-in duration-300">
              {queueCount} in queue
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
};
