import React, { useState } from "react";
import { BookTable } from "../book-table/book-table";
import { BookFormModal } from "../book-form-modal/book-form-modal";
import { InventoryManagementModal } from "../components/inventory-management-modal";
import { bookService } from "../book.service";
import type { BookEntity } from "@/types/books/book.entity";
import { Button } from "@/components/ui/button";
import { 
  useAdminBooks, 
  useDeleteBook 
} from "@/hooks/useBooks";
import { useCategories } from "@/hooks/useCategories";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";
import { FilterX, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/ui/confirmation-modal/confirmation-modal";
import { PageHeader } from "@/components/ui/page-header/page-header";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS, ErrorCode } from "@qltv/shared";

export const BooksPage: React.FC = () => {
  const queryClient = useQueryClient();
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Search and Filter State
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // React Query Hooks
  const { 
    data: booksData, 
    isLoading, 
    isFetching,
    refetch 
  } = useAdminBooks({
    page,
    limit,
    search: search || undefined,
    categoryId: categoryId === "all" ? undefined : categoryId,
    available: availability === "all" ? undefined : availability === "in-stock",
    sort: sortBy
  });

  const { data: categoriesData } = useCategories({ limit: 100 });
  const categories = Array.isArray(categoriesData) 
    ? categoriesData 
    : (categoriesData && typeof categoriesData === 'object' && 'items' in categoriesData) 
      ? categoriesData.items 
      : [];

  const deleteMutation = useDeleteBook();

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookEntity | null>(null);

  // Archive State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<BookEntity | null>(null);

  // Inventory Modal State
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [inventoryBook, setInventoryBook] = useState<BookEntity | null>(null);

  // Bulk Delete State
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleRefresh = () => {
    refetch();
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategoryId("all");
    setAvailability("all");
    setSortBy("newest");
    setPage(1);
  };

  const handleAddBook = () => {
    setSelectedBook(null);
    setIsFormOpen(true);
  };

  const handleEditBook = (book: BookEntity) => {
    setSelectedBook(book);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (book: BookEntity) => {
    setBookToDelete(book);
    setIsDeleteModalOpen(true);
  };

  const handleInventoryClick = (book: BookEntity) => {
    setInventoryBook(book);
    setIsInventoryModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;
    deleteMutation.mutate(bookToDelete.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setBookToDelete(null);
      }
    });
  };

  const handleBulkDelete = (ids: string[]) => {
    setSelectedIds(ids);
    setIsBulkDeleteModalOpen(true);
  };

  const books = booksData?.items || [];
  const total = booksData?.meta?.total || 0;
  const totalPages = booksData?.meta?.totalPages || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader />

      <BookTable
        books={books}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        limit={limit}
        total={total}
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onEdit={handleEditBook}
        onDelete={handleDeleteClick}
        onInventory={handleInventoryClick}
        onAdd={handleAddBook}
        onBulkDelete={handleBulkDelete}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Select value={categoryId} onValueChange={(val) => { setCategoryId(val); setPage(1); }}>
            <SelectTrigger className="w-[180px] h-10 border-muted-foreground/20">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={availability} onValueChange={(val) => { setAvailability(val); setPage(1); }}>
            <SelectTrigger className="w-[140px] h-10 border-muted-foreground/20">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(val) => { setSortBy(val); setPage(1); }}>
            <SelectTrigger className="w-[140px] h-10 border-muted-foreground/20">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="az">A-Z Title</SelectItem>
              <SelectItem value="author">Author Name</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handleResetFilters} title="Reset filters" className="h-10 w-10 text-muted-foreground hover:text-primary">
              <FilterX className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleRefresh} className={`h-10 w-10 text-muted-foreground hover:text-primary ${isFetching ? "animate-spin" : ""}`} title="Refresh data">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </BookTable>

      <BookFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          setIsFormOpen(false);
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS.LIST] });
        }}
        selectedBook={selectedBook}
        categories={categories}
      />

      <InventoryManagementModal
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        book={inventoryBook}
        onSuccess={() => {
          setIsInventoryModalOpen(false);
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS.LIST] });
        }}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Book"
        description={`Are you sure you want to delete "${bookToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />

      <ConfirmationModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={async () => {
          try {
            const response = await bookService.bulkDelete(selectedIds);
            if (response.code === 0 || response.code === ErrorCode.SUCCESS) {
              toast.success(`Successfully deleted ${selectedIds.length} books`);
              setIsBulkDeleteModalOpen(false);
              setSelectedIds([]);
              queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS.LIST] });
            }
          } catch (error: any) {
            toast.error(error.message || "Failed to delete books");
          }
        }}
        title="Bulk Delete Books"
        description={`Are you sure you want to delete ${selectedIds.length} books? This action cannot be undone.`}
        confirmText="Delete All"
        variant="destructive"
      />
    </div>
  );
};
