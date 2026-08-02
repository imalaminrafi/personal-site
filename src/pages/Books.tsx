import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PublicLayout from "@/components/app/PublicLayout";
import BookCard from "@/components/books/BookCard";
import { getPublishedBooks, loadBooks } from "@/data/books";
import { trackBookView } from "@/utils/analytics";

export default function BooksPage() {
  const books = useMemo(() => getPublishedBooks(), []);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadBooks().forEach((b) => { if (b.published) trackBookView(b.title); });
  }, []);

  return (
    <PublicLayout>
      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-16">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">Books & Guides</p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          Learn from my playbooks
        </h1>
        <p className="mb-12 max-w-xl text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
          Practical guides on building websites, starting a freelance business, and growing online — written from real client work.
        </p>

        {books.length === 0 ? (
          <div className="py-20 text-center text-zinc-400">No books available yet. Check back soon!</div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline">
            Have a question about a book? Contact me <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
