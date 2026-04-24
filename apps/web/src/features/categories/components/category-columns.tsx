import type { ColumnDef } from "@tanstack/react-table";
import type { CategoryEntity } from "@/types/category/category.entity";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const createCategoryColumns = (
  onEdit: (category: CategoryEntity) => void,
  onDelete: (category: CategoryEntity) => void
): ColumnDef<CategoryEntity>[] => [
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
      accessorKey: "name",
      header: "Category Name",
      cell: ({ row }) => <span className="font-medium text-foreground">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => <code className="px-2 py-1 bg-muted rounded text-xs font-mono">{row.getValue("code") || "N/A"}</code>,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <span className="text-muted-foreground">{date.toLocaleDateString('en-US')}</span>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => onEdit(category)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(category)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

