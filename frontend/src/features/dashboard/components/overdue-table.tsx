import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertCircle } from "lucide-react";
import { type OverdueDetail } from "@/types/report/report.entity";

interface OverdueTableProps {
  data: OverdueDetail[];
}

export const OverdueTable = ({ data }: OverdueTableProps) => {
  return (
    <Card className="border-none shadow-md bg-white/70 backdrop-blur-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          Critical Overdue
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 font-medium">
          View All <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-slate-400 space-y-2">
            <p>Great! No overdue books today.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="font-semibold text-slate-500">Reader</TableHead>
                <TableHead className="font-semibold text-slate-500">Book</TableHead>
                <TableHead className="font-semibold text-slate-500 text-right">Days Late</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id} className="border-slate-50 group">
                  <TableCell className="font-medium text-slate-700">{item.readerName}</TableCell>
                  <TableCell className="text-slate-600 truncate max-w-[150px]">{item.bookTitle}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="destructive" className="bg-red-50 font-semibold text-red-600 border-none">
                      +{item.daysOverdue}d
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
