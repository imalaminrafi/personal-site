import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Newspaper, Briefcase, BookOpen, Layers } from "lucide-react";
import { useAppUi } from "./app-ui-context";
import { loadPosts } from "@/data/blogData";
import { loadPortfolio } from "@/data/portfolio";
import { getPublishedBooks } from "@/data/books";
import { trackSearch } from "@/utils/analytics";
import { cn } from "@/lib/utils";

const servicesList = [
  { title: "Website Design & Development", to: "/services" },
  { title: "WordPress Website", to: "/services" },
  { title: "Landing Page", to: "/services" },
  { title: "UI/UX Design", to: "/services" },
  { title: "Digital Marketing", to: "/services" },
];

interface SearchResult {
  id: string;
  label: string;
  sub: string;
  to: string;
  group: "Blog" | "Projects" | "Books" | "Services";
  icon: React.ComponentType<{ className?: string }>;
}

const groupIcon: Record<SearchResult["group"], React.ComponentType<{ className?: string }>> = {
  Blog: Newspaper,
  Projects: Briefcase,
  Books: BookOpen,
  Services: Layers,
};

export default function SearchOverlay() {
  const { searchOpen, closeSearch } = useAppUi();
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const all: SearchResult[] = [];
    for (const p of loadPosts()) {
      if ((p.title + " " + p.shortDescription + " " + p.category + " " + p.tags.join(" ")).toLowerCase().includes(q)) {
        all.push({ id: `b-${p.id}`, label: p.title, sub: p.category, to: `/blog/${p.slug}`, group: "Blog", icon: Newspaper });
      }
    }
    for (const pr of loadPortfolio()) {
      if ((pr.title + " " + pr.description + " " + pr.category + " " + pr.tags.join(" ")).toLowerCase().includes(q)) {
        all.push({ id: `p-${pr.id}`, label: pr.title, sub: pr.category, to: "/portfolio", group: "Projects", icon: Briefcase });
      }
    }
    for (const b of getPublishedBooks()) {
      if ((b.title + " " + b.subtitle + " " + b.description).toLowerCase().includes(q)) {
        all.push({ id: `bk-${b.id}`, label: b.title, sub: b.subtitle, to: "/books", group: "Books", icon: BookOpen });
      }
    }
    for (const s of servicesList) {
      if (s.title.toLowerCase().includes(q)) {
        all.push({ id: `s-${s.title}`, label: s.title, sub: "Service", to: s.to, group: "Services", icon: Layers });
      }
    }
    return all.slice(0, 12);
  }, [query]);

  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      setActiveIdx(0);
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!searchOpen) return;
      if (e.key === "Escape") closeSearch();
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, results.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && results[activeIdx]) {
        trackSearch(query.trim(), results.length);
        navigate(results[activeIdx].to);
        closeSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, results, activeIdx, navigate, closeSearch]);

  const go = (to: string) => {
    if (query.trim()) trackSearch(query.trim(), results.length);
    closeSearch();
    navigate(to);
  };

  const groups = useMemo(() => {
    const order: SearchResult["group"][] = ["Blog", "Projects", "Books", "Services"];
    return order
      .map((g) => ({ group: g, items: results.filter((r) => r.group === g) }))
      .filter((g) => g.items.length > 0);
  }, [results]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className={cn(
        "fixed inset-0 z-[90] bg-zinc-50/95 backdrop-blur-sm dark:bg-[#07070f]/95 transition-opacity duration-200",
        searchOpen ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
        {/* Input row */}
        <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 shadow-lg shadow-zinc-200/40 dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
          <Search className="h-5 w-5 shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
            placeholder="Search blogs, projects, books, services…"
            aria-label="Search"
            className="h-14 w-full bg-transparent text-base text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white"
          />
          <button
            onClick={closeSearch}
            aria-label="Close search"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-white/10 dark:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="mt-4 flex-1 overflow-y-auto">
          {query.trim() === "" && (
            <p className="py-10 text-center text-sm text-zinc-400">
              Type to search across the whole site.
            </p>
          )}
          {query.trim() !== "" && results.length === 0 && (
            <p className="py-10 text-center text-sm text-zinc-500">
              No results for “{query}”. Try “website”, “design” or “WordPress”.
            </p>
          )}

          {groups.map(({ group, items }) => {
            const GIcon = groupIcon[group];
            return (
              <section key={group} className="mb-5">
                <h2 className="mb-2 flex items-center gap-1.5 px-1 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                  <GIcon className="h-3.5 w-3.5" /> {group}
                </h2>
                <ul className="space-y-1.5">
                  {items.map((r) => {
                    const globalIdx = results.indexOf(r);
                    return (
                      <li key={r.id}>
                        <button
                          onClick={() => go(r.to)}
                          onMouseEnter={() => setActiveIdx(globalIdx)}
                          className={cn(
                            "flex min-h-[52px] w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-colors",
                            globalIdx === activeIdx
                              ? "bg-violet-50 dark:bg-violet-500/10"
                              : "bg-white hover:bg-zinc-50 dark:bg-white/[0.04] dark:hover:bg-white/[0.07]"
                          )}
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
                            <r.icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-zinc-900 dark:text-white">{r.label}</span>
                            <span className="block truncate text-xs text-zinc-400">{r.sub}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}

          {results.length > 0 && (
            <p className="pb-4 text-center text-[11px] text-zinc-400">
              Use <kbd className="rounded border border-zinc-300 px-1 dark:border-white/20">↑</kbd>{" "}
              <kbd className="rounded border border-zinc-300 px-1 dark:border-white/20">↓</kbd> and{" "}
              <kbd className="rounded border border-zinc-300 px-1 dark:border-white/20">Enter</kbd> to navigate
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
