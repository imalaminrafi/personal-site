import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { loadPosts, type BlogPost } from "@/data/blogData";
import { getOptimizedUrl, getSrcSet } from "@/utils/cloudinary";
import { ArrowRight, Calendar, Clock } from "lucide-react";

function formatShortDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

export default function GrowthInsights() {
    const [posts, setPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        const all = loadPosts()
            .filter((p) => p.status === "published")
            .sort((a, b) => new Date(b.publishedDate || b.updatedDate).getTime() - new Date(a.publishedDate || a.updatedDate).getTime())
            .slice(0, 3);
        setPosts(all);
    }, []);

    if (posts.length === 0) return null;

    return (
        <section id="insights" className="bg-white dark:bg-[#0A1628] py-12 sm:py-14 border-t border-zinc-100 dark:border-white/[0.05]">
            <div className="max-w-5xl mx-auto px-5 sm:px-6">
                <div className="mb-8 sm:mb-12">
                    <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">
                        Growth Insights
                    </p>
                    <h2 className="text-xl sm:text-2xl font-medium text-zinc-900 dark:text-white leading-snug">
                        Growth Insights
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 max-w-xl leading-relaxed">
                        Quick reads on AI, business &amp; digital strategy.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            to={`/blog/${post.slug}`}
                            className="group flex flex-col rounded-xl overflow-hidden border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#0F2040] hover:border-[#C9A84C]/50 dark:hover:border-[#C9A84C]/40 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="aspect-[16/9] overflow-hidden bg-zinc-200 dark:bg-[#14233F]">
                                {post.featuredImage ? (
                                    <img
                                        src={getOptimizedUrl(post.featuredImage, { width: 800, crop: "limit", quality: "auto", format: "auto" })}
                                        srcSet={getSrcSet(post.featuredImage) || undefined}
                                        sizes="(max-width: 640px) 100vw, 33vw"
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
                            <div className="p-4 sm:p-5 flex flex-col grow">
                                <span className="self-start text-[10px] font-bold uppercase tracking-widest text-[#C9A84C] bg-[#C9A84C]/10 dark:bg-[#C9A84C]/15 px-2 py-1 rounded-md">
                                    {post.category}
                                </span>
                                <h3 className="mt-2.5 text-base font-bold text-zinc-900 dark:text-white line-clamp-2 group-hover:text-[#C9A84C] transition-colors">
                                    {post.title}
                                </h3>
                                <div className="mt-3 flex items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-400">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatShortDate(post.publishedDate || post.updatedDate)}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readingTime || "5"} min read</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 sm:mt-10 text-center">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-1.5 text-[#C9A84C] font-semibold text-[15px] hover:gap-2.5 transition-all"
                    >
                        See All Posts <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
