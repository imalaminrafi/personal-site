import AdminLayout from "./AdminLayout";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FileText, Briefcase, Eye, Star, MessageCircle, Image,
  TrendingUp, CheckCircle2, Edit3
} from "lucide-react";
import { loadTestimonials } from "@/data/testimonials";
import { loadMessages } from "@/data/messages";
import { loadGallery } from "@/data/gallery";
import { loadPosts } from "@/data/blogData";

export default function AdminDashboard() {
  const [testimonialCount, setTestimonialCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [galleryCount, setGalleryCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);

  useEffect(() => {
    setTestimonialCount(loadTestimonials().length);
    setMessageCount(loadMessages().filter((m) => !m.replied).length);
    setGalleryCount(loadGallery().length);
    const posts = loadPosts();
    setPostCount(posts.length);
    setDraftCount(posts.filter((p) => p.status === "draft").length);
  }, []);

  const stats = [
    { label: "Blog Posts", value: postCount, icon: FileText, color: "text-violet-600", bg: "bg-violet-100 dark:bg-violet-500/10", change: "+2 this month" },
    { label: "Portfolio", value: "6", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-500/10", change: "All live" },
    { label: "Site Visitors", value: "1,240", icon: Eye, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-500/10", change: "+18% vs last month" },
    { label: "Unread Messages", value: messageCount, icon: MessageCircle, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-500/10", change: messageCount > 0 ? "Needs reply" : "All clear" },
    { label: "Drafts", value: draftCount, icon: Edit3, color: "text-rose-600", bg: "bg-rose-100 dark:bg-rose-500/10", change: `${draftCount} unpublished` },
    { label: "Testimonials", value: testimonialCount, icon: Star, color: "text-pink-600", bg: "bg-pink-100 dark:bg-pink-500/10", change: "All approved" },
  ];

  const quickActions = [
    { label: "New Blog Post", href: "/admin/blog", icon: FileText, desc: "Write a new article" },
    { label: "Add Portfolio", href: "/admin/portfolio", icon: Briefcase, desc: "Showcase your work" },
    { label: "Edit About Page", href: "/admin/about", icon: Edit3, desc: "Update your profile" },
    { label: "View Messages", href: "/admin/messages", icon: MessageCircle, desc: "Check inquiries" },
    { label: "SEO Settings", href: "/admin/seo", icon: TrendingUp, desc: "Optimize rankings" },
    { label: "Upload Media", href: "/admin/media", icon: Image, desc: "Add images & files" },
  ];

  const recentActivity = [
    { action: "Blog post published", detail: "Who is Alamin Rafi?", time: "2 hours ago", type: "publish" },
    { action: "Portfolio updated", detail: "New project added", time: "Yesterday", type: "update" },
    { action: "Message received", detail: "From a new client", time: "2 days ago", type: "message" },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Welcome back</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Here's what's happening with your site today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-[#0F2040] rounded-2xl border border-zinc-200 dark:border-white/[0.06] p-4 hover:shadow-md hover:shadow-violet-500/5 transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-4.5 h-4.5" />
              </div>
              <span className="text-[10px] text-zinc-400 font-medium">{stat.change}</span>
            </div>
            <p className="text-2xl font-black text-zinc-900 dark:text-white">{stat.value}</p>
            <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#0F2040] rounded-2xl border border-zinc-200 dark:border-white/[0.06] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Quick Actions</h3>
              <Link to="/admin/blog" className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 transition-colors">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.href}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-100 dark:border-white/[0.05] hover:border-violet-200 dark:hover:border-violet-800/40 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-[#14233F]/50 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 transition-colors mb-2">
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 text-center leading-tight">{action.label}</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5 text-center">{action.desc}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-[#0F2040] rounded-2xl border border-zinc-200 dark:border-white/[0.06] p-5 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Recent Activity</h3>
              <span className="text-[10px] text-zinc-400 font-medium">Past 7 days</span>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-zinc-100 dark:border-white/[0.05] last:border-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    activity.type === "publish" ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                    activity.type === "message" ? "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                    "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  }`}>
                    {activity.type === "publish" ? <CheckCircle2 className="w-4 h-4" /> :
                     activity.type === "message" ? <MessageCircle className="w-4 h-4" /> :
                     <Edit3 className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white">{activity.action}</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{activity.detail}</p>
                  </div>
                  <span className="text-[10px] text-zinc-400 shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Site Status */}
          <div className="bg-gradient-to-br from-violet-600 to-cyan-500 rounded-2xl p-5 text-white">
            <h3 className="text-sm font-bold mb-1">Site Status</h3>
            <p className="text-white/70 text-xs mb-5">Everything is running smoothly.</p>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-white/70">Performance Score</span>
                  <span className="font-bold">98/100</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[98%] rounded-full" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-white/80" />
                <span className="text-white/80">All systems operational</span>
              </div>
            </div>
          </div>

          {/* Drafts */}
          <div className="bg-white dark:bg-[#0F2040] rounded-2xl border border-zinc-200 dark:border-white/[0.06] p-5">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Content Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Published</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-white">{postCount - draftCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Drafts</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-white">{draftCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Gallery Items</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-white">{galleryCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Unread Messages</span>
                <span className="text-xs font-bold text-amber-600">{messageCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
