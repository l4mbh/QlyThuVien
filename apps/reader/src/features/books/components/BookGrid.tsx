import React from 'react';
import { BookCard } from './BookCard';

interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  status: 'available' | 'out_of_stock';
}

interface BookGridProps {
  books: Book[];
  onBookClick: (book: Book) => void;
}

export const BookGrid: React.FC<BookGridProps> = ({ books, onBookClick }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 py-2">
      {books.map((book) => (
        <BookCard
          key={book.id}
          title={book.title}
          author={book.author}
          coverUrl={book.coverUrl}
          status={book.status}
          onClick={() => onBookClick(book)}
        />
      ))}
    </div>
  );
};
