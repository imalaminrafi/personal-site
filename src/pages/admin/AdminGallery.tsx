import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { GalleryItem, loadGallery, saveGallery, CATEGORIES } from "@/data/gallery";
import { Image, Plus, Trash2, Search, X } from "lucide-react";
import CloudinaryUploadButton from "@/components/cloudinary/CloudinaryUploadButton";

const empty: GalleryItem = {
  id: "", src: "", alt: "", category: "Office", createdAt: "",
};

export default function AdminGallery() {
  const [list, setList] = useState<GalleryItem[]>([]);
  const [modal, setModal] = useState<GalleryItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { setList(loadGallery()); }, []);

  const save = (updated: GalleryItem[]) => {
    saveGallery(updated);
    setList(updated);
  };

  const filtered = list.filter((item) =>
    item.alt.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () =>
    setModal({ ...empty, id: `g${Date.now()}`, createdAt: new Date().toISOString() });

  const deleteItem = (id: string) => {
    if (!confirm("Delete this gallery item?")) return;
    save(list.filter((item) => item.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal) return;
    setSaving(true);
    const exists = list.find((item) => item.id === modal.id);
    if (exists) {
      save(list.map((item) => (item.id === modal.id ? modal : item)));
    } else {
      save([modal, ...list]);
    }
    setSaving(false);
    setModal(null);
  };

  return (
    <AdminLayout title="Gallery">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {list.length} item{list.length !== 1 ? "s" : ""}
        </p>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by alt text..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="group bg-white dark:bg-[#0d0b1f] rounded-2xl border border-zinc-200 dark:border-white/[0.08] overflow-hidden">
            <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
              {item.src ? (
                <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
              ) : (
                <Image className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
              )}
            </div>
            <div className="p-3">
              <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{item.alt}</p>
              <span className="text-[10px] font-bold text-violet-500 bg-violet-50 dark:bg-violet-500/10 px-1.5 py-0.5 rounded mt-1 inline-block">
                {item.category}
              </span>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => deleteItem(item.id)}
                className="p-2 rounded-lg bg-white/90 dark:bg-black/60 text-zinc-400 hover:text-red-500 transition-colors shadow-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-20 text-zinc-400 dark:text-zinc-500">
            <Image className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-bold">No gallery items found</p>
            <p className="text-sm mt-1">{search ? "Try a different search." : 'Click "Add Item" to upload one.'}</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-white dark:bg-[#0d0b1f] rounded-3xl border border-zinc-200 dark:border-white/[0.08] shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-100 dark:border-white/[0.05]">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                {list.find((item) => item.id === modal.id) ? "Edit Item" : "New Gallery Item"}
              </h2>
              <button onClick={() => setModal(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Image</label>
                <CloudinaryUploadButton value={modal.src} onChange={(url) => setModal({ ...modal, src: url })} label="Gallery Image" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Alt Text</label>
                <input value={modal.alt} onChange={(e) => setModal({ ...modal, alt: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Category</label>
                <select value={modal.category} onChange={(e) => setModal({ ...modal, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#0d0b1f] text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40">
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
