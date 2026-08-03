import { Link } from "react-router-dom";
import { BookOpen, ShoppingCart } from "lucide-react";
import { getPublishedBooks, getBookAverageRating, getBookReviewCount } from "@/data/books";
import { getOptimizedUrl } from "@/utils/cloudinary";
import { trackBuyButton } from "@/utils/analytics";
import BookStars from "@/components/books/BookStars";

export default function MyBooksSection() {
    const books = getPublishedBooks();
    if (books.length === 0) return null;

    return (
        <section id="books" className="bg-white dark:bg-[#0F172A] py-12 sm:py-14 border-t border-zinc-100 dark:border-white/[0.05]">
            <div className="max-w-5xl mx-auto px-5 sm:px-6">
                {/* ─── Section Header ─── */}
                <div className="mb-8 sm:mb-12">
                    <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">
                        My Books
                    </p>
                    <h2 className="text-xl sm:text-2xl font-medium text-zinc-900 dark:text-white leading-snug">
                        My Books
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 max-w-xl leading-relaxed">
                        Practical guides on AI, business growth, and digital strategy — written by Alamin Rafi.
                    </p>
                </div>

                {/* ─── Book cards (vertical list) ─── */}
                <div className="space-y-4">
                    {books.map((book) => {
                        const avg = getBookAverageRating(book);
                        const count = getBookReviewCount(book);
                        return (
                            <article
                                key={book.id}
                                className="flex gap-4 bg-white dark:bg-[#162032] rounded-2xl border border-[#C9A84C]/15 p-4"
                            >
                                {/* Cover (left) */}
                                <Link
                                    to={`/books/${book.id}`}
                                    className="w-[120px] h-[160px] shrink-0 rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-[#C9A84C] to-[#E6C97A] flex flex-col items-center justify-center gap-2 relative"
                                >
                                    {book.cover ? (
                                        <img
                                            src={getOptimizedUrl(book.cover, { width: 300, crop: "limit", quality: "auto", format: "auto" })}
                                            alt={book.title}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <>
                                            <BookOpen className="h-8 w-8 text-[#0F172A]" />
                                            <span className="px-2 text-center text-[10px] font-bold text-[#0F172A] leading-tight line-clamp-3">
                                                {book.title}
                                            </span>
                                        </>
                                    )}
                                </Link>

                                {/* Details (right) */}
                                <div className="flex-1 min-w-0 flex flex-col">
                                    <Link
                                        to={`/books/${book.id}`}
                                        className="text-base font-bold text-zinc-900 dark:text-white leading-snug line-clamp-2 hover:text-[#C9A84C] transition-colors"
                                    >
                                        {book.title}
                                    </Link>
                                    <p className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                                        {book.subtitle}
                                    </p>

                                    {/* Rating */}
                                    <div className="mt-2 flex items-center gap-1.5">
                                        <BookStars rating={avg} size="md" />
                                        <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{avg.toFixed(1)}</span>
                                        <span className="text-xs text-zinc-400">({count} Reviews)</span>
                                    </div>

                                    {/* What you'll learn */}
                                    <p className="mt-3 text-[13px] font-semibold text-zinc-900 dark:text-white">
                                        What you'll learn:
                                    </p>
                                    <ul className="mt-1 space-y-0.5">
                                        {(book.learnPoints && book.learnPoints.length ? book.learnPoints : []).map((point, i) => (
                                            <li key={i} className="flex items-start gap-1.5 text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                                <span className="text-[#C9A84C] leading-relaxed">•</span>
                                                <span className="line-clamp-1">{point}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-auto pt-3">
                                        {/* Price */}
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg font-bold text-[#C9A84C]">{book.price}</span>
                                            {book.originalPrice && (
                                                <span className="text-sm text-zinc-400 line-through">{book.originalPrice}</span>
                                            )}
                                        </div>

                                        {/* Buy button */}
                                        <a
                                            href={book.buyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            data-ga="buy_button_click"
                                            data-ga-location={book.title}
                                            onClick={() => trackBuyButton(book.title, book.price)}
                                            className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#C9A84C] py-3 text-sm font-bold text-[#0F172A] transition-all hover:brightness-110 active:scale-[0.99]"
                                        >
                                            <ShoppingCart className="h-4 w-4" /> Buy Now
                                        </a>
                                        <p className="mt-1.5 text-center text-xs text-zinc-400">
                                            🔒 Instant Download · PDF
                                        </p>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* ─── Coming soon note ─── */}
                <p className="mt-8 text-center text-sm italic text-zinc-400">
                    More books coming soon — follow for updates.
                </p>
            </div>
        </section>
    );
}
