import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { loadPosts, savePosts, CATEGORIES, slugify, estimateReadingTime, type BlogPost } from "@/data/blogData";
import { lazy, Suspense } from "react";
import { Plus, Edit2, Trash2, Search, Eye, Calendar, Clock, Tag, Image, Save, X, CheckCircle, Clock9, AlertCircle } from "lucide-react";
import CloudinaryUploadButton from "@/components/cloudinary/CloudinaryUploadButton";
import CloudinaryMultiUploader from "@/components/cloudinary/CloudinaryMultiUploader";

const WysiwygEditor = lazy(() => import("@/components/blog/WysiwygEditor"));

type View = "list" | "editor";
type Status = "draft" | "published" | "scheduled";

interface FAQItem { question: string; answer: string; }
interface FormData {
  title: string; slug: string; category: string; tags: string;
  featuredImage: string; galleryImages: string; shortDescription: string; content: string;
  author: string; seoTitle: string; metaDescription: string; focusKeyword: string; canonicalUrl: string;
  ogTitle: string; ogDescription: string; ogImage: string; twitterCard: string;
  schemaType: string; breadcrumbTitle: string; status: Status; scheduledDate: string;
  relatedSlugs: string[]; faq: FAQItem[];
  imageAlt: string; imageTitle: string; imageCaption: string; imageDescription: string;
}

const emptyForm = (): FormData => ({
  title: "", slug: "", category: CATEGORIES[0], tags: "",
  featuredImage: "", galleryImages: "", shortDescription: "", content: "",
  author: "Alamin Rafi", seoTitle: "", metaDescription: "", focusKeyword: "", canonicalUrl: "",
  ogTitle: "", ogDescription: "", ogImage: "", twitterCard: "summary_large_image",
  schemaType: "Article", breadcrumbTitle: "", status: "draft", scheduledDate: "",
  relatedSlugs: [], faq: [],
  imageAlt: "", imageTitle: "", imageCaption: "", imageDescription: "",
});

