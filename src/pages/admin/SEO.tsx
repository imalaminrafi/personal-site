import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Save, Search, Globe, FileText, RefreshCw } from "lucide-react";

interface SEOSettings {
  siteTitle: string;
  tagline: string;
  description: string;
  keywords: string;
  ogImage: string;
  googleAnalyticsId: string;
  robotsTxt: string;
  canonicalUrl: string;
}

const STORAGE_KEY = "ar_seo";

const defaults: SEOSettings = {
  siteTitle: "Alamin Rafi — Digital Creator",
  tagline: "Full-Stack Developer & Designer",
  description: "Portfolio of Alamin Rafi — a full-stack developer and digital creator specializing in React, TypeScript, and modern web experiences.",
  keywords: "full-stack developer, react, typescript, portfolio, web development, alamin rafi",
  ogImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200",
  googleAnalyticsId: "",
  robotsTxt: "User-agent: *\nAllow: /\n\nSitemap: https://alaminrafi.com/sitemap.xml",
  canonicalUrl: "https://alaminrafi.com",
};

export default function AdminSEO() {
  const [settings, setSettings] = useState<SEOSettings>(() => {
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
    } catch {
      return defaults;
    }
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(t);
    }
  }, [saved]);

  const update = (key: keyof SEOSettings, value: string) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
  };

  return (
    <AdminLayout title="SEO & Meta">
      <div className="max-w-3xl space-y-6">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-5">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-violet-500" /> General
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-1.5">Site Title</label>
              <input value={settings.siteTitle} onChange={e => update("siteTitle", e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-1.5">Tagline</label>
              <input value={settings.tagline} onChange={e => update("tagline", e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-1.5">Meta Description</label>
            <textarea value={settings.description} onChange={e => update("description", e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-1.5">Keywords (comma-separated)</label>
            <input value={settings.keywords} onChange={e => update("keywords", e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-5">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-violet-500" /> Social & Analytics
          </h2>

          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-1.5">OG Image URL</label>
            <input value={settings.ogImage} onChange={e => update("ogImage", e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-1.5">Google Analytics ID</label>
            <input value={settings.googleAnalyticsId} onChange={e => update("googleAnalyticsId", e.target.value)} placeholder="G-XXXXXXXXXX" className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-5">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-violet-500" /> Advanced
          </h2>

          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-1.5">Canonical URL</label>
            <input value={settings.canonicalUrl} onChange={e => update("canonicalUrl", e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-1.5">robots.txt</label>
            <textarea value={settings.robotsTxt} onChange={e => update("robotsTxt", e.target.value)} rows={5} className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-gradient text-white text-sm font-bold shadow-lg shadow-violet-500/20 hover:opacity-90 transition-all">
            {saved ? <><RefreshCw className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
