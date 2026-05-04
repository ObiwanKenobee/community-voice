import { Link, useRouterState } from "@tanstack/react-router";
import { Sprout, Users, Landmark, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Community", icon: Users },
  { to: "/council", label: "Council", icon: Landmark },
  { to: "/transparency", label: "Open Ledger", icon: ScrollText },
] as const;

export function SiteHeader() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) =>
    to === "/" ? path === "/" || path.startsWith("/proposals") || path.startsWith("/allocation") : path.startsWith(to);

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
            <Sprout className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold">Common Ground</div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Community Governance</div>
          </div>
        </Link>
        <nav className="flex items-center gap-1 rounded-full border border-border bg-card/60 p-1">
          {navItems.map((item) => {
            const Active = isActive(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors",
                  Active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/70 hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
