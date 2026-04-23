import { type TopBook } from "@/types/report/report.entity";
import { BookCopy, Trophy, User } from "lucide-react";

interface TopBooksListProps {
  data: TopBook[];
}

export const TopBooksList = ({ data }: TopBooksListProps) => {
  return (
    <div className="p-1 bg-slate-50 rounded-xl ring-1 ring-slate-200">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6 space-y-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-tight">
          <Trophy className="h-4 w-4 text-amber-500" />
          Popular This Week
        </h3>
        <div className="space-y-4">
          {data.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-slate-400 text-xs italic">
              No data available
            </div>
          ) : (
            data.map((book, index) => (
              <div key={book.id} className="flex items-center gap-3 group cursor-default">
                <div className="relative flex-none w-10 h-14 bg-slate-100 rounded overflow-hidden shadow-sm">
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                       <BookCopy className="h-4 w-4 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute top-0 left-0 bg-slate-900/80 text-white text-[8px] font-bold px-1 py-0.5 rounded-br">
                    #{index + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate leading-tight mb-0.5">
                    {book.title}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                     <User className="h-2.5 w-2.5" />
                     <span className="truncate">{book.author}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-xs font-black text-slate-700">{book.borrowCount}</span>
                  <span className="text-[8px] text-slate-400 uppercase font-bold tracking-tighter">Loans</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
