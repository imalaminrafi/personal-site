import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, MonitorPlay, Star } from "lucide-react";
import { getOptimizedUrl, getSrcSet } from "@/utils/cloudinary";
import { PortfolioItem, getAverageRating } from "@/data/portfolio";
import StarRating from "./StarRating";

export default function ProjectCard({ project }: { project: PortfolioItem }) {
  const avg = getAverageRating(project);
  const hasCaseStudy = Boolean(project.caseStudy?.challenge || project.caseStudy?.results?.length);

  return (
    <article className="group bg-white dark:bg-[#0F2040] rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/[0.08] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Featured image */}
      <Link to={`/portfolio/${project.slug}`} className="relative aspect-[16/10] overflow-hidden block bg-zinc-100 dark:bg-[#0F2040]">
        {project.image ? (
          <img
            src={getOptimizedUrl(project.image, { width: 900, crop: "limit", quality: "auto", format: "auto" })}
            srcSet={getSrcSet(project.image) || undefined}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-600 text-xs font-medium">
            No image
          </div>
        )}
        <span className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
          {project.category}
        </span>
        {project.featured && (
          <span className="absolute top-3 right-3 bg-white/95 dark:bg-black/90 text-zinc-900 dark:text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-black/5 dark:border-white/10 shadow-sm">
            Featured
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col grow">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white leading-snug">
          <Link to={`/portfolio/${project.slug}`} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
            {project.title}
          </Link>
        </h3>

        {project.reviews.length > 0 && (
          <div className="flex items-center gap-2 mt-1.5">
            <StarRating rating={avg} />
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              {avg.toFixed(1)} · {project.reviews.length} review{project.reviews.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mt-2 mb-4 grow line-clamp-3">
          {project.description}
        </p>

        {/* Technology tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-md bg-zinc-100 dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-white/[0.08]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2.5 mt-auto">
          <Link
            to={`/portfolio/${project.slug}#live-preview`}
            data-ga="portfolio_button_click"
            data-ga-location={project.title}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors"
          >
            <MonitorPlay className="w-3.5 h-3.5" /> Live Preview
          </Link>
          <Link
            to={`/portfolio/${project.slug}#case-study`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-white/[0.06] text-zinc-800 dark:text-white text-xs font-bold border border-zinc-200 dark:border-white/[0.08] hover:bg-zinc-200 dark:hover:bg-white/[0.1] transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" /> Case Study
          </Link>
        </div>
      </div>
    </article>
  );
}
