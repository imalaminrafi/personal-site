import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogIn, Lock, Search, ExternalLink } from "lucide-react";
import { moreSheetLinks, moreSheetSecondaryLinks } from "./nav";
import { useAppUi } from "./app-ui-context";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

export default function MoreSheet() {
  const { menuOpen, closeMenu, openSearch } = useAppUi();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { admin } = useAdminAuth();

  useEffect(() => {
    if (menuOpen) closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const go = (to: string) => {
    closeMenu();
    navigate(to);
  };

  const socials = [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/imalaminrafi/" },
    { label: "GitHub", href: "https://github.com/imalaminrafi" },
    { label: "X", href: "https://x.com/imalaminrafi" },
    { label: "Behance", href: "https://www.behance.net/imalaminrafi" },
  ];

  return (
    <Drawer open={menuOpen} onOpenChange={(o) => { if (!o) closeMenu(); }} shouldScaleBackground={false}>
      <DrawerContent className="rounded-t-[24px] border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-[#0b0b16]">
        <DrawerHeader className="pb-2 text-left">
          <DrawerTitle className="text-[17px] font-black text-zinc-900 dark:text-white">More</DrawerTitle>
          <DrawerDescription className="text-xs text-zinc-400">Everything else, one tap away.</DrawerDescription>
        </DrawerHeader>

        <div className="max-h-[62vh] overflow-y-auto px-3 pb-safe">
          {/* Primary links */}
          <nav aria-label="More links" className="flex flex-col gap-1">
            {moreSheetLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => go(link.to)}
                className={cn(
                  "flex min-h-[52px] items-center justify-between rounded-2xl px-4 py-2.5 text-left transition-colors duration-200",
                  pathname === link.to
                    ? "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/[0.06]"
                )}
              >
                <span>
                  <span className="block text-[15px] font-semibold">{link.label}</span>
                  <span className="mt-0.5 block text-[11px] text-zinc-400">{link.description}</span>
                </span>
                <span className="text-lg text-zinc-300 dark:text-zinc-600">›</span>
              </button>
            ))}
          </nav>

          {/* Secondary links */}
          <nav aria-label="More links secondary" className="mt-4 border-t border-zinc-200 dark:border-white/[0.08] pt-3">
            <ul className="flex flex-col gap-0.5">
              {moreSheetSecondaryLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => go(link.to)}
                    className={cn(
                      "flex min-h-[44px] w-full items-center justify-between rounded-xl px-4 py-2 text-left text-sm transition-colors duration-200",
                      pathname === link.to
                        ? "font-semibold text-violet-600 dark:text-violet-400"
                        : "font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
                    )}
                  >
                    {link.label}
                    <span className="text-zinc-300 dark:text-zinc-600">›</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Search shortcut */}
          <button
            onClick={() => { closeMenu(); openSearch(); }}
            className="mt-4 flex min-h-[48px] w-full items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 text-left text-sm text-zinc-400 shadow-sm transition-colors hover:border-violet-300 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-violet-700"
          >
            <Search className="h-4 w-4" />
            Search blogs, projects, books…
          </button>

          {/* Admin (hidden from normal visitors) */}
          {admin && (
            <button
              onClick={() => go("/admin/dashboard")}
              className="mt-4 flex min-h-[48px] w-full items-center gap-3 rounded-2xl border border-dashed border-zinc-300 px-4 text-sm font-semibold text-zinc-500 transition-colors hover:border-violet-400 hover:text-violet-600 dark:border-white/15 dark:text-zinc-400 dark:hover:text-violet-400"
            >
              <LogIn className="h-4 w-4" />
              Admin Dashboard
            </button>
          )}

          {/* Socials */}
          <div className="mt-5 flex flex-wrap gap-2 px-1">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[38px] items-center gap-1.5 rounded-full bg-zinc-100 px-3.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-white/[0.06] dark:text-zinc-300 dark:hover:bg-white/[0.12]"
              >
                {s.label}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>

          <p className="mt-5 flex items-center justify-center gap-1 pb-4 text-[11px] text-zinc-400">
            <Lock className="h-3 w-3" />
            © {new Date().getFullYear()} Alamin Rafi
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
