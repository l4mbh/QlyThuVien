import React from "react";
import type { Reader } from "@/types/reader/reader.entity";
import { Card, CardContent } from "@/components/ui/card";
import { User, Library } from "lucide-react";

interface LibraryCardPreviewProps {
  reader: Reader;
}

export const LibraryCardPreview: React.FC<LibraryCardPreviewProps> = ({ reader }) => {
  return (
    <div className="p-1 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl overflow-hidden shadow-xl max-w-sm mx-auto">
      <Card className="border-none bg-background/80 backdrop-blur-sm relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full -ml-12 -mb-12 blur-xl" />
        
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <Library className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight uppercase">City Library</h3>
                <p className="text-[10px] text-muted-foreground font-medium">ESTABLISHED 2024</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Membership Card</span>
            </div>
          </div>

          <div className="flex gap-6 items-center">
            {/* Photo Placeholder */}
            <div className="w-24 h-32 bg-muted rounded-md border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 shrink-0">
              <div className="w-12 h-12 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                <User className="h-6 w-6 text-muted-foreground/40" />
              </div>
              <span className="text-[8px] text-muted-foreground/60 font-medium uppercase text-center px-1">
                ATTACH PHOTO HERE
              </span>
            </div>

            <div className="space-y-4 flex-1">
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Reader Name</p>
                <p className="font-bold text-lg leading-tight truncate">{reader.name}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Reader ID</p>
                <p className="font-mono text-sm tracking-wider">{reader.id.slice(0, 8).toUpperCase()}</p>
              </div>

              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Issue Date</p>
                  <p className="text-xs font-medium">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="w-12 h-12 bg-white p-1 rounded-sm border border-muted">
                  {/* Mock QR Code placeholder */}
                  <div className="w-full h-full bg-slate-900 flex flex-wrap gap-[1px]">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className={`w-[22%] h-[22%] ${Math.random() > 0.5 ? 'bg-white' : 'bg-slate-900'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        {/* Bottom bar */}
        <div className="h-1.5 w-full bg-primary" />
      </Card>
    </div>
  );
};

