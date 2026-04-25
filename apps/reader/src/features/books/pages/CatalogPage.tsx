import React from 'react';
import { useCategories } from '../../../hooks/useCategories';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useNavigate } from 'react-router-dom';
import { Library } from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: categories, isLoading } = useCategories({ limit: 100 });

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/search?category=${categoryId}`);
  };

  return (
    <div className="pt-4 space-y-8 pb-10">
      <div className="space-y-1 px-1">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Catalog</h2>
        <p className="text-sm font-medium text-slate-500">Browse collection by categories</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-32 rounded-[28px]" />
          ))}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat: any) => (
            <div 
              key={cat.id} 
              onClick={() => handleCategoryClick(cat.id)}
              className="p-6 bg-white border border-slate-100 rounded-[28px] flex flex-col items-center justify-center text-center shadow-sm active:scale-95 transition-all hover:border-primary/20 hover:shadow-md cursor-pointer group"
            >
              <div className="w-10 h-10 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                 <Library size={20} />
              </div>
              <span className="text-lg font-black text-slate-900 line-clamp-1">{cat.name}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Explore Collection
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-4">
          <div className="text-slate-200 flex justify-center">
             <Library size={64} />
          </div>
          <h3 className="text-lg font-black text-slate-900">No categories found</h3>
        </div>
      )}
    </div>
  );
};
