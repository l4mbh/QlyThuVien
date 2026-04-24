import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import type { FinancialLedgerEntry } from "@/types/report/report.entity";
import { Banknote } from "lucide-react";

interface FinancialLedgerTableProps {
  data: FinancialLedgerEntry[];
}

export const FinancialLedgerTable = ({ data }: FinancialLedgerTableProps) => {
  const total = data.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Banknote className="h-5 w-5 text-emerald-600" />
          Financial Reconciliation Ledger (Today)
        </h3>
        <div className="text-right">
          <p className="text-xs text-slate-500 uppercase font-medium">Total Collected</p>
          <p className="text-xl font-bold text-emerald-600">{total.toLocaleString()}đ</p>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Reader</TableHead>
              <TableHead>Book</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-slate-400">
                  No fines collected today.
                </TableCell>
              </TableRow>
            ) : (
              data.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.readerName}</TableCell>
                  <TableCell className="text-slate-600">{entry.bookTitle}</TableCell>
                  <TableCell className="text-slate-500 text-xs">
                    {format(new Date(entry.date), "HH:mm")}
                  </TableCell>
                  <TableCell className="text-right font-bold text-emerald-600">
                    +{entry.amount.toLocaleString()}đ
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

