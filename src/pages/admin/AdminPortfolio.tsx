import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
  Plus, Trash2, Edit2, Search, Star, ChevronUp, ChevronDown, X,
  ExternalLink, CheckCircle2, MessageSquareQuote, Lock
} from "lucide-react";
import {
  loadPortfolio, savePortfolio, CATEGORIES, slugify, PortfolioItem, ProjectReview
} from "@/data/portfolio";
import CloudinaryUploader from "@/components/cloudinary/CloudinaryUploader";
import StarRating from "@/components/portfolio/StarRating";
import { cn } from "@/lib/utils";

const emptyReview: ProjectReview = {
  id: "", clientName: "", platform: "", country: "", rating: 5,
  text: "", projectDate: "", verified: true,
};

export default function AdminPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<PortfolioItem | null>(null);
  const [galleryText, setGalleryText] = useState("");
  const [resultsText, setResultsText] = useState("");
  const [reviewEditor, setReviewEditor] = useState<ProjectReview | null>(null);

  useEffect(() => { setItems(loadPortfolio()); }, []);

  function persist(list: PortfolioItem[]) {
    const ordered = list.map((item, i) => ({ ...item, order: i })).sort((a, b) => a.order - b.order);
    savePortfolio(ordered);
    setItems(ordered);
  }

  function openNew() {
    setForm({
      id: "p" + Date.now(), title: "", slug: "", description: "", image: "",
      gallery: [], category: "Website Design", tags: [], liveUrl: "",
      caseStudy: { challenge: "", approach: "", results: [] },
      reviews: [], featured: false, order: items.length,
      seoTitle: "", seoDescription: "", seoKeywords: "",
      createdAt: new Date().toISOString(),
    });
    setGalleryText("");
    setResultsText("");
    setShowModal(true);
  }

  function openEdit(item: PortfolioItem) {
    setForm({ ...item, reviews: [...item.reviews], caseStudy: { ...item.caseStudy, results: [...item.caseStudy.results] } });
    setGalleryText(item.gallery.join("\n"));
    setResultsText(item.caseStudy.results.join("\n"));
    setShowModal(true);
  }

  const isNew = form ? !items.some((i) => i.id === form.id) : false;

  function update(patch: Partial<PortfolioItem>) {
    setForm((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  function save() {
    if (!form || !form.title.trim()) return;
    const final: PortfolioItem = {
      ...form,
      slug: form.slug.trim() || slugify(form.title),
      gallery: galleryText.split("\n").map((u) => u.trim()).filter(Boolean),
      tags: form.tags,
      caseStudy: {
        ...form.caseStudy,
        results: resultsText.split("\n").map((r) => r.trim()).filter(Boolean),
      },
    };
    if (isNew) {
      persist([final, ...items]);
    } else {
      persist(items.map((i) => (i.id === final.id ? final : i)));
    }
    setShowModal(false);
    setForm(null);
  }

  function remove(id: string) {
    if (confirm("Delete this portfolio item?")) persist(items.filter((i) => i.id !== id));
  }

  function toggleFeatured(id: string) {
    persist(items.map((i) => (i.id === id ? { ...i, featured: !i.featured } : i)));
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    persist(next);
  }

  /* ── Reviews ── */
  function openNewReview() {
    setReviewEditor({ ...emptyReview, id: "rv" + Date.now() });
  }

  function saveReview() {
    if (!reviewEditor || !form) return;
    const exists = form.reviews.some((r) => r.id === reviewEditor.id);
    const reviews = exists
      ? form.reviews.map((r) => (r.id === reviewEditor.id ? reviewEditor : r))
      : [...form.reviews, reviewEditor];
    update({ reviews });
    setReviewEditor(null);
  }

  function deleteReview(id: string) {
    if (!form) return;
    if (confirm("Delete this review?")) update({ reviews: form.reviews.filter((r) => r.id !== id) });
  }

  const filtered = items.filter((i) => {
    if (filterCategory !== "All" && i.category !== filterCategory) return false;
    if (search && !i.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminLayout title="Portfolio">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#162032] text-sm focus:outline-none w-48" />
          </div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#162032] text-sm focus:outline-none">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={openNew} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors flex items-center gap-2"><Plus className="w-4 h-4" /> Add Project</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item, index) => (
          <div key={item.id} className="bg-white dark:bg-[#162032] rounded-2xl border border-zinc-200 dark:border-white/[0.08] overflow-hidden group">
            <div className="aspect-video bg-zinc-100 dark:bg-white/[0.03] relative">
              {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-zinc-400 text-xs">No Image</div>}
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => remove(item.id)} className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-violet-500">{item.category}</span>
                <button onClick={() => toggleFeatured(item.id)} className={`${item.featured ? "text-amber-400" : "text-zinc-300 dark:text-zinc-600"} hover:text-amber-400 transition-colors`} title="Toggle featured"><Star className="w-3.5 h-3.5" fill={item.featured ? "currentColor" : "none"} /></button>
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white truncate">{item.title}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{item.description}</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="text-[10px] font-mono text-zinc-400">/{item.slug}</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                  <MessageSquareQuote className="w-3 h-3" /> {item.reviews.length}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100 dark:border-white/[0.05]">
                <a href={`/portfolio/${item.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-500 hover:text-violet-600"><ExternalLink className="w-3 h-3" /> View</a>
                <div className="flex items-center gap-1">
                  <button onClick={() => move(index, -1)} disabled={index === 0} className="p-1 rounded text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.05] disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>
                  <button onClick={() => move(index, 1)} disabled={index === filtered.length - 1} className="p-1 rounded text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.05] disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-zinc-500 mt-12 text-sm">No portfolio items found.</p>}

      {/* Editor modal */}
      {showModal && form && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-[#162032] rounded-3xl border border-zinc-200 dark:border-white/[0.08] shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-100 dark:border-white/[0.05] shrink-0">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{isNew ? "Add Project" : "Edit Project"}</h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Basics */}
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Basics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Title *</label>
                    <input type="text" value={form.title} onChange={(e) => update({ title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Slug</label>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400 text-sm">/portfolio/</span>
                      <input type="text" value={form.slug} placeholder={slugify(form.title) || "auto-generated"} onChange={(e) => update({ slug: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Description</label>
                  <textarea rows={3} value={form.description} onChange={(e) => update({ description: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Category</label>
                    <select value={form.category} onChange={(e) => update({ category: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#162032] text-sm focus:outline-none">
                      {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Technology Tags (comma separated)</label>
                    <input type="text" value={form.tags.join(", ")} onChange={(e) => update({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">
                    Deployment URL (Vercel, Netlify, etc.)
                  </label>
                  <div className="flex items-center gap-2">
                    <input type="url" value={form.liveUrl} placeholder="https://your-project.vercel.app" onChange={(e) => update({ liveUrl: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1.5 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Kept private — shown inside the embedded preview, never in the browser address bar.
                  </p>
                </div>
                <label className="flex items-center gap-2 mt-4 text-xs font-bold text-zinc-600 dark:text-zinc-300 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => update({ featured: e.target.checked })} className="rounded border-zinc-300 dark:border-zinc-600" />
                  Featured project
                </label>
              </div>

              {/* Media */}
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Media</h3>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Featured Image</label>
                  <CloudinaryUploader value={form.image} onChange={(url) => update({ image: url })} label="Upload Project Image" />
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Gallery</label>
                  <CloudinaryUploader multiple value={galleryText} onChange={setGalleryText} label="gallery images" max={12} />
                </div>
              </div>

              {/* Case Study */}
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Case Study</h3>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">The Challenge</label>
                  <textarea rows={2} value={form.caseStudy.challenge} onChange={(e) => update({ caseStudy: { ...form.caseStudy, challenge: e.target.value } })} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">The Approach</label>
                  <textarea rows={2} value={form.caseStudy.approach} onChange={(e) => update({ caseStudy: { ...form.caseStudy, approach: e.target.value } })} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Results (one per line)</label>
                  <textarea rows={3} value={resultsText} onChange={(e) => setResultsText(e.target.value)} placeholder={"3x faster page loads\nCheckout completion up by 38%"} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                </div>
              </div>

              {/* Reviews */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Client Reviews ({form.reviews.length})</h3>
                  <button onClick={openNewReview} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Review
                  </button>
                </div>
                {form.reviews.length === 0 ? (
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-white/[0.03] rounded-xl p-4 border border-dashed border-zinc-200 dark:border-white/[0.08]">
                    No reviews yet. Add client reviews to build trust on this project.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {form.reviews.map((review) => (
                      <div key={review.id} className="flex items-start gap-3 rounded-xl border border-zinc-200 dark:border-white/[0.08] p-3">
                        <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 text-xs font-black shrink-0">
                          {review.clientName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <StarRating rating={review.rating} />
                            <span className="text-xs font-bold text-zinc-900 dark:text-white">{review.clientName}</span>
                            {review.verified && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-3 h-3" /> Verified
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {review.platform}{review.country ? ` · ${review.country}` : ""}{review.projectDate ? ` · ${review.projectDate}` : ""}
                          </p>
                          <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 line-clamp-2">{review.text}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => setReviewEditor({ ...review })} className="p-1.5 rounded-lg text-zinc-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-500/10"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => deleteReview(review.id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SEO */}
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3">SEO</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">SEO Title</label>
                    <input type="text" value={form.seoTitle || ""} onChange={(e) => update({ seoTitle: e.target.value })} placeholder={form.title} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">SEO Keywords</label>
                    <input type="text" value={form.seoKeywords || ""} onChange={(e) => update({ seoKeywords: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Meta Description</label>
                  <textarea rows={2} value={form.seoDescription || ""} onChange={(e) => update({ seoDescription: e.target.value })} placeholder={form.description} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 pt-0 shrink-0 border-t border-zinc-100 dark:border-white/[0.05]">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors">Cancel</button>
              <button onClick={save} className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors">
                {isNew ? "Create Project" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review editor modal */}
      {reviewEditor && form && (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4" onClick={() => setReviewEditor(null)}>
          <div className="bg-white dark:bg-[#162032] rounded-3xl border border-zinc-200 dark:border-white/[0.08] shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-100 dark:border-white/[0.05]">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                {form.reviews.some((r) => r.id === reviewEditor.id) ? "Edit Review" : "Add Review"}
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
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Client Name *</label>
                  <input type="text" value={reviewEditor.clientName} onChange={(e) => setReviewEditor({ ...reviewEditor, clientName: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Platform (Upwork, Fiverr...)</label>
                  <input type="text" value={reviewEditor.platform} onChange={(e) => setReviewEditor({ ...reviewEditor, platform: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Country (optional)</label>
                  <input type="text" value={reviewEditor.country || ""} onChange={(e) => setReviewEditor({ ...reviewEditor, country: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Project Date</label>
                  <input type="date" value={reviewEditor.projectDate} onChange={(e) => setReviewEditor({ ...reviewEditor, projectDate: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Review Text *</label>
                <textarea rows={4} value={reviewEditor.text} onChange={(e) => setReviewEditor({ ...reviewEditor, text: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
              </div>
              <label className="flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-300 cursor-pointer">
                <input type="checkbox" checked={reviewEditor.verified} onChange={(e) => setReviewEditor({ ...reviewEditor, verified: e.target.checked })} className="rounded border-zinc-300 dark:border-zinc-600" />
                Verified client
              </label>
            </div>
            <div className="flex justify-end gap-3 p-6 pt-0 border-t border-zinc-100 dark:border-white/[0.05]">
              <button onClick={() => setReviewEditor(null)} className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors">Cancel</button>
              <button onClick={saveReview} disabled={!reviewEditor.clientName.trim() || !reviewEditor.text.trim()} className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
                Save Review
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
