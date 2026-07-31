import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { loadAboutData, saveAboutData, AboutData } from "@/data/aboutData";
import CloudinaryUploadButton from "@/components/cloudinary/CloudinaryUploadButton";
import {
  CheckCircle2, Plus, Trash2, Eye, EyeOff, Edit3, X,
  User, FileText, Target, Briefcase, GraduationCap, Award,
  Code2, Heart, ArrowRight, Save
} from "lucide-react";

type SectionKey = keyof AboutData["visibility"];

const sectionMeta: Record<SectionKey, { label: string; icon: React.ElementType; desc: string }> = {
  hero: { label: "Hero Introduction", icon: User, desc: "Profile photo, name, title, introduction" },
  summary: { label: "Professional Summary", icon: FileText, desc: "Career journey narrative" },
  focus: { label: "Current Focus", icon: Target, desc: "What you do today" },
  experience: { label: "Experience Timeline", icon: Briefcase, desc: "Work history with dates" },
  skills: { label: "Skills & Expertise", icon: Code2, desc: "Categorized skill badges" },
  education: { label: "Education", icon: GraduationCap, desc: "Degrees and institutions" },
  certifications: { label: "Certifications", icon: Award, desc: "Training and certificates" },
  tools: { label: "Software & Tools", icon: Code2, desc: "Tools you use" },
  values: { label: "Work Values", icon: Heart, desc: "Personal values and work style" },
  cta: { label: "Call to Action", icon: ArrowRight, desc: "Final CTA section" },
};

export default function AdminAbout() {
  const [data, setData] = useState<AboutData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionKey | null>(null);

  useEffect(() => {
    setData(loadAboutData());
  }, []);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(t);
  }, [saved]);

  if (!data) return null;

  const update = (partial: Partial<AboutData>) => {
    setData({ ...data, ...partial });
  };

  const handleSave = () => {
    if (!data) return;
    setSaving(true);
    saveAboutData(data);
    setSaving(false);
    setSaved(true);
    setEditingSection(null);
  };

  const toggleVisibility = (key: SectionKey) => {
    setData({ ...data, visibility: { ...data.visibility, [key]: !data.visibility[key] } });
  };

  const sectionCards = (Object.keys(sectionMeta) as SectionKey[]).map((key) => ({
    key,
    ...sectionMeta[key],
    visible: data.visibility[key],
  }));

  return (
    <AdminLayout title="About Page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">About Page Editor</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Click on any section card to edit its content.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">All changes saved!</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </div>

      {/* Section Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {sectionCards.map((card) => {
          const Icon = card.icon;
          const isEditing = editingSection === card.key;
          return (
            <div
              key={card.key}
              className={`bg-white dark:bg-[#0d0b1f] rounded-2xl border transition-all ${
                isEditing
                  ? "border-violet-500 ring-2 ring-violet-500/20"
                  : card.visible
                    ? "border-zinc-200 dark:border-white/[0.06] hover:border-violet-200 dark:hover:border-violet-800/40"
                    : "border-zinc-200/50 dark:border-white/[0.04] opacity-60"
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    card.visible
                      ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                  }`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleVisibility(card.key)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        card.visible
                          ? "text-zinc-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30"
                          : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                      }`}
                      title={card.visible ? "Hide section" : "Show section"}
                    >
                      {card.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{card.label}</h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 mb-3">{card.desc}</p>
                <button
                  onClick={() => setEditingSection(isEditing ? null : card.key)}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                    isEditing
                      ? "text-violet-600 dark:text-violet-400"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  {isEditing ? "Editing..." : "Edit"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editing Panel */}
      {editingSection && (
        <div className="bg-white dark:bg-[#0d0b1f] rounded-2xl border border-zinc-200 dark:border-white/[0.06] p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Editing: {sectionMeta[editingSection].label}
            </h3>
            <button
              onClick={() => setEditingSection(null)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <EditorContent section={editingSection} data={data} update={update} />
        </div>
      )}
    </AdminLayout>
  );
}

