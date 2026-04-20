import React, { useEffect, useState, useCallback } from "react";
import { BookTable } from "../book-table/book-table";
import { BookFormModal } from "../book-form-modal/book-form-modal";
import { bookService } from "../book.service";
import type { BookEntity } from "@/types/books/book.entity";
import type { CategoryEntity } from "@/types/category/category.entity";
import { Button } from "@/components/ui/button";
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

export const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<BookEntity[]>([]);
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Search and Filter State
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookEntity | null>(null);

  // Archive State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<BookEntity | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Bulk Delete State
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const [booksRes, categoriesRes] = await Promise.all([
        bookService.getBooks({
          page,
          limit,
          search: search || undefined,
          categoryId: categoryId === "all" ? undefined : categoryId,
          available: availability === "all" ? undefined : availability === "in-stock",
          sort: sortBy
        }),
        bookService.getCategories({ limit: 100 }),
      ]);

      if (booksRes.code === 0 && booksRes.data) {
        setBooks(booksRes.data.items);
        setTotal(booksRes.data.meta.total);
        setTotalPages(booksRes.data.meta.totalPages);
      }
      if (categoriesRes.code === 0 && categoriesRes.data) {
        const categoriesData = categoriesRes.data;
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else if (categoriesData && typeof categoriesData === 'object' && 'items' in categoriesData) {
          setCategories(categoriesData.items || []);
        } else {
          setCategories([]);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [page, limit, search, categoryId, availability, sortBy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData(false);
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

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;
    setIsDeleting(true);
    try {
      const response = await bookService.deleteBook(bookToDelete.id);
      if (response.code === 0) {
        toast.success("Book deleted successfully");
        setIsDeleteModalOpen(false);
        fetchData(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete book");
    } finally {
      setIsDeleting(false);
      setBookToDelete(null);
    }
  };

  const handleBulkDelete = (ids: string[]) => {
    setSelectedIds(ids);
    setIsBulkDeleteModalOpen(true);
  };

  return (
    <div className="container mx-auto py-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Book Management</h1>
          <p className="text-muted-foreground">Manage your library inventory, categories, and shelf locations.</p>
        </div>
      </div>

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
              {categories.map((cat) => (
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
            <Button variant="ghost" size="icon" onClick={handleRefresh} className={`h-10 w-10 text-muted-foreground hover:text-primary ${isRefreshing ? "animate-spin" : ""}`} title="Refresh data">
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
          fetchData(false);
        }}
        selectedBook={selectedBook}
        categories={categories}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Book"
        description={`Are you sure you want to delete "${bookToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        isLoading={isDeleting}
      />

      <ConfirmationModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={async () => {
          try {
            const response = await bookService.bulkDeleteBooks(selectedIds);
            if (response.code === 0) {
              toast.success(`Successfully deleted ${selectedIds.length} books`);
              setIsBulkDeleteModalOpen(false);
              setSelectedIds([]);
              fetchData(false);
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
