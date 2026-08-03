import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Book, BookReview, loadBooks, saveBooks, getBookAverageRating, getBookReviewCount } from "@/data/books";
import { BookOpen, Plus, Trash2, Search, X, Star, FileText, CheckCircle2, Edit2, MessageSquareQuote } from "lucide-react";
import CloudinaryUploadButton from "@/components/cloudinary/CloudinaryUploadButton";
import { getOptimizedUrl } from "@/utils/cloudinary";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Business", "Design", "WordPress", "Marketing", "Coding", "Career"];

const emptyReview: BookReview = {
  id: "", name: "", country: "", rating: 5, text: "", date: "", verified: true,
};

const empty: Book = {
  id: "", title: "", subtitle: "", description: "", cover: "", price: "$",
  priceNote: "One-time purchase · Instant PDF", buyUrl: "", previewUrl: "",
  category: "Business", pages: 0, rating: 0, reviews: [], featured: false, published: true,
  createdAt: "",
};

export default function AdminBook() {
  const [list, setList] = useState<Book[]>([]);
  const [modal, setModal] = useState<Book | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [reviewEditor, setReviewEditor] = useState<BookReview | null>(null);

  useEffect(() => { setList(loadBooks()); }, []);

  const save = (updated: Book[]) => {
    saveBooks(updated);
    setList(updated);
  };

  const filtered = list.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () =>
    setModal({ ...empty, reviews: [], id: `b${Date.now()}`, createdAt: new Date().toISOString() });

  const deleteBook = (id: string) => {
    if (!confirm("Delete this book?")) return;
    save(list.filter((b) => b.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal) return;
    setSaving(true);
    const exists = list.find((b) => b.id === modal.id);
    if (exists) {
      save(list.map((b) => (b.id === modal.id ? modal : b)));
    } else {
      save([modal, ...list]);
    }
    setSaving(false);
    setModal(null);
  };

  /* ── Reviews ── */
  function openNewReview() {
    setReviewEditor({ ...emptyReview, id: "br" + Date.now() });
  }

  function saveReview() {
    if (!reviewEditor || !modal) return;
    const exists = modal.reviews.some((r) => r.id === reviewEditor.id);
    const reviews = exists
      ? modal.reviews.map((r) => (r.id === reviewEditor.id ? reviewEditor : r))
      : [...modal.reviews, reviewEditor];
    setModal({ ...modal, reviews });
    setReviewEditor(null);
  }

  function deleteReview(id: string) {
    if (!modal) return;
    if (confirm("Delete this review?")) {
      setModal({ ...modal, reviews: modal.reviews.filter((r) => r.id !== id) });
    }
  }

  return (
    <AdminLayout title="Books">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {list.length} book{list.length !== 1 ? "s" : ""}
        </p>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors">
          <Plus className="w-4 h-4" /> Add Book
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search books..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((book) => (
          <div key={book.id} className="bg-white dark:bg-[#0F2040] rounded-2xl border border-zinc-200 dark:border-white/[0.08] p-4 flex gap-4 relative">
            <div className="w-20 h-28 rounded-xl overflow-hidden border border-zinc-200 dark:border-white/[0.08] shrink-0 bg-zinc-100 dark:bg-[#0F2040] flex items-center justify-center">
              {book.cover ? (
                <img src={getOptimizedUrl(book.cover, { width: 300 })} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <BookOpen className="w-7 h-7 text-zinc-300 dark:text-zinc-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-2">{book.title}</p>
                <button onClick={() => deleteBook(book.id)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0 -mt-1 -mr-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{book.subtitle}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-[10px] font-bold text-violet-500 bg-violet-50 dark:bg-violet-500/10 px-1.5 py-0.5 rounded">{book.category}</span>
                <span className="text-xs font-black text-zinc-900 dark:text-white">{book.price}</span>
                <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500">
                  <Star className="w-3 h-3 fill-amber-500" /> {getBookAverageRating(book).toFixed(1)}
                </span>
                <span className="text-[10px] font-bold text-zinc-400">
                  <MessageSquareQuote className="w-2.5 h-2.5 inline-block mr-0.5" />{getBookReviewCount(book)} reviews
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", book.published ? "bg-emerald-500/10 text-emerald-500" : "bg-zinc-500/10 text-zinc-500")}>
                  {book.published ? "Published" : "Draft"}
                </span>
                {book.featured && (
                  <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded">Featured</span>
                )}
                {book.previewUrl && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded">
                    <FileText className="w-2.5 h-2.5" /> PDF
                  </span>
                )}
              </div>
            </div>
            <button onClick={() => setModal({ ...book })}
              className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-300 text-[11px] font-bold hover:bg-violet-100 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
              Edit
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-20 text-zinc-400 dark:text-zinc-500">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-bold">No books found</p>
            <p className="text-sm mt-1">{search ? "Try a different search." : 'Click "Add Book" to create one.'}</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-white dark:bg-[#0F2040] rounded-3xl border border-zinc-200 dark:border-white/[0.08] shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-100 dark:border-white/[0.05] shrink-0">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                {list.find((b) => b.id === modal.id) ? "Edit Book" : "New Book"}
              </h2>
              <button onClick={() => setModal(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Cover Image</label>
                <CloudinaryUploadButton value={modal.cover} onChange={(url) => setModal({ ...modal, cover: url })} label="Upload Cover" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Title</label>
                  <input value={modal.title} onChange={(e) => setModal({ ...modal, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Subtitle</label>
                  <input value={modal.subtitle} onChange={(e) => setModal({ ...modal, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Description</label>
                <textarea rows={3} value={modal.description} onChange={(e) => setModal({ ...modal, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Category</label>
                  <select value={modal.category} onChange={(e) => setModal({ ...modal, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#0F2040] text-sm text-zinc-900 dark:text-white focus:outline-none">
                    {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Pages</label>
                  <input type="number" min={0} value={modal.pages} onChange={(e) => setModal({ ...modal, pages: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Price</label>
                  <input value={modal.price} onChange={(e) => setModal({ ...modal, price: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Base Rating (0–5)</label>
                  <input type="number" step="0.1" min={0} max={5} value={modal.rating} onChange={(e) => setModal({ ...modal, rating: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                  <p className="text-[10px] text-zinc-400 mt-1">Visitors see the average of customer reviews. This is used only when a book has no reviews.</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Price Note</label>
                <input value={modal.priceNote} onChange={(e) => setModal({ ...modal, priceNote: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Buy / Download Link</label>
                <input type="url" value={modal.buyUrl} onChange={(e) => setModal({ ...modal, buyUrl: e.target.value })}
                  placeholder="https://payhip.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Preview PDF (optional)</label>
                <CloudinaryUploadButton value={modal.previewUrl} onChange={(url) => setModal({ ...modal, previewUrl: url })} label="Upload Preview PDF" acceptType="raw" />
              </div>
              {/* Customer Reviews */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Customer Reviews ({modal.reviews.length})</label>
                  <button type="button" onClick={openNewReview}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Review
                  </button>
                </div>
                {modal.reviews.length === 0 ? (
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-white/[0.03] rounded-xl p-4 border border-dashed border-zinc-200 dark:border-white/[0.08]">
                    No reviews yet. Add customer reviews to show ratings on the bookstore pages.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {modal.reviews.map((review) => (
                      <div key={review.id} className="flex items-start gap-3 rounded-xl border border-zinc-200 dark:border-white/[0.08] p-3">
                        <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 text-xs font-black shrink-0">
                          {review.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-zinc-900 dark:text-white">{review.name}</span>
                            {review.verified && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-3 h-3" /> Verified
                              </span>
                            )}
                            <span className="text-[11px] font-semibold text-amber-500">{"★".repeat(review.rating)}</span>
                          </div>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {review.country}{review.date ? ` · ${review.date}` : ""}
                          </p>
                          <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 line-clamp-2">{review.text}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button type="button" onClick={() => setReviewEditor({ ...review })} className="p-1.5 rounded-lg text-zinc-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-500/10"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button type="button" onClick={() => deleteReview(review.id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-5 pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-300 cursor-pointer">
                  <input type="checkbox" checked={modal.published} onChange={(e) => setModal({ ...modal, published: e.target.checked })}
                    className="rounded border-zinc-300 dark:border-zinc-600" />
                  Published
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-300 cursor-pointer">
                  <input type="checkbox" checked={modal.featured} onChange={(e) => setModal({ ...modal, featured: e.target.checked })}
                    className="rounded border-zinc-300 dark:border-zinc-600" />
                  Featured
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
                  {saving ? "Saving..." : "Save Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review editor modal */}
      {reviewEditor && (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4" onClick={() => setReviewEditor(null)}>
          <div className="bg-white dark:bg-[#0F2040] rounded-3xl border border-zinc-200 dark:border-white/[0.08] shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-100 dark:border-white/[0.05]">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                {modal?.reviews.some((r) => r.id === reviewEditor.id) ? "Edit Review" : "Add Review"}
              </h2>
              <button onClick={() => setReviewEditor(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setReviewEditor({ ...reviewEditor, rating: n })}
                      className={cn("text-2xl transition-colors", n <= reviewEditor.rating ? "text-amber-400" : "text-zinc-300 dark:text-zinc-600 hover:text-amber-300")}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs font-bold text-zinc-500 ml-1">{reviewEditor.rating}/5</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Reviewer Name *</label>
                  <input type="text" value={reviewEditor.name} onChange={(e) => setReviewEditor({ ...reviewEditor, name: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Country</label>
                  <input type="text" value={reviewEditor.country} onChange={(e) => setReviewEditor({ ...reviewEditor, country: e.target.value })} placeholder="Germany, Sweden..." className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Review Date</label>
                  <input type="date" value={reviewEditor.date} onChange={(e) => setReviewEditor({ ...reviewEditor, date: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                </div>
                <label className="flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-300 cursor-pointer sm:pt-6">
                  <input type="checkbox" checked={reviewEditor.verified} onChange={(e) => setReviewEditor({ ...reviewEditor, verified: e.target.checked })} className="rounded border-zinc-300 dark:border-zinc-600" />
                  Verified Purchase
                </label>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Review Text *</label>
                <textarea rows={3} value={reviewEditor.text} onChange={(e) => setReviewEditor({ ...reviewEditor, text: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 pt-0 border-t border-zinc-100 dark:border-white/[0.05]">
              <button type="button" onClick={() => setReviewEditor(null)} className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors">Cancel</button>
              <button type="button" onClick={saveReview} disabled={!reviewEditor.name.trim() || !reviewEditor.text.trim()} className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
                Save Review
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