function EditorContent({ section, data, update }: { section: SectionKey; data: AboutData; update: (partial: Partial<AboutData>) => void }) {
  switch (section) {
    case "hero":
      return <HeroEditor data={data} update={update} />;
    case "summary":
      return <SummaryEditor data={data} update={update} />;
    case "focus":
      return <FocusEditor data={data} update={update} />;
    case "experience":
      return <ExperienceEditor data={data} update={update} />;
    case "skills":
      return <SkillsEditor data={data} update={update} />;
    case "education":
      return <EducationEditor data={data} update={update} />;
    case "certifications":
      return <CertificationsEditor data={data} update={update} />;
    case "tools":
      return <ToolsEditor data={data} update={update} />;
    case "values":
      return <ValuesEditor data={data} update={update} />;
    case "cta":
      return <CTAEditor data={data} update={update} />;
    default:
      return null;
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/50 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
  );
}

function Textarea({ value, onChange, rows = 3, placeholder }: { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder}
      className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/50 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none" />
  );
}

function ParagraphList({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  return (
    <div>
      {items.map((p, i) => (
        <div key={i} className="flex items-start gap-2 mb-2">
          <Textarea value={p} onChange={(v) => { const ps = [...items]; ps[i] = v; onChange(ps); }} rows={2} />
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 mt-1"><Trash2 className="w-4 h-4" /></button>
        </div>
      ))}
      <button onClick={() => onChange([...items, ""])} className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400"><Plus className="w-3.5 h-3.5" /> Add Paragraph</button>
    </div>
  );
}

function HeroEditor({ data, update }: { data: AboutData; update: (partial: Partial<AboutData>) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name"><Input value={data.hero.name} onChange={(v) => update({ hero: { ...data.hero, name: v } })} /></Field>
        <Field label="Title"><Input value={data.hero.title} onChange={(v) => update({ hero: { ...data.hero, title: v } })} /></Field>
      </div>
      <Field label="Profile Photo">
        <CloudinaryUploadButton value={data.hero.image} onChange={(v) => update({ hero: { ...data.hero, image: v } })} label="Profile Photo" />
      </Field>
      <Field label="Introduction Paragraphs">
        <ParagraphList items={data.hero.paragraphs} onChange={(ps) => update({ hero: { ...data.hero, paragraphs: ps } })} />
      </Field>
    </div>
  );
}

function SummaryEditor({ data, update }: { data: AboutData; update: (partial: Partial<AboutData>) => void }) {
  return (
    <Field label="Paragraphs">
      <ParagraphList items={data.summary.paragraphs} onChange={(ps) => update({ summary: { ...data.summary, paragraphs: ps } })} />
    </Field>
  );
}

function FocusEditor({ data, update }: { data: AboutData; update: (partial: Partial<AboutData>) => void }) {
  const items = data.focus.items;
  return (
    <div className="space-y-4">
      <Field label="Subheading"><Textarea value={data.focus.subheading} onChange={(v) => update({ focus: { ...data.focus, subheading: v } })} /></Field>
      <Field label="Focus Items">
        {items.map((item, i) => (
          <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/40 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-500">Item {i + 1}</span>
              <button onClick={() => update({ focus: { ...data.focus, items: items.filter((_, j) => j !== i) } })} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
            <div className="space-y-2">
              <Input value={item.title} onChange={(v) => { const ni = [...items]; ni[i] = { ...ni[i], title: v }; update({ focus: { ...data.focus, items: ni } }); }} placeholder="Title" />
              <Textarea value={item.description} onChange={(v) => { const ni = [...items]; ni[i] = { ...ni[i], description: v }; update({ focus: { ...data.focus, items: ni } }); }} placeholder="Description" />
            </div>
          </div>
        ))}
        <button onClick={() => update({ focus: { ...data.focus, items: [...items, { title: "", description: "" }] } })} className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400"><Plus className="w-3.5 h-3.5" /> Add Item</button>
      </Field>
    </div>
  );
}

function ExperienceEditor({ data, update }: { data: AboutData; update: (partial: Partial<AboutData>) => void }) {
  const items = data.experience.items;
  return (
    <Field label="Timeline Items">
      {items.map((item, i) => (
        <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/40 mb-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-500">Position {i + 1}</span>
            <button onClick={() => update({ experience: { ...data.experience, items: items.filter((_, j) => j !== i) } })} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <Input value={item.title} onChange={(v) => { const ni = [...items]; ni[i] = { ...ni[i], title: v }; update({ experience: { ...data.experience, items: ni } }); }} placeholder="Job Title" />
            <Input value={item.company} onChange={(v) => { const ni = [...items]; ni[i] = { ...ni[i], company: v }; update({ experience: { ...data.experience, items: ni } }); }} placeholder="Company" />
          </div>
          <Input value={item.period} onChange={(v) => { const ni = [...items]; ni[i] = { ...ni[i], period: v }; update({ experience: { ...data.experience, items: ni } }); }} placeholder="Period" />
          <div className="mt-2">
            <Textarea value={item.description} onChange={(v) => { const ni = [...items]; ni[i] = { ...ni[i], description: v }; update({ experience: { ...data.experience, items: ni } }); }} placeholder="Description" />
          </div>
        </div>
      ))}
      <button onClick={() => update({ experience: { ...data.experience, items: [...items, { title: "", company: "", period: "", description: "" }] } })} className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400"><Plus className="w-3.5 h-3.5" /> Add Position</button>
    </Field>
  );
}

function SkillsEditor({ data, update }: { data: AboutData; update: (partial: Partial<AboutData>) => void }) {
  const cats = data.skills.categories;
  return (
    <Field label="Skill Categories">
      {cats.map((cat, i) => (
        <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/40 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-500">Category {i + 1}</span>
            <button onClick={() => update({ skills: { ...data.skills, categories: cats.filter((_, j) => j !== i) } })} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          <Input value={cat.category} onChange={(v) => { const nc = [...cats]; nc[i] = { ...nc[i], category: v }; update({ skills: { ...data.skills, categories: nc } }); }} placeholder="Category name" />
          <div className="mt-2">
            {cat.items.map((item, j) => (
              <div key={j} className="flex items-center gap-2 mb-1.5">
                <Input value={item} onChange={(v) => { const nc = [...cats]; nc[i] = { ...nc[i], items: [...nc[i].items] }; nc[i].items[j] = v; update({ skills: { ...data.skills, categories: nc } }); }} placeholder="Skill" />
                <button onClick={() => { const nc = [...cats]; nc[i] = { ...nc[i], items: nc[i].items.filter((_, k) => k !== j) }; update({ skills: { ...data.skills, categories: nc } }); }} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
            <button onClick={() => { const nc = [...cats]; nc[i] = { ...nc[i], items: [...nc[i].items, ""] }; update({ skills: { ...data.skills, categories: nc } }); }} className="text-xs text-violet-600 dark:text-violet-400 font-bold mt-1"><Plus className="w-3 h-3 inline mr-0.5" /> Add Skill</button>
          </div>
        </div>
      ))}
      <button onClick={() => update({ skills: { ...data.skills, categories: [...cats, { category: "", items: [""] }] } })} className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400"><Plus className="w-3.5 h-3.5" /> Add Category</button>
    </Field>
  );
}

function EducationEditor({ data, update }: { data: AboutData; update: (partial: Partial<AboutData>) => void }) {
  const items = data.education.items;
  return (
    <Field label="Education Items">
      {items.map((item, i) => (
        <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/40 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-500">Item {i + 1}</span>
            <button onClick={() => update({ education: { ...data.education, items: items.filter((_, j) => j !== i) } })} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <Input value={item.degree} onChange={(v) => { const ni = [...items]; ni[i] = { ...ni[i], degree: v }; update({ education: { ...data.education, items: ni } }); }} placeholder="Degree" />
            <Input value={item.institution} onChange={(v) => { const ni = [...items]; ni[i] = { ...ni[i], institution: v }; update({ education: { ...data.education, items: ni } }); }} placeholder="Institution" />
          </div>
          <Input value={item.period} onChange={(v) => { const ni = [...items]; ni[i] = { ...ni[i], period: v }; update({ education: { ...data.education, items: ni } }); }} placeholder="Period" />
        </div>
      ))}
      <button onClick={() => update({ education: { ...data.education, items: [...items, { degree: "", institution: "", period: "" }] } })} className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400"><Plus className="w-3.5 h-3.5" /> Add Education</button>
    </Field>
  );
}

function CertificationsEditor({ data, update }: { data: AboutData; update: (partial: Partial<AboutData>) => void }) {
  const items = data.certifications.items;
  return (
    <Field label="Certifications">
      {items.map((item, i) => (
        <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/40 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-500">Cert {i + 1}</span>
            <button onClick={() => update({ certifications: { ...data.certifications, items: items.filter((_, j) => j !== i) } })} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          <Input value={item.name} onChange={(v) => { const ni = [...items]; ni[i] = { ...ni[i], name: v }; update({ certifications: { ...data.certifications, items: ni } }); }} placeholder="Certification name" />
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input value={item.issuer} onChange={(v) => { const ni = [...items]; ni[i] = { ...ni[i], issuer: v }; update({ certifications: { ...data.certifications, items: ni } }); }} placeholder="Issuer" />
            <Input value={item.year} onChange={(v) => { const ni = [...items]; ni[i] = { ...ni[i], year: v }; update({ certifications: { ...data.certifications, items: ni } }); }} placeholder="Year" />
          </div>
        </div>
      ))}
      <button onClick={() => update({ certifications: { ...data.certifications, items: [...items, { name: "", issuer: "", year: "" }] } })} className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400"><Plus className="w-3.5 h-3.5" /> Add Certification</button>
    </Field>
  );
}

function ToolsEditor({ data, update }: { data: AboutData; update: (partial: Partial<AboutData>) => void }) {
  const items = data.tools.items;
  return (
    <Field label="Tools">
      <div className="flex flex-wrap gap-2 mb-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/[0.06]">
            <input value={item.name} onChange={(e) => { const ni = [...items]; ni[i] = { ...ni[i], name: e.target.value }; update({ tools: { ...data.tools, items: ni } }); }} className="bg-transparent text-xs font-medium text-zinc-900 dark:text-white border-none outline-none w-24" />
            <button onClick={() => update({ tools: { ...data.tools, items: items.filter((_, j) => j !== i) } })} className="text-zinc-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
          </div>
        ))}
      </div>
      <button onClick={() => update({ tools: { ...data.tools, items: [...items, { name: "" }] } })} className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400"><Plus className="w-3.5 h-3.5" /> Add Tool</button>
    </Field>
  );
}

function ValuesEditor({ data, update }: { data: AboutData; update: (partial: Partial<AboutData>) => void }) {
  const items = data.values.items;
  return (
    <div className="space-y-4">
      <Field label="Subheading"><Textarea value={data.values.subheading} onChange={(v) => update({ values: { ...data.values, subheading: v } })} /></Field>
      <Field label="Values">
        {items.map((item, i) => (
          <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/40 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-500">Value {i + 1}</span>
              <button onClick={() => update({ values: { ...data.values, items: items.filter((_, j) => j !== i) } })} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
            <Input value={item.title} onChange={(v) => { const ni = [...items]; ni[i] = { ...ni[i], title: v }; update({ values: { ...data.values, items: ni } }); }} placeholder="Value title" />
            <div className="mt-2">
              <Textarea value={item.description} onChange={(v) => { const ni = [...items]; ni[i] = { ...ni[i], description: v }; update({ values: { ...data.values, items: ni } }); }} placeholder="Description" />
            </div>
          </div>
        ))}
        <button onClick={() => update({ values: { ...data.values, items: [...items, { title: "", description: "" }] } })} className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400"><Plus className="w-3.5 h-3.5" /> Add Value</button>
      </Field>
    </div>
  );
}

function CTAEditor({ data, update }: { data: AboutData; update: (partial: Partial<AboutData>) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Heading"><Input value={data.cta.heading} onChange={(v) => update({ cta: { ...data.cta, heading: v } })} /></Field>
      <Field label="Subheading"><Textarea value={data.cta.subheading} onChange={(v) => update({ cta: { ...data.cta, subheading: v } })} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Button Text"><Input value={data.cta.buttonText} onChange={(v) => update({ cta: { ...data.cta, buttonText: v } })} /></Field>
        <Field label="Button Link"><Input value={data.cta.buttonLink} onChange={(v) => update({ cta: { ...data.cta, buttonLink: v } })} /></Field>
      </div>
    </div>
  );
}
