import { useEffect, useMemo, useState } from "react";
import PublicLayout from "@/components/app/PublicLayout";
import { getPublishedTestimonials } from "@/data/testimonials";
import { Star, Quote } from "lucide-react";
import { getOptimizedUrl } from "@/utils/cloudinary";

export default function TestimonialsPage() {
  const [items] = useState(() => getPublishedTestimonials());
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const sorted = useMemo(
    () => [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [items]
  );

  const markError = (id: string) => setImgErrors((prev) => ({ ...prev, [id]: true }));

  return (
    <PublicLayout>
      <section className="max-w-5xl mx-auto px-5 sm:px-6 py-10 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">Testimonials</p>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight mb-3">What clients say</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-xl leading-relaxed mb-10">
          Real feedback from clients around the world who trusted me with their websites and digital projects.
        </p>

        {sorted.length === 0 ? (
          <div className="py-20 text-center text-zinc-400">No testimonials yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sorted.map((t) => (
              <figure key={t.id} className="flex flex-col rounded-2xl border border-zinc-100 dark:border-white/[0.08] bg-zinc-50/60 dark:bg-[#12233F] p-6 hover:border-[#C9A84C]/40 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <Quote className="h-6 w-6 text-violet-300 dark:text-violet-700" />
                  <span className="flex items-center gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={i < t.rating ? "h-4 w-4 fill-amber-400 text-amber-400" : "h-4 w-4 text-zinc-300 dark:text-zinc-600"} />
                    ))}
                  </span>
                </div>
                <blockquote className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-200 grow">"{t.review}"</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  {t.photo && !imgErrors[t.id] ? (
                    <img
                      src={getOptimizedUrl(t.photo, { width: 100, crop: "fill", quality: "auto", format: "auto" })}
                      alt={t.clientName}
                      loading="lazy"
                      className="h-10 w-10 rounded-full object-cover"
                      onError={() => markError(t.id)}
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
                      {t.clientName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">{t.clientName}</p>
                    <p className="text-xs text-zinc-400">{t.company}{t.country ? ` · ${t.country}` : ""}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
