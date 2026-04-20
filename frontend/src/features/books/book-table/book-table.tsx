import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button";
import type { BookEntity } from "@/types/books/book.entity";
import { Edit, Archive, Book as BookIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton/skeleton";

interface BookTableProps {
  books: BookEntity[];
  isLoading: boolean;
  onEdit: (book: BookEntity) => void;
  onArchive: (book: BookEntity) => void;
}

export const BookTable: React.FC<BookTableProps> = ({
  books,
  isLoading,
  onEdit,
  onArchive,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-12 w-8" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-md border border-dashed bg-muted/50 text-center">
        <BookIcon className="h-12 w-12 text-muted-foreground opacity-20" />
        <h3 className="mt-4 text-lg font-semibold">No books yet</h3>
        <p className="text-sm text-muted-foreground">Add some books to your library to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card/50 backdrop-blur-sm">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id} className="hover:bg-accent/50 transition-colors">
                <TableCell>
                  <div className="h-12 w-9 overflow-hidden rounded bg-muted flex items-center justify-center border">
                    {book.coverUrl ? (
                      <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
                    ) : (
                      <BookIcon className="h-5 w-5 text-muted-foreground/50" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{book.title}</span>
                    <span className="text-xs text-muted-foreground font-normal">{book.isbn}</span>
                  </div>
                </TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {book.category?.name || "Unknown"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{book.availableQuantity}/{book.totalQuantity}</span>
                    {book.availableQuantity > 0 ? (
                      <Badge variant="success" className="h-1.5 w-1.5 p-0" />
                    ) : (
                      <Badge variant="destructive" className="h-1.5 w-1.5 p-0" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(book)} title="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onArchive(book)} title="Archive" className="text-destructive hover:text-destructive">
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden grid grid-cols-1 gap-4 p-4">
        {books.map((book) => (
          <div key={book.id} className="flex flex-col gap-4 rounded-lg border bg-background/50 p-4 shadow-sm">
            <div className="flex gap-4">
              <div className="h-20 w-14 flex-shrink-0 overflow-hidden rounded bg-muted flex items-center justify-center border">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
                ) : (
                  <BookIcon className="h-8 w-8 text-muted-foreground/50" />
                )}
              </div>
              <div className="flex flex-col justify-center gap-1">
                <h4 className="font-semibold leading-tight">{book.title}</h4>
                <p className="text-xs text-muted-foreground">{book.author}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px] h-5">
                    {book.category?.name || "Unknown"}
                  </Badge>
                  <span className="text-xs font-medium">
                    {book.availableQuantity}/{book.totalQuantity} in stock
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t pt-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(book)} className="flex-1">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => onArchive(book)} className="flex-1 text-destructive hover:bg-destructive/10">
                <Archive className="mr-2 h-4 w-4" /> Archive
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
