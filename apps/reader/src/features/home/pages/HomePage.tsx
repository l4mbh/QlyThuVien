import React, { useState } from 'react';
import { HeroSection } from '../components/HeroSection';
import { CategoryBar } from '../components/CategoryBar';
import { BookGrid } from '../../books/components/BookGrid';
import { BookDetailModal } from '../../books/components/BookDetailModal';

// Mock data updated with Call Number and Category
const MOCK_BOOKS = [
  { 
    id: '1', 
    title: 'The Great Gatsby', 
    author: 'F. Scott Fitzgerald', 
    status: 'available' as const, 
    category: 'Fiction',
    callNumber: 'FIC-FITZ-001',
    description: 'A classic novel of the Jazz Age, exploring themes of wealth, class, and the American Dream.'
  },
  { 
    id: '2', 
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship', 
    author: 'Robert C. Martin', 
    status: 'available' as const, 
    category: 'Technology',
    callNumber: 'TECH-MART-102',
    description: 'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees.'
  },
  { 
    id: '3', 
    title: 'Thinking, Fast and Slow', 
    author: 'Daniel Kahneman', 
    status: 'out_of_stock' as const, 
    category: 'Psychology',
    callNumber: 'PSY-KAHN-55',
    description: 'A masterpiece of psychology and behavioral economics that explains how we think.'
  },
  { 
    id: '4', 
    title: 'The Silent Patient', 
    author: 'Alex Michaelides', 
    status: 'available' as const, 
    category: 'Thriller',
    callNumber: 'THRI-MICH-09',
    description: 'A shocking psychological thriller about a woman’s act of violence against her husband—and the therapist obsessed with uncovering her motive.'
  },
  { 
    id: '5', 
    title: 'Atomic Habits', 
    author: 'James Clear', 
    status: 'available' as const, 
    category: 'Self-Help',
    callNumber: 'SELF-CLEA-21',
    description: 'An easy and proven way to build good habits and break bad ones.'
  },
  { 
    id: '6', 
    title: 'Sapiens: A Brief History of Humankind', 
    author: 'Yuval Noah Harari', 
    status: 'available' as const, 
    category: 'History',
    callNumber: 'HIST-HARA-01',
    description: 'From a renowned historian comes a groundbreaking narrative of humanity’s creation and evolution.'
  },
];

export const HomePage: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<typeof MOCK_BOOKS[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookClick = (book: typeof MOCK_BOOKS[0]) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-2">
      <HeroSection />
      <CategoryBar />
      
      <section className="py-4">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recommended for you</h2>
          <button className="text-xs font-bold text-primary hover:underline">See all</button>
        </div>
        
        <BookGrid 
          books={MOCK_BOOKS} 
          onBookClick={handleBookClick} 
        />
      </section>

      <BookDetailModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
