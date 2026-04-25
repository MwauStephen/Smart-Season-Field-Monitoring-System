import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Map, 
  Users, 
  Settings, 
  LogOut, 
  Sprout, 
  ChevronRight,
  ClipboardList,
  Moon,
  Sun
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { user, logout, isAdmin } = useAuth();
  const { theme, setTheme } = useTheme();

  const adminLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Field Management", href: "/dashboard/fields", icon: Map },
    { name: "User Management", href: "/dashboard/users", icon: Users },
  ];

  const agentLinks = [
    { name: "My Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Fields", href: "/dashboard/fields", icon: ClipboardList },
  ];

  const links = isAdmin ? adminLinks : agentLinks;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-brand-dark border-r border-border shadow-sm overflow-hidden">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-brand-green/10 p-2 rounded-lg ring-1 ring-brand-green/20">
          <Sprout className="w-6 h-6 text-brand-green" />
        </div>
        <span className="text-xl font-bold tracking-tight text-brand-dark dark:text-white">
          Crop<span className="text-brand-green">Lens</span>
        </span>
      </div>

      <div className="px-4 flex-1 space-y-6 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="space-y-1">
          <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
            Main Menu
          </p>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-brand-green text-white shadow-md shadow-brand-green/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <link.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-muted-foreground group-hover:text-brand-green")} />
                  {link.name}
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
              </Link>
            );
          })}
        </div>

        <Separator className="mx-2 opacity-50" />

        <div className="space-y-1">
          <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
            System
          </p>
          <Link
            to="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              pathname === "/dashboard/settings"
                ? "bg-brand-green text-white"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </div>
      </div>

      <div className="p-4 mt-auto">
        <div className="bg-muted/50 rounded-2xl p-4 mb-4 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green font-bold text-sm">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground capitalize font-medium">{user?.role}</p>
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <Button 
              variant="outline" 
              size="sm" 
              className={cn("flex-1 h-8 rounded-lg", theme === 'light' && "bg-brand-green/10 border-brand-green text-brand-green")}
              onClick={() => setTheme('light')}
            >
              <Sun className="w-3.5 h-3.5 mr-1.5" /> Light
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className={cn("flex-1 h-8 rounded-lg", theme === 'dark' && "bg-brand-green/10 border-brand-green text-brand-green")}
              onClick={() => setTheme('dark')}
            >
              <Moon className="w-3.5 h-3.5 mr-1.5" /> Dark
            </Button>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg h-9"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
