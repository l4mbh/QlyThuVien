import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { type OverdueDetail } from "@/types/report/report.entity";
import { format } from "date-fns";

interface OverdueTableProps {
  data: OverdueDetail[];
}

export const OverdueTable = ({ data }: OverdueTableProps) => {
  if (data.length === 0) return null;

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-slate-100">
          <TableHead className="font-bold text-[10px] text-slate-400 uppercase tracking-wider px-6">Reader</TableHead>
          <TableHead className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Book</TableHead>
          <TableHead className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Due Date</TableHead>
          <TableHead className="font-bold text-[10px] text-slate-400 uppercase tracking-wider text-right px-6">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id} className="border-slate-50 group hover:bg-slate-50/50 transition-colors">
            <TableCell className="px-6">
              <p className="font-bold text-sm text-slate-700">{item.readerName}</p>
            </TableCell>
            <TableCell>
              <p className="text-xs text-slate-600 truncate max-w-[200px] font-medium">{item.bookTitle}</p>
            </TableCell>
            <TableCell>
               <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-700">{format(new Date(item.dueDate), 'MMM dd, yyyy')}</p>
                  <Badge variant="destructive" className="h-4 text-[9px] px-1 bg-red-100 text-red-600 border-none font-extrabold uppercase">
                    {item.daysOverdue} days late
                  </Badge>
               </div>
            </TableCell>
            <TableCell className="text-right px-6">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-full"
                title="Send Reminder"
              >
                <Bell className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

