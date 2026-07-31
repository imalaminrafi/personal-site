import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { bottomNavItems } from "./nav";
import { useAppUi } from "./app-ui-context";
import { cn } from "@/lib/utils";

function useActiveNav(pathname: string) {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/services")) return "services";
  if (pathname.startsWith("/portfolio")) return "portfolio";
  if (pathname.startsWith("/blog")) return "blog";
  return "";
}

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { openMenu, menuOpen } = useAppUi();
  const active = useActiveNav(pathname);

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200/80 dark:border-white/[0.06] bg-white/95 dark:bg-[#0a0a14]/95 backdrop-blur-lg pb-safe"
    >
      <div className="grid grid-cols-5 items-stretch max-w-md mx-auto">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.to)}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
              className={cn(
                "flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-t-2xl px-1 py-1.5 transition-colors",
                isActive
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-zinc-400 dark:text-zinc-500 active:text-zinc-700 dark:active:text-zinc-300"
              )}
            >
              <span className="relative">
                <Icon className={cn("h-[22px] w-[22px] transition-transform", isActive && "scale-110")} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-violet-500" />
                )}
              </span>
              <span className="text-[11px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}

        {/* Menu — opens the full-screen drawer */}
        <button
          onClick={openMenu}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
          className={cn(
            "flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-t-2xl px-1 py-1.5 transition-colors",
            menuOpen
              ? "text-violet-600 dark:text-violet-400"
              : "text-zinc-400 dark:text-zinc-500 active:text-zinc-700 dark:active:text-zinc-300"
          )}
        >
          <Menu className="h-[22px] w-[22px]" />
          <span className="text-[11px] font-medium leading-none">Menu</span>
        </button>
      </div>
    </nav>
  );
}
