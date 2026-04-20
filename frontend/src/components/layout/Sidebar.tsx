import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Users, BookCopy, LayoutDashboard, Menu, LogOut, BarChart3, Tags } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth.hook";
import { UserRole } from "@/types/auth/user.entity";
import { toast } from "sonner";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "Books", href: "/books" },
  { icon: Tags, label: "Categories", href: "/categories" },
  { icon: Users, label: "Readers", href: "/readers" },
  { icon: BookCopy, label: "Borrow", href: "/borrow" },
  { icon: BarChart3, label: "Reports", href: "/reports", roles: [UserRole.ADMIN] },
];

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const filteredNavItems = navItems.filter(item => 
    !item.roles || (user && item.roles.includes(user.role))
  );

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
        {filteredNavItems.map((item) => {
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

      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors justify-start",
            !isOpen && "justify-center px-0"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {isOpen && <span className="font-medium">Logout</span>}
        </Button>
      </div>
    </aside>
  );
};
