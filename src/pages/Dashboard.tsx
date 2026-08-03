import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, type Order } from "@/context/AuthContext";
import { LogOut, Package, Clock, CheckCircle2, XCircle, Loader2, User, LayoutDashboard } from "lucide-react";

/* ─── Status badge ───────────────────────────────────────────────── */
const statusConfig: Record<Order["status"], { label: string; icon: React.ReactNode; bg: string; text: string }> = {
    Pending: {
        label: "Pending",
        icon: <Clock className="w-3.5 h-3.5" />,
        bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20",
        text: "text-amber-600 dark:text-amber-400",
    },
    "In Progress": {
        label: "In Progress",
        icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
        bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20",
        text: "text-blue-600 dark:text-blue-400",
    },
    Completed: {
        label: "Completed",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
        text: "text-emerald-600 dark:text-emerald-400",
    },
    Cancelled: {
        label: "Cancelled",
        icon: <XCircle className="w-3.5 h-3.5" />,
        bg: "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20",
        text: "text-red-600 dark:text-red-400",
    },
};

function StatusBadge({ status }: { status: Order["status"] }) {
    const cfg = statusConfig[status];
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
            {cfg.icon}
            {cfg.label}
        </span>
    );
}

/* ─── Order Card ─────────────────────────────────────────────────── */
function OrderCard({ order }: { order: Order }) {
    const date = new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
    });

    return (
        <div className="bg-white dark:bg-[#162032]/80 border border-zinc-200 dark:border-[#1E3A5F] rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-violet-500" />
                        <span className="font-bold text-zinc-900 dark:text-white text-[15px]">{order.packageName} Package</span>
                    </div>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">{order.id}</p>
                </div>
                <StatusBadge status={order.status} />
            </div>

            {order.note && (
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4 italic">
                    "{order.note}"
                </p>
            )}

            {order.addons.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {order.addons.map((a, i) => (
                        <span key={i} className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-zinc-100 dark:bg-[#1E293B] text-zinc-600 dark:text-zinc-400">
                            + {a}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-[#1E3A5F]">
                <span className="text-xs text-zinc-400 dark:text-zinc-500">Ordered {date}</span>
                <span className="font-black text-lg bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
                    ${order.total}+
                </span>
            </div>
        </div>
    );
}

/* ─── Dashboard Page ─────────────────────────────────────────────── */
export default function DashboardPage() {
    const { user, logout, getOrders } = useAuth();
    const navigate = useNavigate();
    const orders = getOrders();

    useEffect(() => {
        if (!user) navigate("/login");
    }, [user, navigate]);

    if (!user) return null;

    const completed = orders.filter((o) => o.status === "Completed").length;
    const inProgress = orders.filter((o) => o.status === "In Progress").length;
    const pending = orders.filter((o) => o.status === "Pending").length;

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#0F172A]">
            {/* Background glow */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden hidden dark:block">
                <div className="absolute -top-32 left-1/3 w-[500px] h-[500px] rounded-full bg-gradient-radial from-violet-700/10 to-transparent blur-[100px]" />
            </div>

            {/* Top Nav */}
            <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-xl border-b border-zinc-200 dark:border-[#1E3A5F] shadow-sm dark:shadow-none">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-md">
                            AR
                        </div>
                        <div className="flex items-center gap-1.5">
                            <LayoutDashboard className="w-4 h-4 text-violet-500" />
                            <span className="font-semibold text-zinc-900 dark:text-white text-sm">Client Dashboard</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition-colors hidden sm:block">
                            ← Portfolio
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors group"
                        >
                            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="hidden sm:block">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-10">
                {/* Welcome */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <div>
                        <p className="text-sm text-violet-600 dark:text-violet-400 font-semibold mb-1">Welcome back 👋</p>
                        <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{user.name}</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">{user.email}</p>
                    </div>
                    <Link
                        to="/#pricing"
                        onClick={() => setTimeout(() => document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" }), 100)}
                        className="relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] shrink-0"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-500" />
                        <span className="relative">+ New Order</span>
                    </Link>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: "Total Orders", value: orders.length, color: "text-zinc-900 dark:text-white" },
                        { label: "Completed", value: completed, color: "text-emerald-600 dark:text-emerald-400" },
                        { label: "In Progress", value: inProgress, color: "text-blue-600 dark:text-blue-400" },
                        { label: "Pending", value: pending, color: "text-amber-600 dark:text-amber-400" },
                    ].map((s) => (
                        <div key={s.label} className="bg-white dark:bg-[#162032]/80 border border-zinc-200 dark:border-[#1E3A5F] rounded-2xl p-5 text-center shadow-sm">
                            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Profile card */}
                <div className="bg-white dark:bg-[#162032]/80 border border-zinc-200 dark:border-[#1E3A5F] rounded-2xl p-5 sm:p-6 mb-8 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-black text-xl shrink-0 shadow-lg">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-zinc-900 dark:text-white">{user.name}</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                            <User className="w-3 h-3 text-violet-500" />
                            <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">Client Account</span>
                        </div>
                    </div>
                </div>

                {/* Orders */}
                <div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-5">My Orders</h2>
                    {orders.length === 0 ? (
                        <div className="bg-white dark:bg-[#162032]/80 border border-zinc-200 dark:border-[#1E3A5F] rounded-2xl p-12 text-center">
                            <Package className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-2">No orders yet</p>
                            <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-6">Start a project and your orders will appear here.</p>
                            <Link
                                to="/#pricing"
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-violet-600 dark:text-violet-400 border border-violet-500/30 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors"
                            >
                                View Pricing
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => <OrderCard key={order.id} order={order} />)}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
