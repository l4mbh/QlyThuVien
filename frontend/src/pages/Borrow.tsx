import { BorrowModal } from "@/features/borrow/BorrowModal";

export const Borrow = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Borrow Records</h1>
          <p className="text-muted-foreground">Manage book borrowing and returns.</p>
        </div>
        <BorrowModal />
      </div>
      
      {/* Table Placeholder */}
      <div className="border border-border rounded-md bg-card">
        <div className="p-4 text-center text-muted-foreground">
          No records found.
        </div>
      </div>
    </div>
  );
};
