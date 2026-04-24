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
import type { DailyOperation } from "@/types/report/report.entity";
import { ClipboardList, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface DailyDeskSummaryProps {
  data: DailyOperation[];
}

export const DailyDeskSummary = ({ data }: DailyDeskSummaryProps) => {
  const borrows = data.filter(op => op.type === 'BORROW').length;
  const returns = data.filter(op => op.type === 'RETURN').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Borrows Today</p>
            <p className="text-2xl font-bold text-blue-900">{borrows}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <ArrowUpRight className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-green-600 uppercase tracking-wider">Returns Today</p>
            <p className="text-2xl font-bold text-green-900">{returns}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <ArrowDownLeft className="h-5 w-5 text-green-600" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-slate-500" />
          Recent Daily Logs
        </h3>

        <div className="rounded-md border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead>Book Title</TableHead>
                <TableHead>Reader</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-slate-400">
                    No operations recorded today.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((op) => (
                  <TableRow key={op.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={op.type === 'BORROW' 
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-100" 
                          : "bg-green-100 text-green-700 hover:bg-green-100"
                        }
                      >
                        {op.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{op.bookTitle}</TableCell>
                    <TableCell>{op.readerName}</TableCell>
                    <TableCell className="text-right text-slate-500 text-xs">
                      {format(new Date(op.timestamp), "HH:mm")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

