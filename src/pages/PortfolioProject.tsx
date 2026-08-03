import { useEffect, useMemo } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  MonitorPlay, BookOpen, ArrowLeft, ArrowRight, CheckCircle2,
  Briefcase, Calendar, Globe, MessageSquareQuote
} from "lucide-react";
import ModernHeader from "@/components/modern/Header";
import ProfessionalFooter from "@/components/professional/Footer";
import MobileBottomNav from "@/components/professional/MobileNav";
import ProjectViewer from "@/components/portfolio/ProjectViewer";
import StarRating from "@/components/portfolio/StarRating";
import { getProjectBySlug, loadPortfolio, getAverageRating } from "@/data/portfolio";
import { getOptimizedUrl } from "@/utils/cloudinary";
import { trackPortfolioView, trackPortfolioButton } from "@/utils/analytics";

export default function PortfolioProjectPage() {
  const { slug } = useParams();
  const location = useLocation();
  const project = useMemo(() => (slug ? getProjectBySlug(slug) : undefined), [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!project) return;
    trackPortfolioView(project.title);
    document.title = project.seoTitle || `${project.title} | Alamin Rafi`;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = project.seoDescription || project.description || "";
    return () => {
      document.title = "Alamin Rafi | Web Designer & Developer";
    };
  }, [project]);

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      const timer = window.setTimeout(() => {
        const top = el.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: "smooth" });
      }, 150);
      return () => window.clearTimeout(timer);
    }
  }, [location.hash, slug]);

  const avg = project ? getAverageRating(project) : 0;
  const hasCaseStudy = Boolean(
    project?.caseStudy?.challenge || project?.caseStudy?.approach || project?.caseStudy?.results?.length
  );

  if (!project) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A1628]">
        <ModernHeader />
        <main className="pt-32 pb-24 px-6 text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Project not found</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">This project may have been removed or the link is incorrect.</p>
          <Link to="/portfolio" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>
        </main>
        <ProfessionalFooter />
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A1628]">
      <ModernHeader />
      <main className="pt-24 pb-16">
        {/* ── Hero ── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-400 mb-4">
            <Link to="/portfolio" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Portfolio</Link>
            <ArrowRight className="w-3 h-3" />
            <span className="text-zinc-600 dark:text-zinc-300">{project.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="bg-violet-600/10 text-violet-600 dark:text-violet-400 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="bg-amber-500/10 text-amber-500 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
                {project.title}
              </h1>
              <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-4 leading-relaxed max-w-xl">
                {project.description}
              </p>
              {project.reviews.length > 0 && (
                <div className="flex items-center gap-3 mt-5">
                  <StarRating rating={avg} size="md" />
                  <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{avg.toFixed(1)}</span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">from {project.reviews.length} client review{project.reviews.length !== 1 ? "s" : ""}</span>
                </div>
              )}
              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-zinc-100 dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-white/[0.08]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 shrink-0">
              <a
                href="#live-preview"
                data-ga="portfolio_button_click"
                data-ga-location={project.title}
                onClick={() => trackPortfolioButton(project.title, "live_preview")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-all shadow-lg shadow-violet-600/20"
              >
                <MonitorPlay className="w-4 h-4" /> Live Preview
              </a>
              {hasCaseStudy && (
                <a
                  href="#case-study"
                  onClick={() => trackPortfolioButton(project.title, "case_study")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-100 dark:bg-white/[0.06] text-zinc-800 dark:text-white text-sm font-bold border border-zinc-200 dark:border-white/[0.08] hover:bg-zinc-200 dark:hover:bg-white/[0.1] transition-colors"
                >
                  <BookOpen className="w-4 h-4" /> Case Study
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ── Featured image ── */}
        {project.image && (
          <section className="max-w-6xl mx-auto px-5 sm:px-6 mt-10">
            <div className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/[0.08] shadow-xl">
              <img
                src={getOptimizedUrl(project.image, { width: 1600, crop: "limit", quality: "auto", format: "auto" })}
                alt={project.title}
                className="w-full h-64 sm:h-96 object-cover"
              />
            </div>
          </section>
        )}

        {/* ── Live Preview (embedded) ── */}
        {project.liveUrl && (
          <section id="live-preview" className="max-w-6xl mx-auto px-5 sm:px-6 mt-12 scroll-mt-24">
            <div className="flex items-center gap-2 mb-5">
              <MonitorPlay className="w-5 h-5 text-violet-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">Live Preview</h2>
              <span className="text-[11px] font-semibold text-zinc-400 ml-1">· opened inside this site</span>
            </div>
            <ProjectViewer url={project.liveUrl} title={project.slug} />
          </section>
        )}

        {/* ── Gallery ── */}
        {project.gallery.length > 0 && (
          <section id="gallery" className="max-w-6xl mx-auto px-5 sm:px-6 mt-12 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-5">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.gallery.map((url, i) => (
                <a
                  key={i}
                  href={getOptimizedUrl(url, { width: 1200 })}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/[0.08] block"
                >
                  <img
                    src={getOptimizedUrl(url, { width: 800 })}
                    alt={`${project.title} screenshot ${i + 1}`}
                    className="w-full aspect-[16/10] object-cover hover:scale-[1.03] transition-transform duration-300"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ── Case Study ── */}
        {hasCaseStudy && (
          <section id="case-study" className="max-w-6xl mx-auto px-5 sm:px-6 mt-12 scroll-mt-24">
            <div className="rounded-3xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#0F2040] p-6 sm:p-10">
              <div className="flex items-center gap-2 mb-8">
                <BookOpen className="w-5 h-5 text-violet-500" />
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">Case Study</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-8">
                {project.caseStudy.challenge && (
                  <div>
                    <h3 className="text-sm font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2">The Challenge</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{project.caseStudy.challenge}</p>
                  </div>
                )}
                {project.caseStudy.approach && (
                  <div>
                    <h3 className="text-sm font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2">The Approach</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{project.caseStudy.approach}</p>
                  </div>
                )}
              </div>
              {project.caseStudy.results.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">Results</h3>
                  <ul className="space-y-2.5">
                    {project.caseStudy.results.map((r, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Reviews ── */}
        {project.reviews.length > 0 && (
          <section id="reviews" className="max-w-6xl mx-auto px-5 sm:px-6 mt-12 scroll-mt-24">
            <div className="flex items-center gap-2 mb-5">
              <MessageSquareQuote className="w-5 h-5 text-violet-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">Client Reviews</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {project.reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#0F2040] p-5 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <StarRating rating={review.rating} size="md" />
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Verified Client
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed grow">“{review.text}”</p>
                  <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-white/[0.05]">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">{review.clientName}</p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="inline-flex items-center gap-1"><Briefcase className="w-3 h-3" /> {review.platform}</span>
                          {review.country && (
                            <span className="inline-flex items-center gap-1"><Globe className="w-3 h-3" /> {review.country}</span>
                          )}
                        </p>
                      </div>
                      {review.projectDate && (
                        <span className="text-[11px] text-zinc-400 flex items-center gap-1 shrink-0">
                          <Calendar className="w-3 h-3" /> {review.projectDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Footer CTA ── */}
        <div className="max-w-6xl mx-auto px-5 sm:px-6 mt-14">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-[#C9A84C] to-[#E6C97A] p-6 sm:p-8">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0A1628]">Like this project?</h3>
              <p className="text-sm text-[#0A1628]/80 mt-1">Let's build something great for your business too.</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A1628] text-[#C9A84C] text-sm font-bold hover:bg-[#0A1628]/90 transition-colors"
              >
                Get in Touch
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 text-[#0A1628] text-sm font-bold hover:bg-white/40 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> All Projects
              </Link>
            </div>
          </div>
        </div>

        {/* Next project */}
        {(() => {
          const all = loadPortfolio().sort((a, b) => a.order - b.order);
          const idx = all.findIndex((p) => p.id === project.id);
          const next = all[(idx + 1) % all.length];
          if (!next || next.id === project.id) return null;
          return (
            <div className="max-w-6xl mx-auto px-5 sm:px-6 mt-10">
              <Link
                to={`/portfolio/${next.slug}`}
                className="group flex items-center justify-between rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#0F2040] p-5 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
              >
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Next Project</p>
                  <p className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mt-1">
                    {next.title}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-violet-500 transition-colors" />
              </Link>
            </div>
          );
        })()}
      </main>
      <ProfessionalFooter />
      <MobileBottomNav />
    </div>
  );
}
