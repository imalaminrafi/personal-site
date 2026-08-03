import { useState } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  LayoutDashboard, Briefcase, FolderKanban, FileText, Image, DollarSign,
  MessageCircle, Star, Search, Settings, LogOut, Menu, Globe, User,
  BookOpen, Palette, ChevronDown, ChevronLeft, BarChart3,
  Columns, Monitor, ExternalLink, PanelRightOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  onPreview?: (device: "desktop" | "tablet" | "mobile") => void;
}

interface NavGroup {
  label: string;
  items: { label: string; href: string; icon: React.ElementType }[];
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Pages", href: "/admin/about", icon: BookOpen },
      { label: "Blog", href: "/admin/blog", icon: FileText },
      { label: "Portfolio", href: "/admin/portfolio", icon: Briefcase },
      { label: "Projects", href: "/admin/projects", icon: FolderKanban },
      { label: "Gallery", href: "/admin/gallery", icon: Image },
      { label: "Books", href: "/admin/book", icon: BookOpen },
      { label: "Media Library", href: "/admin/media", icon: Palette },
    ],
  },
  {
    label: "Business",
    items: [
      { label: "Testimonials", href: "/admin/testimonials", icon: Star },
      { label: "Services", href: "/admin/pricing", icon: DollarSign },
      { label: "Pricing", href: "/admin/pricing", icon: BarChart3 },
      { label: "Contact Messages", href: "/admin/messages", icon: MessageCircle },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "SEO", href: "/admin/seo", icon: Globe },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Appearance", href: "/admin/settings", icon: Palette },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  if (!admin) return <Navigate to="/admin" replace />;

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  const toggleGroup = (label: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const allNavItems = navGroups.flatMap((g) => g.items);
  const searchResults = searchQuery
    ? allNavItems.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0F172A] flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#162032] border-r border-zinc-200 dark:border-[#1E3A5F] transition-all duration-300 flex flex-col overflow-hidden",
          sidebarOpen ? "w-60" : "w-16",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn("flex items-center gap-2.5 shrink-0 border-b border-zinc-100 dark:border-[#1E3A5F]", sidebarOpen ? "p-4" : "p-3 justify-center")}>
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 min-w-0">
            <div className="bg-gradient-to-r from-violet-600 to-cyan-500 h-8 w-8 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0">
              AR
            </div>
            {sidebarOpen && (
              <span className="font-black text-zinc-900 dark:text-white tracking-tighter text-sm truncate">Admin</span>
            )}
          </Link>
        </div>

        {/* Search */}
        {sidebarOpen && (
          <div className="px-3 pt-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                placeholder="Search menu..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-100 dark:bg-white/[0.05] text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 border-0"
              />
              {/* Search results dropdown */}
              {searchOpen && searchQuery && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#162032] rounded-xl border border-zinc-200 dark:border-[#1E3A5F] shadow-lg z-50 py-1 max-h-48 overflow-y-auto">
                  {searchResults.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors"
                      onClick={() => { setSearchQuery(""); setSearchOpen(false); setMobileOpen(false); }}
                    >
                      <item.icon className="w-3.5 h-3.5 text-violet-500" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {navGroups.map((group) => {
            const isCollapsed = collapsedGroups[group.label];
            const isActive = group.items.some((item) => location.pathname === item.href);
            return (
              <div key={group.label}>
                {sidebarOpen && (
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className={cn(
                      "flex items-center justify-between w-full px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors",
                      isActive ? "text-violet-600 dark:text-violet-400" : "text-zinc-400 dark:text-zinc-500"
                    )}
                  >
                    <span>{group.label}</span>
                    <ChevronDown className={cn("w-3 h-3 transition-transform", isCollapsed ? "-rotate-90" : "")} />
                  </button>
                )}
                {(!isCollapsed || !sidebarOpen) && (
                  <div className={cn("space-y-0.5", sidebarOpen ? "mt-1" : "")}>
                    {group.items.map((item) => {
                      const active = location.pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-2.5 rounded-xl transition-all",
                            sidebarOpen ? "px-3 py-2" : "px-0 py-2 justify-center",
                            active
                              ? "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 font-semibold"
                              : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.05] hover:text-zinc-900 dark:hover:text-white font-medium"
                          )}
                          title={!sidebarOpen ? item.label : undefined}
                        >
                          <item.icon className={cn("shrink-0", active ? "w-4 h-4" : "w-4 h-4")} />
                          {sidebarOpen && (
                            <span className="text-xs truncate">{item.label}</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-zinc-100 dark:border-[#1E3A5F] p-3 space-y-1 shrink-0">
          {sidebarOpen && (
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.05] hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
              <span>View Site</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-2.5 rounded-xl text-xs font-medium transition-colors w-full",
              sidebarOpen ? "px-3 py-2 justify-start" : "px-0 py-2 justify-center",
              "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
            )}
            title={!sidebarOpen ? "Logout" : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex items-center justify-center h-8 border-t border-zinc-100 dark:border-[#1E3A5F] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors shrink-0"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
        </button>
      </aside>

      {/* Main content */}
      <div className={cn("flex-1 flex flex-col min-w-0 transition-all duration-300", sidebarOpen ? "lg:ml-60" : "lg:ml-16")}>
        {/* Header */}
        <header className="h-14 bg-white dark:bg-[#0F172A] border-b border-zinc-200 dark:border-[#1E3A5F] flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 -ml-1.5 text-zinc-400" onClick={() => setMobileOpen(true)} aria-label="Open Sidebar">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold text-zinc-900 dark:text-white">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/about"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors"
            >
              <Monitor className="w-3.5 h-3.5" />
              Preview
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors"
            >
              <Columns className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-5 lg:p-8 overflow-y-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
