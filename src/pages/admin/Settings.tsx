import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Save, Palette, Bell, Shield, Eye, EyeOff, RefreshCw, RotateCcw } from "lucide-react";

interface AppSettings {
  theme: "light" | "dark" | "system";
  accentColor: string;
  siteName: string;
  email: string;
  enableBlog: boolean;
  enableGallery: boolean;
  enableTestimonials: boolean;
  enablePricing: boolean;
}

const STORAGE_KEY = "ar_settings";

const defaults: AppSettings = {
  theme: "system",
  accentColor: "violet",
  siteName: "Alamin Rafi",
  email: "hello@alaminrafi.com",
  enableBlog: true,
  enableGallery: true,
  enableTestimonials: true,
  enablePricing: true,
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
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

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
  };

  const handleReset = () => {
    setSettings(defaults);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  };

  return (
    <AdminLayout title="Settings">
      <div className="max-w-3xl space-y-6">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-5">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-violet-500" /> Appearance
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-1.5">Theme</label>
              <select
                value={settings.theme}
                onChange={e => update("theme", e.target.value as AppSettings["theme"])}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-1.5">Accent Color</label>
              <div className="flex gap-2">
                {["violet", "blue", "emerald", "rose", "amber"].map((color) => (
                  <button
                    key={color}
                    onClick={() => update("accentColor", color as AppSettings["accentColor"])}
                    className={`w-9 h-9 rounded-xl border-2 transition-all ${
                      settings.accentColor === color
                        ? "border-white dark:border-zinc-900 ring-2 ring-offset-2 ring-violet-500 dark:ring-offset-zinc-900"
                        : "border-transparent"
                    }`}
                    style={{
                      backgroundColor:
                        color === "violet" ? "#8b5cf6" :
                        color === "blue" ? "#3b82f6" :
                        color === "emerald" ? "#10b981" :
                        color === "rose" ? "#f43f5e" : "#f59e0b",
                    }}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-5">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-violet-500" /> Site Info
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-1.5">Site Name</label>
              <input value={settings.siteName} onChange={e => update("siteName", e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-1.5">Contact Email</label>
              <input value={settings.email} onChange={e => update("email", e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-5">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-violet-500" /> Features
          </h2>

          <div className="space-y-3">
            {([
              ["enableBlog", "Blog"],
              ["enableGallery", "Gallery"],
              ["enableTestimonials", "Testimonials"],
              ["enablePricing", "Pricing"],
            ] as const).map(([key, label]) => (
              <label key={key} className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
                <button
                  onClick={() => update(key, !settings[key])}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    settings[key] ? "bg-violet-500" : "bg-zinc-200 dark:bg-zinc-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      settings[key] ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-gradient text-white text-sm font-bold shadow-lg shadow-violet-500/20 hover:opacity-90 transition-all">
            {saved ? <><RefreshCw className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
          <button onClick={handleReset} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all">
            <RotateCcw className="w-4 h-4" /> Reset to Defaults
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
