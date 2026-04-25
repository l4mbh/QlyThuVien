import React, { useState } from 'react';
import { cn } from '../../../lib/utils';

const categories = [
  'All Books',
  'Fiction',
  'Technology',
  'Science',
  'History',
  'Biography',
  'Philosophy',
  'Art'
];

export const CategoryBar: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All Books');

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Categories</h2>
        <button className="text-xs font-medium text-primary hover:underline">View all</button>
      </div>
      
      <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar -mx-4 px-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border",
              activeCategory === category
                ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-105"
                : "bg-white text-slate-600 border-slate-200 hover:border-primary/30 hover:bg-slate-50"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
};
