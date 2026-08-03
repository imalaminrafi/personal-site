import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldAlert, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const { admin, login, changePassword } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mustChange, setMustChange] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  if (admin && !mustChange) return <Navigate to="/admin/dashboard" replace />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) { setError(res.error || "Login failed."); return; }
    if (res.mustChange) { setMustChange(true); return; }
    navigate("/admin/dashboard", { replace: true });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPass !== confirmPass) { setError("Passwords do not match."); return; }
    if (newPass.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const res = await changePassword(password, newPass);
    setLoading(false);
    if (!res.ok) { setError(res.error || "Failed to change password."); return; }
    navigate("/admin/dashboard", { replace: true });
  };

  if (mustChange) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#0A1628] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-[#0F2040] rounded-3xl border border-zinc-200 dark:border-white/[0.08] shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-7 h-7 text-amber-600 dark:text-amber-400" />
              </div>
              <h1 className="text-xl font-black text-zinc-900 dark:text-white">Change Your Password</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                For security reasons, you must change your password before continuing.
              </p>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input type={showPass ? "text" : "password"} value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                    placeholder="Enter new password" required minLength={6} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input type="password" value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                    placeholder="Confirm new password" required />
                </div>
              </div>
              {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ArrowRight className="w-4 h-4" /> Update Password</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0A1628] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-brand-gradient h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-black text-lg">AR</span>
          </div>
          <h1 className="text-xl font-black text-zinc-900 dark:text-white">Admin Login</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Sign in to manage your website</p>
        </div>
        <div className="bg-white dark:bg-[#0F2040] rounded-3xl border border-zinc-200 dark:border-white/[0.08] shadow-sm p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  placeholder="admin@alaminrafi.com" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input type={showPass ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  placeholder="Enter your password" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                <input type="checkbox" className="rounded border-zinc-300 dark:border-zinc-600" /> Remember me
              </label>
              <button type="button" className="text-violet-600 dark:text-violet-400 font-bold hover:underline">
                Forgot password?
              </button>
            </div>
            {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
