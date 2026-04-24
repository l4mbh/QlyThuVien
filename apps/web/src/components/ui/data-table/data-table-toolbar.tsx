import { Plus, Search, Download, Upload, Trash2, X } from "lucide-react";
import { Button } from "../button";
import { Input } from "../input";

interface DataTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  onAdd?: () => void;
  showExport?: boolean;
  showImport?: boolean;
  selectedCount?: number;
  onBulkDelete?: () => void;
  onClearSelection?: () => void;
  children?: React.ReactNode;
}

export function DataTableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  onAdd,
  showExport = false,
  showImport = false,
  selectedCount = 0,
  onBulkDelete,
  onClearSelection,
  children,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Search Area */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 bg-background border-muted-foreground/20 focus:border-primary transition-colors"
          />
        </div>

        {/* Custom Filters */}
        {children && (
          <div className="flex items-center gap-2 flex-1 lg:flex-none">
            {children}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {showImport && (
            <Button variant="outline" size="sm" className="h-10 gap-2 border-dashed">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
            </Button>
          )}
          {showExport && (
            <Button variant="outline" size="sm" className="h-10 gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          )}
          {onAdd && (
            <Button onClick={onAdd} className="h-10 gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" />
              <span>Add new</span>
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between px-4 py-2 bg-primary/5 border border-primary/20 rounded-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-primary">
              Selected {selectedCount} rows
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearSelection}
              className="h-8 px-2 text-muted-foreground hover:text-primary"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={onBulkDelete}
            className="h-8 gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Bulk Delete
          </Button>
        </div>
      )}
    </div>
  );
}

