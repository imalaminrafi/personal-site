import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { Image, Plus, Trash2, GripVertical, ExternalLink } from "lucide-react";

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
}

const STORAGE_KEY = "ar_gallery";

function loadGallery(): GalleryItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveGallery(items: GalleryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const defaultImages: GalleryItem[] = [
  { id: "gal-1", src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800", alt: "Abstract art", category: "Design" },
  { id: "gal-2", src: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800", alt: "Digital artwork", category: "Design" },
  { id: "gal-3", src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800", alt: "3D render", category: "3D" },
];

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>(() => {
    const stored = loadGallery();
    return stored.length ? stored : defaultImages;
  });
  const [showAdd, setShowAdd] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newAlt, setNewAlt] = useState("");
  const [newCategory, setNewCategory] = useState("Design");

  const persist = (updated: GalleryItem[]) => {
    setItems(updated);
    saveGallery(updated);
  };

  const handleAdd = () => {
    if (!newUrl.trim()) return;
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      src: newUrl.trim(),
      alt: newAlt.trim() || "Gallery image",
      category: newCategory,
    };
    persist([...items, newItem]);
    setNewUrl("");
    setNewAlt("");
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    persist(items.filter(i => i.id !== id));
  };

  return (
    <AdminLayout title="Gallery">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-500">{items.length} images</p>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-gradient text-white text-sm font-bold shadow-lg shadow-violet-500/20 hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Image
          </button>
        </div>

        {showAdd && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5">Image URL</label>
                <input
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5">Alt Text</label>
                <input
                  value={newAlt}
                  onChange={e => setNewAlt(e.target.value)}
                  placeholder="Describe the image"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                >
                  <option>Design</option>
                  <option>3D</option>
                  <option>Photography</option>
                  <option>UI/UX</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleAdd} className="px-6 py-2.5 rounded-xl bg-brand-gradient text-white text-sm font-bold">Add</button>
              <button onClick={() => setShowAdd(false)} className="px-6 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-sm font-bold">Cancel</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group relative rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs font-bold truncate">{item.alt}</p>
                  <span className="text-[10px] text-white/70">{item.category}</span>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                  aria-label="Delete image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
