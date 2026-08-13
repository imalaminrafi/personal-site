import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { loadSEOSettings, saveSEOSettings, SEOSettings } from "@/data/settings";
import { Globe, CheckCircle2, AlertTriangle, Eye, Smartphone, Search } from "lucide-react";
import CloudinaryUploader from "@/components/cloudinary/CloudinaryUploader";
import { Btn, Card, CardHeader, Field, Input, Textarea, Select, Badge, PageHeader } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

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

  const scoreTone = seoScore >= 80 ? "emerald" : seoScore >= 50 ? "amber" : "red";
  const scoreBar = seoScore >= 80 ? "bg-emerald-500" : seoScore >= 50 ? "bg-amber-500" : "bg-rose-500";

  const checks = [
    { label: "Meta title set", done: settings.metaTitle.length > 0 },
    { label: "Meta title length (40-60 chars)", done: settings.metaTitle.length >= 40 && settings.metaTitle.length <= 60 },
    { label: "Meta description set", done: settings.metaDescription.length > 0 },
    { label: "Meta description length (120-160 chars)", done: settings.metaDescription.length >= 120 && settings.metaDescription.length <= 160 },
    { label: "Keywords defined", done: settings.keywords.length > 0 },
    { label: "OG image set", done: settings.ogImage.length > 0 },
    { label: "Indexing enabled", done: settings.robots === "index, follow" },
  ];

  return (
    <AdminLayout title="SEO Settings">
      <PageHeader
        title="Search Engine Optimisation"
        description="Control how your website appears in Google and social share previews."
      />

      <div className="max-w-5xl space-y-6">
        {/* SEO Score */}
        <Card className="p-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className={cn(
              "flex h-16 w-16 items-center justify-center rounded-xl text-lg font-black text-white",
              seoScore >= 80 ? "bg-emerald-500" : seoScore >= 50 ? "bg-amber-500" : "bg-rose-500"
            )}>
              {seoScore}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-zinc-900 dark:text-white">SEO Score</p>
                <Badge tone={scoreTone}>{seoScore >= 80 ? "Excellent" : seoScore >= 50 ? "Good" : "Needs work"}</Badge>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-white/[0.06]">
                <div className={cn("h-full rounded-full transition-all", scoreBar)} style={{ width: `${seoScore}%` }} />
              </div>
              <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                {seoScore >= 80 ? "Great shape! Your SEO settings are well optimized." :
                 seoScore >= 50 ? "Good progress. Fill in the missing fields to improve." :
                 "Needs attention. Complete the fields below for better rankings."}
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Settings */}
          <Card>
            <CardHeader icon={Globe} title="Search Engine Optimisation" description="Metadata used by Google and social platforms." />
            <form onSubmit={handleSave} className="space-y-4 p-5">
              <Field label="Focus Keyword">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                  <Input
                    value={settings.keywords}
                    onChange={(e) => update({ keywords: e.target.value })}
                    placeholder="e.g. web design, development"
                    className="pl-9"
                  />
                </div>
              </Field>
              <Field label={`Meta Title (${settings.metaTitle.length}/60)`}>
                <Input value={settings.metaTitle} onChange={(e) => update({ metaTitle: e.target.value })} />
              </Field>
              <Field label={`Meta Description (${settings.metaDescription.length}/160)`}>
                <Textarea rows={3} value={settings.metaDescription} onChange={(e) => update({ metaDescription: e.target.value })} />
              </Field>
              <Field label="OG Image">
                <CloudinaryUploader value={settings.ogImage} onChange={(url) => update({ ogImage: url })} label="OG Image" />
              </Field>
              <Field label="Robots">
                <Select value={settings.robots} onChange={(e) => update({ robots: e.target.value })}>
                  {robotsOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Sitemap URL">
                <Input value={settings.sitemap} onChange={(e) => update({ sitemap: e.target.value })} placeholder="/sitemap.xml" />
              </Field>
              <div className="flex items-center gap-3 pt-1">
                <Btn type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Btn>
                {saved && <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="h-3.5 w-3.5" /> Saved!</span>}
              </div>
            </form>
          </Card>

          {/* Previews */}
          <div className="space-y-6">
            <Card>
              <CardHeader icon={Eye} title="Google Preview" description="How this page appears in search results." />
              <div className="p-5">
                <div className="max-w-sm rounded-xl border border-zinc-200 p-4 dark:border-white/[0.08]">
                  <p className="truncate text-xs text-emerald-700 dark:text-emerald-400">https://alaminrafi.com</p>
                  <p className="mt-0.5 truncate text-sm font-medium leading-tight text-blue-800 dark:text-blue-300">
                    {settings.metaTitle || "Alamin Rafi — Website & Digital Services"}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400">
                    {settings.metaDescription || "Modern, affordable websites for businesses. Web design, development, WordPress, UI/UX — all in one place."}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader icon={Smartphone} title="Social Share Preview" description="Shown when your site is shared on social media." />
              <div className="p-5">
                <div className="max-w-sm overflow-hidden rounded-xl border border-zinc-200 dark:border-white/[0.08]">
                  <div className="flex h-32 items-center justify-center bg-gradient-to-br from-violet-600 to-cyan-500">
                    {settings.ogImage ? (
                      <img src={settings.ogImage} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Globe className="h-8 w-8 text-white/60" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">alaminrafi.com</p>
                    <p className="mt-0.5 truncate text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      {settings.metaTitle || "Alamin Rafi — Website & Digital Services"}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[10px] text-zinc-600 dark:text-zinc-400">
                      {settings.metaDescription || "Modern, affordable websites for businesses."}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader icon={CheckCircle2} title="Optimization Checklist" />
              <div className="space-y-2 p-5">
                {checks.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    {item.done ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                    )}
                    <span className={cn("text-xs", item.done ? "text-zinc-600 dark:text-zinc-400" : "font-medium text-zinc-900 dark:text-white")}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}