import AdminLayout from "./AdminLayout";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FileText, DollarSign, Briefcase, Users, Eye, TrendingUp, Star, MessageCircle, Image } from "lucide-react";
import { loadTestimonials } from "@/data/testimonials";
import { loadMessages } from "@/data/messages";
import { loadGallery } from "@/data/gallery";

export default function AdminDashboard() {
  const [testimonialCount, setTestimonialCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [galleryCount, setGalleryCount] = useState(0);

  useEffect(() => {
    setTestimonialCount(loadTestimonials().length);
    setMessageCount(loadMessages().filter((m) => !m.replied).length);
    setGalleryCount(loadGallery().length);
  }, []);

  const stats = [
    { label: "Total Posts", value: "4", icon: FileText, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
    { label: "Site Visitors", value: "1,240", icon: Eye, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-500/10" },
    { label: "New Leads", value: "12", icon: Users, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
    { label: "Project Requests", value: "8", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
    { label: "Testimonials", value: String(testimonialCount), icon: Star, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-500/10" },
    { label: "Unread Messages", value: String(messageCount), icon: MessageCircle, color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-500/10" },
    { label: "Gallery Items", value: String(galleryCount), icon: Image, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
  ];

  return (
    <AdminLayout title="Overview">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-[#0d0b1f] p-5 rounded-2xl border border-zinc-200 dark:border-white/[0.08] shadow-sm">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-4.5 h-4.5" />
            </div>
            <p className="text-xl font-black text-zinc-900 dark:text-white">{stat.value}</p>
            <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#0d0b1f] p-6 rounded-2xl border border-zinc-200 dark:border-white/[0.08]">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-5">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            <Link to="/admin/blog" className="flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-100 dark:border-white/[0.05] hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors text-center">
              <FileText className="w-5 h-5 text-violet-500 mb-2" />
              <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-200">Blog</span>
            </Link>
            <Link to="/admin/testimonials" className="flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-100 dark:border-white/[0.05] hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors text-center">
              <Star className="w-5 h-5 text-pink-500 mb-2" />
              <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-200">Testimonials</span>
            </Link>
            <Link to="/admin/pricing" className="flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-100 dark:border-white/[0.05] hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors text-center">
              <DollarSign className="w-5 h-5 text-emerald-500 mb-2" />
              <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-200">Pricing</span>
            </Link>
            <Link to="/admin/gallery" className="flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-100 dark:border-white/[0.05] hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors text-center">
              <Image className="w-5 h-5 text-orange-500 mb-2" />
              <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-200">Gallery</span>
            </Link>
            <Link to="/admin/messages" className="flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-100 dark:border-white/[0.05] hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors text-center">
              <MessageCircle className="w-5 h-5 text-cyan-500 mb-2" />
              <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-200">Messages</span>
            </Link>
            <Link to="/admin/portfolio" className="flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-100 dark:border-white/[0.05] hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors text-center">
              <Briefcase className="w-5 h-5 text-blue-500 mb-2" />
              <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-200">Portfolio</span>
            </Link>
          </div>
        </div>

        <div className="bg-brand-gradient p-6 rounded-2xl text-white">
          <h3 className="text-base font-bold mb-1">System Status</h3>
          <p className="text-white/80 text-xs mb-5">Everything is running smoothly.</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/70">Core Performance</span>
              <span className="font-bold">98/100</span>
            </div>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white w-[98%] rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
