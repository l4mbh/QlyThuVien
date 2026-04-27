import React from 'react';
import { Loader2, Library } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LoaderProps {
  fullPage?: boolean;
  message?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ 
  fullPage = false, 
  message = "Loading magic...", 
  className 
}) => {
  const content = (
    <div className={cn(
      "flex flex-col items-center justify-center gap-4 p-8",
      className
    )}>
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
        <div className="relative bg-white p-5 rounded-[24px] shadow-2xl border border-primary/10">
          <Library className="w-10 h-10 text-primary animate-bounce" />
          <Loader2 className="absolute -bottom-1 -right-1 w-5 h-5 text-primary animate-spin" />
        </div>
      </div>
      
      {message && (
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-bold text-slate-900 tracking-tight">{message}</p>
          <div className="flex gap-1">
             <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
             <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
             <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
          </div>
        </div>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[100] glass flex items-center justify-center backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
};
