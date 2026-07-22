import { useState, useRef } from "react";
import AdminLayout from "./AdminLayout";
import { Upload, Image, File, Trash2, Copy, Check, X } from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: "image" | "file";
  size: string;
  date: string;
}

const STORAGE_KEY = "ar_media";

function loadMedia(): MediaItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveMedia(items: MediaItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>(() => {
    const stored = loadMedia();
    return stored.length ? stored : [
      { id: "med-1", name: "hero-bg.jpg", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800", type: "image", size: "245 KB", date: "2026-07-15" },
      { id: "med-2", name: "profile-pic.png", url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800", type: "image", size: "180 KB", date: "2026-07-14" },
    ];
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const persist = (updated: MediaItem[]) => {
    setItems(updated);
    saveMedia(updated);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const newItem: MediaItem = {
        id: `med-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: file.name,
        url,
        type: file.type.startsWith("image/") ? "image" : "file",
        size: formatSize(file.size),
        date: new Date().toISOString().split("T")[0],
      };
      persist([...items, newItem]);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = (id: string) => {
    persist(items.filter(i => i.id !== id));
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AdminLayout title="Media Library">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-500">{items.length} files</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-gradient text-white text-sm font-bold shadow-lg shadow-violet-500/20 hover:opacity-90 transition-all"
          >
            <Upload className="w-4 h-4" /> Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.zip"
            className="hidden"
            onChange={handleUpload}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group relative rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                {item.type === "image" ? (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <File className="w-12 h-12 text-zinc-300 dark:text-zinc-600" />
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-zinc-900 dark:text-white truncate" title={item.name}>{item.name}</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">{item.size}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleCopyUrl(item.url, item.id)}
                  className="p-1.5 rounded-lg bg-zinc-900/70 text-white hover:bg-zinc-900"
                  aria-label="Copy URL"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg bg-red-500/70 text-white hover:bg-red-600"
                  aria-label="Delete file"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-16">
            <Image className="w-16 h-16 text-zinc-200 dark:text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-1">No media uploaded yet</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">Click Upload to add images or files</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
