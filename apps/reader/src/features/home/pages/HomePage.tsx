import React, { useState } from 'react';
import { HeroSection } from '../components/HeroSection';
import { CategoryBar } from '../components/CategoryBar';
import { BookCard } from '../../books/components/BookCard';
import { BookGrid } from '../../books/components/BookGrid';
import { BookDetailModal } from '../../books/components/BookDetailModal';
import { useBooks } from '../../../hooks/useBooks';
import { Skeleton } from '../../../components/ui/Skeleton';

export const HomePage: React.FC = () => {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  // Use React Query Hook
  const { data: booksData, isLoading } = useBooks();
  const books = booksData?.items || [];

  const handleBookClick = (book: any) => {
    setSelectedBookId(book.id);
  };

  return (
    <div className="space-y-2">
      <HeroSection />
      <CategoryBar />
      
      <section className="py-3">
        <div className="flex items-center justify-between mb-4 px-0.5">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Recommended</h2>
          <button className="text-xs font-medium text-primary hover:underline">See all</button>
        </div>
        
        {isLoading ? (
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
