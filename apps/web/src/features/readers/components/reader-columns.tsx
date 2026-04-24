import type { ColumnDef } from "@tanstack/react-table";
import type { Reader } from "@/types/reader/reader.entity";
import { ReaderStatus } from "@/types/reader/reader.entity";
import { Badge } from "@/components/ui/badge/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserCheck, UserX, Edit, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReaderColumnProps {
  onEdit: (reader: Reader) => void;
  onBlock: (reader: Reader) => void;
  onView: (reader: Reader) => void;
}

export const getReaderColumns = ({
  onEdit,
  onBlock,
  onView,
}: ReaderColumnProps): ColumnDef<Reader>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as ReaderStatus;
        return (
          <Badge
            variant="outline"
            className={status === ReaderStatus.ACTIVE
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : "bg-destructive/10 text-destructive border-destructive/20"
            }
          >
            {status === ReaderStatus.ACTIVE ? "Active" : "Blocked"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "currentBorrowCount",
      header: "Borrowed",
      cell: ({ row }) => {
        const count = row.original.currentBorrowCount;
        const limit = row.original.borrowLimit;
        const isOverLimit = count >= limit;
        return (
          <div className="flex items-center gap-2">
            <span className={isOverLimit ? "text-destructive font-bold" : ""}>
              {count} / {limit}
            </span>
            {isOverLimit && <Badge variant="secondary" className="text-[10px] h-4">Limit Reached</Badge>}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const reader = row.original;
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
              <DropdownMenuItem onClick={() => onView(reader)}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(reader)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Reader
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onBlock(reader)}
                className={reader.status === ReaderStatus.ACTIVE ? "text-destructive" : "text-primary"}
              >
                {reader.status === ReaderStatus.ACTIVE ? (
                  <>
                    <UserX className="mr-2 h-4 w-4" /> Block Reader
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" /> Unblock Reader
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

