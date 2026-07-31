import { useState, useEffect, useRef, useCallback } from "react";
import AdminLayout from "./AdminLayout";
import {
  Search, Image as ImageIcon, Trash2, X, CheckCircle2, Link, Upload,
  Grid3X3, List, Loader2, RefreshCw, Info, FolderOpen
} from "lucide-react";
import {
  uploadToCloudinary, deleteFromCloudinary, getThumbnailUrl, getOptimizedUrl,
  formatBytes, isCloudinaryUrl
} from "@/utils/cloudinary";
import {
  MediaLibraryItem, loadMediaLibrary, saveMediaLibrary, fromCloudinaryAsset,
  getMediaFolders
} from "@/data/cloudinaryMedia";

interface PreviewModal {
  item: MediaLibraryItem;
}

export default function AdminMedia() {
  const [list, setList] = useState<MediaLibraryItem[]>([]);
  const [search, setSearch] = useState("");
  const [folderFilter, setFolderFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [preview, setPreview] = useState<PreviewModal | null>(null);
  const [copiedId, setCopiedId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setList(loadMediaLibrary());
  }, []);

  const folders = ["all", ...getMediaFolders()];

  const handleUploadFiles = useCallback(async (files: FileList | File[]) => {
    setUploadError("");
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        setUploadError(`"${file.name}" is not an image and was skipped.`);
        continue;
      }
      setUploading(true);
      setProgress(0);
      try {
        const asset = await uploadToCloudinary(file, {
          folder: "alaminrafi",
          onProgress: setProgress,
        });
        const item = fromCloudinaryAsset(asset, file.name);
        const updated = [item, ...loadMediaLibrary()];
        saveMediaLibrary(updated);
        setList(updated);
      } catch (e) {
        setUploadError(e instanceof Error ? e.message : "Upload failed. Please try again.");
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files?.length) handleUploadFiles(e.dataTransfer.files);
    },
    [handleUploadFiles]
  );

  const copyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(""), 2000);
    });
  };

  const handleDelete = async (id: string) => {
    const item = list.find((i) => i.id === id);
    if (!item) return;
    if (!confirm(`Delete "${item.name}" from Cloudinary and the media library?`)) return;
    setDeletingId(id);
    if (item.publicId && isCloudinaryUrl(item.url)) {
      await deleteFromCloudinary(item.publicId);
    }
    const updated = list.filter((i) => i.id !== id);
    saveMediaLibrary(updated);
    setList(updated);
    setSelected((prev) => prev.filter((s) => s !== id));
    setDeletingId("");
  };

  const handleDeleteSelected = async () => {
    if (!selected.length) return;
    if (!confirm(`Delete ${selected.length} item(s) from Cloudinary?`)) return;
    for (const id of selected) {
      const item = list.find((i) => i.id === id);
      if (item?.publicId && isCloudinaryUrl(item.url)) {
        await deleteFromCloudinary(item.publicId);
      }
    }
    const updated = list.filter((i) => !selected.includes(i.id));
    saveMediaLibrary(updated);
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
      return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return iso;
    }
  };

  const filtered = list.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchFolder = folderFilter === "all" || m.folder === folderFilter;
    return matchSearch && matchFolder;
  });

  const totalSize = list.reduce((acc, i) => acc + (i.size || 0), 0);
  const cloudinaryCount = list.filter((i) => isCloudinaryUrl(i.url)).length;

  return (
    <AdminLayout title="Media Library">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#0d0b1f] rounded-2xl border border-zinc-200 dark:border-white/[0.06] p-4">
          <p className="text-2xl font-black text-zinc-900 dark:text-white">{list.length}</p>
          <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">Total Files</p>
        </div>
        <div className="bg-white dark:bg-[#0d0b1f] rounded-2xl border border-zinc-200 dark:border-white/[0.06] p-4">
          <p className="text-2xl font-black text-zinc-900 dark:text-white">{cloudinaryCount}</p>
          <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">Cloudinary Assets</p>
        </div>
        <div className="bg-white dark:bg-[#0d0b1f] rounded-2xl border border-zinc-200 dark:border-white/[0.06] p-4">
          <p className="text-2xl font-black text-zinc-900 dark:text-white">{formatBytes(totalSize)}</p>
          <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">Total Size</p>
        </div>
        <div className="bg-white dark:bg-[#0d0b1f] rounded-2xl border border-zinc-200 dark:border-white/[0.06] p-4">
          <p className="text-2xl font-black text-zinc-900 dark:text-white">{folders.length - 1}</p>
          <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">Folders</p>
        </div>
      </div>

      {/* Upload drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`mb-6 rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
          dragOver
            ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
            : "border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#0d0b1f]"
        }`}
      >
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleUploadFiles(e.target.files)} />
        {uploading ? (
          <div>
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin mx-auto mb-2" />
            <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Uploading to Cloudinary...</p>
            <div className="w-full max-w-xs mx-auto h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-[11px] text-zinc-400 mt-1.5">{progress}%</p>
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()} className="w-full">
            <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-zinc-900 dark:text-white">Upload to Cloudinary</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Drag & drop images here or click to browse</p>
          </button>
        )}
        {uploadError && <p className="mt-3 text-xs text-red-600 dark:text-red-400">{uploadError}</p>}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#0d0b1f] text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={folderFilter}
            onChange={(e) => setFolderFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#0d0b1f] text-sm text-zinc-900 dark:text-white focus:outline-none"
          >
            {folders.map((f) => (
              <option key={f} value={f}>{f === "all" ? "All Folders" : f}</option>
            ))}
          </select>
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
          {selected.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete {selected.length}
            </button>
          )}
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
                className="aspect-square bg-zinc-100 dark:bg-zinc-900 relative cursor-pointer"
                onClick={() => toggleSelect(m.id)}
              >
                <img src={getThumbnailUrl(m.url, 300)} alt={m.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                  <button onClick={(e) => { e.stopPropagation(); copyLink(m.id, m.url); }} className="p-1.5 rounded-lg bg-white/90 text-blue-600 hover:bg-white" title="Copy URL">
                    {copiedId === m.id ? <CheckCircle2 className="w-4 h-4" /> : <Link className="w-4 h-4" />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setPreview({ item: m }); }} className="p-1.5 rounded-lg bg-white/90 text-zinc-800 hover:bg-white" title="Info">
                    <Info className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }} disabled={deletingId === m.id} className="p-1.5 rounded-lg bg-white/90 text-red-600 hover:bg-white" title="Delete">
                    {deletingId === m.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-bold">No media found</p>
              <p className="text-sm mt-1">Drag & drop images above to upload to Cloudinary.</p>
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
                <input type="checkbox" checked={selected.includes(m.id)} onChange={() => toggleSelect(m.id)} className="rounded border-zinc-300 dark:border-zinc-600" />
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 overflow-hidden shrink-0">
                  <img src={getThumbnailUrl(m.url, 100)} alt={m.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{m.name}</p>
                  <p className="text-[10px] text-zinc-400">{formatDate(m.createdAt)}</p>
                </div>
                {m.width > 0 && (
                  <span className="text-[11px] text-zinc-500 shrink-0 hidden sm:block">{m.width}×{m.height}</span>
                )}
                <span className="text-[11px] text-zinc-500 shrink-0">{formatBytes(m.size)}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => copyLink(m.id, m.url)} className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10" title="Copy URL">
                    {copiedId === m.id ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Link className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => setPreview({ item: m })} className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10" title="Info">
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(m.id)} disabled={deletingId === m.id} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10" title="Delete">
                    {deletingId === m.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview / Info modal */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-white dark:bg-[#0d0b1f] rounded-3xl border border-zinc-200 dark:border-white/[0.08] shadow-xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 pb-4 border-b border-zinc-100 dark:border-white/[0.05]">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Image Information</h2>
              <button onClick={() => setPreview(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-center p-4">
              <img src={getOptimizedUrl(preview.item.url, { width: 900 })} alt={preview.item.name} className="max-h-64 rounded-xl object-contain" />
            </div>
            <div className="p-5 space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Name</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white break-all">{preview.item.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Upload Date</p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">{formatDate(preview.item.createdAt)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">File Size</p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">{formatBytes(preview.item.size)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Dimensions</p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {preview.item.width > 0 ? `${preview.item.width} × ${preview.item.height}px` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Format</p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white uppercase">{preview.item.format || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Folder</p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-1"><FolderOpen className="w-3.5 h-3.5 text-violet-500" /> {preview.item.folder}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Storage</p>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Cloudinary CDN</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Cloudinary Public ID</p>
                <p className="text-[11px] font-mono bg-zinc-100 dark:bg-zinc-900 rounded-lg px-2.5 py-1.5 text-zinc-600 dark:text-zinc-300 break-all">{preview.item.publicId}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Secure URL</p>
                <p className="text-[11px] font-mono bg-zinc-100 dark:bg-zinc-900 rounded-lg px-2.5 py-1.5 text-zinc-600 dark:text-zinc-300 break-all">{preview.item.url}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => copyLink(preview.item.id, preview.item.url)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors flex-1 justify-center"
                >
                  {copiedId === preview.item.id ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Link className="w-3.5 h-3.5" />}
                  {copiedId === preview.item.id ? "Copied!" : "Copy URL"}
                </button>
                <button
                  onClick={() => { const id = preview.item.id; setPreview(null); handleDelete(id); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
