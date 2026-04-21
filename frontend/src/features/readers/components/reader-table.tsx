import React, { useMemo } from "react";
import type { Reader } from "@/types/reader/reader.entity";
import { DataTable } from "@/components/ui/data-table/data-table";
import { getReaderColumns } from "./reader-columns";

interface ReaderTableProps {
  readers: Reader[];
  isLoading: boolean;
  onEdit: (reader: Reader) => void;
  onBlock: (reader: Reader) => void;
  onView: (reader: Reader) => void;
  onAdd: () => void;
  onBulkDelete?: (ids: string[]) => void;
  search: string;
  onSearchChange: (value: string) => void;
  // Common DataTable props
  page: number;
  totalPages: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  children?: React.ReactNode;
}

export const ReaderTable: React.FC<ReaderTableProps> = ({
  readers,
  isLoading,
  onEdit,
  onBlock,
  onView,
  onAdd,
  onBulkDelete,
  search,
  onSearchChange,
  page,
  totalPages,
  limit,
  total,
  onPageChange,
  onLimitChange,
  children,
}) => {
  const columns = useMemo(
    () => getReaderColumns({ onEdit, onBlock, onView }),
    [onEdit, onBlock, onView]
  );

  return (
    <DataTable<Reader, any>
      columns={columns}
      data={readers}
      loading={isLoading}
      search={search}
      onSearchChange={onSearchChange}
      page={page}
      totalPages={totalPages}
      limit={limit}
      total={total}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      onAdd={onAdd}
      onBulkDelete={onBulkDelete}
      searchPlaceholder="Search readers by name or email..."
    >
      {children}
    </DataTable>
  );
};
