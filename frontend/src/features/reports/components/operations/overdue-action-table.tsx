import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge/badge";
import type { ActionableOverdue } from "@/types/report/report.entity";
import { Phone, AlertTriangle } from "lucide-react";

interface OverdueActionTableProps {
  data: ActionableOverdue[];
}

export const OverdueActionTable = ({ data }: OverdueActionTableProps) => {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-400">
        <p>No overdue items requiring immediate action.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Actionable Overdue List
        </h3>
        <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
          {data.length} Items
        </Badge>
      </div>

      <div className="rounded-md border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Book Title</TableHead>
              <TableHead>Reader</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-center">Days Late</TableHead>
              <TableHead className="text-right">Est. Fine</TableHead>
              <TableHead className="print:hidden">Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.borrowItemId} className="hover:bg-slate-50/50">
                <TableCell className="font-medium">{item.bookTitle}</TableCell>
                <TableCell>{item.readerName}</TableCell>
                <TableCell>{format(new Date(item.dueDate), "dd MMM yyyy")}</TableCell>
                <TableCell className="text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    item.daysOverdue > 7 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                  }`}>
                    {item.daysOverdue} days
                  </span>
                </TableCell>
                <TableCell className="text-right font-semibold text-red-600">
                  {item.estimatedFine.toLocaleString()}đ
                </TableCell>
                <TableCell className="print:hidden">
                  {item.readerPhone ? (
                    <a 
                      href={`tel:${item.readerPhone}`} 
                      className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                    >
                      <Phone className="h-3 w-3" />
                      {item.readerPhone}
                    </a>
                  ) : (
                    <span className="text-slate-400 text-xs italic">No phone</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <p className="text-[10px] text-slate-400 italic print:block hidden">
        Report generated on {new Date().toLocaleString()}
      </p>
    </div>
  );
};
