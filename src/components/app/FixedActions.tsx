import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowUp, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setVisible(false), [pathname]);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className={cn(
        "fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-lg shadow-zinc-900/10 transition-all hover:text-violet-600 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 lg:bottom-8 lg:right-8",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

/** Persistent "Start Project" CTA — always one tap away on mobile. */
export function FloatingCta() {
  const [visible, setVisible] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 380);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hideOn = ["/contact", "/faq", "/privacy", "/terms", "/login", "/signup"];
  if (hideOn.some((p) => pathname.startsWith(p))) return null;

  return (
    <Link
      to="/contact"
      aria-label="Start a project"
      className={cn(
        "bg-brand-gradient fixed bottom-24 right-4 z-40 flex h-12 items-center gap-2 rounded-full px-5 text-sm font-bold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-105 lg:hidden",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <Send className="h-4 w-4" />
      Start Project
    </Link>
  );
}
