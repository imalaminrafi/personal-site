import { Link } from "react-router-dom";
import { ShoppingCart, BookOpen } from "lucide-react";
import { getOptimizedUrl } from "@/utils/cloudinary";
import { Book, getBookAverageRating, getBookReviewCount } from "@/data/books";
import { trackBuyButton } from "@/utils/analytics";
import BookStars from "./BookStars";

export default function BookCard({ book }: { book: Book }) {
  const avg = getBookAverageRating(book);
  const count = getBookReviewCount(book);

  return (
    <article className="group flex flex-col">
      {/* Cover tile */}
      <Link
        to={`/books/${book.id}`}
        className="relative block aspect-[16/10] overflow-hidden rounded-xl border border-zinc-200/80 dark:border-white/[0.08] bg-zinc-100 dark:bg-[#0F2040]"
      >
        {book.cover ? (
          <img
            src={getOptimizedUrl(book.cover, { width: 600, crop: "limit", quality: "auto", format: "auto" })}
            alt={book.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-zinc-300 dark:text-zinc-600">
            <BookOpen className="h-6 w-6" />
            <span className="text-[10px] font-medium">Cover</span>
          </span>
        )}
        <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-700 backdrop-blur dark:bg-black/70 dark:text-white">
          {book.category}
        </span>
      </Link>

      {/* Body */}
      <div className="flex grow flex-col pt-3.5">
        <Link to={`/books/${book.id}`} className="text-[15px] font-semibold leading-snug text-zinc-900 dark:text-white line-clamp-1 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
          {book.title}
        </Link>
        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">{book.subtitle}</p>

        {/* Rating between title and price */}
        <div className="mt-2 flex items-center gap-1.5">
          <BookStars rating={avg} size="md" />
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{avg.toFixed(1)}</span>
          <span className="text-xs text-zinc-400">({count} Reviews)</span>
        </div>

        {/* Price + buy */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-100 pt-3 dark:border-white/[0.06]">
          <span className="text-[15px] font-bold text-zinc-900 dark:text-white">{book.price}</span>
          <a
            href={book.buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-ga="buy_button_click"
            data-ga-location={book.title}
            onClick={() => trackBuyButton(book.title, book.price)}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-violet-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-violet-700"
          >
            <ShoppingCart className="h-3.5 w-3.5" /> Buy
          </a>
        </div>
      </div>
    </article>
  );
}
