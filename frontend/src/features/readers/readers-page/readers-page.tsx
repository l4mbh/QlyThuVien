import React, { useEffect, useState, useCallback } from "react";
import { ReaderTable } from "../components/reader-table";
import { ReaderFormModal } from "../components/reader-form-modal";
import { ReaderDetailDrawer } from "../components/reader-detail-drawer";
import { readerService } from "../reader.service";
import type { Reader } from "@/types/reader/reader.entity";
import { ReaderStatus } from "@/types/reader/reader.entity";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";
import { FilterX, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/ui/confirmation-modal/confirmation-modal";

export const ReadersPage: React.FC = () => {
  const [readers, setReaders] = useState<Reader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pagination State (Note: API needs to support these)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Search and Filter State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedReader, setSelectedReader] = useState<Reader | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const response = await readerService.getReaders();
      if (response.code === 0 && response.data) {
        let filteredData = response.data;
        
        if (statusFilter !== "all") {
          filteredData = filteredData.filter(r => r.status === statusFilter);
        }
        
        if (search) {
          const s = search.toLowerCase();
          filteredData = filteredData.filter(r => 
            r.name.toLowerCase().includes(s) || 
            r.email.toLowerCase().includes(s)
          );
        }

        setReaders(filteredData);
        setTotal(filteredData.length);
        setTotalPages(Math.ceil(filteredData.length / limit));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch readers");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [search, statusFilter, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData(false);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  const handleAddReader = () => {
    setSelectedReader(null);
    setIsFormOpen(true);
  };

  const handleEditReader = (reader: Reader) => {
    setSelectedReader(reader);
    setIsFormOpen(true);
  };

  const handleViewReader = (reader: Reader) => {
    setSelectedReader(reader);
    setIsDetailOpen(true);
  };

  const handleBlockClick = (reader: Reader) => {
    setSelectedReader(reader);
    setIsBlockModalOpen(true);
  };

  const handleConfirmBlock = async () => {
    if (!selectedReader) return;
    setIsBlocking(true);
    try {
      const response = await readerService.toggleBlockReader(selectedReader.id);
      if (response.code === 0) {
        toast.success(`${selectedReader.status === ReaderStatus.ACTIVE ? "Blocked" : "Unblocked"} successfully`);
        setIsBlockModalOpen(false);
        fetchData(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Action failed");
    } finally {
      setIsBlocking(false);
      setSelectedReader(null);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reader Management</h1>
          <p className="text-muted-foreground">Manage library readers, their membership status, and borrowing limits.</p>
        </div>
      </div>

      <ReaderTable
        readers={readers}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        limit={limit}
        total={total}
        search={search}
        onSearchChange={setSearch}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onEdit={handleEditReader}
        onBlock={handleBlockClick}
        onView={handleViewReader}
        onAdd={handleAddReader}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
            <SelectTrigger className="w-[180px] h-10 border-muted-foreground/20">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value={ReaderStatus.ACTIVE}>Active Only</SelectItem>
              <SelectItem value={ReaderStatus.BLOCKED}>Blocked Only</SelectItem>
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
      </ReaderTable>

      <ConfirmationModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onConfirm={handleConfirmBlock}
        title={selectedReader?.status === ReaderStatus.ACTIVE ? "Block Reader" : "Unblock Reader"}
        description={`Are you sure you want to ${selectedReader?.status === ReaderStatus.ACTIVE ? "block" : "unblock"} ${selectedReader?.name}?`}
        confirmText={selectedReader?.status === ReaderStatus.ACTIVE ? "Block" : "Unblock"}
        variant={selectedReader?.status === ReaderStatus.ACTIVE ? "destructive" : "default"}
        isLoading={isBlocking}
      />

      <ReaderFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          setIsFormOpen(false);
          fetchData(false);
        }}
        selectedReader={selectedReader}
      />

      <ReaderDetailDrawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        reader={selectedReader}
        onUpdate={() => fetchData(false)}
      />
    </div>
  );
};
