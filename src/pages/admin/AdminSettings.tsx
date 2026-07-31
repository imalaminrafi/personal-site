import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Link } from "react-router-dom";
import { loadSettings, saveSettings, SiteSettings } from "@/data/settings";
import { Settings, Plus, Trash2, CheckCircle2, BarChart3 } from "lucide-react";
import CloudinaryUploadButton from "@/components/cloudinary/CloudinaryUploadButton";

export default function AdminSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(t);
  }, [saved]);

  if (!settings) return null;

  const update = (partial: Partial<SiteSettings>) => {
    setSettings({ ...settings, ...partial });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    saveSettings(settings);
    setSaving(false);
    setSaved(true);
  };

  const addSocial = () => {
    update({
      socialLinks: [...settings.socialLinks, { platform: "", url: "" }],
    });
  };

  const updateSocial = (idx: number, field: "platform" | "url", value: string) => {
    const links = [...settings.socialLinks];
    links[idx] = { ...links[idx], [field]: value };
    update({ socialLinks: links });
  };

  const removeSocial = (idx: number) => {
    update({ socialLinks: settings.socialLinks.filter((_, i) => i !== idx) });
  };

  return (
    <AdminLayout title="Site Settings">
      <div className="max-w-2xl">
        <div className="bg-white dark:bg-[#0d0b1f] rounded-2xl border border-zinc-200 dark:border-white/[0.08] p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-5 h-5 text-violet-500" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">General Settings</h2>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Logo</label>
                <CloudinaryUploadButton value={settings.logo} onChange={(url) => update({ logo: url })} label="Logo" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Favicon</label>
                <CloudinaryUploadButton value={settings.favicon} onChange={(url) => update({ favicon: url })} label="Favicon" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Website Name</label>
              <input
                value={settings.siteName}
                onChange={(e) => update({ siteName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Email</label>
                <input
                  value={settings.email}
                  onChange={(e) => update({ email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Phone</label>
                <input
                  value={settings.phone}
                  onChange={(e) => update({ phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">WhatsApp</label>
                <input
                  value={settings.whatsapp}
                  onChange={(e) => update({ whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>
            </div>

            {/* Social Links */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Social Links</label>
                <button
                  type="button"
                  onClick={addSocial}
                  className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {settings.socialLinks.map((link, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      value={link.platform}
                      onChange={(e) => updateSocial(idx, "platform", e.target.value)}
                      placeholder="Platform"
                      className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                    />
                    <input
                      value={link.url}
                      onChange={(e) => updateSocial(idx, "url", e.target.value)}
                      placeholder="URL"
                      className="flex-[2] px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                    />
                    <button
                      type="button"
                      onClick={() => removeSocial(idx)}
                      className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Footer Text</label>
              <textarea
                value={settings.footer}
                onChange={(e) => update({ footer: e.target.value })}
                rows={3}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-2">
                Analytics
              </label>
              <Link
                to="/admin/analytics"
                className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-white/[0.03] p-4 transition-colors hover:border-violet-300 dark:hover:border-violet-700"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">
                    Google Analytics {settings.analyticsMeasurementId ? `· ${settings.analyticsMeasurementId}` : "· Not configured"}
                  </p>
                  <p className="text-xs text-zinc-400">Manage measurement ID, status & live events →</p>
                </div>
                <span className="text-zinc-300 dark:text-zinc-600">›</span>
              </Link>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : <><CheckCircle2 className="w-4 h-4" /> Save Settings</>}
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
