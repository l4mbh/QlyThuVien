import React, { useState, useEffect } from 'react';
import { keepPreviousData } from '@tanstack/react-query';
import { HeroSection } from '../components/HeroSection';
import { CategoryBar } from '../components/CategoryBar';
import { BookCard } from '../../books/components/BookCard';
import { BookGrid } from '../../books/components/BookGrid';
import { BookDetailModal } from '../../books/components/BookDetailModal';
import { useBooks } from '../../../hooks/useBooks';
import { Skeleton } from '../../../components/ui/Skeleton';

export const HomePage: React.FC = () => {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    if (!search) {
      setDebouncedSearch('');
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Use React Query Hook with params
  const { data: booksData, isLoading, isFetching, isPlaceholderData } = useBooks(
    {
      search: debouncedSearch || undefined,
      categoryId: categoryId || undefined
    },
    {
      placeholderData: search ? keepPreviousData : undefined
    }
  );
  
  const books = booksData?.items || [];

  const handleBookClick = (book: any) => {
    setSelectedBookId(book.id);
  };

  return (
    <div className="space-y-2">
      <HeroSection 
        searchValue={search} 
        onSearchChange={setSearch} 
      />
      <CategoryBar 
        onCategoryChange={setCategoryId} 
      />
      
      <section className="py-3">
        <div className="flex items-center justify-between mb-4 px-0.5">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            {debouncedSearch || categoryId ? 'Search Results' : 'Recommended'}
          </h2>
          {!debouncedSearch && !categoryId && (
            <button className="text-xs font-medium text-primary hover:underline">See all</button>
          )}
        </div>
        
        {/* Show skeletons if first time loading */}
        {(isLoading && !booksData) ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative min-h-[200px]">
            {isFetching && (
              <div className="absolute inset-0 z-10 glass-subtle flex items-center justify-center rounded-3xl backdrop-blur-[1px] transition-all">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Refreshing...</span>
                </div>
              </div>
            )}
            
            {books.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <p className="text-muted-foreground">No books found matching your criteria.</p>
                <button 
                  onClick={() => { setSearch(''); setCategoryId(null); }}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <BookGrid>
                {books.map((book: any) => (
                  <BookCard 
                    key={book.id}
                    title={book.title}
                    author={book.author}
                    coverUrl={book.coverUrl}
                    status={book.availableQuantity > 0 ? 'available' : 'out_of_stock'}
                    onClick={() => handleBookClick(book)}
                  />
                ))}
              </BookGrid>
            )}
          </div>
        )}
      </section>

      <BookDetailModal
        bookId={selectedBookId}
        onClose={() => {
          setSelectedBookId(null);
        }}
      />
    </div>
  );
};
