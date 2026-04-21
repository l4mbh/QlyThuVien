import React, { useState } from "react";
import { format } from "date-fns";
import { 
  User, 
  Book as BookIcon, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  RotateCcw,
  ArrowLeft,
  CheckSquare,
  Square
} from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
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

import type { BorrowRecord, BorrowItem } from "@/types/borrow/borrow.entity";
import { BorrowRecordStatus, BorrowItemStatus } from "@/types/borrow/borrow.entity";
import { borrowService } from "../../borrow.service";

interface BorrowDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: BorrowRecord | null;
  onUpdate: () => void;
}

export const BorrowDetailDrawer: React.FC<BorrowDetailDrawerProps> = ({
  isOpen,
  onClose,
  record,
  onUpdate,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!record) return null;

  const toggleItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkReturn = async () => {
    if (selectedItems.length === 0) return;
    
    setIsProcessing(true);
    try {
      const response = await borrowService.returnBook({ borrowItemIds: selectedItems });
      if (response.code === 0) {
        toast.success(`${selectedItems.length} book(s) returned successfully`);
        setSelectedItems([]);
        onUpdate();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to return books");
    } finally {
      setIsProcessing(false);
      setConfirmOpen(false);
    }
  };

  const borrowingItems = record.borrowItems.filter(i => i.status !== BorrowItemStatus.RETURNED);
  const isOverdue = new Date(record.dueDate) < new Date() && record.status !== BorrowRecordStatus.COMPLETED;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-md flex flex-col p-0">
          <SheetHeader className="p-6 border-b bg-accent/10">
            <div className="flex justify-between items-start mb-2">
              <Badge 
                variant={record.status === BorrowRecordStatus.COMPLETED ? "outline" : (isOverdue ? "destructive" : "secondary")}
                className={record.status === BorrowRecordStatus.COMPLETED ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : ""}
              >
                {record.status.toLowerCase()}
              </Badge>
              <span className="text-[10px] text-muted-foreground font-mono">{record.id.split('-')[0]}</span>
            </div>
            <SheetTitle className="text-xl">Borrow Transaction Details</SheetTitle>
            <SheetDescription>
              Transaction recorded on {format(new Date(record.borrowDate), "PPP")}
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-grow">
            <div className="p-6 space-y-8">
              {/* Reader Section */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" /> Reader Information
                </h3>
                <Card className="p-4 flex items-center gap-4 border-none bg-accent/20">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {record.user?.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold">{record.user?.name}</span>
                    <span className="text-sm text-muted-foreground">{record.user?.email}</span>
                  </div>
                </Card>
              </section>

              {/* Dates Section */}
              <section className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                     <Clock className="h-3 w-3" /> Borrow Date
                   </span>
                   <p className="text-sm font-medium">{format(new Date(record.borrowDate), "dd MMM yyyy")}</p>
                 </div>
                 <div className="space-y-2">
                   <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                     <Calendar className="h-3 w-3" /> Due Date
                   </span>
                   <p className={`text-sm font-bold ${isOverdue ? "text-destructive" : ""}`}>
                     {format(new Date(record.dueDate), "dd MMM yyyy")}
                   </p>
                 </div>
              </section>

              <Separator />

              {/* Books Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <BookIcon className="h-4 w-4" /> Borrowed Books ({record.borrowItems.length})
                  </h3>
                  {borrowingItems.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-[10px] font-bold"
                      onClick={() => {
                        if (selectedItems.length === borrowingItems.length) setSelectedItems([]);
                        else setSelectedItems(borrowingItems.map(i => i.id));
                      }}
                    >
                      {selectedItems.length === borrowingItems.length ? "Deselect All" : "Select All"}
                    </Button>
                  )}
                </div>
                
                <div className="space-y-3">
                  {record.borrowItems.map((item: BorrowItem) => (
                    <Card 
                      key={item.id} 
                      className={`p-4 space-y-3 overflow-hidden relative group border-accent/20 transition-all ${
                        selectedItems.includes(item.id) ? "ring-2 ring-primary bg-primary/5" : ""
                      }`}
                      onClick={() => item.status !== BorrowItemStatus.RETURNED && toggleItem(item.id)}
                    >
                      {item.status === BorrowItemStatus.RETURNED && (
                        <div className="absolute top-0 right-0 p-1 bg-emerald-500 text-white rounded-bl-lg">
                          <CheckCircle2 className="h-3 w-3" />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-start gap-3 flex-grow">
                          {item.status !== BorrowItemStatus.RETURNED && (
                            <div className="mt-0.5">
                              {selectedItems.includes(item.id) ? (
                                <CheckSquare className="h-4 w-4 text-primary" />
                              ) : (
                                <Square className="h-4 w-4 text-muted-foreground/30" />
                              )}
                            </div>
                          )}
                          <div className="flex flex-col gap-1 min-w-0">
                            <span className="font-bold text-sm leading-tight truncate">{item.book.title}</span>
                            <span className="text-[10px] font-mono text-muted-foreground">Call: {item.book.callNumber}</span>
                          </div>
                        </div>
                        
                        <Badge 
                          variant={item.status === BorrowItemStatus.RETURNED ? "outline" : "secondary"}
                          className={item.status === BorrowItemStatus.RETURNED ? "text-emerald-600 bg-emerald-50" : ""}
                        >
                          {item.status.toLowerCase()}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase text-muted-foreground">Status</span>
                          {item.status === BorrowItemStatus.RETURNED ? (
                            <span className="text-[10px] text-emerald-600 font-medium italic">
                              Returned on {format(new Date(item.returnedAt!), "dd MMM")}
                            </span>
                          ) : (
                            <span className="text-[10px] text-orange-600 font-medium">Still borrowing</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          </ScrollArea>

          <div className="p-6 border-t bg-accent/5 space-y-3">
            {selectedItems.length > 0 && (
              <Button 
                className="w-full gap-2 shadow-lg shadow-primary/20" 
                onClick={() => setConfirmOpen(true)}
                disabled={isProcessing}
              >
                <RotateCcw className={`h-4 w-4 ${isProcessing ? "animate-spin" : ""}`} />
                Return {selectedItems.length} Selected Book(s)
              </Button>
            )}
            <Button variant="outline" className="w-full gap-2" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" /> Back to List
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Return</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to return {selectedItems.length} selected book(s)? 
              This will update inventory levels and reader borrow counts immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBulkReturn} 
              disabled={isProcessing}
              className="bg-primary hover:bg-primary/90"
            >
              {isProcessing ? "Processing..." : "Confirm Return"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
