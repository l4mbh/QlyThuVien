import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button";
import { Eye, Clock, User, Book as BookIcon } from "lucide-react";
import type { Reservation } from "../../reservation.service";
import { format } from "date-fns";

interface ColumnProps {
  onView: (reservation: Reservation) => void;
}

export const getReservationColumns = ({
  onView,
}: ColumnProps): ColumnDef<Reservation>[] => [
  {
    accessorKey: "user",
    header: "Reader",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{user?.name || "Guest"}</span>
          <span className="text-xs text-slate-500 font-medium">{user?.phoneNormalized}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "book",
    header: "Book",
    cell: ({ row }) => {
      const book = row.original.book;
      return (
        <div className="flex flex-col max-w-[200px]">
          <span className="font-bold text-slate-900 truncate">{book.title}</span>
          <span className="text-xs text-primary font-black uppercase tracking-tighter italic">{book.author}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variants: Record<string, string> = {
        PENDING: "bg-orange-100 text-orange-700 border-orange-200",
        READY: "bg-green-100 text-green-700 border-green-200 animate-pulse",
        COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
        CANCELLED: "bg-slate-100 text-slate-500 border-slate-200",
        EXPIRED: "bg-red-100 text-red-700 border-red-200",
      };

      return (
        <Badge variant="outline" className={variants[status] || ""}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined At",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock className="h-3 w-3" />
          <span className="text-xs font-medium">
            {format(new Date(row.original.createdAt), "MMM dd, HH:mm")}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onView(row.original);
            }}
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
