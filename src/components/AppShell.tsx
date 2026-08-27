import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookMarked,
  Bot,
  CalendarClock,
  LayoutDashboard,
  ListChecks,
  Menu,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppStore } from "@/lib/app-store";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/planner", label: "AI Task Planner", icon: CalendarClock },
  { to: "/research", label: "Research Assistant", icon: Search },
  { to: "/assistant", label: "AI Assistant", icon: Bot },
  { to: "/tasks", label: "My Tasks", icon: ListChecks },
  { to: "/saved", label: "Saved Research", icon: BookMarked },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1 px-3">
      <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/50">
        Workspace
      </p>
      {navItems.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-all duration-200",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              active &&
                "bg-sidebar-primary/15 text-sidebar-accent-foreground shadow-[inset_0_0_0_1px_var(--sidebar-border)]",
            )}
          >
            <Icon className={cn("h-[18px] w-[18px] shrink-0 transition-colors", active && "text-sidebar-primary")} />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBrand() {
  return (
    <div className="flex items-center gap-3 border-b border-sidebar-border px-6 py-5">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-gradient shadow-[var(--shadow-float)]">
        <Sparkles className="h-5 w-5 text-primary-foreground" />
      </div>
      <div className="min-w-0">
        <p className="truncate font-display text-[15px] font-semibold text-sidebar-accent-foreground">FlowDesk AI</p>
        <p className="truncate text-xs text-sidebar-foreground/55">Workplace productivity</p>
      </div>
    </div>
  );
}

function SidebarFooter() {
  return (
    <div className="mt-auto px-5 pb-6 pt-4">
      <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-3.5">
        <div className="flex items-center gap-2 text-sidebar-accent-foreground">
          <ShieldCheck className="h-4 w-4 shrink-0 text-sidebar-primary" />
          <p className="text-xs font-semibold">No account required</p>
        </div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-sidebar-foreground/60">
          Your information is processed within this application and is not stored on a server.
        </p>
      </div>
    </div>
  );
}

function ThemeToggle() {
  const { prefs, setPrefs } = useAppStore();
  const isDark = prefs.theme === "dark";

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle colour mode"
            onClick={() => setPrefs({ theme: isDark ? "light" : "dark" })}
            className="rounded-full text-muted-foreground hover:text-foreground"
          >
            {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{isDark ? "Switch to light mode" : "Switch to dark mode"}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col bg-sidebar lg:flex">
        <SidebarBrand />
        <div className="flex flex-1 flex-col overflow-y-auto py-4">
          <NavList />
          <SidebarFooter />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-[264px]">
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-md">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] border-sidebar-border bg-sidebar p-0">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <div className="flex h-full flex-col">
                    <SidebarBrand />
                    <div className="flex flex-1 flex-col overflow-y-auto py-4">
                      <NavList onNavigate={() => setOpen(false)} />
                      <SidebarFooter />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <span className="font-display text-sm font-semibold lg:hidden">FlowDesk AI</span>
            </div>

            <div className="hidden min-w-0 justify-center md:flex">
              <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/70 px-3.5 py-1.5">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                <p className="truncate text-xs text-muted-foreground">
                  AI-generated content may require human review
                </p>
              </div>
            </div>

            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
