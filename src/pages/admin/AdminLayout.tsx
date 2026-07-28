import { useState } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  LayoutDashboard, Briefcase, FolderKanban, FileText, Image, DollarSign,
  MessageCircle, Star, Search, Settings, LogOut, Menu, X, Globe, User
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "About", href: "/admin/about", icon: User },
  { label: "Portfolio", href: "/admin/portfolio", icon: Briefcase },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Gallery", href: "/admin/gallery", icon: Image },
  { label: "Pricing", href: "/admin/pricing", icon: DollarSign },
  { label: "Messages", href: "/admin/messages", icon: MessageCircle },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star },
  { label: "SEO", href: "/admin/seo", icon: Globe },
  { label: "Media Library", href: "/admin/media", icon: Search },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (!admin) return <Navigate to="/admin" replace />;

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#070711] flex">
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0d0b1f] border-r border-zinc-200 dark:border-white/[0.06] transition-transform duration-300 lg:translate-x-0 lg:static lg:block overflow-y-auto",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-5 flex items-center justify-between border-b border-zinc-100 dark:border-white/[0.05]">
            <Link to="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="bg-brand-gradient h-8 w-8 rounded-lg flex items-center justify-center text-white font-black text-xs">
                AR
              </div>
              <span className="font-black text-zinc-900 dark:text-white tracking-tighter text-sm">ADMIN PANEL</span>
            </Link>
            <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close">
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400"
                    : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.05] hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-zinc-100 dark:border-white/[0.05]">
            <button onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white dark:bg-[#070711] border-b border-zinc-200 dark:border-white/[0.06] flex items-center justify-between px-5 lg:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 -ml-1.5 text-zinc-400" onClick={() => setOpen(true)} aria-label="Open Sidebar">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold text-zinc-900 dark:text-white">{title}</h1>
          </div>
          <Link to="/" className="text-xs font-bold text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
            View Site ↗
          </Link>
        </header>
        <main className="p-5 lg:p-8 overflow-y-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
