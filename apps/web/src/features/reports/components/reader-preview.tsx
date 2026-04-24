import { 
  Trophy, 
  AlertTriangle, 
  UserX,
  AlertCircle
} from "lucide-react";
import { type ReaderActivityReport } from "@/types/report/report.entity";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge/badge";

interface ReaderPreviewProps {
  data: ReaderActivityReport;
}

export const ReaderPreview = ({ data }: ReaderPreviewProps) => {
  const { topReaders, riskyReaders, blockedReadersCount, generatedAt } = data;

  return (
    <div className="p-8 space-y-12 bg-white">
      {/* Header */}
      <div className="flex justify-between items-start border-b pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 uppercase">Reader Activity Report</h2>
          <p className="text-slate-500 font-medium">Engagement & Risk Assessment</p>
        </div>
        <div className="text-right text-xs text-slate-400">
          <p>Generated At: {new Date(generatedAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center gap-4 p-6 rounded-2xl bg-amber-50 border border-amber-100">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-800">Risky Readers</p>
            <p className="text-2xl font-bold text-amber-900">{riskyReaders.length} accounts</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-6 rounded-2xl bg-red-50 border border-red-100">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl">
            <UserX className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-800">Blocked Readers</p>
            <p className="text-2xl font-bold text-red-900">{blockedReadersCount} accounts</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Top Readers */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Hall of Fame (Top 5)
          </h3>
          <div className="border rounded-xl overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Reader</TableHead>
                  <TableHead className="text-right">Borrows</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topReaders.map((reader) => (
                  <TableRow key={reader.id}>
                    <TableCell>
                      <div className="font-semibold text-slate-700">{reader.name}</div>
                      <div className="text-xs text-slate-400">{reader.email}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none">
                        {reader.borrowCount} books
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Risky Readers */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Risk Watchlist
          </h3>
          <div className="border rounded-xl overflow-hidden ring-1 ring-red-100">
            <Table>
              <TableHeader className="bg-red-50/50">
                <TableRow>
                  <TableHead className="text-red-900">Name</TableHead>
                  <TableHead className="text-right text-red-900">Overdue Items</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riskyReaders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8 text-slate-400">
                      No readers with active overdues. Great!
                    </TableCell>
                  </TableRow>
                ) : (
                  riskyReaders.map((reader) => (
                    <TableRow key={reader.id} className="hover:bg-red-50/30">
                      <TableCell className="font-medium text-slate-700">{reader.name}</TableCell>
                      <TableCell className="text-right">
                        <span className="text-red-600 font-bold">{reader.overdueCount}</span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

