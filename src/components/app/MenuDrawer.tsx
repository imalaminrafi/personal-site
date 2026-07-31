import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { X, Search, LogIn, Lock } from "lucide-react";
import { menuLinks } from "./nav";
import { useAppUi } from "./app-ui-context";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export default function MenuDrawer() {
  const { menuOpen, closeMenu, openSearch } = useAppUi();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { admin } = useAdminAuth();

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const socials = [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/imalaminrafi/" },
    { label: "GitHub", href: "https://github.com/imalaminrafi" },
    { label: "X / Twitter", href: "https://x.com/imalaminrafi" },
    { label: "Facebook", href: "https://www.facebook.com/alamin.rafiofficial" },
    { label: "Behance", href: "https://www.behance.net/imalaminrafi" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className={cn(
        "fixed inset-0 z-[80] bg-zinc-50 dark:bg-[#07070f] transition-opacity duration-300",
        menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-full w-full max-w-2xl flex-col overflow-y-auto transition-transform duration-300",
          menuOpen ? "translate-y-0" : "-translate-y-4"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
          <button
            onClick={() => { closeMenu(); navigate("/"); }}
            className="flex items-center gap-2.5"
            aria-label="Go to home"
          >
            <div className="bg-brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-white text-sm font-black shadow-md">
              AR
            </div>
            <span className="bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-base font-black tracking-tight text-transparent">
              Alamin Rafi
            </span>
          </button>
          <button
            onClick={closeMenu}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-white/[0.06] dark:text-zinc-300 dark:hover:bg-white/[0.12]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search entry */}
        <button
          onClick={() => { closeMenu(); openSearch(); }}
          className="mx-5 mb-5 flex min-h-[48px] items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 text-left text-sm text-zinc-400 shadow-sm transition-colors hover:border-violet-300 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-violet-700"
        >
          <Search className="h-4 w-4" />
          Search blogs, projects, books…
          <kbd className="ml-auto hidden rounded-md border border-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-400 dark:border-white/10 sm:block">
            ⌘K
          </kbd>
        </button>

        {/* Links */}
        <nav className="flex-1 px-3" aria-label="Menu links">
          <ul className="flex flex-col gap-1">
            {menuLinks.map((link) => (
              <li key={link.id}>
                <Link
                  to={link.to}
                  onClick={closeMenu}
                  className={cn(
                    "flex min-h-[56px] items-center justify-between rounded-2xl px-4 py-3 transition-colors",
                    pathname === link.to
                      ? "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/[0.06]"
                  )}
                >
                  <span>
                    <span className="block text-[15px] font-semibold">{link.label}</span>
                    <span className="mt-0.5 block text-xs text-zinc-400">{link.description}</span>
                  </span>
                  <span className="text-zinc-300 dark:text-zinc-600">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
          <div className="mb-4 flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm ring-1 ring-zinc-100 dark:bg-white/[0.04] dark:ring-white/10">
            <span className="px-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">Appearance</span>
            <ThemeToggle />
          </div>

          <div className="flex flex-wrap gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[40px] items-center rounded-full bg-zinc-100 px-4 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-white/[0.06] dark:text-zinc-300 dark:hover:bg-white/[0.12]"
              >
                {s.label}
              </a>
            ))}
          </div>

          {admin && (
            <Link
              to="/admin/dashboard"
              onClick={closeMenu}
              className="mt-4 flex min-h-[44px] items-center gap-2 rounded-xl border border-dashed border-zinc-300 px-4 text-xs font-semibold text-zinc-400 transition-colors hover:border-violet-400 hover:text-violet-600 dark:border-white/15 dark:text-zinc-500 dark:hover:text-violet-400"
            >
              <LogIn className="h-4 w-4" />
              Admin Dashboard
            </Link>
          )}
          <p className="mt-4 text-center text-[11px] text-zinc-400">
            <Lock className="mr-1 inline h-3 w-3" />
            © {new Date().getFullYear()} Alamin Rafi. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
