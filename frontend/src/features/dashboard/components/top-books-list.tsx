import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type TopBook } from "@/types/report/report.entity";
import { BookCopy, Trophy } from "lucide-react";

interface TopBooksListProps {
  data: TopBook[];
}

export const TopBooksList = ({ data }: TopBooksListProps) => {
  return (
    <Card className="border-none shadow-md bg-white/70 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Top Borrowed Books
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-slate-400">
            No data available
          </div>
        ) : (
          data.map((book, index) => (
            <div key={book.id} className="flex items-center gap-4 group">
              <div className="flex-none w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                #{index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700 truncate group-hover:text-primary transition-colors">
                  {book.title}
                </p>
                <p className="text-xs text-slate-400 truncate">{book.author}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                <BookCopy className="h-3.5 w-3.5" />
                {book.borrowCount}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
