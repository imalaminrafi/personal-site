import { useEffect, useMemo, useState } from "react";
import { FolderOpen, LayoutGrid } from "lucide-react";
import ModernHeader from "@/components/modern/Header";
import ProfessionalFooter from "@/components/professional/Footer";
import MobileBottomNav from "@/components/professional/MobileNav";
import ProjectCard from "@/components/portfolio/ProjectCard";
import { loadPortfolio, CATEGORIES } from "@/data/portfolio";
import { trackPortfolioView } from "@/utils/analytics";
import { cn } from "@/lib/utils";

export default function PortfolioPage() {
  const [category, setCategory] = useState("All");

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPortfolioView("all");
  }, []);

  const projects = useMemo(() => {
    const list = loadPortfolio().sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.order - b.order;
    });
    return category === "All" ? list : list.filter((p) => p.category === category);
  }, [category]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A1628]">
      <ModernHeader />
      <main className="pt-24 pb-16">
        <section className="max-w-6xl mx-auto px-5 sm:px-6">
          {/* Header */}
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3 flex items-center gap-2">
              <FolderOpen className="w-4 h-4" /> Full Portfolio
            </p>
            <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
              Selected Work &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500">
                Case Studies
              </span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-4 max-w-2xl leading-relaxed">
              Real projects built for clients — from high-converting landing pages to full e-commerce platforms.
              Each project includes an embedded live preview and client reviews.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border",
                  category === c
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-transparent shadow-sm"
                    : "bg-white dark:bg-[#0F2040] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-24 text-zinc-400 dark:text-zinc-500">
              <LayoutGrid className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-bold">No projects in this category yet</p>
            </div>
          )}
        </section>
      </main>
      <ProfessionalFooter />
      <MobileBottomNav />
    </div>
  );
}
