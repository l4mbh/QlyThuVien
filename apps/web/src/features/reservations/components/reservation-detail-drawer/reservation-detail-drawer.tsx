import React, { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Book as BookIcon, 
  Clock, 
  Calendar, 
  Ban, 
  CheckCircle2, 
  ArrowRight,
  Phone,
  Mail,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import type { Reservation } from "../../reservation.service";
import { reservationService } from "../../reservation.service";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const CANCEL_REASONS = [
  { value: "BOOK_DAMAGED_OR_LOST", label: "Book damaged or lost" },
  { value: "BOOK_RECALLED", label: "Book recalled by library" },
  { value: "DUPLICATE_RESERVATION", label: "Duplicate reservation" },
  { value: "READER_NO_SHOW", label: "Reader did not collect in time" },
  { value: "READER_REQUEST", label: "Reader request" },
  { value: "INVENTORY_ADJUSTMENT", label: "Inventory adjustment" },
  { value: "OTHER", label: "Other (please specify)" },
] as const;

interface ReservationDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  onUpdate: () => void;
  onProcessBorrow: (reservation: Reservation) => void;
}

export const ReservationDetailDrawer: React.FC<ReservationDetailDrawerProps> = ({
  isOpen,
  onClose,
  reservation,
  onUpdate,
  onProcessBorrow,
}) => {
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelNote, setCancelNote] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const cancelFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showCancelForm && cancelFormRef.current) {
      setTimeout(() => {
        cancelFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [showCancelForm]);

  if (!reservation) return null;

  const resetCancelForm = () => {
    setShowCancelForm(false);
    setCancelReason("");
    setCancelNote("");
  };

  const handleCancel = async () => {
    if (!cancelReason) {
      toast.error("Please select a reason for cancellation.");
      return;
    }
    if (cancelReason === "OTHER" && !cancelNote.trim()) {
      toast.error("Please provide a note for 'Other' reason.");
      return;
    }

    const reasonLabel = CANCEL_REASONS.find(r => r.value === cancelReason)?.label || cancelReason;

    try {
      setIsCancelling(true);
      await reservationService.cancel(reservation.id, {
        reason: reasonLabel,
        note: cancelNote.trim() || undefined,
      });
      toast.success("Reservation cancelled");
      resetCancelForm();
      onUpdate();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel");
    } finally {
      setIsCancelling(false);
    }
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-orange-100 text-orange-700 border-orange-200",
    READY: "bg-green-100 text-green-700 border-green-200",
    COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
    CANCELLED: "bg-slate-100 text-slate-500 border-slate-200",
    EXPIRED: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) { resetCancelForm(); onClose(); } }}>
      <SheetContent className="sm:max-w-md flex flex-col h-full p-0 gap-0">
        <SheetHeader className="p-6 pb-2">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-xl font-black">Reservation Details</SheetTitle>
            <Badge variant="outline" className={statusColors[reservation.status]}>
              {reservation.status}
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Section: Book */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <BookIcon size={12} className="text-primary" />
              Target Book
            </h4>
            <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="w-16 h-24 bg-white rounded-xl shadow-sm overflow-hidden flex-shrink-0 border border-slate-200/50">
                  {reservation.book.coverUrl ? (
                    <img src={reservation.book.coverUrl} alt={reservation.book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <BookIcon size={24} />
                    </div>
                  )}
               </div>
               <div className="flex flex-col justify-center min-w-0">
                  <h3 className="font-bold text-slate-900 leading-tight truncate">{reservation.book.title}</h3>
                  <p className="text-xs font-black text-primary uppercase mt-1 italic">{reservation.book.author}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-slate-400">Available:</span>
                    <Badge variant="secondary" className="h-5 text-[10px] px-1.5">{reservation.book.availableQuantity}</Badge>
                  </div>
               </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Section: Reader */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <User size={12} className="text-primary" />
              Requested By
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black">
                  {reservation.user?.name?.charAt(0) || "G"}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{reservation.user?.name || "Guest Reader"}</p>
                  <p className="text-xs font-medium text-slate-500">ID: {reservation.userId.slice(-8).toUpperCase()}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 pt-2">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                   <Phone size={14} className="text-primary/60" />
                   {reservation.user?.phoneNormalized || "N/A"}
                </div>
                {reservation.user?.email && (
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                    <Mail size={14} className="text-primary/60" />
                    {reservation.user.email}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Section: Timeline */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Clock size={12} className="text-primary" />
              Queue Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Joined Queue</span>
                  <span className="text-xs font-black text-slate-900">{format(new Date(reservation.createdAt), "MMM dd, HH:mm")}</span>
               </div>
               <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Current Position</span>
                  <span className="text-xs font-black text-primary"># {reservation.position || "N/A"}</span>
               </div>
            </div>
            
            {reservation.status === 'READY' && reservation.expiresAt && (
              <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-green-700 block mb-1">Ready Since</span>
                  <span className="text-xs font-black text-green-800">{format(new Date(reservation.updatedAt), "MMM dd, HH:mm")}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-green-700 block mb-1">Expires In</span>
                  <span className="text-xs font-black text-green-800">
                    {format(new Date(reservation.expiresAt), "MMM dd, HH:mm")}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Cancel Reason Form (inline) */}
          {showCancelForm && (
            <>
              <Separator className="bg-red-100" />
              <div ref={cancelFormRef} className="space-y-4 p-4 bg-red-50/50 rounded-2xl border border-red-100">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-2">
                  <AlertTriangle size={12} />
                  Cancel Reason
                </h4>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-red-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300"
                >
                  <option value="">-- Select a reason --</option>
                  {CANCEL_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <textarea
                  value={cancelNote}
                  onChange={(e) => setCancelNote(e.target.value)}
                  placeholder={cancelReason === "OTHER" ? "Note is required for 'Other' reason..." : "Additional note (optional)..."}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-red-200 bg-white text-sm font-medium text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 font-bold rounded-xl"
                    onClick={resetCancelForm}
                    disabled={isCancelling}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
                    onClick={handleCancel}
                    disabled={isCancelling || !cancelReason}
                  >
                    {isCancelling ? "Cancelling..." : "Confirm Cancel"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        <SheetFooter className="p-6 bg-slate-50 border-t border-slate-100 flex-col sm:flex-col gap-3">
          {reservation.status === 'READY' && !showCancelForm && (
            <div className="w-full space-y-2">
              {reservation.book.availableQuantity <= 0 && (
                <p className="text-[10px] font-bold text-red-600 bg-red-50 p-2 rounded-lg border border-red-100 flex items-center gap-2">
                  <Ban size={12} />
                  Book currently out of stock. Please wait for a return.
                </p>
              )}
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white font-black py-6 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                onClick={() => onProcessBorrow(reservation)}
                disabled={reservation.book.availableQuantity <= 0}
              >
                <CheckCircle2 size={18} />
                Issue to Reader
                <ArrowRight size={18} className="ml-1" />
              </Button>
            </div>
          )}
          
          {(reservation.status === 'PENDING' || reservation.status === 'READY') && !showCancelForm && (
            <Button 
              variant="outline" 
              className="w-full border-red-100 text-red-600 hover:bg-red-50 font-bold py-6 rounded-2xl flex items-center justify-center gap-2"
              onClick={() => setShowCancelForm(true)}
            >
              <Ban size={18} />
              Cancel Reservation
            </Button>
          )}
          
          {!showCancelForm && (
            <Button variant="ghost" className="w-full font-bold" onClick={onClose}>
              Close
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
