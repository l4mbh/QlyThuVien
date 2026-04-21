import React, { useEffect, useState, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { Reader } from "@/types/reader/reader.entity";
import { ReaderStatus } from "@/types/reader/reader.entity";
import type { BorrowItem } from "@/types/borrow.entity";
import { BorrowItemStatus } from "@/types/borrow.entity";
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
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton/skeleton";

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
  const [isReturning, setIsReturning] = useState<string | null>(null);

  const fetchBorrowings = useCallback(async () => {
    if (!reader) return;
    setIsLoading(true);
    try {
      const response = await borrowService.getReaderBorrowings(reader.id);
      if (response.code === 0 && response.data) {
        setBorrowings(response.data);
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
    }
  }, [isOpen, reader, fetchBorrowings]);

  const handleReturn = async (borrowItemId: string) => {
    setIsReturning(borrowItemId);
    try {
      const response = await borrowService.returnBook(borrowItemId);
      if (response.code === 0) {
        toast.success("Book returned successfully");
        fetchBorrowings();
        onUpdate(); // Refresh parent list
      }
    } catch (error: any) {
      toast.error(error.message || "Return failed");
    } finally {
      setIsReturning(null);
    }
  };

  if (!reader) return null;

  const overdueCount = borrowings.filter(b => b.status === BorrowItemStatus.OVERDUE).length;
  const activeCount = borrowings.filter(b => b.status === BorrowItemStatus.BORROWING).length;
  const isOverLimit = reader.currentBorrowCount >= reader.borrowLimit;

  return (
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
            {/* 1. Quick Stats & Warning */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Active Loans</span>
                <span className="text-3xl font-black">{activeCount} / {reader.borrowLimit}</span>
                {isOverLimit && (
                  <div className="flex items-center gap-1 text-[10px] text-destructive font-bold">
                    <AlertCircle className="h-3 w-3" /> LIMIT REACHED
                  </div>
                )}
              </div>
              <div className={`p-4 rounded-xl border flex flex-col gap-1 ${overdueCount > 0 ? 'bg-destructive/5 border-destructive/20' : 'bg-muted/30 border-muted-foreground/10'}`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${overdueCount > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>Overdue Items</span>
                <span className={`text-3xl font-black ${overdueCount > 0 ? 'text-destructive' : ''}`}>{overdueCount}</span>
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
                  <BookOpen className="h-4 w-4 text-primary" /> Current Borrowings
                </div>
                <Button variant="ghost" size="sm" onClick={fetchBorrowings} disabled={isLoading}>
                  <RotateCcw className={`h-3.5 w-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}
                </div>
              ) : borrowings.length === 0 ? (
                <div className="text-center py-10 border border-dashed rounded-xl bg-muted/20">
                  <History className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No active borrowings found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {borrowings.map((item) => (
                    <div
                      key={item.id}
                      className={`group relative p-4 rounded-xl border transition-all hover:shadow-md ${item.status === BorrowItemStatus.OVERDUE
                          ? 'bg-destructive/5 border-destructive/20'
                          : 'bg-background border-muted'
                        }`}
                    >
                      <div className="flex gap-4">
                        {/* Book Cover Placeholder */}
                        <div className="w-12 h-16 bg-muted rounded-md overflow-hidden shrink-0 border border-muted-foreground/10">
                          {item.book.coverUrl ? (
                            <img src={item.book.coverUrl} alt={item.book.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                              <BookOpen className="h-6 w-6" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="font-bold text-sm leading-tight truncate">{item.book.title}</h4>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{item.book.callNumber || 'N/A'}</p>

                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              Borrowed: {new Date(item.borrowedAt).toLocaleDateString()}
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-bold ${item.status === BorrowItemStatus.OVERDUE ? 'text-destructive' : 'text-primary'}`}>
                              <Clock className="h-3 w-3" />
                              Due: {new Date(item.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center gap-2">
                          {item.status === BorrowItemStatus.BORROWING || item.status === BorrowItemStatus.OVERDUE ? (
                            <Button
                              size="sm"
                              variant={item.status === BorrowItemStatus.OVERDUE ? "destructive" : "outline"}
                              className="h-8 text-[10px] font-bold uppercase tracking-wider"
                              onClick={() => handleReturn(item.id)}
                              disabled={isReturning === item.id}
                            >
                              {isReturning === item.id ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <RotateCcw className="h-3 w-3 mr-1" />}
                              Return
                            </Button>
                          ) : (
                            <Badge variant="outline" className="text-[10px] uppercase">{item.status}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
