import AdminLayout from "./AdminLayout";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Search, ExternalLink, Star } from "lucide-react";
import { loadPortfolio, savePortfolio, CATEGORIES, PortfolioItem } from "@/data/portfolio";

export default function AdminPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [form, setForm] = useState({ title: "", description: "", image: "", category: "Website Design", demoLink: "", tags: "" });

  useEffect(() => { setItems(loadPortfolio()); }, []);

  function persist(list: PortfolioItem[]) { savePortfolio(list); setItems([...list]); }

  function openNew() {
    setEditing(null);
    setForm({ title: "", description: "", image: "", category: "Website Design", demoLink: "", tags: "" });
    setShowModal(true);
  }

  function openEdit(item: PortfolioItem) {
    setEditing(item);
    setForm({ title: item.title, description: item.description, image: item.image, category: item.category, demoLink: item.demoLink, tags: item.tags.join(", ") });
    setShowModal(true);
  }

  function save() {
    if (!form.title.trim()) return;
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    if (editing) {
      persist(items.map((i) => (i.id === editing.id ? { ...i, ...form, tags, createdAt: i.createdAt } : i)));
    } else {
      const id = "p" + Date.now();
      persist([{ id, ...form, tags, featured: false, createdAt: new Date().toISOString() }, ...items]);
    }
    setShowModal(false);
  }

  function remove(id: string) { if (confirm("Delete this portfolio item?")) persist(items.filter((i) => i.id !== id)); }

  function toggleFeatured(id: string) { persist(items.map((i) => (i.id === id ? { ...i, featured: !i.featured } : i))); }

  const filtered = items.filter((i) => {
    if (filterCategory !== "All" && i.category !== filterCategory) return false;
    if (search && !i.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminLayout title="Portfolio">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#0d0b1f] text-sm focus:outline-none w-48" />
          </div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#0d0b1f] text-sm focus:outline-none">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={openNew} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors flex items-center gap-2"><Plus className="w-4 h-4" /> Add Project</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white dark:bg-[#0d0b1f] rounded-2xl border border-zinc-200 dark:border-white/[0.08] overflow-hidden group">
            <div className="aspect-video bg-zinc-100 dark:bg-white/[0.03] relative">
              {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-zinc-400 text-xs">No Image</div>}
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => remove(item.id)} className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">{item.category}</span>
                <button onClick={() => toggleFeatured(item.id)} className={`${item.featured ? "text-amber-400" : "text-zinc-300 dark:text-zinc-600"} hover:text-amber-400 transition-colors`} title="Toggle featured"><Star className="w-3.5 h-3.5" fill={item.featured ? "currentColor" : "none"} /></button>
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white">{item.title}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{item.description}</p>
              {item.demoLink && (
                <a href={item.demoLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-500 hover:text-blue-600 mt-2"><ExternalLink className="w-3 h-3" /> Demo</a>
              )}
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-zinc-500 mt-12 text-sm">No portfolio items found.</p>}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-[#0d0b1f] rounded-2xl border border-zinc-200 dark:border-white/[0.08] p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-5">{editing ? "Edit" : "Add"} Project</h3>
            <div className="space-y-4">
              <div><label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Title</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#0d0b1f] text-sm focus:outline-none" /></div>
              <div><label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Description</label><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#0d0b1f] text-sm focus:outline-none" /></div>
              <div><label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Image URL</label><input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#0d0b1f] text-sm focus:outline-none" /></div>
              <div><label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#0d0b1f] text-sm focus:outline-none">{CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}</select></div>
              <div><label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Demo Link</label><input type="text" value={form.demoLink} onChange={(e) => setForm({ ...form, demoLink: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#0d0b1f] text-sm focus:outline-none" /></div>
              <div><label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Tags (comma separated)</label><input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#0d0b1f] text-sm focus:outline-none" /></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Cancel</button>
              <button onClick={save} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors">{editing ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
