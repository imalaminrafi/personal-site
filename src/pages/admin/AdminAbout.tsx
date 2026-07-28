import { useState, useEffect, useMemo } from "react";
import AdminLayout from "./AdminLayout";
import { loadAboutData, saveAboutData, AboutData, AboutTimelineItem, AboutEducationItem, AboutCertificationItem, AboutSkillCategory, AboutValueItem, AboutToolItem } from "@/data/aboutData";
import { CheckCircle2, Plus, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";

type SectionKey = keyof AboutData["visibility"];

export default function AdminAbout() {
  const [data, setData] = useState<AboutData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<SectionKey>("hero");

  useEffect(() => {
    setData(loadAboutData());
  }, []);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(t);
  }, [saved]);

  const update = (partial: Partial<AboutData>) => {
    if (!data) return;
    setData({ ...data, ...partial });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    saveAboutData(data);
    setSaving(false);
    setSaved(true);
  };

  const toggleVisibility = (key: SectionKey) => {
    if (!data) return;
    setData({ ...data, visibility: { ...data.visibility, [key]: !data.visibility[key] } });
  };

  if (!data) return null;

  const tabs: { key: SectionKey; label: string }[] = [
    { key: "hero", label: "Hero" },
    { key: "summary", label: "Summary" },
    { key: "focus", label: "Focus" },
    { key: "experience", label: "Experience" },
    { key: "skills", label: "Skills" },
    { key: "education", label: "Education" },
    { key: "certifications", label: "Certifications" },
    { key: "tools", label: "Tools" },
    { key: "values", label: "Values" },
    { key: "cta", label: "CTA" },
  ];

  return (
    <AdminLayout title="About Page Editor">
      <form onSubmit={handleSave}>
        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === t.key
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "bg-white dark:bg-[#0d0b1f] border border-zinc-200 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-400 hover:border-violet-200 dark:hover:border-violet-800/40"
              }`}
            >
              {data.visibility[t.key] ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {/* === HERO === */}
          {activeTab === "hero" && (
            <SectionCard title="Hero Introduction" visible={data.visibility.hero} onToggle={() => toggleVisibility("hero")}>
              <Field label="Name">
                <input value={data.hero.name} onChange={(e) => update({ hero: { ...data.hero, name: e.target.value } })} className="input" />
              </Field>
              <Field label="Title">
                <input value={data.hero.title} onChange={(e) => update({ hero: { ...data.hero, title: e.target.value } })} className="input" />
              </Field>
              <Field label="Profile Photo URL">
                <input value={data.hero.image} onChange={(e) => update({ hero: { ...data.hero, image: e.target.value } })} className="input" />
                {data.hero.image && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-zinc-200 dark:border-white/[0.08] w-20 h-20 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                    <img src={data.hero.image} alt="Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
              </Field>
              <Field label="Introduction Paragraphs">
                {data.hero.paragraphs.map((p, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <textarea
                      value={p}
                      onChange={(e) => {
                        const ps = [...data.hero.paragraphs];
                        ps[i] = e.target.value;
                        update({ hero: { ...data.hero, paragraphs: ps } });
                      }}
                      rows={3}
                      className="input flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const ps = data.hero.paragraphs.filter((_, j) => j !== i);
                        update({ hero: { ...data.hero, paragraphs: ps } });
                      }}
                      className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => update({ hero: { ...data.hero, paragraphs: [...data.hero.paragraphs, ""] } })}
                  className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Paragraph
                </button>
              </Field>
              <Field label="Social Links">
                {data.hero.socialLinks.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <input
                      value={s.platform}
                      onChange={(e) => {
                        const links = [...data.hero.socialLinks];
                        links[i] = { ...links[i], platform: e.target.value };
                        update({ hero: { ...data.hero, socialLinks: links } });
                      }}
                      placeholder="Platform"
                      className="input flex-1"
                    />
                    <input
                      value={s.url}
                      onChange={(e) => {
                        const links = [...data.hero.socialLinks];
                        links[i] = { ...links[i], url: e.target.value };
                        update({ hero: { ...data.hero, socialLinks: links } });
                      }}
                      placeholder="URL"
                      className="input flex-[2]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const links = data.hero.socialLinks.filter((_, j) => j !== i);
                        update({ hero: { ...data.hero, socialLinks: links } });
                      }}
                      className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => update({ hero: { ...data.hero, socialLinks: [...data.hero.socialLinks, { platform: "", url: "" }] } })}
                  className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Link
                </button>
              </Field>
            </SectionCard>
          )}

          {/* === SUMMARY === */}
          {activeTab === "summary" && (
            <SectionCard title="Professional Summary" visible={data.visibility.summary} onToggle={() => toggleVisibility("summary")}>
              <Field label="Heading">
                <input value={data.summary.heading} onChange={(e) => update({ summary: { ...data.summary, heading: e.target.value } })} className="input" />
              </Field>
              <Field label="Paragraphs">
                {data.summary.paragraphs.map((p, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <textarea value={p} onChange={(e) => { const ps = [...data.summary.paragraphs]; ps[i] = e.target.value; update({ summary: { ...data.summary, paragraphs: ps } }); }} rows={4} className="input flex-1" />
                    <button type="button" onClick={() => { const ps = data.summary.paragraphs.filter((_, j) => j !== i); update({ summary: { ...data.summary, paragraphs: ps } }); }} className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button type="button" onClick={() => update({ summary: { ...data.summary, paragraphs: [...data.summary.paragraphs, ""] } })} className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400"><Plus className="w-3.5 h-3.5" /> Add Paragraph</button>
              </Field>
            </SectionCard>
          )}

          {/* === FOCUS === */}
          {activeTab === "focus" && (
            <SectionCard title="Current Focus" visible={data.visibility.focus} onToggle={() => toggleVisibility("focus")}>
              <Field label="Heading">
                <input value={data.focus.heading} onChange={(e) => update({ focus: { ...data.focus, heading: e.target.value } })} className="input" />
              </Field>
              <Field label="Subheading">
                <textarea value={data.focus.subheading} onChange={(e) => update({ focus: { ...data.focus, subheading: e.target.value } })} rows={2} className="input" />
              </Field>
              <Field label="Focus Items">
                {data.focus.items.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/40 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-zinc-500">Item {i + 1}</span>
                      <button type="button" onClick={() => update({ focus: { ...data.focus, items: data.focus.items.filter((_, j) => j !== i) } })} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="space-y-2">
                      <input value={item.title} onChange={(e) => { const items = [...data.focus.items]; items[i] = { ...items[i], title: e.target.value }; update({ focus: { ...data.focus, items } }); }} placeholder="Title" className="input" />
                      <textarea value={item.description} onChange={(e) => { const items = [...data.focus.items]; items[i] = { ...items[i], description: e.target.value }; update({ focus: { ...data.focus, items } }); }} placeholder="Description" rows={2} className="input" />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => update({ focus: { ...data.focus, items: [...data.focus.items, { title: "", description: "" }] } })} className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400"><Plus className="w-3.5 h-3.5" /> Add Item</button>
              </Field>
            </SectionCard>
          )}

          {/* === EXPERIENCE === */}
          {activeTab === "experience" && (
            <SectionCard title="Professional Experience" visible={data.visibility.experience} onToggle={() => toggleVisibility("experience")}>
              <Field label="Heading">
                <input value={data.experience.heading} onChange={(e) => update({ experience: { ...data.experience, heading: e.target.value } })} className="input" />
              </Field>
              <Field label="Timeline Items">
                {data.experience.items.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/40 mb-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-zinc-500">Position {i + 1}</span>
                      <button type="button" onClick={() => update({ experience: { ...data.experience, items: data.experience.items.filter((_, j) => j !== i) } })} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input value={item.title} onChange={(e) => { const items = [...data.experience.items]; items[i] = { ...items[i], title: e.target.value }; update({ experience: { ...data.experience, items } }); }} placeholder="Job Title" className="input" />
                      <input value={item.company} onChange={(e) => { const items = [...data.experience.items]; items[i] = { ...items[i], company: e.target.value }; update({ experience: { ...data.experience, items } }); }} placeholder="Company" className="input" />
                    </div>
                    <div className="mb-2">
                      <input value={item.period} onChange={(e) => { const items = [...data.experience.items]; items[i] = { ...items[i], period: e.target.value }; update({ experience: { ...data.experience, items } }); }} placeholder="Period (e.g. Jan 2023 – Dec 2023)" className="input" />
                    </div>
                    <textarea value={item.description} onChange={(e) => { const items = [...data.experience.items]; items[i] = { ...items[i], description: e.target.value }; update({ experience: { ...data.experience, items } }); }} placeholder="Description of responsibilities and achievements" rows={3} className="input" />
                  </div>
                ))}
                <button type="button" onClick={() => update({ experience: { ...data.experience, items: [...data.experience.items, { title: "", company: "", period: "", description: "" }] } })} className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400"><Plus className="w-3.5 h-3.5" /> Add Position</button>
              </Field>
            </SectionCard>
          )}

          {/* === SKILLS === */}
          {activeTab === "skills" && (
            <SectionCard title="Skills & Expertise" visible={data.visibility.skills} onToggle={() => toggleVisibility("skills")}>
              <Field label="Heading">
                <input value={data.skills.heading} onChange={(e) => update({ skills: { ...data.skills, heading: e.target.value } })} className="input" />
              </Field>
              <Field label="Skill Categories">
                {data.skills.categories.map((cat, i) => (
                  <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/40 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-zinc-500">Category {i + 1}</span>
                      <button type="button" onClick={() => update({ skills: { ...data.skills, categories: data.skills.categories.filter((_, j) => j !== i) } })} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="mb-2">
                      <input value={cat.category} onChange={(e) => { const cats = [...data.skills.categories]; cats[i] = { ...cats[i], category: e.target.value }; update({ skills: { ...data.skills, categories: cats } }); }} placeholder="Category name" className="input" />
                    </div>
                    <div>
                      {cat.items.map((item, j) => (
                        <div key={j} className="flex items-center gap-2 mb-1.5">
                          <input value={item} onChange={(e) => { const cats = [...data.skills.categories]; cats[i] = { ...cats[i], items: [...cats[i].items] }; cats[i].items[j] = e.target.value; update({ skills: { ...data.skills, categories: cats } }); }} placeholder="Skill" className="input flex-1 text-sm" />
                          <button type="button" onClick={() => { const cats = [...data.skills.categories]; cats[i] = { ...cats[i], items: cats[i].items.filter((_, k) => k !== j) }; update({ skills: { ...data.skills, categories: cats } }); }} className="p-1 rounded text-zinc-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => { const cats = [...data.skills.categories]; cats[i] = { ...cats[i], items: [...cats[i].items, ""] }; update({ skills: { ...data.skills, categories: cats } }); }} className="text-xs text-violet-600 dark:text-violet-400 font-bold mt-1"><Plus className="w-3 h-3 inline mr-0.5" /> Add Skill</button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => update({ skills: { ...data.skills, categories: [...data.skills.categories, { category: "", items: [""] }] } })} className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400"><Plus className="w-3.5 h-3.5" /> Add Category</button>
              </Field>
            </SectionCard>
          )}

          {/* === EDUCATION === */}
          {activeTab === "education" && (
            <SectionCard title="Education" visible={data.visibility.education} onToggle={() => toggleVisibility("education")}>
              <Field label="Heading">
                <input value={data.education.heading} onChange={(e) => update({ education: { ...data.education, heading: e.target.value } })} className="input" />
              </Field>
              <Field label="Education Items">
                {data.education.items.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/40 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-zinc-500">Item {i + 1}</span>
                      <button type="button" onClick={() => update({ education: { ...data.education, items: data.education.items.filter((_, j) => j !== i) } })} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input value={item.degree} onChange={(e) => { const items = [...data.education.items]; items[i] = { ...items[i], degree: e.target.value }; update({ education: { ...data.education, items } }); }} placeholder="Degree" className="input" />
                      <input value={item.institution} onChange={(e) => { const items = [...data.education.items]; items[i] = { ...items[i], institution: e.target.value }; update({ education: { ...data.education, items } }); }} placeholder="Institution" className="input" />
                    </div>
                    <input value={item.period} onChange={(e) => { const items = [...data.education.items]; items[i] = { ...items[i], period: e.target.value }; update({ education: { ...data.education, items } }); }} placeholder="Period" className="input" />
                  </div>
                ))}
                <button type="button" onClick={() => update({ education: { ...data.education, items: [...data.education.items, { degree: "", institution: "", period: "" }] } })} className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400"><Plus className="w-3.5 h-3.5" /> Add Education</button>
              </Field>
            </SectionCard>
          )}

          {/* === CERTIFICATIONS === */}
          {activeTab === "certifications" && (
            <SectionCard title="Training & Certifications" visible={data.visibility.certifications} onToggle={() => toggleVisibility("certifications")}>
              <Field label="Heading">
                <input value={data.certifications.heading} onChange={(e) => update({ certifications: { ...data.certifications, heading: e.target.value } })} className="input" />
              </Field>
              <Field label="Certifications">
                {data.certifications.items.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/40 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-zinc-500">Cert {i + 1}</span>
                      <button type="button" onClick={() => update({ certifications: { ...data.certifications, items: data.certifications.items.filter((_, j) => j !== i) } })} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input value={item.name} onChange={(e) => { const items = [...data.certifications.items]; items[i] = { ...items[i], name: e.target.value }; update({ certifications: { ...data.certifications, items } }); }} placeholder="Certification name" className="input col-span-3" />
                      <input value={item.issuer} onChange={(e) => { const items = [...data.certifications.items]; items[i] = { ...items[i], issuer: e.target.value }; update({ certifications: { ...data.certifications, items } }); }} placeholder="Issuer" className="input" />
                      <input value={item.year} onChange={(e) => { const items = [...data.certifications.items]; items[i] = { ...items[i], year: e.target.value }; update({ certifications: { ...data.certifications, items } }); }} placeholder="Year" className="input" />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => update({ certifications: { ...data.certifications, items: [...data.certifications.items, { name: "", issuer: "", year: "" }] } })} className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400"><Plus className="w-3.5 h-3.5" /> Add Certification</button>
              </Field>
            </SectionCard>
          )}

          {/* === TOOLS === */}
          {activeTab === "tools" && (
            <SectionCard title="Software & Tools" visible={data.visibility.tools} onToggle={() => toggleVisibility("tools")}>
              <Field label="Heading">
                <input value={data.tools.heading} onChange={(e) => update({ tools: { ...data.tools, heading: e.target.value } })} className="input" />
              </Field>
              <Field label="Tools">
                <div className="flex flex-wrap gap-2 mb-3">
                  {data.tools.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/[0.06]">
                      <input value={item.name} onChange={(e) => { const items = [...data.tools.items]; items[i] = { ...items[i], name: e.target.value }; update({ tools: { ...data.tools, items } }); }} className="bg-transparent text-xs font-medium text-zinc-900 dark:text-white border-none outline-none w-24" />
                      <button type="button" onClick={() => update({ tools: { ...data.tools, items: data.tools.items.filter((_, j) => j !== i) } })} className="text-zinc-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => update({ tools: { ...data.tools, items: [...data.tools.items, { name: "" }] } })} className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400"><Plus className="w-3.5 h-3.5" /> Add Tool</button>
              </Field>
            </SectionCard>
          )}

          {/* === VALUES === */}
          {activeTab === "values" && (
            <SectionCard title="Personal Values" visible={data.visibility.values} onToggle={() => toggleVisibility("values")}>
              <Field label="Heading">
                <input value={data.values.heading} onChange={(e) => update({ values: { ...data.values, heading: e.target.value } })} className="input" />
              </Field>
              <Field label="Subheading">
                <textarea value={data.values.subheading} onChange={(e) => update({ values: { ...data.values, subheading: e.target.value } })} rows={2} className="input" />
              </Field>
              <Field label="Values">
                {data.values.items.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/40 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-zinc-500">Value {i + 1}</span>
                      <button type="button" onClick={() => update({ values: { ...data.values, items: data.values.items.filter((_, j) => j !== i) } })} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <input value={item.title} onChange={(e) => { const items = [...data.values.items]; items[i] = { ...items[i], title: e.target.value }; update({ values: { ...data.values, items } }); }} placeholder="Value title" className="input mb-2" />
                    <textarea value={item.description} onChange={(e) => { const items = [...data.values.items]; items[i] = { ...items[i], description: e.target.value }; update({ values: { ...data.values, items } }); }} placeholder="Description" rows={2} className="input" />
                  </div>
                ))}
                <button type="button" onClick={() => update({ values: { ...data.values, items: [...data.values.items, { title: "", description: "" }] } })} className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400"><Plus className="w-3.5 h-3.5" /> Add Value</button>
              </Field>
            </SectionCard>
          )}

          {/* === CTA === */}
          {activeTab === "cta" && (
            <SectionCard title="Call to Action" visible={data.visibility.cta} onToggle={() => toggleVisibility("cta")}>
              <Field label="Heading">
                <input value={data.cta.heading} onChange={(e) => update({ cta: { ...data.cta, heading: e.target.value } })} className="input" />
              </Field>
              <Field label="Subheading">
                <textarea value={data.cta.subheading} onChange={(e) => update({ cta: { ...data.cta, subheading: e.target.value } })} rows={2} className="input" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Button Text">
                  <input value={data.cta.buttonText} onChange={(e) => update({ cta: { ...data.cta, buttonText: e.target.value } })} className="input" />
                </Field>
                <Field label="Button Link">
                  <input value={data.cta.buttonLink} onChange={(e) => update({ cta: { ...data.cta, buttonLink: e.target.value } })} className="input" />
                </Field>
              </div>
            </SectionCard>
          )}
        </div>

        <div className="flex items-center gap-4 pt-6 border-t border-zinc-200 dark:border-white/[0.06] mt-8">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : <><CheckCircle2 className="w-4 h-4" /> Save Changes</>}
          </button>
          {saved && (
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">All changes saved!</span>
          )}
        </div>
      </form>
    </AdminLayout>
  );
}

function SectionCard({ title, visible, onToggle, children }: { title: string; visible: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className={`bg-white dark:bg-[#0d0b1f] rounded-2xl border ${visible ? "border-zinc-200 dark:border-white/[0.08]" : "border-zinc-200/50 dark:border-white/[0.04] opacity-60"} p-6 sm:p-8 transition-all`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{title}</h2>
        <button
          type="button"
          onClick={onToggle}
          className={`p-2 rounded-lg transition-colors ${visible ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"}`}
          title={visible ? "Hide section" : "Show section"}
        >
          {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
