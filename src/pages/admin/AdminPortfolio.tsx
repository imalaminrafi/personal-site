import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
  Plus, Trash2, Edit2, Star, ChevronUp, ChevronDown, X,
  ExternalLink, CheckCircle2, MessageSquareQuote, Lock, Save, Briefcase,
} from "lucide-react";
import {
  loadPortfolio, savePortfolio, CATEGORIES, slugify, PortfolioItem, ProjectReview
} from "@/data/portfolio";
import CloudinaryUploader from "@/components/cloudinary/CloudinaryUploader";
import StarRating from "@/components/portfolio/StarRating";
import { cn } from "@/lib/utils";
import {
  Btn, Badge, Card, Field, Input, Textarea, Select, Modal, EmptyState,
  SearchInput, PageHeader, IconBtn,
} from "@/components/admin/ui";

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
      <PageHeader
        title="Portfolio Projects"
        description="Showcase your work with images, case studies and client reviews."
        actions={
          <Btn onClick={openNew}><Plus className="h-4 w-4" /> Add Project</Btn>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search projects..." className="w-full sm:w-64" />
        <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full sm:w-44">
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </Select>
        <span className="ml-auto text-xs font-medium text-zinc-400">{filtered.length} project{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={Briefcase} title="No portfolio items found" description={search ? "Try a different search." : 'Click "Add Project" to showcase your work.'} />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item, index) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative aspect-video bg-zinc-100 dark:bg-white/[0.03]">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-zinc-400">No Image</div>
                )}
                <div className="absolute left-2 top-2 flex gap-1.5">
                  {item.featured && <Badge tone="amber"><Star className="h-3 w-3 fill-current" /> Featured</Badge>}
                </div>
              </div>
              <div className="p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-violet-500">{item.category}</span>
                  <button onClick={() => toggleFeatured(item.id)} className={cn("transition-colors", item.featured ? "text-amber-400" : "text-zinc-300 hover:text-amber-400 dark:text-zinc-600")} title="Toggle featured">
                    <Star className="h-4 w-4" fill={item.featured ? "currentColor" : "none"} />
                  </button>
                </div>
                <h3 className="truncate text-sm font-bold text-zinc-900 dark:text-white">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">{item.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] text-zinc-400">/{item.slug}</span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                    <MessageSquareQuote className="h-3 w-3" /> {item.reviews.length} review{item.reviews.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-white/[0.05]">
                  <a href={`/portfolio/${item.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400">
                    <ExternalLink className="h-3 w-3" /> Preview
                  </a>
                  <div className="flex items-center gap-0.5">
                    <button onClick={() => move(index, -1)} disabled={index === 0} className="rounded p-1 text-zinc-400 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-white/[0.06]"><ChevronUp className="h-3.5 w-3.5" /></button>
                    <button onClick={() => move(index, 1)} disabled={index === filtered.length - 1} className="rounded p-1 text-zinc-400 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-white/[0.06]"><ChevronDown className="h-3.5 w-3.5" /></button>
                    <IconBtn label="Edit" tone="violet" onClick={() => openEdit(item)}><Edit2 className="h-4 w-4" /></IconBtn>
                    <IconBtn label="Delete" tone="danger" onClick={() => remove(item.id)}><Trash2 className="h-4 w-4" /></IconBtn>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Editor modal */}
      {showModal && form && (
        <Modal
          title={isNew ? "Add Project" : "Edit Project"}
          onClose={() => setShowModal(false)}
          size="xl"
          footer={
            <>
              <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
              <Btn onClick={save}>{isNew ? "Create Project" : "Save Changes"}</Btn>
            </>
          }
        >
          <div className="space-y-6">
            {/* Basics */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">Basics</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Title" required>
                  <Input value={form.title} onChange={(e) => update({ title: e.target.value })} />
                </Field>
                <Field label="Slug">
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 text-sm text-zinc-400">/portfolio/</span>
                    <Input value={form.slug} placeholder={slugify(form.title) || "auto-generated"} onChange={(e) => update({ slug: e.target.value })} />
                  </div>
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Description">
                  <Textarea rows={3} value={form.description} onChange={(e) => update({ description: e.target.value })} />
                </Field>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Category">
                  <Select value={form.category} onChange={(e) => update({ category: e.target.value })}>
                    {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
                  </Select>
                </Field>
                <Field label="Technology Tags (comma separated)">
                  <Input value={form.tags.join(", ")} onChange={(e) => update({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Deployment URL (Vercel, Netlify, etc.)"
                  hint={<span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Kept private — shown inside the embedded preview, never in the browser address bar.</span>}>
                  <Input type="url" value={form.liveUrl} placeholder="https://your-project.vercel.app" onChange={(e) => update({ liveUrl: e.target.value })} />
                </Field>
              </div>
              <label className="mt-4 flex cursor-pointer items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                <input type="checkbox" checked={form.featured} onChange={(e) => update({ featured: e.target.checked })} className="rounded border-zinc-300 dark:border-zinc-600" />
                Featured project
              </label>
            </div>

            {/* Media */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">Media</p>
              <Field label="Featured Image">
                <CloudinaryUploader value={form.image} onChange={(url) => update({ image: url })} label="Upload project image" />
              </Field>
              <div className="mt-4">
                <Field label="Gallery">
                  <CloudinaryUploader multiple value={galleryText} onChange={setGalleryText} label="Upload gallery images" max={12} />
                </Field>
              </div>
            </div>

            {/* Case Study */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">Case Study</p>
              <div className="space-y-4">
                <Field label="The Challenge">
                  <Textarea rows={2} value={form.caseStudy.challenge} onChange={(e) => update({ caseStudy: { ...form.caseStudy, challenge: e.target.value } })} />
                </Field>
                <Field label="The Approach">
                  <Textarea rows={2} value={form.caseStudy.approach} onChange={(e) => update({ caseStudy: { ...form.caseStudy, approach: e.target.value } })} />
                </Field>
                <Field label="Results (one per line)">
                  <Textarea rows={3} value={resultsText} onChange={(e) => setResultsText(e.target.value)} placeholder={"3x faster page loads\nCheckout completion up by 38%"} />
                </Field>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Client Reviews ({form.reviews.length})</p>
                <Btn variant="secondary" size="sm" onClick={openNewReview}><Plus className="h-3.5 w-3.5" /> Add Review</Btn>
              </div>
              {form.reviews.length === 0 ? (
                <p className="rounded-lg border border-dashed border-zinc-200 p-4 text-xs text-zinc-400 dark:border-white/[0.08]">
                  No reviews yet. Add client reviews to build trust on this project.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {form.reviews.map((review) => (
                    <div key={review.id} className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 dark:border-white/[0.08]">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-black text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                        {review.clientName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <StarRating rating={review.rating} />
                          <span className="text-xs font-bold text-zinc-900 dark:text-white">{review.clientName}</span>
                          {review.verified && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" /> Verified
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                          {review.platform}{review.country ? ` · ${review.country}` : ""}{review.projectDate ? ` · ${review.projectDate}` : ""}
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

            {/* SEO */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">SEO</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="SEO Title">
                  <Input value={form.seoTitle || ""} placeholder={form.title} onChange={(e) => update({ seoTitle: e.target.value })} />
                </Field>
                <Field label="SEO Keywords">
                  <Input value={form.seoKeywords || ""} onChange={(e) => update({ seoKeywords: e.target.value })} />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Meta Description">
                  <Textarea rows={2} value={form.seoDescription || ""} placeholder={form.description} onChange={(e) => update({ seoDescription: e.target.value })} />
                </Field>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Review editor modal */}
      {reviewEditor && form && (
        <Modal
          title={form.reviews.some((r) => r.id === reviewEditor.id) ? "Edit Review" : "Add Review"}
          onClose={() => setReviewEditor(null)}
          size="md"
          footer={
            <>
              <Btn variant="ghost" onClick={() => setReviewEditor(null)}>Cancel</Btn>
              <Btn onClick={saveReview} disabled={!reviewEditor.clientName.trim() || !reviewEditor.text.trim()}>Save Review</Btn>
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
              <Field label="Client Name" required>
                <Input value={reviewEditor.clientName} onChange={(e) => setReviewEditor({ ...reviewEditor, clientName: e.target.value })} />
              </Field>
              <Field label="Platform (Upwork, Fiverr...)">
                <Input value={reviewEditor.platform} onChange={(e) => setReviewEditor({ ...reviewEditor, platform: e.target.value })} />
              </Field>
              <Field label="Country (optional)">
                <Input value={reviewEditor.country || ""} onChange={(e) => setReviewEditor({ ...reviewEditor, country: e.target.value })} />
              </Field>
              <Field label="Project Date">
                <Input type="date" value={reviewEditor.projectDate} onChange={(e) => setReviewEditor({ ...reviewEditor, projectDate: e.target.value })} />
              </Field>
            </div>
            <Field label="Review Text" required>
              <Textarea rows={4} value={reviewEditor.text} onChange={(e) => setReviewEditor({ ...reviewEditor, text: e.target.value })} />
            </Field>
            <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <input type="checkbox" checked={reviewEditor.verified} onChange={(e) => setReviewEditor({ ...reviewEditor, verified: e.target.checked })} className="rounded border-zinc-300 dark:border-zinc-600" />
              Verified client
            </label>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}