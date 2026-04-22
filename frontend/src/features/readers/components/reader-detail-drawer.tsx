import React, { useEffect, useState, useCallback, useMemo } from "react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { Reader } from "@/types/reader/reader.entity";
import { ReaderStatus } from "@/types/reader/reader.entity";
import type { BorrowItem } from "@/types/borrow/borrow.entity";
import { BorrowItemStatus } from "@/types/borrow/borrow.entity";
import { borrowService } from "../../borrow/borrow.service";
import { LibraryCardPreview } from "./library-card-preview";
import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  Calendar,
  Clock,
  BookOpen,
  History,
  IdCard,
  RotateCcw,
  Loader2,
  CheckSquare,
  Square,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { calculateOverdue, formatVND } from "../../borrow/utils/fine-utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ReaderDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reader: Reader | null;
  onUpdate: () => void;
}

export const ReaderDetailDrawer: React.FC<ReaderDetailDrawerProps> = ({
  isOpen,
  onClose,
  reader,
  onUpdate,
}) => {
  const [borrowings, setBorrowings] = useState<BorrowItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchBorrowings = useCallback(async () => {
    if (!reader) return;
    setIsLoading(true);
    try {
      const response = await borrowService.getAllBorrows({ userId: reader.id });
      if (response.code === 0 && response.data) {
        // Flatten all items from all records for this user
        const allItems = response.data.flatMap(record => 
          record.borrowItems.map(item => ({
            ...item,
            dueDate: record.dueDate // Inject due date from record to items
          }))
        );
        setBorrowings(allItems as any);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch borrowings");
    } finally {
      setIsLoading(false);
    }
  }, [reader]);

  useEffect(() => {
    if (isOpen && reader) {
      fetchBorrowings();
      setSelectedItems([]); // Reset selection when opening
    }
  }, [isOpen, reader, fetchBorrowings]);

  const toggleItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleReturn = async () => {
    if (selectedItems.length === 0) return;
    
    setIsProcessing(true);
    try {
      const response = await borrowService.returnBook({ borrowItemIds: selectedItems });
      if (response.code === 0) {
        toast.success(`${selectedItems.length} book(s) returned successfully`);
        setSelectedItems([]);
        fetchBorrowings();
        onUpdate(); // Refresh parent list
      }
    } catch (error: any) {
      toast.error(error.message || "Return failed");
    } finally {
      setIsProcessing(false);
      setConfirmOpen(false);
    }
  };

  // Calculate totals for selected items
  const selectedStats = useMemo(() => {
    if (selectedItems.length === 0) return { totalFine: 0, hasOverdue: false };
    
    return selectedItems.reduce((acc, id) => {
      const item = borrowings.find(b => b.id === id);
      if (item) {
        const { fine, isOverdue } = calculateOverdue(item.dueDate);
        acc.totalFine += fine;
        if (isOverdue) acc.hasOverdue = true;
      }
      return acc;
    }, { totalFine: 0, hasOverdue: false });
  }, [selectedItems, borrowings]);

  if (!reader) return null;

  const borrowingItems = borrowings.filter(b => b.status !== BorrowItemStatus.RETURNED);
  const activeCount = borrowingItems.length;
  
  // Use backend computed stats with fallback to local calculation
  const totalFinePaid = (reader as any).totalFine || 0;
  const overdueCount = (reader as any).overdueCount || borrowings.filter(b => {
    const { isOverdue } = calculateOverdue(b.dueDate);
    return b.status !== BorrowItemStatus.RETURNED && isOverdue;
  }).length;

  const isOverLimit = reader.currentBorrowCount >= reader.borrowLimit;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-[540px] w-full p-0 flex flex-col">
          <SheetHeader className="p-6 pb-2">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                Reader Profile
                {reader.status === ReaderStatus.BLOCKED && (
                  <Badge variant="destructive" className="ml-2 animate-pulse">Blocked</Badge>
                )}
              </SheetTitle>
            </div>
            <SheetDescription>
              Detailed overview of {reader.name}'s membership and activity.
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-1 px-6">
            <div className="space-y-8 pb-8">
              {/* 1. Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Active Loans</span>
                  <span className="text-2xl font-black">{activeCount} / {reader.borrowLimit}</span>
                  {isOverLimit && (
                    <div className="flex items-center gap-1 text-[8px] text-destructive font-bold">
                      <AlertCircle className="h-2 w-2" /> LIMIT REACHED
                    </div>
                  )}
                </div>
                
                <div className={`p-3 rounded-xl border flex flex-col gap-1 ${overdueCount > 0 ? 'bg-destructive/5 border-destructive/20' : 'bg-muted/30 border-muted-foreground/10'}`}>
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${overdueCount > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>Overdue Items</span>
                  <span className={`text-2xl font-black ${overdueCount > 0 ? 'text-destructive' : ''}`}>{overdueCount}</span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Total Fine Paid</span>
                  <span className="text-xl font-black text-emerald-600 truncate">{formatVND(totalFinePaid)}</span>
                  <span className="text-[8px] text-muted-foreground italic leading-none">Lifetime history</span>
                </div>
              </div>

              {/* 2. Library Card Identity */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <IdCard className="h-4 w-4 text-primary" /> Membership Card
                </div>
                <LibraryCardPreview reader={reader} />
              </div>

              <Separator />

              {/* 3. Borrowing List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <BookOpen className="h-4 w-4 text-primary" /> Borrowing History
                  </div>
                  <div className="flex gap-2">
                    {borrowingItems.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-[10px] font-bold uppercase"
                        onClick={() => {
                          if (selectedItems.length === borrowingItems.length) setSelectedItems([]);
                          else setSelectedItems(borrowingItems.map(i => i.id));
                        }}
                      >
                        {selectedItems.length === borrowingItems.length ? "Deselect All" : "Select All"}
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="h-8" onClick={fetchBorrowings} disabled={isLoading}>
                      <RotateCcw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}
                  </div>
                ) : borrowings.length === 0 ? (
                  <div className="text-center py-10 border border-dashed rounded-xl bg-muted/20">
                    <History className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No borrowing records found.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {borrowings.map((item) => {
                      const { isOverdue, fine } = calculateOverdue(item.dueDate, item.returnedAt);
                      const isActuallyOverdue = isOverdue && item.status !== BorrowItemStatus.RETURNED;
                      const isSelected = selectedItems.includes(item.id);

                      return (
                        <div
                          key={item.id}
                          className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${
                            item.status !== BorrowItemStatus.RETURNED ? (
                              isSelected 
                                ? 'bg-primary/5 border-primary ring-1 ring-primary' 
                                : isActuallyOverdue
                                  ? 'bg-destructive/5 border-destructive/20 hover:border-destructive/40'
                                  : 'bg-background border-muted hover:border-primary/30 shadow-sm'
                            ) : 'bg-muted/10 border-muted opacity-80'
                          }`}
                          onClick={() => item.status !== BorrowItemStatus.RETURNED && toggleItem(item.id)}
                        >
                          <div className="flex gap-4">
                            {/* Selection Checkbox (Only for active loans) */}
                            {item.status !== BorrowItemStatus.RETURNED && (
                              <div className="flex items-center justify-center shrink-0">
                                {isSelected ? (
                                  <CheckSquare className="h-5 w-5 text-primary" />
                                ) : (
                                  <Square className="h-5 w-5 text-muted-foreground/30 group-hover:text-muted-foreground/50" />
                                )}
                              </div>
                            )}

                            {/* Book Cover */}
                            <div className="w-12 h-16 bg-muted rounded-md overflow-hidden shrink-0 border border-muted-foreground/10">
                              {item.book.coverUrl ? (
                                <img src={item.book.coverUrl} alt={item.book.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                                  <BookOpen className="h-6 w-6" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <h4 className="font-bold text-sm leading-tight truncate">{item.book.title}</h4>
                                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{item.book.callNumber || 'N/A'}</p>
                              </div>

                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(item.borrowedAt), "dd MMM")}
                                </div>
                                <div className={`flex items-center gap-1 text-[10px] font-bold ${isActuallyOverdue ? 'text-destructive' : 'text-primary'}`}>
                                  <Clock className="h-3 w-3" />
                                  {format(new Date(item.dueDate), "dd MMM")}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end justify-center gap-2">
                              <Badge 
                                variant={item.status === BorrowItemStatus.RETURNED ? "outline" : (isActuallyOverdue ? "destructive" : "secondary")}
                                className={`text-[9px] uppercase font-bold tracking-tighter h-5 ${item.status === BorrowItemStatus.RETURNED ? "text-emerald-600 bg-emerald-50 border-emerald-100" : ""}`}
                              >
                                {item.status === BorrowItemStatus.RETURNED ? "Returned" : (isActuallyOverdue ? "Overdue" : "Borrowing")}
                              </Badge>

                              {/* Fine amount display */}
                              {item.status === BorrowItemStatus.RETURNED ? (
                                (item.fineAmount ?? 0) > 0 && (
                                  <span className="text-[10px] font-bold text-emerald-600">{formatVND(item.fineAmount ?? 0)} paid</span>
                                )
                              ) : (
                                fine > 0 && (
                                  <span className="text-[10px] font-bold text-destructive">+{formatVND(fine)}</span>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          {/* Action Bar (Footer) */}
          <div className="p-6 border-t bg-accent/5 space-y-3">
            {selectedItems.length > 0 && (
              <Button 
                className={`w-full gap-2 shadow-lg h-12 text-sm font-bold uppercase tracking-wide transition-all ${selectedStats.hasOverdue ? "bg-destructive hover:bg-destructive/90 shadow-destructive/20" : "shadow-primary/20"}`}
                onClick={() => setConfirmOpen(true)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4" />
                )}
                Return {selectedItems.length} Selected Book(s)
              </Button>
            )}
            <Button variant="outline" className="w-full gap-2 h-12 text-sm font-bold uppercase text-muted-foreground" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" /> Close Details
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Confirmation Modal */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {selectedStats.hasOverdue && <Clock className="h-5 w-5 text-destructive" />}
              Confirm Book Return
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p className="text-sm">
                You are about to process the return of <span className="font-bold text-foreground">{selectedItems.length}</span> book(s) for <span className="font-bold text-foreground">{reader.name}</span>.
              </p>
              
              {selectedStats.hasOverdue && (
                <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-sm font-black text-destructive uppercase tracking-tight">
                    <AlertCircle className="h-4 w-4" /> Overdue Fine Detected
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Fine per day:</span>
                      <span>5,000 VND</span>
                    </div>
                    <div className="flex justify-between text-lg border-t border-destructive/10 pt-2">
                      <span className="font-bold">Total Fine to Collect:</span>
                      <span className="font-black text-destructive">{formatVND(selectedStats.totalFine)}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground italic leading-tight">
                    * Please ensure the reader has paid the fine amount before confirming.
                  </p>
                </div>
              )}
              
              {!selectedStats.hasOverdue && (
                <p className="text-xs text-muted-foreground bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-lg">
                  Inventory levels and reader loan counts will be updated automatically upon confirmation.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleReturn();
              }} 
              disabled={isProcessing}
              className={`font-bold ${selectedStats.hasOverdue ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"}`}
            >
              {isProcessing ? "Processing..." : (selectedStats.hasOverdue ? "Confirm & Collected Fine" : "Confirm Return")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
