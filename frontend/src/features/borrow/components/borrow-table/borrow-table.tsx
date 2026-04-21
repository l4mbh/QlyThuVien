import React from "react";
import type { BorrowRecord } from "@/types/borrow/borrow.entity";
import { DataTable } from "@/components/ui/data-table/data-table";
import { getBorrowColumns } from "../borrow-columns";

interface BorrowTableProps {
  borrows: BorrowRecord[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  limit: number;
  total: number;
  search: string;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onView: (record: BorrowRecord) => void;
  onAdd: () => void;
  children?: React.ReactNode;
}

export const BorrowTable: React.FC<BorrowTableProps> = ({
  borrows,
  isLoading,
  page,
  totalPages,
  limit,
  total,
  search,
  onSearchChange,
  onPageChange,
  onLimitChange,
  onView,
  onAdd,
  children,
}) => {
  const columns = React.useMemo(
    () => getBorrowColumns({ onView }),
    [onView]
  );

  return (
    <DataTable
      columns={columns}
      data={borrows}
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
      searchPlaceholder="Search reader name, email..."
    >
      {children}
    </DataTable>
  );
};
