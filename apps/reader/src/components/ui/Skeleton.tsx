import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-slate-100 rounded-md",
        className
      )}
    />
  );
};

export const BookSkeleton: React.FC = () => (
  <div className="space-y-3">
    <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
  </div>
);

export const NotificationSkeleton: React.FC = () => (
  <div className="flex gap-4 py-4">
    <Skeleton className="w-10 h-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
);
