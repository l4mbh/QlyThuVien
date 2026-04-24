import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";
import type { BookFormValues } from "@/schemas/books/book.schema";
import { bookFormSchema } from "@/schemas/books/book.schema";
import type { BookEntity } from "@/types/books/book.entity";
import type { CategoryEntity } from "@/types/category/category.entity";
import { bookService } from "../book.service";
import { toast } from "sonner";
import { Loader2, Search, Info } from "lucide-react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal/confirmation-modal";
import { ErrorCode } from "@qltv/shared";


interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedBook?: BookEntity | null;
  categories: CategoryEntity[];
}

export const BookFormModal: React.FC<BookFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedBook,
  categories,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingIsbn, setIsFetchingIsbn] = useState(false);
  const [isbnInput, setIsbnInput] = useState("");

  // Confirmation states
  const [isConfirmCloseOpen, setIsConfirmCloseOpen] = useState(false);
  const [isConfirmRegenOpen, setIsConfirmRegenOpen] = useState(false);
  const [pendingCategoryId, setPendingCategoryId] = useState("");

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      isbn: "",
      totalQuantity: 1,
      categoryId: "",
      callNumber: "",
      coverUrl: "",
    },
  });

  const watchedCategoryId = form.watch("categoryId");
  const watchedAuthor = form.watch("author");
  const watchedCoverUrl = form.watch("coverUrl");

  // Reset form when modal opens/changes
  useEffect(() => {
    if (isOpen) {
      if (selectedBook) {
        form.reset({
          title: selectedBook.title,
          author: selectedBook.author,
          isbn: selectedBook.isbn,
          totalQuantity: selectedBook.totalQuantity,
          categoryId: selectedBook.categoryId || "",
          callNumber: selectedBook.callNumber || "",
          coverUrl: selectedBook.coverUrl || "",
        });
        setIsbnInput(selectedBook.isbn);
      } else {
        form.reset({
          title: "",
          author: "",
          isbn: "",
          totalQuantity: 1,
          categoryId: "",
          callNumber: "",
          coverUrl: "",
        });
        setIsbnInput("");
      }
    }
  }, [isOpen, selectedBook, form.reset]);

  // Call Number Generation Logic
  const generateCallNumber = useCallback((catId: string, authorName: string) => {
    const category = categories.find((c) => c.id === catId);
    if (!category || !authorName) return "";

    const catCode = category.code || "UNK";
    const authorCode = authorName.substring(0, 3).toUpperCase();
    const year = new Date().getFullYear();
    return `${catCode}.${authorCode}${year}`;
  }, [categories]);

  // Handle Category Change
  const handleCategoryChange = (value: string) => {
    form.setValue("categoryId", value, { shouldDirty: true });

    const newCallNumber = generateCallNumber(value, watchedAuthor);
    if (newCallNumber) {
      if (!form.watch("callNumber")) {
        form.setValue("callNumber", newCallNumber, { shouldDirty: true });
      } else {
        setPendingCategoryId(value);
        setIsConfirmRegenOpen(true);
      }
    }
  };

  const confirmRegenCallNumber = () => {
    const newCallNumber = generateCallNumber(pendingCategoryId, watchedAuthor);
    form.setValue("callNumber", newCallNumber, { shouldDirty: true });
    setIsConfirmRegenOpen(false);
  };

  // Fetch ISBN Info
  const handleFetchIsbn = async () => {
    if (!isbnInput || isbnInput.length < 10) {
      toast.error("Please enter a valid ISBN");
      return;
    }

    setIsFetchingIsbn(true);
    try {
      const response = await bookService.fetchISBN(isbnInput);
      if ((response.code === 0 || response.code === ErrorCode.SUCCESS) && response.data) {
        const { title, author, coverUrl, category: categoryName } = response.data;
        form.setValue("title", title, { shouldDirty: true });
        form.setValue("author", author, { shouldDirty: true });
        form.setValue("isbn", isbnInput, { shouldDirty: true });
        form.setValue("coverUrl", coverUrl || "", { shouldDirty: true });

        if (categoryName) {
          const matchedCategory = categories.find(
            (c) => c.name.toLowerCase() === categoryName.toLowerCase()
          );
          if (matchedCategory) {
            form.setValue("categoryId", matchedCategory.id, { shouldDirty: true });
            form.setValue("callNumber", generateCallNumber(matchedCategory.id, author), { shouldDirty: true });
          }
        }
        toast.success("Book info fetched successfully");
      } else {
        toast.error("Could not find book info for this ISBN");
      }
    } catch (error: any) {
      toast.error(error.message || "Error fetching ISBN info");
    } finally {
      setIsFetchingIsbn(false);
    }
  };

  const onSubmit: SubmitHandler<BookFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      if (selectedBook) {
        if (data.totalQuantity < (selectedBook.totalQuantity - selectedBook.availableQuantity)) {
          toast.error(`Total quantity cannot be less than borrowed books (${selectedBook.totalQuantity - selectedBook.availableQuantity})`);
          setIsSubmitting(false);
          return;
        }

        const response = await bookService.updateBook(selectedBook.id, data);
        if (response.code === 0 || response.code === ErrorCode.SUCCESS) {
          toast.success("Book updated successfully");
          onSuccess();
        }
      } else {
        const response = await bookService.createBook({
          ...data,
          publishedYear: new Date().getFullYear(),
        });
        if (response.code === 0 || response.code === ErrorCode.SUCCESS) {
          toast.success("Book created successfully");
          onSuccess();
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAttempt = () => {
    if (form.formState.isDirty) {
      setIsConfirmCloseOpen(true);
    } else {
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCloseAttempt}>
        <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{selectedBook ? "Edit Book" : "Add New Book"}</DialogTitle>
            <DialogDescription>
              {selectedBook ? "Modify book details and save changes." : "Enter ISBN to fetch info or fill manually."}
            </DialogDescription>
          </DialogHeader>

          {!selectedBook && (
            <div className="flex gap-4 items-start mb-4 bg-muted/30 p-4 rounded-lg border">
              {watchedCoverUrl && (
                <div className="h-24 w-16 bg-muted rounded overflow-hidden flex-shrink-0 border shadow-sm">
                  <img src={watchedCoverUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <Label htmlFor="isbn-fetch">Smart ISBN Fetch</Label>
                <div className="relative">
                  <Input
                    id="isbn-fetch"
                    placeholder="Enter 10 or 13 digit ISBN"
                    value={isbnInput}
                    onChange={(e) => setIsbnInput(e.target.value)}
                    className="pl-9"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex justify-end pt-1">
                  <Button
                    type="button"
                    onClick={handleFetchIsbn}
                    disabled={isFetchingIsbn || !isbnInput}
                    variant="secondary"
                    size="sm"
                  >
                    {isFetchingIsbn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Info className="mr-2 h-4 w-4" />}
                    Fetch Info
                  </Button>
                </div>
              </div>
            </div>
          )}

          {selectedBook && watchedCoverUrl && (
            <div className="flex gap-4 items-center mb-4 p-4 rounded-lg border bg-muted/10">
              <div className="h-20 w-14 bg-muted rounded overflow-hidden flex-shrink-0 border shadow-sm">
                <img src={watchedCoverUrl} alt="Cover" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-medium">Current Book Cover</p>
                <p className="text-xs text-muted-foreground">This image will be displayed in the library catalog.</p>
              </div>
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" {...form.register("title")} className={form.formState.errors.title ? "border-destructive" : ""} />
                {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input id="author" {...form.register("author")} className={form.formState.errors.author ? "border-destructive" : ""} />
                {form.formState.errors.author && <p className="text-xs text-destructive">{form.formState.errors.author.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN *</Label>
                <Input id="isbn" {...form.register("isbn")} className={form.formState.errors.isbn ? "border-destructive" : ""} />
                {form.formState.errors.isbn && <p className="text-xs text-destructive">{form.formState.errors.isbn.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Category *</Label>
                <Select value={watchedCategoryId} onValueChange={handleCategoryChange}>
                  <SelectTrigger id="categoryId" className={form.formState.errors.categoryId ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                    {categories.length === 0 && <SelectItem value="none" disabled>No categories available</SelectItem>}
                  </SelectContent>
                </Select>
                {form.formState.errors.categoryId && <p className="text-xs text-destructive">{form.formState.errors.categoryId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalQuantity">Total Quantity *</Label>
                <Input
                  id="totalQuantity"
                  type="number"
                  {...form.register("totalQuantity", {
                    valueAsNumber: true,
                    onChange: (e) => form.setValue("totalQuantity", parseInt(e.target.value, 10), { shouldDirty: true })
                  })}
                  className={form.formState.errors.totalQuantity ? "border-destructive" : ""}
                />
                {form.formState.errors.totalQuantity && <p className="text-xs text-destructive">{form.formState.errors.totalQuantity.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="callNumber">Call Number *</Label>
                <Input id="callNumber" {...form.register("callNumber")} className={form.formState.errors.callNumber ? "border-destructive" : ""} />
                <div className="flex flex-col gap-0.5">
                  <p className="text-[10px] text-muted-foreground italic">
                    Auto: {watchedCategoryId ? generateCallNumber(watchedCategoryId, watchedAuthor) : "Select category"}
                  </p>
                  <p className="text-[10px] text-primary/70 italic">
                    * Duplicates will automatically get suffixes (e.g., .1, .2)
                  </p>
                </div>
                {form.formState.errors.callNumber && <p className="text-xs text-destructive">{form.formState.errors.callNumber.message}</p>}
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleCloseAttempt}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {selectedBook ? "Save Changes" : "Create Book"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        isOpen={isConfirmCloseOpen}
        onClose={() => setIsConfirmCloseOpen(false)}
        onConfirm={() => {
          setIsConfirmCloseOpen(false);
          onClose();
        }}
        title="Discard Changes"
        description="You have unsaved changes. Are you sure you want to close? All progress will be lost."
        confirmText="Discard"
      />

      <ConfirmationModal
        isOpen={isConfirmRegenOpen}
        onClose={() => setIsConfirmRegenOpen(false)}
        onConfirm={confirmRegenCallNumber}
        title="Regenerate Call Number"
        description="The category has changed. Would you like to regenerate the call number to match the new category?"
        confirmText="Regenerate"
        variant="default"
      />
    </>
  );
};

