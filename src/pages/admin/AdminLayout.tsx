import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  LayoutDashboard, Briefcase, FolderKanban, FileText, Image,
  DollarSign, MessageSquare, Star, Search, Settings,
  LogOut, Menu, X, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const navGroups = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Portfolio", href: "/admin/portfolio", icon: Briefcase },
      { label: "Projects", href: "/admin/projects", icon: FolderKanban },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Blog", href: "/admin/blog", icon: FileText },
      { label: "Gallery", href: "/admin/gallery", icon: Image },
      { label: "Pricing", href: "/admin/pricing", icon: DollarSign },
    ],
  },
  {
    label: "Engagement",
    items: [
      { label: "Messages", href: "/admin/messages", icon: MessageSquare },
      { label: "Testimonials", href: "/admin/testimonials", icon: Star },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Media Library", href: "/admin/media", icon: Search },
      { label: "SEO", href: "/admin/seo", icon: Settings },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#070711] flex">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0d0b1f] border-r border-zinc-200 dark:border-white/[0.06] transition-transform duration-300 lg:translate-x-0 lg:static lg:block flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-5 flex items-center justify-between border-b border-zinc-100 dark:border-white/[0.05]">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="bg-brand-gradient h-8 w-8 rounded-lg flex items-center justify-center text-white font-black text-xs">
              AR
            </div>
            <span className="font-black text-zinc-900 dark:text-white tracking-tighter text-sm">ADMIN</span>
          </Link>
          <button
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                        isActive
                          ? "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400"
                          : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-white"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-100 dark:border-white/[0.05]">
          <div className="bg-zinc-50 dark:bg-white/[0.03] rounded-2xl p-4 border border-zinc-100 dark:border-white/[0.05]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold text-xs">
                {admin?.name?.charAt(0) || "A"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{admin?.name}</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 capitalize">{admin?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-[#070711] border-b border-zinc-200 dark:border-white/[0.06] flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-2 text-zinc-400"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-zinc-900 dark:text-white">{title}</h1>
          </div>
          <Link to="/" className="text-xs font-bold text-zinc-500 hover:text-violet-600 transition-colors">
            View Site ↗
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
