import React from 'react';
import { cn } from '../../../lib/utils';

interface BookCardProps {
  title: string;
  author: string;
  coverUrl?: string;
  status: 'available' | 'out_of_stock';
  onClick: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({ title, author, coverUrl, status, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="flex flex-col space-y-3 cursor-pointer group animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-100 shadow-sm transition-all group-hover:shadow-md group-hover:-translate-y-1">
        {coverUrl ? (
          <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            No Cover
          </div>
        )}
        <div className={cn(
          "absolute top-2 left-2 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm",
          status === 'available' 
            ? "bg-green-500 text-white" 
            : "bg-slate-500 text-white"
        )}>
          {status === 'available' ? 'Available' : 'Out'}
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          {author}
        </p>
      </div>
    </div>
  );
};
