import { 
  Package, 
  CheckCircle, 
  ArrowRightLeft,
  Tag
} from "lucide-react";
import { type InventoryReport } from "@/types/report/report.entity";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface InventoryPreviewProps {
  data: InventoryReport;
}

export const InventoryPreview = ({ data }: InventoryPreviewProps) => {
  const { totalBooks, available, borrowed, byCategory, generatedAt } = data;

  return (
    <div className="p-8 space-y-10 bg-white">
      {/* Header */}
      <div className="flex justify-between items-start border-b pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 uppercase">Inventory Report</h2>
          <p className="text-slate-500 font-medium italic">Current Snapshot</p>
        </div>
        <div className="text-right text-xs text-slate-400">
          <p>Generated At: {new Date(generatedAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-2">
          <div className="flex justify-between items-center opacity-60">
            <span className="text-xs font-bold uppercase tracking-widest">Total Repository</span>
            <Package className="h-4 w-4" />
          </div>
          <p className="text-4xl font-black">{totalBooks}</p>
          <p className="text-xs opacity-50">Total physical units in library</p>
        </div>

        <div className="p-6 rounded-2xl border-2 border-emerald-100 bg-emerald-50 text-emerald-900 space-y-2">
          <div className="flex justify-between items-center opacity-60">
            <span className="text-xs font-bold uppercase tracking-widest">Available</span>
            <CheckCircle className="h-4 w-4" />
          </div>
          <p className="text-4xl font-black">{available}</p>
          <p className="text-xs text-emerald-600 font-medium">Ready for checkout ({(available/totalBooks*100).toFixed(1)}%)</p>
        </div>

        <div className="p-6 rounded-2xl border-2 border-blue-100 bg-blue-50 text-blue-900 space-y-2">
          <div className="flex justify-between items-center opacity-60">
            <span className="text-xs font-bold uppercase tracking-widest">On Borrow</span>
            <ArrowRightLeft className="h-4 w-4" />
          </div>
          <p className="text-4xl font-black">{borrowed}</p>
          <p className="text-xs text-blue-600 font-medium">Currently with readers ({(borrowed/totalBooks*100).toFixed(1)}%)</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Tag className="h-5 w-5 text-indigo-500" />
          Distribution by Category
        </h3>
        <div className="border rounded-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead className="text-right">Book Count</TableHead>
                <TableHead className="text-right">Share (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {byCategory.map((cat) => (
                <TableRow key={cat.categoryId}>
                  <TableCell className="font-medium text-slate-700">{cat.categoryName}</TableCell>
                  <TableCell className="text-right font-bold">{cat.count}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-slate-400">{(cat.count / totalBooks * 100).toFixed(1)}%</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500" 
                          style={{ width: `${(cat.count / totalBooks * 100)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
