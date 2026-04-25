import React from 'react';
import { Search } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="py-6 md:py-12 space-y-4 md:space-y-6">
      <div className="space-y-1 md:space-y-2">
        <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
          Find your next book
        </h1>
        <p className="text-slate-500 text-sm md:text-lg">
          Explore thousands of titles in our library collection
        </p>
      </div>

      <div className="relative group max-w-2xl">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
          <Search size={20} className="md:w-6 md:h-6" />
        </div>
        <input
          type="text"
          placeholder="Search by title, author or ISBN..."
          className="w-full h-14 md:h-16 pl-12 md:pl-14 pr-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-base md:text-lg placeholder:text-slate-400"
        />
      </div>
    </section>
  );
};
