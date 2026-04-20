import React, { useEffect, useState, useCallback } from "react";
import { BookTable } from "../book-table/book-table";
import { BookFormModal } from "../book-form-modal/book-form-modal";
import { bookService } from "../book.service";
import type { BookEntity } from "@/types/books/book.entity";
import type { CategoryEntity } from "@/types/category/category.entity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";
import { Plus, Search, FilterX, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/ui/confirmation-modal/confirmation-modal";

export const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<BookEntity[]>([]);
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search and Filter State
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookEntity | null>(null);

  // Archive State
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [bookToArchive, setBookToArchive] = useState<BookEntity | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const [booksRes, categoriesRes] = await Promise.all([
        bookService.getBooks({
          search: search || undefined,
          categoryId: categoryId === "all" ? undefined : categoryId,
          available: availability === "all" ? undefined : availability === "in-stock",
          sort: sortBy
        }),
        bookService.getCategories(),
      ]);

      if (booksRes.code === 0) setBooks(booksRes.data || []);
      if (categoriesRes.code === 0) setCategories(categoriesRes.data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [search, categoryId, availability, sortBy]);

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
  };

  const handleAddBook = () => {
    setSelectedBook(null);
    setIsFormOpen(true);
  };

  const handleEditBook = (book: BookEntity) => {
    setSelectedBook(book);
    setIsFormOpen(true);
  };

  const handleArchiveClick = (book: BookEntity) => {
    setBookToArchive(book);
    setIsArchiveModalOpen(true);
  };

  const handleConfirmArchive = async () => {
    if (!bookToArchive) return;
    setIsArchiving(true);
    try {
      const response = await bookService.deleteBook(bookToArchive.id);
      if (response.code === 0) {
        toast.success("Book archived successfully");
        setIsArchiveModalOpen(false);
        fetchData(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to archive book");
    } finally {
      setIsArchiving(false);
      setBookToArchive(null);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Book Management</h1>
          <p className="text-muted-foreground">Manage your library inventory, categories, and shelf locations.</p>
        </div>
        <Button onClick={handleAddBook} className="shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" /> Add New Book
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-card/30 p-4 rounded-xl border backdrop-blur-sm">
        <div className="lg:col-span-1">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search title, author..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={availability} onValueChange={setAvailability}>
          <SelectTrigger>
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="az">A-Z Title</SelectItem>
              <SelectItem value="author">Author Name</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={handleResetFilters} title="Reset filters">
            <FilterX className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleRefresh} className={isRefreshing ? "animate-spin" : ""} title="Refresh data">
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <BookTable
        books={books}
        isLoading={isLoading}
        onEdit={handleEditBook}
        onArchive={handleArchiveClick}
      />

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
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        onConfirm={handleConfirmArchive}
        title="Archive Book"
        description={`Are you sure you want to archive "${bookToArchive?.title}"? This will mark the book as unavailable for borrowing.`}
        confirmText="Archive"
        isLoading={isArchiving}
      />
    </div>
  );
};
