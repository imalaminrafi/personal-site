import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { getPostBySlug, getRelatedPosts, loadPosts } from "@/data/blogData";
import { ArrowLeft, Calendar, Clock, User, Tag, ChevronLeft, ChevronRight, ExternalLink, BarChart3 } from "lucide-react";
import Header from "@/components/professional/Header";
import Footer from "@/components/professional/Footer";
import SocialShare from "@/components/blog/SocialShare";
import AuthorBox from "@/components/blog/AuthorBox";
import NotFound from "./NotFound";
import { author } from "@/data/author";
import {
  buildPostMeta, generateArticleSchema, generateBreadcrumbSchema, generateFaqSchema,
  getSitewideSchemas, calculateSeoScore, generatePrevNextPosts, getBaseUrl,
} from "@/utils/seoUtils";

export default function BlogPost() {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : undefined;
  const allPosts = useMemo(() => loadPosts().filter((p) => p.status === "published"), []);
  const relatedPosts = useMemo(() => (post ? getRelatedPosts(post) : []), [post]);
  const { prev, next } = useMemo(() => (post ? generatePrevNextPosts(post.slug, allPosts) : { prev: null, next: null }), [post, allPosts]);
  const seoScore = useMemo(() => (post ? calculateSeoScore(post) : null), [post]);
  const baseUrl = getBaseUrl();

  useEffect(() => {
    if (!post) return;
    const meta = buildPostMeta(post);
    document.title = meta.title;
    setMeta("description", meta.description);
    setMeta("keywords", meta.keywords);
    setMeta("robots", meta.robots);
    setMeta("og:type", meta.ogType); setMeta("og:title", meta.ogTitle); setMeta("og:description", meta.ogDescription);
    setMeta("og:image", meta.ogImage); setMeta("og:url", meta.ogUrl); setMeta("og:site_name", meta.ogSiteName);
    setMeta("twitter:card", meta.twitterCard); setMeta("twitter:title", meta.twitterTitle);
    setMeta("twitter:description", meta.twitterDescription); setMeta("twitter:image", meta.twitterImage);
    setLink("canonical", meta.canonical);

    const schemas = [
      ...getSitewideSchemas(),
      generateArticleSchema(post),
      generateBreadcrumbSchema(post.slug, post.breadcrumbTitle, post.title),
      generateFaqSchema(post.faq || []),
    ].filter(Boolean);

    const container = document.head;
    schemas.forEach((schema, i) => {
      const id = `schema-${i}`;
      let el = document.getElementById(id);
      if (!el) { el = document.createElement("script"); el.id = id; el.setAttribute("type", "application/ld+json"); container.appendChild(el); }
      el.textContent = JSON.stringify(schema, null, 2);
    });

    // Inject internal link to /about-alamin-rafi in content
    if (post.content && !post.content.includes("/about-alamin-rafi")) {
      // Add hidden link for SEO
      let linkEl = document.getElementById("author-link-seo");
      if (!linkEl) { linkEl = document.createElement("link"); linkEl.id = "author-link-seo"; linkEl.setAttribute("rel", "author"); document.head.appendChild(linkEl); }
      linkEl.setAttribute("href", `${baseUrl}/about-alamin-rafi`);
    }

    return () => {
      document.title = "Alamin Rafi — Website Developer & Designer";
      setMeta("description", "Professional website developer and designer crafting modern, SEO-optimized digital experiences.");
      setMeta("keywords", ""); setMeta("robots", "index, follow");
      ["og:type","og:title","og:description","og:image","og:url","og:site_name","twitter:card","twitter:title","twitter:description","twitter:image"].forEach((n) => {
        const el = document.querySelector(`meta[property="${n}"], meta[name="${n}"]`);
        if (el) el.remove();
      });
      setLink("canonical", baseUrl);
      for (let i = 0; i < 20; i++) { const el = document.getElementById(`schema-${i}`); if (el) el.remove(); }
      const al = document.getElementById("author-link-seo"); if (al) al.remove();
    };
  }, [post]);

  function setMeta(name: string, content: string) {
    const sel = `meta[property="${name}"], meta[name="${name}"]`;
    let el = document.querySelector(sel) as HTMLMetaElement | null;
    if (!el) { el = document.createElement("meta"); if (name.startsWith("og:")) el.setAttribute("property", name); else el.setAttribute("name", name); document.head.appendChild(el); }
    el.setAttribute("content", content);
  }

  function setLink(rel: string, href: string) {
    let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!el) { el = document.createElement("link"); el.setAttribute("rel", rel); document.head.appendChild(el); }
    el.setAttribute("href", href);
  }

  if (!post) return <NotFound />;

  const cleanContent = post.content?.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") || "";
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const contentWithInternalLinks = cleanContent.includes("/about-alamin-rafi")
    ? cleanContent
    : cleanContent + `<p class="mt-8"><a href="/about-alamin-rafi" class="text-violet-600 dark:text-violet-400 font-bold hover:underline">About Alamin Rafi</a> — Professional website developer and designer helping businesses grow online.</p>`;

  return (
    <div className="min-h-screen bg-white dark:bg-[#070711]">
      <Header />

      <article className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          {seoScore && (
            <div className="flex items-center gap-2 text-[11px] text-zinc-500" title="SEO Score">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>SEO: {seoScore.score}/100</span>
              <div className="w-16 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${seoScore.score >= 80 ? "bg-emerald-500" : seoScore.score >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${seoScore.score}%` }} />
              </div>
            </div>
          )}
        </div>

        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">{post.category}</span>
            <span className="text-zinc-300 dark:text-zinc-600">/</span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(post.publishedDate || post.updatedDate)}</span>
            <span className="text-zinc-300 dark:text-zinc-600">/</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readingTime || "5"} min read</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-6 leading-tight">{post.title}</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-2xl">{post.shortDescription}</p>
        </header>

        {(post.featuredImage || post.ogImage) && (
          <div className="aspect-[21/9] rounded-3xl overflow-hidden mb-12 border border-zinc-100 dark:border-white/[0.05] shadow-xl shadow-zinc-200/20 dark:shadow-none">
            <img src={post.featuredImage || post.ogImage} alt={post.imageAlt || post.title} title={post.imageTitle || post.title} loading="lazy" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
        )}

        <div className="flex items-center gap-4 pb-8 mb-10 border-b border-zinc-100 dark:border-white/[0.05]">
          <Link to="/about-alamin-rafi" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold text-sm overflow-hidden">
              {author.image ? <img src={author.image} alt={author.name} className="w-full h-full object-cover" /> : (post.author || "AR").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{post.author || author.name}</p>
              <p className="text-[11px] text-zinc-500">{author.jobTitle}</p>
            </div>
          </Link>
          <div className="ml-auto">
            <SocialShare url={postUrl} title={post.title} />
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: contentWithInternalLinks }} />

          {post.galleryImages && post.galleryImages.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Gallery</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {post.galleryImages.map((img, i) => (
                  <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-white/[0.08]">
                    <img src={img} alt={`${post.title} gallery ${i + 1}`} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {post.faq && post.faq.length > 0 && (
            <div className="mt-12 bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl p-6 border border-zinc-100 dark:border-white/[0.05]">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {post.faq.map((item, i) => (
                  <details key={i} className="group bg-white dark:bg-[#0d0b1f] rounded-xl border border-zinc-200 dark:border-white/[0.08] overflow-hidden">
                    <summary className="px-4 py-3 font-bold text-sm text-zinc-900 dark:text-white cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors list-none flex items-center justify-between">
                      <span>{item.question}</span>
                      <svg className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <div className="px-4 pb-3 text-sm text-zinc-600 dark:text-zinc-400">{item.answer}</div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-zinc-400" />
              {post.tags.map((tag) => (
                <Link key={tag} to={`/blog?tag=${encodeURIComponent(tag)}`} className="px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-bold hover:bg-violet-100 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{tag}</Link>
              ))}
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-zinc-100 dark:border-white/[0.05]">
            <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3">Share this article</p>
            <SocialShare url={postUrl} title={post.title} />
          </div>

          <div className="mt-8">
            <AuthorBox />
          </div>
        </div>
      </article>

      {/* Prev / Next Navigation */}
      {(prev || next) && (
        <section className="max-w-4xl mx-auto px-6 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prev ? (
              <Link to={`/blog/${prev.slug}`} className="flex items-center gap-3 p-4 rounded-2xl border border-zinc-100 dark:border-white/[0.05] hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors group">
                <ChevronLeft className="w-5 h-5 text-zinc-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">Previous</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">{prev.title}</p>
                </div>
              </Link>
            ) : <div />}
            {next ? (
              <Link to={`/blog/${next.slug}`} className="flex items-center gap-3 p-4 rounded-2xl border border-zinc-100 dark:border-white/[0.05] hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors group text-right justify-end">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">Next</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">{next.title}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-400 shrink-0" />
              </Link>
            ) : <div />}
          </div>
        </section>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="border-t border-zinc-100 dark:border-white/[0.05] pt-12 mb-8">
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Related Articles</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedPosts.map((rp) => (
              <Link key={rp.id} to={`/blog/${rp.slug}`} className="group flex flex-col rounded-2xl overflow-hidden border border-zinc-100 dark:border-white/[0.05] bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-violet-200 dark:hover:border-violet-800/40 transition-all">
                <div className="aspect-[16/9] overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                  {rp.featuredImage ? (
                    <img src={rp.featuredImage} alt={rp.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs">No image</div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-1">{rp.category}</p>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">{rp.title}</h3>
                  <p className="text-[11px] text-zinc-500 mt-1">{formatDate(rp.publishedDate || rp.updatedDate)}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-violet-600 dark:text-violet-400 hover:underline">
              View All Articles <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
