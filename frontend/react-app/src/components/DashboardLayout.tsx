
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom";

export function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:inset-y-0">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6 shadow-sm">
          <Sheet>
            <SheetTrigger 
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "text-foreground flex items-center justify-center rounded-lg hover:bg-muted"
              )}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation</span>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 border-r-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Crop<span className="text-brand-green">Lens</span>
          </span>
        </header>

        <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