export default function AdminBlog() {
  const [view, setView] = useState<View>("list");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "draft" | "published" | "scheduled">("all");
  const [saved, setSaved] = useState(false);
  const [autoSaved, setAutoSaved] = useState("");

  useEffect(() => { setPosts(loadPosts()); }, []);

  function persist(list: BlogPost[]) { savePosts(list); setPosts([...list]); }

  function openNew() {
    setEditId(null);
    setForm(emptyForm());
    setView("editor");
  }

  function openEdit(post: BlogPost) {
    setEditId(post.id);
    setForm({
      title: post.title, slug: post.slug, category: post.category || CATEGORIES[0],
      tags: (post.tags || []).join(", "), featuredImage: post.featuredImage || "",
      galleryImages: (post.galleryImages || []).join("\n"), shortDescription: post.shortDescription || "",
      content: post.content || "", author: post.author || "Alamin Rafi",
      seoTitle: post.seoTitle || "", metaDescription: post.metaDescription || "",
      focusKeyword: post.focusKeyword || "", canonicalUrl: post.canonicalUrl || "",
      ogTitle: post.ogTitle || "", ogDescription: post.ogDescription || "",
      ogImage: post.ogImage || "", twitterCard: post.twitterCard || "summary_large_image",
      schemaType: post.schemaType || "Article", breadcrumbTitle: post.breadcrumbTitle || "",
      status: post.status || "draft", scheduledDate: post.scheduledDate || "",
      relatedSlugs: post.relatedSlugs || [],
      faq: post.faq || [], imageAlt: post.imageAlt || "", imageTitle: post.imageTitle || "",
      imageCaption: post.imageCaption || "", imageDescription: post.imageDescription || "",
    });
    setView("editor");
  }

  function remove(id: string) {
    if (confirm("Delete this post permanently?")) persist(posts.filter((p) => p.id !== id));
  }

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleAutoSave() {
    if (!form.title.trim()) return;
    try {
      localStorage.setItem("ar_blog_autosave", JSON.stringify({ id: editId, form, timestamp: Date.now() }));
      setAutoSaved("Draft auto-saved at " + new Date().toLocaleTimeString());
      setTimeout(() => setAutoSaved(""), 3000);
    } catch { /* localStorage quota */ }
  }

  function handleSave() {
    if (!form.title.trim()) return;
    const slug = form.slug || slugify(form.title);
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const galleryImages = form.galleryImages.split("\n").map((l) => l.trim()).filter(Boolean);
    const readingTime = estimateReadingTime(form.content);
    const now = new Date().toISOString();
    const allPosts = loadPosts();
    const related = allPosts.filter((p) => p.id !== editId && form.relatedSlugs.includes(p.slug)).map((p) => p.slug);

    const post: BlogPost = {
      ...(editId ? allPosts.find((p) => p.id === editId) || {} : {}),
      id: editId || Date.now().toString(),
      slug, title: form.title, shortDescription: form.shortDescription,
      content: form.content, category: form.category, tags, featuredImage: form.featuredImage,
      galleryImages, author: form.author, readingTime,
      status: form.status, scheduledDate: form.status === "scheduled" ? form.scheduledDate : "",
      publishedDate: editId ? (allPosts.find((p) => p.id === editId)?.publishedDate || now) : now,
      updatedDate: now, seoTitle: form.seoTitle, metaDescription: form.metaDescription,
      focusKeyword: form.focusKeyword, canonicalUrl: form.canonicalUrl,
      ogTitle: form.ogTitle, ogDescription: form.ogDescription, ogImage: form.ogImage,
      twitterCard: form.twitterCard as BlogPost["twitterCard"], schemaType: form.schemaType as BlogPost["schemaType"],
      breadcrumbTitle: form.breadcrumbTitle, relatedSlugs: related, faq: form.faq,
      imageAlt: form.imageAlt, imageTitle: form.imageTitle, imageCaption: form.imageCaption,
      imageDescription: form.imageDescription,
    };

    if (editId) {
      persist(allPosts.map((p) => (p.id === editId ? post : p)));
    } else {
      persist([post, ...allPosts]);
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); setView("list"); }, 800);
  }

  function addFaq() { setForm((prev) => ({ ...prev, faq: [...prev.faq, { question: "", answer: "" }] })); }
  function removeFaq(i: number) { setForm((prev) => ({ ...prev, faq: prev.faq.filter((_, idx) => idx !== i) })); }
  function updateFaq(i: number, key: "question" | "answer", value: string) {
    setForm((prev) => ({ ...prev, faq: prev.faq.map((f, idx) => (idx === i ? { ...f, [key]: value } : f)) }));
  }

  function toggleRelated(slug: string) {
    setForm((prev) => ({
      ...prev,
      relatedSlugs: prev.relatedSlugs.includes(slug) ? prev.relatedSlugs.filter((s) => s !== slug) : [...prev.relatedSlugs, slug],
    }));
  }

  const allTags = [...new Set(posts.flatMap((p) => p.tags || []))];
  const filteredPosts = posts.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusBadge = (s: string) => {
    if (s === "published") return { label: "Published", icon: CheckCircle, cls: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10" };
    if (s === "scheduled") return { label: "Scheduled", icon: Clock9, cls: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10" };
    return { label: "Draft", icon: AlertCircle, cls: "text-zinc-600 bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-500/10" };
  };

  if (view === "editor") {
    return (
      <AdminLayout title={editId ? "Edit Post" : "New Post"}>
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-zinc-900 dark:text-white">{editId ? "Edit Post" : "New Post"}</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Fill in the fields below. Most SEO fields are optional but recommended.</p>
                {autoSaved && <p className="text-xs text-emerald-500 mt-1 font-bold">{autoSaved}</p>}
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setView("list")} className="px-4 py-2 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors flex items-center gap-2"><Save className="w-4 h-4" /> {saved ? "Saved!" : "Save Post"}</button>
              </div>
            </div>

          {/* Content */}
          <Section title="Content">
            <Field label="Title"><input type="text" value={form.title} onChange={(e) => { update("title", e.target.value); if (!editId) update("slug", slugify(e.target.value)); }} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none" /></Field>
            <Field label="Slug"><input type="text" value={form.slug} onChange={(e) => update("slug", slugify(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none font-mono text-xs" /></Field>
            <Field label="Short Description"><textarea rows={3} value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none" /></Field>
            <Field label="Full Article">
              <Suspense fallback={<div className="h-[500px] rounded-2xl border border-zinc-200 dark:border-[#1E3A5F] bg-zinc-50 dark:bg-[#162032] flex items-center justify-center text-sm text-zinc-400">Loading editor...</div>}>
                <WysiwygEditor value={form.content} onChange={(html) => update("content", html)} onAutoSave={handleAutoSave} />
              </Suspense>
            </Field>
          </Section>

          {/* Taxonomy */}
          <Section title="Taxonomy">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Category"><select value={form.category} onChange={(e) => update("category", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none">{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
              <Field label="Author"><input type="text" value={form.author} onChange={(e) => update("author", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none" /></Field>
            </div>
            <Field label="Tags (comma separated)"><input type="text" value={form.tags} onChange={(e) => update("tags", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none" placeholder="web development, react, tailwind" /></Field>
          </Section>

          {/* Image */}
          <Section title="Images">
            <Field label="Featured Image">
              <CloudinaryUploadButton value={form.featuredImage} onChange={(url) => update("featuredImage", url)} />
            </Field>
            <Field label="Gallery Images">
              <CloudinaryMultiUploader value={form.galleryImages} onChange={(urls) => update("galleryImages", urls)} label="gallery images" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Image Alt Text"><input type="text" value={form.imageAlt} onChange={(e) => update("imageAlt", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none" /></Field>
              <Field label="Image Title"><input type="text" value={form.imageTitle} onChange={(e) => update("imageTitle", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none" /></Field>
              <Field label="Image Caption"><input type="text" value={form.imageCaption} onChange={(e) => update("imageCaption", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none" /></Field>
              <Field label="Image Description"><input type="text" value={form.imageDescription} onChange={(e) => update("imageDescription", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none" /></Field>
            </div>
          </Section>

          {/* Status & Dates */}
          <Section title="Status & Publishing">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Status"><select value={form.status} onChange={(e) => update("status", e.target.value as Status)} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none">
                <option value="draft">Draft</option><option value="published">Published</option><option value="scheduled">Scheduled</option>
              </select></Field>
              {form.status === "scheduled" && <Field label="Schedule Date"><input type="datetime-local" value={form.scheduledDate} onChange={(e) => update("scheduledDate", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none" /></Field>}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Reading time: ~{estimateReadingTime(form.content)} min</p>
          </Section>

          {/* SEO */}
          <Section title="SEO Settings">
            <Field label="SEO Title"><input type="text" value={form.seoTitle} onChange={(e) => update("seoTitle", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none" placeholder="Leave blank to use post title" /></Field>
            <Field label="Meta Description"><textarea rows={2} value={form.metaDescription} onChange={(e) => update("metaDescription", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none" placeholder="Brief description for search results" /></Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Focus Keyword"><input type="text" value={form.focusKeyword} onChange={(e) => update("focusKeyword", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none" /></Field>
              <Field label="Canonical URL"><input type="text" value={form.canonicalUrl} onChange={(e) => update("canonicalUrl", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none" /></Field>
            </div>
            <div className="bg-zinc-50 dark:bg-white/[0.03] rounded-xl p-4 border border-zinc-200 dark:border-[#1E3A5F]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Google Preview</p>
              <p className="text-sm text-blue-600 truncate">https://alaminrafi.com/blog/{form.slug || "post-slug"}</p>
              <p className="text-base font-bold text-zinc-800 dark:text-zinc-200 truncate">{form.seoTitle || form.title || "Post Title"}</p>
              <p className="text-xs text-zinc-500 line-clamp-2">{form.metaDescription || form.shortDescription || "Your meta description will appear here..."}</p>
            </div>
          </Section>

          {/* Social */}
          <Section title="Social Sharing">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="OG Title"><input type="text" value={form.ogTitle} onChange={(e) => update("ogTitle", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none" /></Field>
              <Field label="Twitter Card"><select value={form.twitterCard} onChange={(e) => update("twitterCard", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none">
                <option value="summary">Summary</option><option value="summary_large_image">Summary Large Image</option><option value="app">App</option><option value="player">Player</option>
              </select></Field>
            </div>
            <Field label="OG Description"><textarea rows={2} value={form.ogDescription} onChange={(e) => update("ogDescription", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none" /></Field>
            <Field label="OG Image">
              <CloudinaryUploadButton value={form.ogImage} onChange={(url) => update("ogImage", url)} label="OG Image" />
            </Field>
          </Section>

          {/* Schema */}
          <Section title="Schema.org">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Schema Type"><select value={form.schemaType} onChange={(e) => update("schemaType", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none">
                <option value="Article">Article</option><option value="BlogPosting">BlogPosting</option><option value="NewsArticle">NewsArticle</option>
              </select></Field>
              <Field label="Breadcrumb Title"><input type="text" value={form.breadcrumbTitle} onChange={(e) => update("breadcrumbTitle", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none" /></Field>
            </div>
          </Section>

          {/* Related Posts */}
          <Section title="Related Posts">
            <div className="flex flex-wrap gap-2">
              {posts.filter((p) => p.id !== editId && p.status === "published").map((p) => (
                <label key={p.id} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/[0.02] text-sm">
                  <input type="checkbox" checked={form.relatedSlugs.includes(p.slug)} onChange={() => toggleRelated(p.slug)} className="rounded" />
                  <span className="text-zinc-700 dark:text-zinc-300">{p.title}</span>
                </label>
              ))}
              {posts.filter((p) => p.id !== editId && p.status === "published").length === 0 && <p className="text-xs text-zinc-500">No published posts to link.</p>}
            </div>
          </Section>

          {/* FAQ */}
          <Section title="FAQ Section">
            {form.faq.map((item, i) => (
              <div key={i} className="flex gap-3 items-start mb-3">
                <div className="flex-1 space-y-2">
                  <input type="text" placeholder="Question" value={item.question} onChange={(e) => updateFaq(i, "question", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none" />
                  <textarea rows={2} placeholder="Answer" value={item.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none" />
                </div>
                <button onClick={() => removeFaq(i)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"><X className="w-4 h-4" /></button>
              </div>
            ))}
            <button onClick={addFaq} className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">+ Add FAQ</button>
          </Section>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-[#1E3A5F]">
            <button onClick={() => setView("list")} className="px-4 py-2 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors flex items-center gap-2"><Save className="w-4 h-4" /> Save Post</button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Blog Management">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input type="text" placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none w-48" />
          </div>
          {(["all", "published", "draft", "scheduled"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${filter === f ? "bg-blue-600 text-white" : "bg-zinc-100 dark:bg-[#1E293B] text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"}`}>{f}</button>
          ))}
        </div>
        <button onClick={openNew} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors flex items-center gap-2"><Plus className="w-4 h-4" /> New Post</button>
      </div>

      <div className="bg-white dark:bg-[#162032] rounded-2xl border border-zinc-200 dark:border-[#1E3A5F] overflow-hidden">
        {filteredPosts.length === 0 ? (
          <p className="text-center text-zinc-500 py-12 text-sm">No posts found.</p>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-white/[0.05]">
            {filteredPosts.map((post) => {
              const badge = statusBadge(post.status || "draft");
              return (
                <div key={post.id} className="flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
                  <div className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-white/[0.05] overflow-hidden shrink-0">
                    {post.featuredImage ? <img src={post.featuredImage} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /> : <div className="flex items-center justify-center h-full"><Image className="w-5 h-5 text-zinc-300" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-blue-600">{post.category}</span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.cls}`}><badge.icon className="w-3 h-3" />{badge.label}</span>
                    </div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{post.title}</p>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-500 mt-0.5">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.publishedDate || post.updatedDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readingTime || "?"} min</span>
                      {(post.tags || []).length > 0 && (
                        <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{(post.tags || []).slice(0, 2).join(", ")}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"><Eye className="w-4 h-4" /></a>
                    <button onClick={() => openEdit(post)} className="p-2 rounded-lg text-zinc-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => remove(post.id)} className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#162032] p-6 rounded-2xl border border-zinc-200 dark:border-[#1E3A5F]">
      <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-1.5">{label}</label>
      {children}
    </div>
  );
}
