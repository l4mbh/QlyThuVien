import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/tabs";
import type { BookEntity, InventoryLogEntity } from "@/types/books/book.entity";
import { InventoryLogReason } from "@/types/books/book.entity";
import { bookService } from "../book.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge/badge";
import { format } from "date-fns";
import { PackageOpen, ArrowRight, Save, History, SlidersHorizontal, Plus, Minus } from "lucide-react";
import { ErrorCode } from "@qltv/shared";


interface InventoryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: BookEntity | null;
  onSuccess: () => void;
}

export const InventoryManagementModal: React.FC<InventoryManagementModalProps> = ({
  isOpen,
  onClose,
  book,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState("adjust");
  
  // Adjust Form State
  const [changeAmount, setChangeAmount] = useState<string>("0");
  const [reason, setReason] = useState<InventoryLogReason>(InventoryLogReason.RESTOCK);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // History State
  const [logs, setLogs] = useState<InventoryLogEntity[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  useEffect(() => {
    if (isOpen && activeTab === "history" && book) {
      fetchLogs();
    }
  }, [isOpen, activeTab, book]);

  useEffect(() => {
    if (!isOpen) {
      setChangeAmount("0");
      setReason(InventoryLogReason.RESTOCK);
      setNote("");
      setActiveTab("adjust");
    }
  }, [isOpen]);

  const handleReasonChange = (val: InventoryLogReason) => {
    setReason(val);
    const num = parseInt(changeAmount) || 0;
    if (val === InventoryLogReason.RESTOCK && num < 0) {
      setChangeAmount(Math.abs(num).toString());
    } else if ((val === InventoryLogReason.LOST || val === InventoryLogReason.DAMAGED) && num > 0) {
      setChangeAmount(( -Math.abs(num)).toString());
    }
  };

  const handleIncrement = () => {
    const current = parseInt(changeAmount) || 0;
    if ((reason === InventoryLogReason.LOST || reason === InventoryLogReason.DAMAGED) && current >= 0) {
      return;
    }
    setChangeAmount((current + 1).toString());
  };

  const handleDecrement = () => {
    const current = parseInt(changeAmount) || 0;
    if (reason === InventoryLogReason.RESTOCK && current <= 0) {
      return;
    }
    setChangeAmount((current - 1).toString());
  };

  const fetchLogs = async () => {
    if (!book) return;
    setIsLoadingLogs(true);
    try {
      const res = await bookService.getInventoryLogs(book.id);
      if (res.code === 0 || res.code === ErrorCode.SUCCESS) {
        setLogs(res.data || []);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch inventory logs");
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    const numChange = parseInt(changeAmount);
    if (isNaN(numChange) || numChange === 0) {
      toast.error("Please enter a valid change amount (non-zero)");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await bookService.adjustInventory(book.id, {
        change: numChange,
        reason,
        note
      });
      if (res.code === 0 || res.code === ErrorCode.SUCCESS) {
        toast.success("Inventory adjusted successfully");
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || "Error adjusting inventory");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!book) return null;

  // Preview Calculations
  const numChange = parseInt(changeAmount) || 0;
  let newTotal = book.totalQuantity;
  let newAvailable = book.availableQuantity + numChange;

  if (reason === InventoryLogReason.RESTOCK) {
    newTotal += numChange;
  } else if (reason === InventoryLogReason.DAMAGED || reason === InventoryLogReason.LOST) {
    newTotal -= Math.abs(numChange);
  }

  const isInvalid = newAvailable < 0 || newTotal < (book.totalQuantity - book.availableQuantity);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackageOpen className="h-5 w-5 text-primary" />
            Inventory Management: {book.title}
          </DialogTitle>
          <DialogDescription>
            Adjust inventory quantity or view the history of changes for this book.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="adjust" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Adjust
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" /> History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="adjust" className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-muted p-3 rounded-lg flex flex-col items-center justify-center">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Borrowed</span>
                <span className="text-2xl font-bold text-orange-500">{book.totalQuantity - book.availableQuantity}</span>
              </div>
              <div className="bg-muted p-3 rounded-lg flex flex-col items-center justify-center border border-primary/20 bg-primary/5">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Available</span>
                <span className="text-2xl font-bold text-primary">{book.availableQuantity}</span>
              </div>
              <div className="bg-muted p-3 rounded-lg flex flex-col items-center justify-center">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Total</span>
                <span className="text-2xl font-bold text-foreground">{book.totalQuantity}</span>
              </div>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Reason for adjustment <span className="text-destructive">*</span></Label>
                  <Select value={reason} onValueChange={handleReasonChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={InventoryLogReason.RESTOCK}>Add stock (RESTOCK)</SelectItem>
                      <SelectItem value={InventoryLogReason.DAMAGED}>Damaged (DAMAGED)</SelectItem>
                      <SelectItem value={InventoryLogReason.LOST}>Lost (LOST)</SelectItem>
                      <SelectItem value={InventoryLogReason.MANUAL_ADJUST}>Manual adjust (MANUAL_ADJUST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Change amount {reason === InventoryLogReason.MANUAL_ADJUST && "(+/-)"} <span className="text-destructive">*</span></Label>
                  <div className="flex items-center gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={handleDecrement}
                      disabled={
                        (reason === InventoryLogReason.RESTOCK && (parseInt(changeAmount) || 0) <= 0)
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input 
                      type="number" 
                      value={changeAmount} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChangeAmount(e.target.value)} 
                      className="text-center font-bold"
                      placeholder={reason === InventoryLogReason.MANUAL_ADJUST ? "Ex: 5 or -2" : "Ex: 5"}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={handleIncrement}
                      disabled={
                        (reason === InventoryLogReason.LOST || reason === InventoryLogReason.DAMAGED) && (parseInt(changeAmount) || 0) >= 0
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Note</Label>
                <Textarea 
                  placeholder="Detailed reason..." 
                  value={note} 
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)} 
                  className="resize-none"
                  rows={2}
                />
              </div>

              {/* Preview Box */}
              <div className="bg-muted/50 border border-muted p-4 rounded-lg mt-4">
                <h4 className="text-sm font-semibold mb-3">Preview changes:</h4>
                <div className="flex items-center justify-between text-sm">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground uppercase font-medium">Metric</p>
                    <p className="text-slate-600">Available Stock</p>
                    <p className="text-slate-600">Total Physical</p>
                  </div>
                  <div className="space-y-2 text-center">
                    <p className="text-xs text-muted-foreground uppercase font-medium">Current</p>
                    <p className="font-semibold">{book.availableQuantity}</p>
                    <p className="font-semibold">{book.totalQuantity}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground mt-6" />
                  <div className="space-y-2 text-right">
                    <p className="text-xs text-muted-foreground uppercase font-medium">After (Delta)</p>
                    <p className={newAvailable < 0 ? "text-destructive font-bold" : "text-primary font-bold"}>
                      {newAvailable} ({numChange >= 0 ? `+${numChange}` : numChange})
                    </p>
                    <p className={newTotal < (book.totalQuantity - book.availableQuantity) ? "text-destructive font-bold" : "font-bold text-slate-900"}>
                      {newTotal} ({newTotal - book.totalQuantity >= 0 ? `+${newTotal - book.totalQuantity}` : newTotal - book.totalQuantity})
                    </p>
                  </div>
                </div>
                
                {isInvalid && (
                  <div className="mt-4 p-2 bg-destructive/10 border border-destructive/20 rounded text-[11px] text-destructive flex items-center gap-2">
                    <span className="font-bold">⚠️ ERROR:</span>
                    {newAvailable < 0 ? "Available quantity cannot be negative." : "Total quantity cannot be less than current borrowed books."}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting || isInvalid || numChange === 0} className="gap-2">
                  <Save className="h-4 w-4" /> Confirm
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="history" className="pt-4">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Change</th>
                    <th className="px-4 py-3 font-medium">Reason</th>
                    <th className="px-4 py-3 font-medium">Creator</th>
                    <th className="px-4 py-3 font-medium">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoadingLogs ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading history...</td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No inventory history found.</td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="bg-card hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                          {format(new Date(log.createdAt), "dd/MM/yyyy HH:mm")}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-bold ${log.change > 0 ? "text-green-600" : "text-red-600"}`}>
                            {log.change > 0 ? `+${log.change}` : log.change}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-[10px]">
                            {log.reason}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium">{(log as any).user?.name || log.userId}</span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate" title={log.note || ""}>
                          {log.note || "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

