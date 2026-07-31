import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu } from "lucide-react";
import { useAppUi } from "./app-ui-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const desktopLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Blog", to: "/blog" },
  { label: "Books", to: "/books" },
  { label: "Contact", to: "/contact" },
];

export default function SiteHeader() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { openSearch, openMenu } = useAppUi();

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      setHidden(y > 120 && y > lastY);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cmd/Ctrl+K opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSearch]);

  // Reset when route changes so the header is visible at top of new pages
  useEffect(() => {
    setHidden(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-[60] transition-transform duration-300",
        hidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div
        className={cn(
          "transition-all duration-300",
          scrolled
            ? "border-b border-zinc-200/80 bg-white/90 shadow-sm backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#07070f]/90"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="Alamin Rafi — home">
            <div className="bg-brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black text-white shadow-md">
              AR
            </div>
            <span className="hidden bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-lg font-black tracking-tight text-transparent sm:block">
              Alamin Rafi
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
            {desktopLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  pathname === l.to
                    ? "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={openSearch}
              aria-label="Search"
              className="flex h-11 w-11 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
            >
              <Search className="h-[21px] w-[21px]" />
            </button>
            <ThemeToggle />
            <Link
              to="/contact"
              className="bg-brand-gradient hidden h-11 items-center rounded-full px-5 text-sm font-bold text-white shadow-md shadow-violet-500/20 transition-transform hover:scale-105 lg:inline-flex"
            >
              Hire Me
            </Link>
            <button
              onClick={openMenu}
              aria-label="Open menu"
              className="flex h-11 w-11 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white lg:hidden"
            >
              <Menu className="h-[21px] w-[21px]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
