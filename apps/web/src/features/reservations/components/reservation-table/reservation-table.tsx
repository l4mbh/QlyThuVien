import React from "react";
import type { Reservation } from "../../reservation.service";
import { DataTable } from "@/components/ui/data-table/data-table";
import { getReservationColumns } from "../reservation-columns";

interface ReservationTableProps {
  items: Reservation[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  limit: number;
  total: number;
  search: string;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onView: (record: Reservation) => void;
  children?: React.ReactNode;
}

export const ReservationTable: React.FC<ReservationTableProps> = ({
  items,
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
  children,
}) => {
  const columns = React.useMemo(
    () => getReservationColumns({ onView }),
    [onView]
  );

  return (
    <DataTable
      columns={columns}
      data={items}
      loading={isLoading}
      page={page}
      totalPages={totalPages}
      limit={limit}
      total={total}
      search={search}
      onSearchChange={onSearchChange}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      onRowClick={onView}
      searchPlaceholder="Search reader or book..."
    >
      {children}
    </DataTable>
  );
};
