import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Globe, Code2, Layout, Figma, ArrowRight, Layers, BadgeDollarSign,
  Briefcase, Mail, Star, ShoppingCart, Clock, Calendar, MessageCircle, Zap,
} from "lucide-react";
import PublicLayout from "@/components/app/PublicLayout";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { author } from "@/data/author";
import { plans } from "@/data/pricingData";
import { loadPortfolio } from "@/data/portfolio";
import { loadPosts } from "@/data/blogData";
import { getPublishedBooks } from "@/data/books";
import { getFeaturedTestimonials } from "@/data/testimonials";
import { getOptimizedUrl, getSrcSet, getThumbnailUrl } from "@/utils/cloudinary";
import { trackWhatsAppClick } from "@/utils/analytics";
import { cn } from "@/lib/utils";

const WHATSAPP_URL = "https://wa.me/8801917443161?text=Hi%20Alamin!%20I'd%20like%20to%20start%20a%20project.";

/* ─── Quick actions ─────────────────────────────────────────────────── */
const quickActions = [
  { label: "Services", to: "/services", icon: Layers, tint: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300" },
  { label: "Pricing", to: "/pricing", icon: BadgeDollarSign, tint: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300" },
  { label: "Portfolio", to: "/portfolio", icon: Briefcase, tint: "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-300" },
  { label: "Contact", to: "/contact", icon: Mail, tint: "bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300" },
];

/* ─── Featured services ─────────────────────────────────────────────── */
const featuredServices = [
  { icon: Globe, title: "Website Design", desc: "Fast, modern, responsive sites", tint: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300" },
  { icon: Code2, title: "WordPress", desc: "Easy-to-manage business sites", tint: "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-300" },
  { icon: Layout, title: "Landing Pages", desc: "High-converting simple pages", tint: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300" },
  { icon: Figma, title: "UI/UX Design", desc: "Clean, modern interface design", tint: "bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300" },
];

function SectionHeading({ title, to, linkLabel }: { title: string; to?: string; linkLabel?: string }) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <h2 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">{title}</h2>
      {to && (
        <Link to={to} className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400">
          {linkLabel || "See all"} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ModernPage() {
  const featuredProjects = useMemo(() => {
    const all = loadPortfolio();
    const featured = all.filter((p) => p.featured);
    return (featured.length >= 3 ? featured : all).slice(0, 3);
  }, []);

  const latestPosts = useMemo(
    () =>
      loadPosts()
        .filter((p) => p.status === "published")
        .sort((a, b) => new Date(b.publishedDate || b.updatedDate).getTime() - new Date(a.publishedDate || a.updatedDate).getTime())
        .slice(0, 3),
    []
  );

  const books = useMemo(() => getPublishedBooks().slice(0, 3), []);
  const testimonials = useMemo(() => getFeaturedTestimonials().slice(0, 2), []);

  return (
    <PublicLayout>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="px-5 pb-3 pt-5" aria-label="Introduction">
        <div className="flex items-center gap-3.5">
          {author.image ? (
            <img
              src={getThumbnailUrl(author.image, 120)}
              alt={author.name}
              className="h-14 w-14 rounded-2xl object-cover shadow-md"
            />
          ) : (
            <div className="bg-brand-gradient flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-black text-white shadow-md">
              AR
            </div>
          )}
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Available for projects
            </p>
            <h1 className="text-[22px] font-black tracking-tight text-zinc-900 dark:text-white">Hey, I'm {author.name.split(" ")[0]}</h1>
            <p className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">{author.jobTitle}</p>
          </div>
        </div>
        <p className="mt-3 max-w-md text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
          I build fast, modern websites that help businesses grow — design, development, WordPress, and SEO in one place.
        </p>
        <div className="mt-4 flex gap-2.5">
          <Link
            to="/contact"
            className="bg-brand-gradient flex min-h-[46px] flex-1 items-center justify-center gap-1.5 rounded-2xl px-5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-transform active:scale-[0.98]"
          >
            Start Project <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-ga="whatsapp_click"
            data-ga-location="home_hero"
            onClick={() => trackWhatsAppClick("home_hero")}
            className="flex min-h-[46px] items-center justify-center gap-1.5 rounded-2xl border border-zinc-200 bg-white px-5 text-sm font-bold text-zinc-700 transition-colors hover:border-violet-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200"
          >
            <Zap className="h-4 w-4 text-emerald-500" /> WhatsApp
          </a>
        </div>
      </section>

      {/* ── Quick Actions ────────────────────────────────────────── */}
      <section className="px-5 pt-4" aria-label="Quick actions">
        <div className="grid grid-cols-4 gap-2.5">
          {quickActions.map((qa) => {
            const Icon = qa.icon;
            return (
              <Link
                key={qa.label}
                to={qa.to}
                className="flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-zinc-100 bg-zinc-50/80 px-1 py-2.5 transition-colors active:bg-zinc-100 dark:border-white/[0.06] dark:bg-white/[0.04] dark:active:bg-white/[0.08]"
              >
                <span className={cn("flex h-9 w-9 items-center justify-center rounded-full", qa.tint)}>
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="text-[10px] font-semibold text-zinc-700 dark:text-zinc-200">{qa.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Featured Services ────────────────────────────────────── */}
      <section className="border-t border-zinc-100 px-5 py-6 dark:border-white/[0.06]" aria-label="Services">
        <SectionHeading title="Services" to="/services" />
        <div className="grid grid-cols-2 gap-2.5">
          {featuredServices.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.title}
                to="/services"
                className="flex min-h-[76px] items-center gap-3 rounded-2xl border border-zinc-100 bg-white p-3 shadow-sm transition-colors active:bg-zinc-50 dark:border-white/[0.06] dark:bg-white/[0.03] dark:active:bg-white/[0.06]"
              >
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", s.tint)}>
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-bold text-zinc-900 dark:text-white">{s.title}</span>
                  <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">{s.desc}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Pricing Preview ──────────────────────────────────────── */}
      <section id="pricing" className="border-t border-zinc-100 px-5 py-6 dark:border-white/[0.06]" aria-label="Pricing">
        <SectionHeading title="Pricing" to="/pricing" />
        <div className="grid grid-cols-3 gap-2.5">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "flex flex-col rounded-2xl border p-3",
                plan.highlighted
                  ? "border-violet-300 bg-violet-50/70 dark:border-violet-700/50 dark:bg-violet-500/10"
                  : "border-zinc-100 bg-white dark:border-white/[0.06] dark:bg-white/[0.03]"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-zinc-900 dark:text-white">{plan.name}</span>
                {plan.highlighted && (
                  <span className="rounded-full bg-violet-600 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">Popular</span>
                )}
              </div>
              <p className="mt-1 truncate text-[15px] font-black text-zinc-900 dark:text-white">{plan.priceLabel}</p>
              <p className="text-[10px] text-zinc-400">{plan.delivery}</p>
              <Link
                to="/contact"
                className={cn(
                  "mt-2 flex min-h-[38px] items-center justify-center rounded-xl text-xs font-bold transition-colors",
                  plan.highlighted
                    ? "bg-violet-600 text-white hover:bg-violet-700"
                    : "border border-zinc-200 bg-white text-zinc-700 hover:border-violet-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200"
                )}
              >
                {plan.ctaLabel}
              </Link>
            </div>
          ))}
        </div>
        <Link
          to="/pricing"
          className="mt-3 flex min-h-[44px] items-center justify-center gap-1.5 rounded-2xl border border-zinc-200 text-sm font-bold text-zinc-700 transition-colors hover:border-violet-300 dark:border-white/10 dark:text-zinc-200"
        >
          View Full Pricing <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* ── Featured Portfolio ───────────────────────────────────── */}
      <section className="border-t border-zinc-100 px-5 py-6 dark:border-white/[0.06]" aria-label="Portfolio">
        <SectionHeading title="Selected Work" to="/portfolio" linkLabel="View All" />
        <div className="space-y-3">
          {featuredProjects.map((p) => (
            <Link
              key={p.id}
              to="/portfolio"
              className="flex overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-colors active:bg-zinc-50 dark:border-white/[0.06] dark:bg-white/[0.03] dark:active:bg-white/[0.06]"
            >
              <div className="h-24 w-28 shrink-0 overflow-hidden bg-zinc-200 dark:bg-zinc-800 sm:h-28 sm:w-40">
                {p.image && (
                  <img
                    src={getOptimizedUrl(p.image, { width: 300, crop: "limit", quality: "auto", format: "auto" })}
                    srcSet={getSrcSet(p.image) || undefined}
                    sizes="160px"
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex min-w-0 flex-col justify-center p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">{p.category}</span>
                <h3 className="mt-0.5 truncate text-[15px] font-bold text-zinc-900 dark:text-white">{p.title}</h3>
                <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">{p.description}</p>
                <span className="mt-1.5 flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400">
                  View <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <Link
          to="/portfolio"
          data-ga="portfolio_button_click"
          data-ga-location="home_view_all"
          className="mt-3 flex min-h-[44px] items-center justify-center gap-1.5 rounded-2xl border border-zinc-200 text-sm font-bold text-zinc-700 transition-colors hover:border-violet-300 dark:border-white/10 dark:text-zinc-200"
        >
          View All Portfolio <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* ── Latest Blogs ─────────────────────────────────────────── */}
      <section className="border-t border-zinc-100 px-5 py-6 dark:border-white/[0.06]" aria-label="Latest blog posts">
        <SectionHeading title="Latest Blogs" to="/blog" />
        <div className="space-y-2.5">
          {latestPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-white p-3 shadow-sm transition-colors active:bg-zinc-50 dark:border-white/[0.06] dark:bg-white/[0.03] dark:active:bg-white/[0.06]"
            >
              <div className="h-14 w-[68px] shrink-0 overflow-hidden rounded-xl bg-zinc-200 dark:bg-zinc-800">
                {post.featuredImage && (
                  <img
                    src={getThumbnailUrl(post.featuredImage, 140)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-1 text-[14px] font-bold text-zinc-900 dark:text-white">{post.title}</h3>
                <p className="mt-0.5 flex items-center gap-2 text-[11px] text-zinc-400">
                  <span className="font-semibold text-violet-600 dark:text-violet-400">{post.category}</span>
                  <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{post.readingTime || 5} min</span>
                  <span className="flex items-center gap-0.5"><Calendar className="h-3 w-3" />{formatDate(post.publishedDate || post.updatedDate)}</span>
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-zinc-300 dark:text-zinc-600" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Books ────────────────────────────────────────────────── */}
      {books.length > 0 && (
        <section className="border-t border-zinc-100 px-5 py-6 dark:border-white/[0.06]" aria-label="Books">
          <SectionHeading title="Books" to="/books" />
          <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1 scrollbar-none snap-x">
            {books.map((b) => (
              <div
                key={b.id}
                className="w-40 shrink-0 snap-start rounded-2xl border border-zinc-100 bg-white p-3 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03]"
              >
                <div className="flex h-16 items-center justify-center rounded-xl bg-violet-50 text-violet-400 dark:bg-violet-500/10">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="mt-2 line-clamp-1 text-[13px] font-bold text-zinc-900 dark:text-white">{b.title}</h3>
                <p className="text-[11px] text-zinc-400">{b.subtitle}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-black text-zinc-900 dark:text-white">{b.price}</span>
                  <a
                    href={b.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ga="buy_button_click"
                    data-ga-location={b.title}
                    className="flex min-h-[32px] items-center gap-1 rounded-lg bg-violet-600 px-2.5 text-[11px] font-bold text-white"
                  >
                    <ShoppingCart className="h-3 w-3" /> Buy
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Testimonials ─────────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="border-t border-zinc-100 px-5 py-6 dark:border-white/[0.06]" aria-label="Testimonials">
          <SectionHeading title="What Clients Say" to="/testimonials" />
          <div className="space-y-2.5">
            {testimonials.map((t) => (
              <figure key={t.id} className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03]">
                <div className="mb-1.5 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={i < t.rating ? "h-3 w-3 fill-amber-400 text-amber-400" : "h-3 w-3 text-zinc-300 dark:text-zinc-600"} />
                  ))}
                </div>
                <blockquote className="line-clamp-2 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">"{t.review}"</blockquote>
                <figcaption className="mt-2 text-xs font-bold text-zinc-900 dark:text-white">
                  {t.clientName} <span className="font-normal text-zinc-400">· {t.company}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ── Contact CTA ──────────────────────────────────────────── */}
      <section id="contact" className="px-5 py-6" aria-label="Contact">
        <div className="bg-brand-gradient rounded-3xl p-5 text-white shadow-xl shadow-violet-600/20">
          <h2 className="text-xl font-black tracking-tight">Have a project in mind?</h2>
          <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-white/85">
            Tell me about it — I'll reply within 24 hours with ideas and a clear quote.
          </p>
          <div className="mt-4 flex gap-2.5">
            <Link
              to="/contact"
              className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-2xl bg-white px-4 text-sm font-bold text-violet-700 transition-transform active:scale-[0.98]"
            >
              Contact Me <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-ga="whatsapp_click"
              data-ga-location="home_cta"
              onClick={() => trackWhatsAppClick("home_cta")}
              className="flex min-h-[44px] flex-1 items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-4 text-sm font-bold text-white transition-colors active:bg-white/20"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      <PWAInstallPrompt />
    </PublicLayout>
  );
}
