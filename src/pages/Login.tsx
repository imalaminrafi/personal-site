import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) { setError("Please fill in all fields."); return; }
        setLoading(true);
        setError("");
        const result = login(email, password);
        setLoading(false);
        if (result.ok) navigate("/dashboard");
        else setError(result.error!);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#0F172A] px-4 py-16">
            {/* Background glow */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden hidden dark:block">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-violet-700/15 to-transparent blur-[100px]" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo / back link */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 text-sm font-medium transition-colors mb-6">
                        ← Back to portfolio
                    </Link>
                    <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 items-center justify-center text-white font-black text-lg shadow-lg mb-4">
                        AR
                    </div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Welcome back</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1.5 text-sm">Sign in to your client account</p>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-[#162032]/80 backdrop-blur-sm border border-zinc-200 dark:border-[#1E3A5F] rounded-3xl p-8 shadow-xl shadow-black/5 dark:shadow-black/40">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-zinc-50 dark:bg-[#1E293B]/50 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 dark:focus:border-violet-400 transition-all text-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-zinc-50 dark:bg-[#1E293B]/50 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 dark:focus:border-violet-400 transition-all text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                                >
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="relative w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-[15px] text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-500" />
                            {loading
                                ? <><Loader2 className="relative w-4 h-4 animate-spin" /> Signing in…</>
                                : <><span className="relative">Sign In</span><ArrowRight className="relative w-4 h-4" /></>
                            }
                        </button>
                    </form>

                    <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-6">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-violet-600 dark:text-violet-400 font-semibold hover:underline">
                            Sign up free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
