import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import {
  FileText, Briefcase, Sparkles, Book, MessageCircle, FolderKanban, Image as ImageIcon,
  CheckCircle2, Edit3, Star, AlertCircle, ShieldCheck, Plus,
  type LucideIcon,
} from "lucide-react";
import { Card, PageHeader, EmptyState } from "@/components/admin/ui";
import { loadPosts, type BlogPost } from "@/data/blogData";
import { loadPortfolio } from "@/data/portfolio";
import { loadBooks } from "@/data/books";
import { plans } from "@/data/pricingData";
import { loadMessages } from "@/data/messages";
import { loadTestimonials } from "@/data/testimonials";
import { loadGallery } from "@/data/gallery";

interface Activity {
  action: string;
  detail: string;
  time: number;
  type: "publish" | "message" | "testimonial" | "update" | "book";
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

const activityMeta: Record<Activity["type"], { color: string; icon: LucideIcon }> = {
  publish: { color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400", icon: CheckCircle2 },
  message: { color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400", icon: MessageCircle },
  testimonial: { color: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400", icon: Star },
  update: { color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400", icon: Edit3 },
  book: { color: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400", icon: Book },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({ posts: 0, drafts: 0, portfolio: 0, services: 0, books: 0, messages: 0, gallery: 0 });
  const [activity, setActivity] = useState<Activity[]>([]);

  useEffect(() => {
    const posts = loadPosts();
    setStats({
      posts: posts.length,
      drafts: posts.filter((p) => p.status === "draft").length,
      portfolio: loadPortfolio().length,
      services: plans.length,
      books: loadBooks().length,
      messages: loadMessages().filter((m) => !m.replied).length,
      gallery: loadGallery().length,
    });

    const list: Activity[] = [];
    posts.forEach((p: BlogPost) => {
      const ts = new Date(p.updatedDate || p.publishedDate || Date.now()).getTime();
      list.push({
        action: p.status === "published" ? "Blog post published" : "Blog post saved as draft",
        detail: p.title,
        time: ts,
        type: p.status === "published" ? "publish" : "update",
      });
    });
    loadMessages().forEach((m) => {
      list.push({ action: m.replied ? "Message marked replied" : "New message received", detail: `${m.name} — ${m.subject}`, time: new Date(m.createdAt).getTime(), type: "message" });
    });
    loadTestimonials().forEach((t) => {
      list.push({ action: "Testimonial added", detail: t.clientName || "New testimonial", time: new Date(t.createdAt || Date.now()).getTime(), type: "testimonial" });
    });
    loadBooks().forEach((b) => {
      list.push({ action: b.published ? "Book published" : "Book added", detail: b.title, time: new Date(b.createdAt || Date.now()).getTime(), type: "book" });
    });
    setActivity(list.sort((a, b) => b.time - a.time).slice(0, 7));
  }, []);

  const statCards: { label: string; value: number; icon: LucideIcon }[] = [
    { label: "Blog Posts", value: stats.posts, icon: FileText },
    { label: "Portfolio Projects", value: stats.portfolio, icon: Briefcase },
    { label: "Services", value: stats.services, icon: Sparkles },
    { label: "Books", value: stats.books, icon: Book },
    { label: "Messages", value: stats.messages, icon: MessageCircle },
  ];

  const quickActions = [
    { label: "New Blog Post", href: "/admin/blog", icon: FileText },
    { label: "Add Project", href: "/admin/projects", icon: FolderKanban },
    { label: "Add Portfolio", href: "/admin/portfolio", icon: Briefcase },
    { label: "Add Book", href: "/admin/book", icon: Book },
    { label: "Upload Media", href: "/admin/media", icon: ImageIcon },
  ];

  return (
    <AdminLayout title="Dashboard">
      <PageHeader
        title="Dashboard"
        description="Overview of your content, activity and site health."
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {statCards.map((s) => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 dark:bg-white/[0.06] dark:text-zinc-400">
                <s.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold leading-none text-zinc-900 dark:text-white">{s.value}</p>
                <p className="mt-1 truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-5 lg:col-span-2">
          {/* Quick Actions */}
          <Card>
            <div className="border-b border-zinc-100 px-5 py-3.5 dark:border-white/[0.05]">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-2.5 p-4 sm:grid-cols-3">
              {quickActions.map((a) => (
                <Link
                  key={a.href + a.label}
                  to={a.href}
                  className="group flex items-center gap-2.5 rounded-lg border border-zinc-100 px-3 py-2.5 transition-colors hover:border-violet-200 hover:bg-violet-50/50 dark:border-white/[0.05] dark:hover:border-violet-800/40 dark:hover:bg-violet-500/5"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 transition-colors group-hover:bg-violet-100 group-hover:text-violet-600 dark:bg-white/[0.06] dark:text-zinc-400 dark:group-hover:bg-violet-500/15 dark:group-hover:text-violet-400">
                    <a.icon className="h-4 w-4" />
                  </div>
                  <span className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-200">{a.label}</span>
                </Link>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3.5 dark:border-white/[0.05]">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Recent Activity</h3>
              <span className="text-[11px] font-medium text-zinc-400">Latest updates</span>
            </div>
            {activity.length === 0 ? (
              <EmptyState
                icon={AlertCircle}
                title="No activity yet"
                description="Changes you make across the admin panel will appear here."
              />
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-white/[0.05]">
                {activity.map((a, i) => {
                  const meta = activityMeta[a.type];
                  return (
                    <div key={i} className="flex items-start gap-3 px-5 py-3">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.color}`}>
                        <meta.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-zinc-900 dark:text-white">{a.action}</p>
                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{a.detail}</p>
                      </div>
                      <span className="shrink-0 text-[11px] font-medium text-zinc-400">{timeAgo(a.time)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Content overview */}
          <Card>
            <div className="border-b border-zinc-100 px-5 py-3.5 dark:border-white/[0.05]">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Content Overview</h3>
            </div>
            <div className="space-y-3 px-5 py-4">
              {[
                { label: "Published posts", value: stats.posts - stats.drafts },
                { label: "Drafts", value: stats.drafts },
                { label: "Gallery items", value: stats.gallery },
                { label: "Unread messages", value: stats.messages },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-[13px] text-zinc-500 dark:text-zinc-400">{row.label}</span>
                  <span className={`text-sm font-bold ${row.label === "Unread messages" && row.value > 0 ? "text-amber-600 dark:text-amber-400" : "text-zinc-900 dark:text-white"}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Site status */}
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-zinc-900 dark:text-white">All systems operational</p>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  The site is live and your content is being served normally. Use the sidebar to manage each section.
                </p>
                <Link
                  to="/admin/media"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-white/[0.06] dark:text-zinc-200 dark:hover:bg-white/[0.1]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Upload media
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}