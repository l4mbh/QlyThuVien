import React from 'react';
import { Search } from 'lucide-react';

interface HeroSectionProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ searchValue, onSearchChange }) => {
  return (
    <section className="pt-5 pb-2 md:pt-8 md:pb-4 space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Discover Books
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Explore our collection
        </p>
      </div>

      <div className="relative group max-w-2xl">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search title, author or ISBN..."
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full h-12 md:h-13 pl-11 pr-4 glass-subtle rounded-2xl border border-border/60 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 transition-all text-sm md:text-base placeholder:text-muted-foreground/60"
        />
      </div>
    </section>
  );
};
