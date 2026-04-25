import React, { useState, useMemo } from 'react';
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
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const { data: booksData, isLoading } = useBooks({
    search: initialSearch || undefined,
    categoryId: initialCategory || undefined,
    limit: 50
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: any = {};
    if (searchValue) params.q = searchValue;
    if (initialCategory) params.category = initialCategory;
    setSearchParams(params);
  };

  const clearSearch = () => {
    setSearchValue('');
    const params: any = {};
    if (initialCategory) params.category = initialCategory;
    setSearchParams(params);
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

      <form onSubmit={handleSearch} className="relative group">
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

      {isLoading ? (
        <BookGrid>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4 rounded-lg" />
              <Skeleton className="h-3 w-1/2 rounded-lg" />
            </div>
          ))}
        </BookGrid>
      ) : books.length > 0 ? (
        <BookGrid>
          {books.map((book: any) => (
            <BookCard 
              key={book.id}
              title={book.title}
              author={book.author}
              coverUrl={book.coverUrl}
              status={book.availableCount > 0 ? 'available' : 'out_of_stock'}
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

      {selectedBookId && (
        <BookDetailModal 
          bookId={selectedBookId} 
          onClose={() => setSelectedBookId(null)} 
        />
      )}
    </div>
  );
};
