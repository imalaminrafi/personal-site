import { useEffect, useMemo, useState } from "react";
import PublicLayout from "@/components/app/PublicLayout";
import { loadGallery, CATEGORIES } from "@/data/gallery";
import { getOptimizedUrl } from "@/utils/cloudinary";
import { cn } from "@/lib/utils";

export default function GalleryPage() {
  const [active, setActive] = useState("All");
  const [items] = useState(() => loadGallery());
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const withImages = useMemo(() => items.filter((i) => i.src), [items]);
  const filtered = useMemo(
    () => (active === "All" ? withImages : withImages.filter((i) => i.category === active)),
    [withImages, active]
  );

  const visibleCategories = useMemo(
    () => ["All", ...CATEGORIES.filter((c) => withImages.some((i) => i.category === c))],
    [withImages]
  );

  return (
    <PublicLayout>
      <section className="max-w-6xl mx-auto px-5 sm:px-6 py-10 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">Gallery</p>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight mb-6">
          Moments behind the work
        </h1>

        {/* Filter chips */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {visibleCategories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors",
                active === c
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-white/[0.06] dark:text-zinc-300 dark:hover:bg-white/[0.12]"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center text-zinc-400">No photos in this category yet.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setLightbox(i)}
                aria-label={`View ${item.alt}`}
                className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-100 dark:bg-[#1E293B]"
              >
                <img
                  src={getOptimizedUrl(item.src, { width: 500, crop: "limit", quality: "auto", format: "auto" })}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-2 pt-8 text-left text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {item.alt}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Photo preview"
        >
          <button
            onClick={() => setLightbox((i) => (i === null || i <= 0 ? filtered.length - 1 : i - 1))}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white"
          >
            ‹
          </button>
          <figure className="max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={getOptimizedUrl(filtered[lightbox].src, { width: 1200, crop: "limit", quality: "auto", format: "auto" })}
              alt={filtered[lightbox].alt}
              className="max-h-[75vh] w-auto rounded-xl object-contain"
            />
            <figcaption className="mt-3 text-center text-sm text-zinc-300">{filtered[lightbox].alt}</figcaption>
          </figure>
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i === null || i >= filtered.length - 1 ? 0 : i + 1)); }}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white"
          >
            ›
          </button>
          <button
            onClick={() => setLightbox(null)}
            aria-label="Close preview"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-lg text-white"
          >
            ✕
          </button>
        </div>
      )}
    </PublicLayout>
  );
}
