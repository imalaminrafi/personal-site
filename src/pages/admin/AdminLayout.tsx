import { useState } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import {
  LayoutDashboard, Briefcase, FolderKanban, FileText, Images, Book, BookOpen,
  MessageCircle, Star, Search, Settings, LogOut, Menu, Globe, Sparkles,
  Palette, ChevronLeft, PanelLeftRight, ExternalLink,
  SearchCheck, BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  onPreview?: (device: "desktop" | "tablet" | "mobile") => void;
}

interface NavItem { label: string; href: string; icon: React.ElementType }
interface NavGroup { label: string; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { label: "Pages", href: "/admin/about", icon: BookOpen },
      { label: "Blog", href: "/admin/blog", icon: FileText },
      { label: "Portfolio", href: "/admin/portfolio", icon: Briefcase },
      { label: "Projects", href: "/admin/projects", icon: FolderKanban },
      { label: "Gallery", href: "/admin/gallery", icon: Images },
      { label: "Books", href: "/admin/book", icon: Book },
      { label: "Media Library", href: "/admin/media", icon: Palette },
    ],
  },
  {
    label: "Business",
    items: [
      { label: "Services", href: "/admin/pricing", icon: Sparkles },
      { label: "Pricing", href: "/admin/pricing", icon: Globe },
      { label: "Testimonials", href: "/admin/testimonials", icon: Star },
      { label: "Contact Messages", href: "/admin/messages", icon: MessageCircle },
    ],
  },
  {
    label: "System",
    items: [
      { label: "SEO", href: "/admin/seo", icon: SearchCheck },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

function AdminErrorFallback({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mx-auto w-full max-w-md">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
          <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="mb-1.5 text-lg font-bold text-zinc-900 dark:text-white">Something went wrong</h2>
        <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
          An unexpected error occurred in this section. The rest of the admin panel is unaffected.
        </p>
        <div className="flex justify-center gap-2">
          <button
            onClick={reset}
            className="inline-flex h-9 items-center rounded-lg bg-violet-600 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-violet-700"
          >
            Try Again
          </button>
          <Link
            to="/admin/dashboard"
            className="inline-flex h-9 items-center rounded-lg bg-zinc-100 px-4 text-[13px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-white/[0.06] dark:text-zinc-200 dark:hover:bg-white/[0.1]"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (!admin) return <Navigate to="/admin" replace />;

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  const allNavItems = navGroups.flatMap((g) => g.items);
  const searchResults = searchQuery
    ? allNavItems.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const SidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={cn("flex shrink-0 items-center border-b border-zinc-100 dark:border-white/[0.05]", sidebarOpen ? "px-4 py-3.5" : "justify-center px-2 py-3.5")}>
        <Link to="/admin/dashboard" className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-xs font-black text-white">
            AR
          </div>
          {sidebarOpen && (
            <span className="truncate text-sm font-bold tracking-tight text-zinc-900 dark:text-white">Admin Panel</span>
          )}
        </Link>
      </div>

      {/* Search */}
      {sidebarOpen && (
        <div className="shrink-0 px-3 pt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search menu..."
              className="h-9 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-white/[0.08] dark:bg-[#162032] dark:text-white"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-white/[0.08] dark:bg-[#162032]">
                {searchResults.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => { setSearchQuery(""); setMobileOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-white/[0.05]"
                  >
                    <item.icon className="h-3.5 w-3.5 text-violet-500" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            {sidebarOpen && (
              <p className="mb-1 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    title={!sidebarOpen ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg text-[13px] font-medium transition-colors",
                      sidebarOpen ? "px-2.5" : "justify-center px-0",
                      "h-9",
                      active
                        ? "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 shrink-0", active && "text-violet-600 dark:text-violet-400")} />
                    {sidebarOpen && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="shrink-0 space-y-0.5 border-t border-zinc-100 p-2.5 dark:border-white/[0.05]">
        <Link
          to="/"
          target="_blank"
          className={cn(
            "flex items-center gap-2.5 rounded-lg text-[13px] font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.05] dark:hover:text-white h-9",
            sidebarOpen ? "px-2.5 justify-start" : "justify-center px-0"
          )}
          title="View Website"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          {sidebarOpen && <span>View Website</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-2.5 rounded-lg text-[13px] font-medium transition-colors h-9 w-full",
            sidebarOpen ? "px-2.5 justify-start" : "justify-center px-0",
            "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
          )}
          title="Logout"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-[#0F172A]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 hidden flex-col border-r border-zinc-200 bg-white shadow-sm transition-all duration-300 dark:border-white/[0.06] dark:bg-[#162032] lg:flex",
          sidebarOpen ? "w-56" : "w-[60px]"
        )}
      >
        {SidebarContent}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex h-9 shrink-0 items-center justify-center border-t border-zinc-100 text-zinc-400 transition-colors hover:text-zinc-700 dark:border-white/[0.05] dark:hover:text-zinc-200"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <PanelLeftRight className="h-4 w-4" />}
        </button>
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-white shadow-xl transition-transform duration-300 dark:border-white/[0.06] dark:bg-[#162032] lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {SidebarContent}
      </div>

      {/* Main content */}
      <div className={cn("flex min-w-0 flex-1 flex-col transition-all duration-300", sidebarOpen ? "lg:ml-56" : "lg:ml-[60px]")}>
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-white/[0.06] dark:bg-[#0F172A] lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/[0.06] dark:hover:text-zinc-200 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="truncate text-[15px] font-bold text-zinc-900 dark:text-white">{title}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/"
              target="_blank"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white sm:inline-flex"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Website
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          <ErrorBoundary name="admin-page" fallback={(reset) => <AdminErrorFallback reset={reset} />}>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}