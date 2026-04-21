import type { ColumnDef } from "@tanstack/react-table";
import type { BorrowRecord } from "@/types/borrow/borrow.entity";
import { BorrowRecordStatus } from "@/types/borrow/borrow.entity";
import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { calculateOverdue } from "../utils/fine-utils";

interface BorrowColumnProps {
  onView: (record: BorrowRecord) => void;
}

export const getBorrowColumns = ({
  onView,
}: BorrowColumnProps): ColumnDef<BorrowRecord>[] => [
    {
      accessorKey: "user",
      header: "Reader",
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{user?.name || "Unknown"}</span>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
          </div>
        );
      },
    },
    {
      id: "booksCount",
      header: "Books",
      cell: ({ row }) => {
        const count = row.original.borrowItems?.length || 0;
        return <div className="font-medium text-center">{count}</div>;
      },
    },
    {
      accessorKey: "borrowDate",
      header: "Borrow Date",
      cell: ({ row }) => format(new Date(row.getValue("borrowDate")), "dd MMM yyyy"),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => {
        const record = row.original;
        const dueDate = new Date(row.getValue("dueDate"));
        
        // For display, we check if it's currently overdue
        const { isOverdue, days } = calculateOverdue(dueDate, record.status === BorrowRecordStatus.COMPLETED ? record.updatedAt : null);
        const isActuallyOverdue = isOverdue && record.status !== BorrowRecordStatus.COMPLETED;

        return (
          <div className="flex flex-col">
            <span className={isActuallyOverdue ? "text-destructive font-bold" : ""}>
              {format(dueDate, "dd MMM yyyy")}
            </span>
            {isActuallyOverdue && (
              <span className="text-[10px] text-destructive font-bold uppercase tracking-tight">
                {days} days trễ
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const record = row.original;
        const dueDate = new Date(record.dueDate);
        const { isOverdue } = calculateOverdue(dueDate, record.status === BorrowRecordStatus.COMPLETED ? record.updatedAt : null);
        
        const status = record.status;
        const displayStatus = (isOverdue && status !== BorrowRecordStatus.COMPLETED) ? BorrowRecordStatus.OVERDUE : status;

        let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
        let className = "";

        switch (displayStatus) {
          case BorrowRecordStatus.COMPLETED:
            variant = "outline";
            className = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 capitalize";
            break;
          case BorrowRecordStatus.OVERDUE:
            variant = "destructive";
            className = "capitalize animate-pulse";
            break;
          case BorrowRecordStatus.BORROWING:
            variant = "secondary";
            className = "bg-blue-500/10 text-blue-600 border-blue-500/20 capitalize";
            break;
        }

        return (
          <Badge variant={variant} className={className}>
            {displayStatus.toLowerCase()}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const record = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onView(record)}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
