import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Book, BookReview, loadBooks, saveBooks, getBookAverageRating, getBookReviewCount } from "@/data/books";
import { Plus, Trash2, Star, FileText, CheckCircle2, Edit2, MessageSquareQuote, BookOpen } from "lucide-react";
import CloudinaryUploader from "@/components/cloudinary/CloudinaryUploader";
import { getOptimizedUrl } from "@/utils/cloudinary";
import { cn } from "@/lib/utils";
import {
  Btn, Badge, Card, Field, Input, Textarea, Select, Modal, EmptyState, SearchInput,
  PageHeader, IconBtn,
} from "@/components/admin/ui";

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
    if (confirm("Delete this book?")) return;
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
      <PageHeader
        title="Books"
        description="Manage your digital books, covers, pricing and PDF downloads."
        actions={
          <Btn onClick={openNew}><Plus className="h-4 w-4" /> Add Book</Btn>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search books..." className="mb-4 w-full sm:w-72" />

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={BookOpen} title="No books found" description={search ? "Try a different search." : 'Click "Add Book" to create one.'} />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((book) => (
            <Card key={book.id} className="relative flex gap-4 p-4">
              <div className="flex h-28 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-white/[0.08] dark:bg-white/[0.03]">
                {book.cover ? (
                  <img src={getOptimizedUrl(book.cover, { width: 300 })} alt={book.title} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <BookOpen className="h-7 w-7 text-zinc-300 dark:text-zinc-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-bold text-zinc-900 dark:text-white">{book.title}</p>
                <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">{book.subtitle}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Badge tone="violet">{book.category}</Badge>
                  <span className="text-xs font-black text-zinc-900 dark:text-white">{book.price}</span>
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500">
                    <Star className="h-3 w-3 fill-amber-500" /> {getBookAverageRating(book).toFixed(1)}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400">
                    <MessageSquareQuote className="mr-0.5 inline-block h-2.5 w-2.5" />{getBookReviewCount(book)} reviews
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Badge tone={book.published ? "emerald" : "zinc"}>{book.published ? "Published" : "Draft"}</Badge>
                  {book.featured && <Badge tone="amber">Featured</Badge>}
                  {book.previewUrl && (
                    <Badge tone="red"><FileText className="h-3 w-3" /> PDF</Badge>
                  )}
                </div>
              </div>
              <div className="absolute bottom-3 right-3 flex items-center gap-1">
                <button onClick={() => setModal({ ...book })}
                  className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-600 transition-colors hover:bg-violet-50 hover:text-violet-600 dark:bg-white/[0.06] dark:text-zinc-300 dark:hover:bg-violet-500/10 dark:hover:text-violet-400">
                  <Edit2 className="h-3 w-3" /> Edit
                </button>
                <IconBtn label="Delete book" tone="danger" onClick={() => deleteBook(book.id)}>
                  <Trash2 className="h-4 w-4" />
                </IconBtn>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <Modal
          title={list.find((b) => b.id === modal.id) ? "Edit Book" : "New Book"}
          onClose={() => setModal(null)}
          size="lg"
          footer={
            <>
              <Btn type="button" variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn type="submit" form="book-form" disabled={saving}>{saving ? "Saving..." : "Save Book"}</Btn>
            </>
          }
        >
          <form id="book-form" onSubmit={handleSave} className="space-y-4">
            <Field label="Cover Image">
              <CloudinaryUploader value={modal.cover} onChange={(url) => setModal({ ...modal, cover: url })} label="Upload cover" />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Title" required>
                <Input value={modal.title} onChange={(e) => setModal({ ...modal, title: e.target.value })} required />
              </Field>
              <Field label="Subtitle">
                <Input value={modal.subtitle} onChange={(e) => setModal({ ...modal, subtitle: e.target.value })} />
              </Field>
            </div>
            <Field label="Description">
              <Textarea rows={3} value={modal.description} onChange={(e) => setModal({ ...modal, description: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Field label="Category">
                <Select value={modal.category} onChange={(e) => setModal({ ...modal, category: e.target.value })}>
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </Select>
              </Field>
              <Field label="Pages">
                <Input type="number" min={0} value={modal.pages} onChange={(e) => setModal({ ...modal, pages: Number(e.target.value) })} />
              </Field>
              <Field label="Price">
                <Input value={modal.price} onChange={(e) => setModal({ ...modal, price: e.target.value })} />
              </Field>
              <Field label="Base Rating (0–5)">
                <Input type="number" step="0.1" min={0} max={5} value={modal.rating} onChange={(e) => setModal({ ...modal, rating: Number(e.target.value) })} />
              </Field>
            </div>
            <p className="text-[10px] text-zinc-400">Visitors see the average of customer reviews. Base rating is used only when a book has no reviews.</p>
            <Field label="Price Note">
              <Input value={modal.priceNote} onChange={(e) => setModal({ ...modal, priceNote: e.target.value })} />
            </Field>
            <Field label="Buy / Download Link">
              <Input type="url" value={modal.buyUrl} onChange={(e) => setModal({ ...modal, buyUrl: e.target.value })} placeholder="https://payhip.com/..." />
            </Field>
            <Field label="Preview PDF (optional)">
              <CloudinaryUploader value={modal.previewUrl} onChange={(url) => setModal({ ...modal, previewUrl: url })} label="Upload preview PDF" accept="raw" />
            </Field>

            {/* Reviews */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Customer Reviews ({modal.reviews.length})</p>
                <Btn type="button" variant="secondary" size="sm" onClick={openNewReview}><Plus className="h-3.5 w-3.5" /> Add Review</Btn>
              </div>
              {modal.reviews.length === 0 ? (
                <p className="rounded-lg border border-dashed border-zinc-200 p-4 text-xs text-zinc-400 dark:border-white/[0.08]">
                  No reviews yet. Add customer reviews to show ratings on the bookstore pages.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {modal.reviews.map((review) => (
                    <div key={review.id} className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 dark:border-white/[0.08]">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-black text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-zinc-900 dark:text-white">{review.name}</span>
                          {review.verified && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" /> Verified
                            </span>
                          )}
                          <span className="text-[11px] font-semibold text-amber-500">{"★".repeat(review.rating)}</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                          {review.country}{review.date ? ` · ${review.date}` : ""}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-300">{review.text}</p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <IconBtn label="Edit review" onClick={() => setReviewEditor({ ...review })}><Edit2 className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn label="Delete review" tone="danger" onClick={() => deleteReview(review.id)}><Trash2 className="h-3.5 w-3.5" /></IconBtn>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-5 pt-1">
              <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                <input type="checkbox" checked={modal.published} onChange={(e) => setModal({ ...modal, published: e.target.checked })} className="rounded border-zinc-300 dark:border-zinc-600" />
                Published
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                <input type="checkbox" checked={modal.featured} onChange={(e) => setModal({ ...modal, featured: e.target.checked })} className="rounded border-zinc-300 dark:border-zinc-600" />
                Featured
              </label>
            </div>
          </form>
        </Modal>
      )}

      {/* Review editor modal */}
      {reviewEditor && (
        <Modal
          title={modal?.reviews.some((r) => r.id === reviewEditor.id) ? "Edit Review" : "Add Review"}
          onClose={() => setReviewEditor(null)}
          size="md"
          footer={
            <>
              <Btn type="button" variant="ghost" onClick={() => setReviewEditor(null)}>Cancel</Btn>
              <Btn type="button" onClick={saveReview} disabled={!reviewEditor.name.trim() || !reviewEditor.text.trim()}>Save Review</Btn>
            </>
          }
        >
          <div className="space-y-4">
            <Field label="Rating">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setReviewEditor({ ...reviewEditor, rating: n })}
                    className={cn("text-2xl transition-colors", n <= reviewEditor.rating ? "text-amber-400" : "text-zinc-300 hover:text-amber-300 dark:text-zinc-600")}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-1 text-xs font-bold text-zinc-500">{reviewEditor.rating}/5</span>
              </div>
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Reviewer Name" required>
                <Input value={reviewEditor.name} onChange={(e) => setReviewEditor({ ...reviewEditor, name: e.target.value })} />
              </Field>
              <Field label="Country">
                <Input value={reviewEditor.country} onChange={(e) => setReviewEditor({ ...reviewEditor, country: e.target.value })} placeholder="Germany, Sweden..." />
              </Field>
              <Field label="Review Date">
                <Input type="date" value={reviewEditor.date} onChange={(e) => setReviewEditor({ ...reviewEditor, date: e.target.value })} />
              </Field>
              <label className="flex items-center gap-2 pt-6 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                <input type="checkbox" checked={reviewEditor.verified} onChange={(e) => setReviewEditor({ ...reviewEditor, verified: e.target.checked })} className="rounded border-zinc-300 dark:border-zinc-600" />
                Verified Purchase
              </label>
            </div>
            <Field label="Review Text" required>
              <Textarea rows={3} value={reviewEditor.text} onChange={(e) => setReviewEditor({ ...reviewEditor, text: e.target.value })} />
            </Field>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}