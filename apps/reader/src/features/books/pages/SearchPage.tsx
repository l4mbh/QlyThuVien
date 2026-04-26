import React, { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useBooks } from '../../../hooks/useBooks';
import { BookCard } from '../components/BookCard';
import { BookGrid } from '../components/BookGrid';
import { BookDetailModal } from '../components/BookDetailModal';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Search as SearchIcon, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  
  const [searchValue, setSearchValue] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  // Debounce search value
  useEffect(() => {
    if (!searchValue) {
      setDebouncedSearch('');
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Sync searchValue when URL params change (e.g. browser back/forward)
  useEffect(() => {
    const q = searchParams.get('q') || '';
    if (q !== searchValue) {
      setSearchValue(q);
    }
  }, [searchParams]);

  // Sync URL with debounced search
  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    const currentCat = searchParams.get('category') || '';
    
    // Only update if values actually changed to avoid infinite loops
    if (debouncedSearch !== currentQ || initialCategory !== currentCat) {
      const params: any = {};
      if (debouncedSearch) params.q = debouncedSearch;
      if (initialCategory) params.category = initialCategory;
      setSearchParams(params, { replace: true });
    }
  }, [debouncedSearch, initialCategory, searchParams, setSearchParams]);

  const { data: booksData, isLoading, isFetching, isPlaceholderData } = useBooks(
    {
      search: debouncedSearch || undefined,
      categoryId: initialCategory || undefined,
      limit: 50
    },
    {
      placeholderData: searchValue ? keepPreviousData : undefined
    }
  );

  const clearSearch = () => {
    setSearchValue('');
  };

  const books = booksData?.items || [];

  return (
    <div className="pt-4 space-y-8 pb-10">
      <div className="space-y-1 px-1">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Search</h2>
        <p className="text-sm font-medium text-slate-500">
          {initialCategory ? `Browsing books in category` : 'Quickly find titles, authors or ISBN'}
        </p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-primary transition-colors">
          <SearchIcon size={20} />
        </div>
        <input 
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search library..."
          className="w-full h-16 bg-white border border-slate-200 rounded-2xl px-14 flex items-center text-slate-900 font-bold shadow-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300 placeholder:italic placeholder:font-medium"
        />
        {searchValue && (
          <button 
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </form>

      {/* Show skeletons if:
          1. First time loading (isLoading && !booksData)
          2. Just cleared search and waiting for full list (isFetching && !searchValue && isPlaceholderData)
      */}
      {(isLoading && !booksData) || (isFetching && !searchValue && isPlaceholderData) ? (
        <BookGrid>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4 rounded-lg" />
              <Skeleton className="h-3 w-1/2 rounded-lg" />
            </div>
          ))}
        </BookGrid>
      ) : (
        <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
          {books.length > 0 ? (
            <BookGrid>
              {books.map((book: any) => (
                <BookCard 
                  key={book.id}
                  title={book.title}
                  author={book.author}
                  coverUrl={book.coverUrl}
                  status={(book.effectiveAvailable ?? book.availableQuantity) > 0 ? 'available' : 'out_of_stock'}
                  queueCount={book.queueCount}
                  onClick={() => setSelectedBookId(book.id)}
                />
              ))}
            </BookGrid>
          ) : (
            <div className="text-center py-20 space-y-4">
              <div className="text-slate-200 flex justify-center">
                 <SearchIcon size={64} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">No books found</h3>
                <p className="text-sm font-medium text-slate-500 max-w-[240px] mx-auto">
                  Try searching with different keywords or categories.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedBookId && (
        <BookDetailModal 
          bookId={selectedBookId} 
          onClose={() => setSelectedBookId(null)} 
        />
      )}
    </div>
  );
};
