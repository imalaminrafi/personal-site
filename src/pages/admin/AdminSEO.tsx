import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { loadSEOSettings, saveSEOSettings, SEOSettings } from "@/data/settings";
import { Globe, CheckCircle2 } from "lucide-react";

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

  return (
    <AdminLayout title="SEO Settings">
      <div className="max-w-2xl">
        <div className="bg-white dark:bg-[#0d0b1f] rounded-2xl border border-zinc-200 dark:border-white/[0.08] p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-violet-500" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Search Engine Optimisation</h2>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Meta Title</label>
              <input
                value={settings.metaTitle}
                onChange={(e) => update({ metaTitle: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Meta Description</label>
              <textarea
                value={settings.metaDescription}
                onChange={(e) => update({ metaDescription: e.target.value })}
                rows={3}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">OG Image URL</label>
              <input
                value={settings.ogImage}
                onChange={(e) => update({ ogImage: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
              {settings.ogImage && (
                <div className="mt-2 rounded-xl overflow-hidden border border-zinc-200 dark:border-white/[0.08] w-40">
                  <img src={settings.ogImage} alt="OG preview" className="w-full h-24 object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Keywords</label>
              <input
                value={settings.keywords}
                onChange={(e) => update({ keywords: e.target.value })}
                placeholder="web design, development, SEO"
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
              <p className="text-[11px] text-zinc-400 mt-1">Comma-separated list of keywords</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Robots</label>
              <select
                value={settings.robots}
                onChange={(e) => update({ robots: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 appearance-none"
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
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : <><CheckCircle2 className="w-4 h-4" /> Save SEO Settings</>}
              </button>
              {saved && (
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">Settings saved!</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
