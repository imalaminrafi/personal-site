import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Search, Image, Plus, Trash2, Edit2, FileType, X, CheckCircle2, Link, Copy, Move } from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size: string;
  createdAt: string;
}

const STORAGE_KEY = "ar_media";

function loadMedia(): MediaItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMedia(list: MediaItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function isImage(url: string): boolean {
  return url.startsWith("http") || url.startsWith("/");
}

export default function AdminMedia() {
  const [list, setList] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterImages, setFilterImages] = useState(false);
  const [modal, setModal] = useState<MediaItem | null>(null);
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadName, setUploadName] = useState("");
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState("");
  const [folder, setFolder] = useState("all");
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    setList(loadMedia());
  }, []);

  const folders = [...new Set(list.map((m) => m.type).filter(Boolean))];

  function copyLink(id: string, url: string) {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(""), 2000);
    });
  }

  function handleFileUpload(file: File) {
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith("image/") ? "image" : "file";
    const item: MediaItem = {
      id: `m${Date.now()}`,
      name: file.name,
      url,
      type,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      createdAt: new Date().toISOString(),
    };
    const updated = [item, ...list];
    saveMedia(updated);
    setList(updated);
  }

  const filtered = list.filter((m) => {
    const match = m.name.toLowerCase().includes(search.toLowerCase());
    if (!filterImages) return match;
    if (folder !== "all" && m.type !== folder) return false;
    return match && isImage(m.url);
  });

  const handleUpload = () => {
    if (!uploadUrl.trim() || !uploadName.trim()) return;
    const item: MediaItem = {
      id: `m${Date.now()}`,
      name: uploadName.trim(),
      url: uploadUrl.trim(),
      type: isImage(uploadUrl) ? "image" : "file",
      size: "—",
      createdAt: new Date().toISOString(),
    };
    const updated = [item, ...list];
    saveMedia(updated);
    setList(updated);
    setUploadUrl("");
    setUploadName("");
  };

  const openEdit = (item: MediaItem) => setModal({ ...item });

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal) return;
    setSaving(true);
    const updated = list.map((m) => (m.id === modal.id ? modal : m));
    saveMedia(updated);
    setList(updated);
    setSaving(false);
    setModal(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this media item?")) return;
    const updated = list.filter((m) => m.id !== id);
    saveMedia(updated);
    setList(updated);
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const imageCount = list.filter((m) => isImage(m.url)).length;
  const totalSize = list.reduce((acc, m) => {
    const match = m.size.match(/^([\d.]+)/);
    return match ? acc + parseFloat(match[1]) : acc;
  }, 0);

  return (
    <AdminLayout title="Media Library">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-[#0d0b1f] p-4 rounded-2xl border border-zinc-200 dark:border-white/[0.08]">
          <p className="text-xl font-black text-zinc-900 dark:text-white">{list.length}</p>
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Total Files</p>
        </div>
        <div className="bg-white dark:bg-[#0d0b1f] p-4 rounded-2xl border border-zinc-200 dark:border-white/[0.08]">
          <p className="text-xl font-black text-zinc-900 dark:text-white">{imageCount}</p>
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Images</p>
        </div>
        <div className="bg-white dark:bg-[#0d0b1f] p-4 rounded-2xl border border-zinc-200 dark:border-white/[0.08]">
          <p className="text-xl font-black text-zinc-900 dark:text-white">{totalSize.toFixed(0)} KB</p>
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Total Size</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#0d0b1f] text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 shrink-0">
          <input
            type="checkbox"
            checked={filterImages}
            onChange={(e) => setFilterImages(e.target.checked)}
            className="rounded border-zinc-300 dark:border-zinc-600"
          />
          Images only
        </label>
        <select value={folder} onChange={(e) => setFolder(e.target.value)} className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#0d0b1f] text-sm focus:outline-none">
          <option value="all">All Types</option>
          {folders.map((f) => <option key={f}>{f}</option>)}
        </select>
      </div>

      {/* Upload form */}
      <div className="bg-white dark:bg-[#0d0b1f] rounded-2xl border border-zinc-200 dark:border-white/[0.08] p-5 mb-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Image URL</label>
              <input
                value={uploadUrl}
                onChange={(e) => setUploadUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Name</label>
              <input
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                placeholder="My Image"
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
            </div>
            <button
              onClick={handleUpload}
              disabled={!uploadUrl.trim() || !uploadName.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors disabled:opacity-50 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add URL
            </button>
          </div>
          <div className="border-t border-zinc-100 dark:border-white/[0.05] pt-3">
            <p className="text-[11px] font-bold text-zinc-500 mb-2">Or upload from your computer</p>
            <label className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-zinc-200 dark:border-white/[0.08] cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
              <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => { const files = e.target.files; if (files) Array.from(files).forEach(handleFileUpload); }} />
              <Image className="w-5 h-5 text-zinc-400" />
              <span className="text-sm text-zinc-500">Click to browse or drag & drop images</span>
            </label>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="bg-white dark:bg-[#0d0b1f] rounded-2xl border border-zinc-200 dark:border-white/[0.08] overflow-hidden group"
          >
            <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center relative">
              {isImage(m.url) ? (
                <img
                  src={m.url}
                  alt={m.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                    (e.currentTarget.nextSibling as HTMLElement)?.classList.remove("hidden");
                  }}
                />
              ) : null}
              <div className={`absolute inset-0 flex items-center justify-center ${isImage(m.url) ? "hidden" : ""}`}>
                <FileType className="w-8 h-8 text-zinc-400" />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => copyLink(m.id, m.url)}
                  className="p-2 rounded-lg bg-white/90 text-blue-600 hover:bg-white transition-colors relative"
                  title="Copy Link"
                >
                  {copiedId === m.id ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => openEdit(m)}
                  className="p-2 rounded-lg bg-white/90 text-zinc-800 hover:bg-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-2 rounded-lg bg-white/90 text-red-600 hover:bg-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{m.name}</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">{formatDate(m.createdAt)}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-20 text-zinc-400 dark:text-zinc-500">
            <Image className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-bold">No media found</p>
            <p className="text-sm mt-1">Add a URL above to get started.</p>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div
            className="bg-white dark:bg-[#0d0b1f] rounded-3xl border border-zinc-200 dark:border-white/[0.08] shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-100 dark:border-white/[0.05]">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Edit Media</h2>
              <button onClick={() => setModal(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Name</label>
                <input
                  value={modal.name}
                  onChange={(e) => setModal({ ...modal, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">URL</label>
                <input
                  value={modal.url}
                  onChange={(e) => setModal({ ...modal, url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  required
                />
              </div>
              {isImage(modal.url) && (
                <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-white/[0.08]">
                  <img src={modal.url} alt={modal.name} className="w-full h-40 object-cover" />
                </div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : <><CheckCircle2 className="w-4 h-4" /> Save</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
