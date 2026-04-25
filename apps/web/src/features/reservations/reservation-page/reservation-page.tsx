import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { FilterX, RefreshCcw, LayoutDashboard, Clock } from "lucide-react";
import { ErrorCode } from "@qltv/shared";
import { PageHeader } from "@/components/ui/page-header/page-header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";
import { ReservationTable } from "../components/reservation-table/reservation-table";
import { reservationService } from "../reservation.service";
import type { Reservation } from "../reservation.service";
import { ReservationDetailDrawer } from "../components/reservation-detail-drawer/reservation-detail-drawer";
import { BorrowModal } from "@/features/borrow/components/borrow-modal/borrow-modal";

export const ReservationPage: React.FC = () => {
  const [items, setItems] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters State
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  // Modal & Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const response = await reservationService.getAll();

      if ((response.code === 0 || response.code === ErrorCode.SUCCESS) && response.data) {
        let filtered = response.data;

        if (status !== "all") {
          filtered = filtered.filter(r => r.status === status);
        }

        if (search) {
          const s = search.toLowerCase();
          filtered = filtered.filter(r =>
            r.user?.name?.toLowerCase().includes(s) ||
            r.book?.title?.toLowerCase().includes(s) ||
            r.user?.phoneNormalized?.includes(s)
          );
        }

        setItems(filtered);
        setTotal(filtered.length);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch reservations");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [status, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData(false);
  };

  const handleResetFilters = () => {
    setStatus("all");
    setSearch("");
  };

  const handleView = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDrawerOpen(true);
  };

  const handleProcessBorrow = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsBorrowModalOpen(true);
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <Clock className="h-8 w-8 text-primary" />
            Smart Queue
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Monitor and manage book reservations and queue priorities
          </p>
        </div>
      </div>

      <ReservationTable
        items={items}
        isLoading={isLoading}
        page={page}
        totalPages={Math.ceil(total / limit)}
        limit={limit}
        total={total}
        search={search}
        onSearchChange={setSearch}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onView={handleView}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px] h-10 border-muted-foreground/20">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="READY">Ready</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handleResetFilters} title="Reset filters" className="h-10 w-10 text-muted-foreground hover:text-primary">
              <FilterX className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleRefresh} className={`h-10 w-10 text-muted-foreground hover:text-primary ${isRefreshing ? "animate-spin" : ""}`} title="Refresh data">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </ReservationTable>

      <ReservationDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        reservation={selectedReservation}
        onUpdate={fetchData}
        onProcessBorrow={handleProcessBorrow}
      />

      <BorrowModal
        isOpen={isBorrowModalOpen}
        onClose={() => setIsBorrowModalOpen(false)}
        onSuccess={() => {
          fetchData();
          setIsBorrowModalOpen(false);
        }}
        initialReservation={selectedReservation}
      />
    </div>
  );
};
