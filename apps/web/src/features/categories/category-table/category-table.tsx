import React from "react";
import type { CategoryEntity } from "@/types/category/category.entity";
import { DataTable } from "@/components/ui/data-table/data-table";
import { createCategoryColumns } from "../components/category-columns";

interface CategoryTableProps {
  categories: CategoryEntity[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  limit: number;
  total: number;
  search: string;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onEdit: (category: CategoryEntity) => void;
  onDelete: (category: CategoryEntity) => void;
  onAdd: () => void;
  onBulkDelete: (ids: string[]) => void;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  isLoading,
  page,
  totalPages,
  limit,
  total,
  search,
  onSearchChange,
  onPageChange,
  onLimitChange,
  onEdit,
  onDelete,
  onAdd,
  onBulkDelete,
}) => {
  const columns = React.useMemo(
    () => createCategoryColumns(onEdit, onDelete),
    [onEdit, onDelete]
  );

  return (
    <DataTable
      columns={columns}
      data={categories}
      loading={isLoading}
      page={page}
      totalPages={totalPages}
      limit={limit}
      total={total}
      search={search}
      onSearchChange={onSearchChange}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      onAdd={onAdd}
      onBulkDelete={onBulkDelete}
      searchPlaceholder="Search category name or code..."
    />
  );
};

