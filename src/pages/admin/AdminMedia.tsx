import { useState, useEffect, useRef } from "react";
import AdminLayout from "./AdminLayout";
import { Search, Image, Plus, Trash2, Edit2, FileType, X, CheckCircle2, Link, Upload, Grid3X3, List } from "lucide-react";

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<string[]>([]);
  const [dropActive, setDropActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setList(loadMedia());
  }, []);

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
    setSelected((prev) => prev.filter((s) => s !== id));
  };

  const handleDeleteSelected = () => {
    if (!selected.length || !confirm(`Delete ${selected.length} item(s)?`)) return;
    const updated = list.filter((m) => !selected.includes(m.id));
    saveMedia(updated);
    setList(updated);
    setSelected([]);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#0d0b1f] rounded-2xl border border-zinc-200 dark:border-white/[0.06] p-4">
          <p className="text-2xl font-black text-zinc-900 dark:text-white">{list.length}</p>
          <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">Total Files</p>
        </div>
        <div className="bg-white dark:bg-[#0d0b1f] rounded-2xl border border-zinc-200 dark:border-white/[0.06] p-4">
          <p className="text-2xl font-black text-zinc-900 dark:text-white">{imageCount}</p>
          <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">Images</p>
        </div>
        <div className="bg-white dark:bg-[#0d0b1f] rounded-2xl border border-zinc-200 dark:border-white/[0.06] p-4">
          <p className="text-2xl font-black text-zinc-900 dark:text-white">{totalSize.toFixed(0)} KB</p>
          <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">Total Size</p>
        </div>
        <div className="bg-white dark:bg-[#0d0b1f] rounded-2xl border border-zinc-200 dark:border-white/[0.06] p-4">
          <p className="text-2xl font-black text-zinc-900 dark:text-white">{selected.length}</p>
          <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">Selected</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-[#0d0b1f] rounded-2xl border border-zinc-200 dark:border-white/[0.06] p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/50 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400" : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.05]"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400" : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.05]"}`}
            >
              <List className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-zinc-200 dark:bg-white/[0.08]" />
            <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={filterImages}
                onChange={(e) => setFilterImages(e.target.checked)}
                className="rounded border-zinc-300 dark:border-zinc-600"
              />
              Images
            </label>
            {selected.length > 0 && (
              <>
                <div className="w-px h-6 bg-zinc-200 dark:bg-white/[0.08]" />
                <button onClick={handleDeleteSelected} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Delete {selected.length}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Upload area */}
        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-white/[0.05]">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex gap-2">
              <input
                value={uploadUrl}
                onChange={(e) => setUploadUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/50 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
              <input
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                placeholder="Name"
                className="w-36 px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/50 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
              <button
                onClick={handleUpload}
                disabled={!uploadUrl.trim() || !uploadName.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors disabled:opacity-50 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add URL
              </button>
            </div>
            <div className="shrink-0">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => { const files = e.target.files; if (files) Array.from(files).forEach(handleFileUpload); }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-zinc-200 dark:border-white/[0.08] text-zinc-500 dark:text-zinc-400 text-sm font-medium hover:border-violet-200 dark:hover:border-violet-800/40 hover:text-violet-600 dark:hover:text-violet-400 transition-all cursor-pointer w-full sm:w-auto justify-center"
              >
                <Upload className="w-4 h-4" /> Upload Files
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filtered.map((m) => (
            <div
              key={m.id}
              className={`bg-white dark:bg-[#0d0b1f] rounded-2xl border overflow-hidden group transition-all ${
                selected.includes(m.id)
                  ? "border-violet-500 ring-2 ring-violet-500/20"
                  : "border-zinc-200 dark:border-white/[0.06] hover:border-violet-200 dark:hover:border-violet-800/40"
              }`}
            >
              <div
                className="aspect-square bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center relative cursor-pointer"
                onClick={() => toggleSelect(m.id)}
              >
                {isImage(m.url) ? (
                  <img src={m.url} alt={m.name} className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <FileType className="w-8 h-8 text-zinc-400" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={(e) => { e.stopPropagation(); copyLink(m.id, m.url); }} className="p-2 rounded-lg bg-white/90 text-blue-600 hover:bg-white transition-colors" title="Copy Link">
                    {copiedId === m.id ? <CheckCircle2 className="w-4 h-4" /> : <Link className="w-4 h-4" />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); openEdit(m); }} className="p-2 rounded-lg bg-white/90 text-zinc-800 hover:bg-white transition-colors" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }} className="p-2 rounded-lg bg-white/90 text-red-600 hover:bg-white transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {selected.includes(m.id) && (
                  <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
              <div className="p-3" onClick={() => toggleSelect(m.id)}>
                <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{m.name}</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">{formatDate(m.createdAt)}</p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-20 text-zinc-400 dark:text-zinc-500">
              <Image className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-bold">No media found</p>
              <p className="text-sm mt-1">Upload images or add a URL to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-white dark:bg-[#0d0b1f] rounded-2xl border border-zinc-200 dark:border-white/[0.06] overflow-hidden">
          <div className="divide-y divide-zinc-100 dark:divide-white/[0.05]">
            {filtered.map((m) => (
              <div key={m.id} className={`flex items-center gap-4 p-3 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors ${selected.includes(m.id) ? "bg-violet-50/50 dark:bg-violet-500/5" : ""}`}>
                <input
                  type="checkbox"
                  checked={selected.includes(m.id)}
                  onChange={() => toggleSelect(m.id)}
                  className="rounded border-zinc-300 dark:border-zinc-600"
                />
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 overflow-hidden shrink-0 flex items-center justify-center">
                  {isImage(m.url) ? (
                    <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    <FileType className="w-5 h-5 text-zinc-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{m.name}</p>
                  <p className="text-[10px] text-zinc-400">{formatDate(m.createdAt)}</p>
                </div>
                <span className="text-[11px] text-zinc-500 shrink-0">{m.size}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => copyLink(m.id, m.url)} className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors" title="Copy Link">
                    {copiedId === m.id ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Link className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors" title="Edit">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-white dark:bg-[#0d0b1f] rounded-3xl border border-zinc-200 dark:border-white/[0.08] shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-100 dark:border-white/[0.05]">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Edit File</h2>
              <button onClick={() => setModal(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">Name</label>
                <input value={modal.name} onChange={(e) => setModal({ ...modal, name: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-1">URL</label>
                <input value={modal.url} onChange={(e) => setModal({ ...modal, url: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40" required />
              </div>
              {isImage(modal.url) && (
                <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-white/[0.08]">
                  <img src={modal.url} alt={modal.name} className="w-full h-40 object-cover" />
                </div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
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
