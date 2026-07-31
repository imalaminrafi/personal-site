import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { loadPosts, CATEGORIES } from "@/data/blogData";
import { getOptimizedUrl, getSrcSet } from "@/utils/cloudinary";
import { ArrowRight, Calendar, Clock, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/professional/Header";
import Footer from "@/components/professional/Footer";

const ITEMS_PER_PAGE = 9;

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || "");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const all = loadPosts().filter((p) => p.status === "published");
    setPosts(all);
    const tagParam = searchParams.get("tag");
    if (tagParam) setSelectedTag(tagParam);
  }, [searchParams]);

  const allTags = useMemo(() => [...new Set(posts.flatMap((p) => p.tags || []))].sort(), [posts]);

  const filtered = useMemo(() => {
    let result = [...posts];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.shortDescription?.toLowerCase().includes(q) || p.content?.toLowerCase().includes(q));
    }
    if (category !== "All") result = result.filter((p) => p.category === category);
    if (selectedTag) result = result.filter((p) => (p.tags || []).includes(selectedTag));
    if (sort === "newest") result.sort((a, b) => new Date(b.publishedDate || b.updatedDate).getTime() - new Date(a.publishedDate || a.updatedDate).getTime());
    else result.sort((a, b) => new Date(a.publishedDate || a.updatedDate).getTime() - new Date(b.publishedDate || b.updatedDate).getTime());
    return result;
  }, [posts, search, category, selectedTag, sort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [search, category, selectedTag, sort]);

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  function handleTagClick(tag: string) {
    setSelectedTag(tag === selectedTag ? "" : tag);
    setSearchParams(tag ? { tag } : {});
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#070711]">
      <Header />

      <main>
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-50/50 to-transparent dark:from-violet-950/10 dark:to-transparent pointer-events-none" />
          <div className="max-w-6xl mx-auto relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">Blog</p>
            <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white mb-4">Insights & Stories</h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl text-sm">Tutorials, guides, and stories about web development, design, and building a business online.</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-8">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input type="text" placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:border-violet-400 dark:focus:border-violet-500 transition-colors" />
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900 text-sm focus:outline-none">
              {["All", ...CATEGORIES].map((c) => <option key={c}>{c}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value as "newest" | "oldest")} className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900 text-sm focus:outline-none">
              <option value="newest">Newest First</option><option value="oldest">Oldest First</option>
            </select>
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="text-[11px] font-bold uppercase text-zinc-400 mr-1">Tags:</span>
              {allTags.map((tag) => (
                <button key={tag} onClick={() => handleTagClick(tag)} className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${selectedTag === tag ? "bg-violet-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"}`}>{tag}</button>
              ))}
            </div>
          )}
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-20">
          {paginated.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-400 text-lg mb-2">No articles found</p>
              <p className="text-zinc-500 text-sm">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="group flex flex-col rounded-2xl overflow-hidden border border-zinc-100 dark:border-white/[0.05] bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-violet-200 dark:hover:border-violet-800/40 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300">
                    <div className="aspect-[16/9] overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                      {post.featuredImage ? (
                        <img
                          src={getOptimizedUrl(post.featuredImage, { width: 800, crop: "limit", quality: "auto", format: "auto" })}
                          srcSet={getSrcSet(post.featuredImage) || undefined}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          alt={post.imageAlt || post.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs">No image</div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col grow">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">{post.category}</span>
                        <span className="text-[10px] text-zinc-400">•</span>
                        <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(post.publishedDate || post.updatedDate)}</span>
                      </div>
                      <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">{post.title}</h2>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 grow line-clamp-2">{post.shortDescription}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3 text-[10px] text-zinc-400">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readingTime || "5"} min read</span>
                        </div>
                        <span className="text-violet-600 dark:text-violet-400 font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">Read <ArrowRight className="w-3.5 h-3.5" /></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors ${page === p ? "bg-violet-600 text-white" : "border border-zinc-200 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>{p}</button>
                  ))}
                  <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
