import { useState, useEffect, lazy, Suspense } from "react";
import AdminLayout from "./AdminLayout";
import { loadPosts, savePosts, CATEGORIES, slugify, estimateReadingTime, type BlogPost } from "@/data/blogData";
import { Plus, Edit2, Trash2, Eye, Calendar, Clock, Tag, Save, X, CheckCircle, Clock9, AlertCircle, FileText, Tags, Image as ImageIcon, CalendarClock, SearchCheck } from "lucide-react";
import CloudinaryUploader from "@/components/cloudinary/CloudinaryUploader";
import { cn } from "@/lib/utils";
import {
  Btn, Field, Input, Textarea, Select, Badge, Card, SearchInput,
  AccordionSection, PageHeader, EmptyState,
} from "@/components/admin/ui";

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

  function handleSave(overrideStatus?: Status) {
    if (!form.title.trim()) return;
    const status = overrideStatus ?? form.status;
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
      status, scheduledDate: status === "scheduled" ? form.scheduledDate : "",
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

  const filteredPosts = posts.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusBadge = (s: string) => {
    if (s === "published") return { label: "Published", icon: CheckCircle, tone: "emerald" as const };
    if (s === "scheduled") return { label: "Scheduled", icon: Clock9, tone: "amber" as const };
    return { label: "Draft", icon: AlertCircle, tone: "zinc" as const };
  };

  /* ── Editor ────────────────────────────────────────────────── */
  if (view === "editor") {
    return (
      <AdminLayout title={editId ? "Edit Post" : "New Post"}>
        <div className="mx-auto max-w-4xl">
          <PageHeader
            title={editId ? "Edit Post" : "New Post"}
            description="Fill in the fields below. Most SEO fields are optional but recommended."
            actions={
              <>
                <Btn variant="ghost" onClick={() => setView("list")}>Cancel</Btn>
                <Btn variant="outline" onClick={() => handleSave("draft")}>
                  <Save className="h-4 w-4" /> {saved ? "Saved!" : "Save Draft"}
                </Btn>
                <Btn onClick={() => handleSave("published")}>Publish</Btn>
              </>
            }
          />
          {autoSaved && <p className="mb-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">{autoSaved}</p>}

          <div className="space-y-4 pb-24">
            {/* CONTENT */}
            <AccordionSection title="Content" icon={FileText}>
              <div className="space-y-4">
                <Field label="Title" required>
                  <Input value={form.title} onChange={(e) => { update("title", e.target.value); if (!editId) update("slug", slugify(e.target.value)); }} placeholder="Enter post title" />
                </Field>
                <Field label="Slug">
                  <Input value={form.slug} onChange={(e) => update("slug", slugify(e.target.value))} className="font-mono text-xs" placeholder="auto-generated from title" />
                </Field>
                <Field label="Short Description">
                  <Textarea rows={3} value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} placeholder="Brief summary shown on the blog listing" />
                </Field>
                <Field label="Full Article">
                  <Suspense fallback={<div className="flex h-[480px] items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-sm text-zinc-400 dark:border-white/[0.08] dark:bg-[#162032]">Loading editor...</div>}>
                    <WysiwygEditor value={form.content} onChange={(html) => update("content", html)} onAutoSave={handleAutoSave} />
                  </Suspense>
                </Field>
              </div>
            </AccordionSection>

            {/* TAXONOMY */}
            <AccordionSection title="Taxonomy" icon={Tags}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Category">
                  <Select value={form.category} onChange={(e) => update("category", e.target.value)}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </Select>
                </Field>
                <Field label="Author">
                  <Input value={form.author} onChange={(e) => update("author", e.target.value)} />
                </Field>
                <Field label="Tags (comma separated)" className="sm:col-span-2">
                  <Input value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="web development, react, tailwind" />
                </Field>
              </div>
            </AccordionSection>

            {/* IMAGE */}
            <AccordionSection title="Image" icon={ImageIcon}>
              <div className="space-y-4">
                <Field label="Featured Image">
                  <CloudinaryUploader value={form.featuredImage} onChange={(url) => update("featuredImage", url)} label="Upload featured image" />
                </Field>
                <Field label="Gallery Images">
                  <CloudinaryUploader multiple value={form.galleryImages} onChange={(urls) => update("galleryImages", urls)} label="Upload gallery images" />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Image Alt Text"><Input value={form.imageAlt} onChange={(e) => update("imageAlt", e.target.value)} /></Field>
                  <Field label="Image Title"><Input value={form.imageTitle} onChange={(e) => update("imageTitle", e.target.value)} /></Field>
                  <Field label="Image Caption"><Input value={form.imageCaption} onChange={(e) => update("imageCaption", e.target.value)} /></Field>
                  <Field label="Image Description"><Input value={form.imageDescription} onChange={(e) => update("imageDescription", e.target.value)} /></Field>
                </div>
              </div>
            </AccordionSection>

            {/* PUBLISHING */}
            <AccordionSection title="Publishing" icon={CalendarClock}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Status">
                  <Select value={form.status} onChange={(e) => update("status", e.target.value as Status)}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </Select>
                </Field>
                {form.status === "scheduled" && (
                  <Field label="Schedule Date">
                    <Input type="datetime-local" value={form.scheduledDate} onChange={(e) => update("scheduledDate", e.target.value)} />
                  </Field>
                )}
              </div>
              <p className="mt-3 text-[11px] text-zinc-500">Reading time: ~{estimateReadingTime(form.content)} min</p>
            </AccordionSection>

            {/* SEO */}
            <AccordionSection title="SEO" icon={SearchCheck}>
              <div className="space-y-4">
                <Field label="SEO Title">
                  <Input value={form.seoTitle} onChange={(e) => update("seoTitle", e.target.value)} placeholder="Leave blank to use post title" />
                </Field>
                <Field label="Meta Description">
                  <Textarea rows={2} value={form.metaDescription} onChange={(e) => update("metaDescription", e.target.value)} placeholder="Brief description for search results" />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Focus Keyword"><Input value={form.focusKeyword} onChange={(e) => update("focusKeyword", e.target.value)} /></Field>
                  <Field label="Canonical URL"><Input value={form.canonicalUrl} onChange={(e) => update("canonicalUrl", e.target.value)} /></Field>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Google Preview</p>
                  <p className="truncate text-sm text-blue-600">https://alaminrafi.com/blog/{form.slug || "post-slug"}</p>
                  <p className="truncate text-[15px] font-bold text-zinc-800 dark:text-zinc-200">{form.seoTitle || form.title || "Post Title"}</p>
                  <p className="line-clamp-2 text-xs text-zinc-500">{form.metaDescription || form.shortDescription || "Your meta description will appear here..."}</p>
                </div>
              </div>
            </AccordionSection>

            {/* ADVANCED SEO (collapsed) */}
            <AccordionSection title="Advanced SEO" defaultOpen={false}>
              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300">Social Sharing</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="OG Title"><Input value={form.ogTitle} onChange={(e) => update("ogTitle", e.target.value)} /></Field>
                    <Field label="Twitter Card">
                      <Select value={form.twitterCard} onChange={(e) => update("twitterCard", e.target.value)}>
                        <option value="summary">Summary</option>
                        <option value="summary_large_image">Summary Large Image</option>
                        <option value="app">App</option>
                        <option value="player">Player</option>
                      </Select>
                    </Field>
                  </div>
                  <div className="mt-4 space-y-4">
                    <Field label="OG Description"><Textarea rows={2} value={form.ogDescription} onChange={(e) => update("ogDescription", e.target.value)} /></Field>
                    <Field label="OG Image">
                      <CloudinaryUploader value={form.ogImage} onChange={(url) => update("ogImage", url)} label="Upload OG image" />
                    </Field>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300">Schema.org</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Schema Type">
                      <Select value={form.schemaType} onChange={(e) => update("schemaType", e.target.value)}>
                        <option value="Article">Article</option>
                        <option value="BlogPosting">BlogPosting</option>
                        <option value="NewsArticle">NewsArticle</option>
                      </Select>
                    </Field>
                    <Field label="Breadcrumb Title"><Input value={form.breadcrumbTitle} onChange={(e) => update("breadcrumbTitle", e.target.value)} /></Field>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300">Related Posts</p>
                  <div className="flex flex-wrap gap-2">
                    {posts.filter((p) => p.id !== editId && p.status === "published").map((p) => (
                      <label key={p.id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-[13px] transition-colors hover:bg-zinc-50 dark:border-white/[0.08] dark:hover:bg-white/[0.03]">
                        <input type="checkbox" checked={form.relatedSlugs.includes(p.slug)} onChange={() => toggleRelated(p.slug)} className="rounded border-zinc-300" />
                        <span className="text-zinc-700 dark:text-zinc-300">{p.title}</span>
                      </label>
                    ))}
                    {posts.filter((p) => p.id !== editId && p.status === "published").length === 0 && (
                      <p className="text-xs text-zinc-500">No published posts to link.</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300">FAQ Section</p>
                  {form.faq.map((item, i) => (
                    <div key={i} className="mb-3 flex items-start gap-2">
                      <div className="flex-1 space-y-2">
                        <Input placeholder="Question" value={item.question} onChange={(e) => updateFaq(i, "question", e.target.value)} />
                        <Textarea rows={2} placeholder="Answer" value={item.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} />
                      </div>
                      <button onClick={() => removeFaq(i)} className="mt-1 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"><X className="h-4 w-4" /></button>
                    </div>
                  ))}
                  <button onClick={addFaq} className="text-[13px] font-semibold text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400">+ Add FAQ</button>
                </div>
              </div>
            </AccordionSection>
          </div>

          {/* Sticky action bar */}
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-white/[0.06] dark:bg-[#0F172A]/95 lg:pl-64">
            <div className="mx-auto flex max-w-4xl items-center justify-end gap-2">
              <Btn variant="ghost" onClick={() => setView("list")}>Cancel</Btn>
              <Btn variant="outline" onClick={() => handleSave("draft")}>
                <Save className="h-4 w-4" /> {saved ? "Saved!" : "Save Draft"}
              </Btn>
              <Btn onClick={() => handleSave("published")}>Publish</Btn>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  /* ── List ───────────────────────────────────────────────────── */
  return (
    <AdminLayout title="Blog Management">
      <PageHeader
        title="Blog Posts"
        description="Create, edit and publish articles on your blog."
        actions={
          <Btn onClick={openNew}><Plus className="h-4 w-4" /> New Post</Btn>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search posts..." className="w-full sm:w-64" />
        <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-0.5 dark:bg-white/[0.06]">
          {(["all", "published", "draft", "scheduled"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-semibold capitalize transition-colors",
                filter === f ? "bg-white text-zinc-900 shadow-sm dark:bg-[#1E293B] dark:text-white" : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs font-medium text-zinc-400">{filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}</span>
      </div>

      <Card>
        {filteredPosts.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No posts found"
            description={search || filter !== "all" ? "Try a different search or filter." : 'Click "New Post" to write your first article.'}
          />
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-white/[0.05]">
            {filteredPosts.map((post) => {
              const badge = statusBadge(post.status || "draft");
              return (
                <div key={post.id} className="flex items-center gap-4 p-3.5 transition-colors hover:bg-zinc-50 dark:hover:bg-white/[0.02]">
                  <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-white/[0.05]">
                    {post.featuredImage ? (
                      <img src={post.featuredImage} alt="" className="h-full w-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    ) : (
                      <div className="flex h-full items-center justify-center"><ImageIcon className="h-5 w-5 text-zinc-300" /></div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
                      <Badge tone="violet">{post.category}</Badge>
                      <Badge tone={badge.tone} icon={badge.icon}>{badge.label}</Badge>
                    </div>
                    <p className="truncate text-[13px] font-bold text-zinc-900 dark:text-white">{post.title}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-zinc-500">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(post.publishedDate || post.updatedDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readingTime || "?"} min</span>
                      {(post.tags || []).length > 0 && (
                        <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{(post.tags || []).slice(0, 2).join(", ")}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" title="View post" className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-500/10"><Eye className="h-4 w-4" /></a>
                    <button onClick={() => openEdit(post)} title="Edit" className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => remove(post.id)} title="Delete" className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}