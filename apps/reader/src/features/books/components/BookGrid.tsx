import React from 'react';

interface BookGridProps {
  children: React.ReactNode;
}

export const BookGrid: React.FC<BookGridProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 py-2">
      {children}
    </div>
  );
};
