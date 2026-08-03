import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { loadSEOSettings, saveSEOSettings, SEOSettings } from "@/data/settings";
import { Globe, CheckCircle2, AlertTriangle, TrendingUp, Search, Eye, Smartphone } from "lucide-react";
import CloudinaryUploader from "@/components/cloudinary/CloudinaryUploader";

const robotsOptions = [
  "index, follow",
  "noindex, follow",
  "index, nofollow",
  "noindex, nofollow",
];

export default function AdminSEO() {
  const [settings, setSettings] = useState<SEOSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(loadSEOSettings());
  }, []);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(t);
  }, [saved]);

  if (!settings) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    saveSEOSettings(settings);
    setSaving(false);
    setSaved(true);
  };

  const update = (partial: Partial<SEOSettings>) => {
    setSettings({ ...settings, ...partial });
  };

  const seoScore = (() => {
    let score = 0;
    if (settings.metaTitle.length >= 40 && settings.metaTitle.length <= 60) score += 25;
    else if (settings.metaTitle.length > 0) score += 10;
    if (settings.metaDescription.length >= 120 && settings.metaDescription.length <= 160) score += 25;
    else if (settings.metaDescription.length > 0) score += 10;
    if (settings.keywords.length > 0) score += 15;
    if (settings.ogImage.length > 0) score += 20;
    if (settings.robots === "index, follow") score += 15;
    return score;
  })();

  return (
    <AdminLayout title="SEO Settings">
      <div className="max-w-4xl">
        {/* SEO Score */}
        <div className="bg-white dark:bg-[#162032] rounded-2xl border border-zinc-200 dark:border-white/[0.06] p-5 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-lg ${
              seoScore >= 80 ? "bg-emerald-500" : seoScore >= 50 ? "bg-amber-500" : "bg-rose-500"
            }`}>
              {seoScore}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-zinc-900 dark:text-white">SEO Score</p>
              <div className="w-full h-2 bg-zinc-100 dark:bg-[#1E293B] rounded-full mt-2 overflow-hidden">
                <div className={`h-full rounded-full transition-all ${
                  seoScore >= 80 ? "bg-emerald-500" : seoScore >= 50 ? "bg-amber-500" : "bg-rose-500"
                }`} style={{ width: `${seoScore}%` }} />
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                {seoScore >= 80 ? "Great shape! Your SEO settings are well optimized." :
                 seoScore >= 50 ? "Good progress. Fill in the missing fields to improve." :
                 "Needs attention. Complete the fields below for better rankings."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left - Settings */}
          <div className="bg-white dark:bg-[#162032] rounded-2xl border border-zinc-200 dark:border-white/[0.06] p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <Globe className="w-5 h-5 text-violet-500" />
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Search Engine Optimisation</h2>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Focus Keyword</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                  <input
                    value={settings.keywords}
                    onChange={(e) => update({ keywords: e.target.value })}
                    placeholder="e.g. web design, development"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">
                  Meta Title <span className="text-zinc-400 font-normal">({settings.metaTitle.length}/60)</span>
                </label>
                <input
                  value={settings.metaTitle}
                  onChange={(e) => update({ metaTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">
                  Meta Description <span className="text-zinc-400 font-normal">({settings.metaDescription.length}/160)</span>
                </label>
                <textarea
                  value={settings.metaDescription}
                  onChange={(e) => update({ metaDescription: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">OG Image</label>
                <CloudinaryUploader value={settings.ogImage} onChange={(url) => update({ ogImage: url })} label="OG Image" />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Robots</label>
                <select
                  value={settings.robots}
                  onChange={(e) => update({ robots: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 appearance-none"
                >
                  {robotsOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Sitemap URL</label>
                <input
                  value={settings.sitemap}
                  onChange={(e) => update({ sitemap: e.target.value })}
                  placeholder="/sitemap.xml"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : <><CheckCircle2 className="w-4 h-4" /> Save Changes</>}
                </button>
                {saved && (
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">Saved!</span>
                )}
              </div>
            </form>
          </div>

          {/* Right - Previews */}
          <div className="space-y-6">
            {/* Google Preview */}
            <div className="bg-white dark:bg-[#162032] rounded-2xl border border-zinc-200 dark:border-white/[0.06] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-4 h-4 text-violet-500" />
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white">Google Preview</h3>
              </div>
              <div className="bg-white dark:bg-[#162032] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 max-w-sm">
                <p className="text-xs text-green-700 dark:text-green-400 truncate">https://alaminrafi.com</p>
                <p className="text-sm text-blue-800 dark:text-blue-300 font-medium leading-tight truncate hover:underline cursor-pointer">
                  {settings.metaTitle || "Alamin Rafi — Website & Digital Services"}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-0.5">
                  {settings.metaDescription || "Modern, affordable websites for businesses. Web design, development, WordPress, UI/UX — all in one place."}
                </p>
              </div>
            </div>

            {/* Social Preview */}
            <div className="bg-white dark:bg-[#162032] rounded-2xl border border-zinc-200 dark:border-white/[0.06] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Smartphone className="w-4 h-4 text-violet-500" />
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white">Social Share Preview</h3>
              </div>
              <div className="bg-white dark:bg-[#162032] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden max-w-sm">
                <div className="h-32 bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
                  {settings.ogImage ? (
                    <img src={settings.ogImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Globe className="w-8 h-8 text-white/60" />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">alaminrafi.com</p>
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-snug truncate">
                    {settings.metaTitle || "Alamin Rafi — Website & Digital Services"}
                  </p>
                  <p className="text-[10px] text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-0.5">
                    {settings.metaDescription || "Modern, affordable websites for businesses."}
                  </p>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-white dark:bg-[#162032] rounded-2xl border border-zinc-200 dark:border-white/[0.06] p-5">
              <h3 className="text-xs font-bold text-zinc-900 dark:text-white mb-3">Optimization Checklist</h3>
              <div className="space-y-2">
                {[
                  { label: "Meta title set", done: settings.metaTitle.length > 0 },
                  { label: "Meta title length (40-60 chars)", done: settings.metaTitle.length >= 40 && settings.metaTitle.length <= 60 },
                  { label: "Meta description set", done: settings.metaDescription.length > 0 },
                  { label: "Meta description length (120-160 chars)", done: settings.metaDescription.length >= 120 && settings.metaDescription.length <= 160 },
                  { label: "Keywords defined", done: settings.keywords.length > 0 },
                  { label: "OG image set", done: settings.ogImage.length > 0 },
                  { label: "Indexing enabled", done: settings.robots === "index, follow" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {item.done ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
                    <span className={`text-xs ${item.done ? "text-zinc-600 dark:text-zinc-400" : "text-zinc-900 dark:text-white font-medium"}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
