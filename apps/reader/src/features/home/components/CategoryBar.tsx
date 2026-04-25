import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { useCategories } from '../../../hooks/useCategories';
import { Skeleton } from '../../../components/ui/Skeleton';

interface CategoryBarProps {
  onCategoryChange?: (categoryId: string | null) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({ onCategoryChange }) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const { data: categories, isLoading } = useCategories();

  const handleSelect = (categoryId: string | null) => {
    setActiveCategoryId(categoryId);
    onCategoryChange?.(categoryId);
  };

  return (
    <section className="space-y-2.5">
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-0.5">Browse</h2>
      
      <div className="flex overflow-x-auto pb-3 gap-2 no-scrollbar -mx-4 px-4">
        <button
          onClick={() => handleSelect(null)}
          className={cn(
            "whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 border",
            activeCategoryId === null
              ? "bg-primary text-white border-primary shadow-sm shadow-primary/15"
              : "glass-subtle text-muted-foreground border-border/50 hover:text-foreground hover:border-border"
          )}
        >
          All
        </button>

        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-xl flex-shrink-0" />
          ))
        ) : (
          categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 border",
                activeCategoryId === cat.id
                  ? "bg-primary text-white border-primary shadow-sm shadow-primary/15"
                  : "glass-subtle text-muted-foreground border-border/50 hover:text-foreground hover:border-border"
              )}
            >
              {cat.name}
            </button>
          ))
        )}
      </div>
    </section>
  );
};
