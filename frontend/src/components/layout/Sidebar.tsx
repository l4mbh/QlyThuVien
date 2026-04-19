import { Link, useLocation } from "react-router-dom";
import { BookOpen, Users, BookCopy, LayoutDashboard, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "Books", href: "/books" },
  { icon: Users, label: "Readers", href: "/readers" },
  { icon: BookCopy, label: "Borrow", href: "/borrow" },
];

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "bg-card border-r border-border h-full transition-all duration-300 flex flex-col shrink-0 overflow-hidden",
        isOpen ? "w-64" : "w-16 sm:w-20"
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {isOpen && (
          <span className="font-bold text-lg text-primary truncate">LibMgnt</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="shrink-0"
        >
          <Menu className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {isOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
