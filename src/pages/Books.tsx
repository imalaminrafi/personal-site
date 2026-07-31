import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, BookOpen, Star, Eye, ArrowRight } from "lucide-react";
import PublicLayout from "@/components/app/PublicLayout";
import { getPublishedBooks, loadBooks } from "@/data/books";
import { trackBookView, trackBuyButton } from "@/utils/analytics";
import { getOptimizedUrl } from "@/utils/cloudinary";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={i < Math.round(rating) ? "h-3.5 w-3.5 fill-amber-400 text-amber-400" : "h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600"}
        />
      ))}
    </span>
  );
}

export default function BooksPage() {
  const books = useMemo(() => getPublishedBooks(), []);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadBooks().forEach((b) => { if (b.published) trackBookView(b.title); });
  }, []);

  return (
    <PublicLayout>
      <section className="max-w-5xl mx-auto px-5 sm:px-6 py-10 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">Books & Guides</p>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight mb-3">
          Learn from my playbooks
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-xl leading-relaxed mb-10">
          Practical guides on building websites, starting a freelance business, and growing online — written from real client work.
        </p>

        {books.length === 0 ? (
          <div className="py-20 text-center text-zinc-400">No books available yet. Check back soon!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {books.map((book) => (
              <article
                key={book.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-zinc-100 dark:border-white/[0.06] bg-zinc-50/60 dark:bg-zinc-900/40 hover:border-violet-200 dark:hover:border-violet-800/40 transition-colors"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                  {book.cover ? (
                    <img
                      src={getOptimizedUrl(book.cover, { width: 600, crop: "limit", quality: "auto", format: "auto" })}
                      alt={book.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-400">
                      <BookOpen className="h-8 w-8" />
                      <span className="text-xs">Cover</span>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur">
                    {book.category}
                  </span>
                </div>

                <div className="flex flex-col grow p-5">
                  <h2 className="text-base font-bold text-zinc-900 dark:text-white leading-snug line-clamp-1">{book.title}</h2>
                  <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">{book.subtitle}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 mb-3">{book.description}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <Stars rating={book.rating} />
                    <span className="text-[11px] text-zinc-400">{book.rating}</span>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-2 border-t border-zinc-100 dark:border-white/[0.06] pt-4">
                    <div>
                      <p className="text-lg font-black text-zinc-900 dark:text-white">{book.price}</p>
                      <p className="text-[10px] text-zinc-400">{book.priceNote}</p>
                    </div>
                    <div className="flex gap-2">
                      {book.previewUrl && (
                        <a
                          href={book.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 text-xs font-bold text-zinc-700 transition-colors hover:border-violet-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200"
                        >
                          <Eye className="h-4 w-4" /> Preview
                        </a>
                      )}
                      <a
                        href={book.buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-ga="buy_button_click"
                        data-ga-location={book.title}
                        onClick={() => trackBuyButton(book.title, book.price)}
                        className="flex min-h-[44px] items-center gap-1.5 rounded-xl bg-violet-600 px-4 text-xs font-bold text-white transition-colors hover:bg-violet-700"
                      >
                        <ShoppingCart className="h-4 w-4" /> Buy Now
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-bold text-violet-600 dark:text-violet-400 hover:underline">
            Have a question about a book? Contact me <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
