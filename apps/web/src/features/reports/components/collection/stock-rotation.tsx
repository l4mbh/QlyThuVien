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
import type { CollectionHealth } from "@/types/report/report.entity";
import { TrendingUp, Ghost } from "lucide-react";

interface StockRotationTableProps {
  data: CollectionHealth;
}

export const StockRotationTable = ({ data }: StockRotationTableProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Best Sellers */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700">
          <TrendingUp className="h-5 w-5" />
          Top Requested Books
        </h3>
        <div className="rounded-md border border-blue-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-blue-50">
              <TableRow>
                <TableHead>Book Title</TableHead>
                <TableHead className="text-right">Borrows</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.bestSellers.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium text-slate-700">{book.title}</TableCell>
                  <TableCell className="text-right font-bold text-blue-600">
                    {book.borrowCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dead Stock */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-500">
          <Ghost className="h-5 w-5" />
          "Dead Stock" (Not borrowed &gt; 6m)
        </h3>
        <div className="rounded-md border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Book Title</TableHead>
                <TableHead className="text-right">Last Borrowed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.deadStock.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-10 text-slate-400 italic">
                    No items in dead stock.
                  </TableCell>
                </TableRow>
              ) : (
                data.deadStock.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium text-slate-600">{book.title}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="font-normal text-slate-400 border-slate-200">
                        {book.lastBorrowedAt 
                          ? format(new Date(book.lastBorrowedAt), "MMM yyyy")
                          : "Never"
                        }
                      </Badge>
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

