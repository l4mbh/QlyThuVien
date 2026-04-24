import React from "react";
import type { BookEntity } from "@/types/books/book.entity";
import { DataTable } from "@/components/ui/data-table/data-table";
import { createBookColumns } from "../components/book-columns";

interface BookTableProps {
  books: BookEntity[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  limit: number;
  total: number;
  search: string;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onEdit: (book: BookEntity) => void;
  onDelete: (book: BookEntity) => void;
  onAdd: () => void;
  onBulkDelete: (ids: string[]) => void;
  onInventory: (book: BookEntity) => void;
  children?: React.ReactNode;
}

export const BookTable: React.FC<BookTableProps> = ({
  books,
  isLoading,
  page,
  totalPages,
  limit,
  total,
  search,
  onSearchChange,
  onPageChange,
  onLimitChange,
  onEdit,
  onDelete,
  onAdd,
  onBulkDelete,
  onInventory,
  children,
}) => {
  const columns = React.useMemo(
    () => createBookColumns(onEdit, onDelete, onInventory),
    [onEdit, onDelete, onInventory]
  );

  return (
    <DataTable
      columns={columns}
      data={books}
      loading={isLoading}
      page={page}
      totalPages={totalPages}
      limit={limit}
      total={total}
      search={search}
      onSearchChange={onSearchChange}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      onAdd={onAdd}
      onBulkDelete={onBulkDelete}
      searchPlaceholder="Search book title, author, isbn..."
    >
      {children}
    </DataTable>
  );
};

