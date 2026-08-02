import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ShoppingCart, Eye, BookOpen, ArrowLeft, CheckCircle2, Globe, Calendar
} from "lucide-react";
import PublicLayout from "@/components/app/PublicLayout";
import BookStars from "@/components/books/BookStars";
import { getBookById, getBookAverageRating, getBookReviewCount } from "@/data/books";
import { getOptimizedUrl } from "@/utils/cloudinary";
import { trackBookView, trackBuyButton } from "@/utils/analytics";

function formatDate(date: string) {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return date;
  }
}

export default function BookDetailPage() {
  const { id } = useParams();
  const book = useMemo(() => (id ? getBookById(id) : undefined), [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (book) {
      trackBookView(book.title);
      document.title = `${book.title} | Alamin Rafi`;
    }
    return () => { document.title = "Alamin Rafi | Web Designer & Developer"; };
  }, [book]);

  if (!book) {
    return (
      <PublicLayout>
        <section className="mx-auto max-w-5xl px-5 py-24 text-center sm:px-6">
          <BookOpen className="mx-auto mb-4 h-10 w-10 text-zinc-300 dark:text-zinc-600" />
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Book not found</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">This book may have been removed or the link is incorrect.</p>
          <Link to="/books" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700">
            <ArrowLeft className="h-4 w-4" /> Back to Books
          </Link>
        </section>
      </PublicLayout>
    );
  }

  const avg = getBookAverageRating(book);
  const count = getBookReviewCount(book);

  return (
    <PublicLayout>
      <section className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 text-xs text-zinc-400">
          <Link to="/books" className="font-medium hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Books</Link>
          <span>/</span>
          <span className="text-zinc-600 dark:text-zinc-300">{book.title}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col gap-8 sm:flex-row">
          {/* Cover */}
          <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-100 dark:border-white/[0.08] dark:bg-[#0F2040] sm:aspect-auto sm:h-72 sm:w-56">
            {book.cover ? (
              <img
                src={getOptimizedUrl(book.cover, { width: 700, crop: "limit", quality: "auto", format: "auto" })}
                alt={book.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-300 dark:text-zinc-600">
                <BookOpen className="h-9 w-9" />
                <span className="text-xs">Cover</span>
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <span className="inline-block rounded-full bg-violet-600/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              {book.category}
            </span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              {book.title}
            </h1>
            <p className="mt-1 text-sm font-medium text-violet-600 dark:text-violet-400">{book.subtitle}</p>

            {/* Average rating */}
            <div className="mt-3.5 flex items-center gap-2">
              <BookStars rating={avg} size="lg" />
              <span className="text-sm font-semibold text-zinc-900 dark:text-white">{avg.toFixed(1)}</span>
              <span className="text-xs text-zinc-400">{count} Reviews</span>
            </div>

            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
              {book.description}
            </p>

            <div className="mt-6">
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{book.price}</p>
              <p className="mt-0.5 text-xs text-zinc-400">{book.priceNote}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <a
                href={book.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-ga="buy_button_click"
                data-ga-location={book.title}
                onClick={() => trackBuyButton(book.title, book.price)}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
              >
                <ShoppingCart className="h-4 w-4" /> Buy Now
              </a>
              {book.previewUrl && (
                <a
                  href={book.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition-colors hover:border-violet-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200"
                >
                  <Eye className="h-4 w-4" /> Preview
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-14">
          <div className="flex items-end justify-between gap-4 border-b border-zinc-100 pb-4 dark:border-white/[0.06]">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Customer Reviews</h2>
              <p className="mt-0.5 text-xs text-zinc-400">
                Average {avg.toFixed(1)} out of 5 · based on {count} review{count !== 1 ? "s" : ""}
              </p>
            </div>
            <span className="hidden sm:block">
              <BookStars rating={avg} size="lg" />
            </span>
          </div>

          {book.reviews.length === 0 ? (
            <p className="py-16 text-center text-sm text-zinc-400">No reviews yet for this book.</p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
              {book.reviews.map((review) => (
                <div key={review.id} className="flex flex-col">
                  <BookStars rating={review.rating} />
                  <p className="mt-3 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-200">
                    “{review.text}”
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-100 pt-3 dark:border-white/[0.06]">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">{review.name}</p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-zinc-400">
                        {review.country && (
                          <span className="inline-flex items-center gap-1"><Globe className="h-3 w-3" /> {review.country}</span>
                        )}
                        {review.date && (
                          <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(review.date)}</span>
                        )}
                      </p>
                    </div>
                    {review.verified && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" /> Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-14 text-center">
          <Link to="/books" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to all books
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
