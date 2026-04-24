import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { FilterX, RefreshCcw, Plus } from "lucide-react";
import { ErrorCode } from "@qltv/shared";
import { PageHeader } from "@/components/ui/page-header/page-header";


import { BorrowTable } from "../components/borrow-table/borrow-table";
import { BorrowModal } from "../components/borrow-modal/borrow-modal";
import { BorrowDetailDrawer } from "../components/borrow-detail-drawer/borrow-detail-drawer";
import { borrowService } from "../borrow.service";
import type { BorrowRecord } from "@/types/borrow/borrow.entity";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";

export const BorrowPage: React.FC = () => {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters State
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  // Pagination (Using dummy pagination since backend simple list currently)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  // Modal & Drawer State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BorrowRecord | null>(null);

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const response = await borrowService.getAllBorrows({
        status: status === "all" ? undefined : status,
      });

      if ((response.code === 0 || response.code === ErrorCode.SUCCESS) && response.data) {
        let filtered = response.data;

        // Simple search filtering on frontend if backend doesn't support yet
        if (search) {
          filtered = filtered.filter(r =>
            r.user?.name.toLowerCase().includes(search.toLowerCase()) ||
            r.user?.email.toLowerCase().includes(search.toLowerCase())
          );
        }

        setRecords(filtered);
        setTotal(filtered.length);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch borrow records");
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

  const handleViewRecord = (record: BorrowRecord) => {
    setSelectedRecord(record);
    setIsDrawerOpen(true);
  };

  // If record updated in drawer, we need to refresh list and selected record
  const handleUpdateRecord = async () => {
    if (!selectedRecord) return;

    // Refresh the list
    await fetchData(false);

    // Refresh the selected record details
    try {
      const res = await borrowService.getBorrowById(selectedRecord.id);
      if (res.code === 0 || res.code === ErrorCode.SUCCESS) {
        setSelectedRecord(res.data ?? null);
      }
    } catch (error) {
      console.error("Failed to refresh record details");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader />

      <BorrowTable
        borrows={records}
        isLoading={isLoading}
        page={page}
        totalPages={Math.ceil(total / limit)}
        limit={limit}
        total={total}
        search={search}
        onSearchChange={setSearch}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onView={handleViewRecord}
        onAdd={() => setIsModalOpen(true)}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px] h-10 border-muted-foreground/20">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="BORROWING">Borrowing</SelectItem>
              <SelectItem value="OVERDUE">Overdue</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
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
      </BorrowTable>

      <BorrowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
      />

      <BorrowDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        record={selectedRecord}
        onUpdate={handleUpdateRecord}
      />
    </div>
  );
};

