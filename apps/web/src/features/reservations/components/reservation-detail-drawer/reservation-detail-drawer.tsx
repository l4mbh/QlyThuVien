import React from "react";
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
  Mail
} from "lucide-react";
import { format } from "date-fns";
import type { Reservation } from "../../reservation.service";
import { reservationService } from "../../reservation.service";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

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
  if (!reservation) return null;

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      await reservationService.cancel(reservation.id);
      toast.success("Reservation cancelled");
      onUpdate();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel");
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
    <Sheet open={isOpen} onOpenChange={onClose}>
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
        </div>

        <SheetFooter className="p-6 bg-slate-50 border-t border-slate-100 flex-col sm:flex-col gap-3">
          {reservation.status === 'READY' && (
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
          
          {(reservation.status === 'PENDING' || reservation.status === 'READY') && (
            <Button 
              variant="outline" 
              className="w-full border-red-100 text-red-600 hover:bg-red-50 font-bold py-6 rounded-2xl flex items-center justify-center gap-2"
              onClick={handleCancel}
            >
              <Ban size={18} />
              Cancel Reservation
            </Button>
          )}
          
          <Button variant="ghost" className="w-full font-bold" onClick={onClose}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
