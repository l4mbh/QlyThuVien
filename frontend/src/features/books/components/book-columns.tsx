import type { ColumnDef } from "@tanstack/react-table";
import type { BookEntity } from "@/types/books/book.entity";
import { Pencil, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge/badge";

export const createBookColumns = (
  onEdit: (book: BookEntity) => void,
  onDelete: (book: BookEntity) => void
): ColumnDef<BookEntity>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          className="translate-y-[2px] h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="translate-y-[2px] h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(!!e.target.checked)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Book Details",
      cell: ({ row }) => {
        const book = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-12 w-9 rounded bg-muted flex items-center justify-center overflow-hidden border border-muted-foreground/10 flex-shrink-0">
              {book.coverUrl ? (
                <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
              ) : (
                <BookOpen className="h-5 w-5 text-muted-foreground/50" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-foreground truncate">{book.title}</span>
              <span className="text-xs text-muted-foreground truncate">{book.author}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "isbn",
      header: "ISBN",
      cell: ({ row }) => <span className="text-sm font-mono">{row.getValue("isbn") || "N/A"}</span>,
    },
    {
      accessorKey: "callNumber",
      header: "Call Number",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono text-[10px] bg-muted/50 border-muted-foreground/10 uppercase">
          {row.getValue("callNumber") || "N/A"}
        </Badge>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.original.category;
        return category ? (
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            {category.name}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: "Availability",
      cell: ({ row }) => {
        const book = row.original;
        const ratio = book.availableQuantity / book.totalQuantity;
        let statusColor = "bg-green-500";
        if (ratio === 0) statusColor = "bg-red-500";
        else if (ratio < 0.2) statusColor = "bg-orange-500";

        return (
          <div className="flex flex-col gap-1.5 w-24">
            <div className="flex justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              <span>{book.availableQuantity} / {book.totalQuantity}</span>
              <span>{Math.round(ratio * 100)}%</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${statusColor} transition-all duration-500`}
                style={{ width: `${ratio * 100}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const book = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => onEdit(book)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(book)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
