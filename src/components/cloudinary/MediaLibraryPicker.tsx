import { useState, useEffect, useMemo } from "react";
import {
  Search, X, CheckCircle2, FileText, Film, FolderOpen, Loader2,
  Image as ImageIcon, ChevronLeft, ChevronRight
} from "lucide-react";
import {
  MediaLibraryItem, loadMediaLibrary, getMediaFolders
} from "@/data/cloudinaryMedia";
import { getThumbnailUrl, formatBytes } from "@/utils/cloudinary";
import { cn } from "@/lib/utils";

export type MediaPickerFilter = "all" | "image" | "raw" | "video";

interface MediaLibraryPickerProps {
  open: boolean;
  onClose: () => void;
  /** Returns the selected URL(s). For single mode a one-element array. */
  onSelect: (urls: string[]) => void;
  mode?: "single" | "multi";
  filter?: MediaPickerFilter;
  title?: string;
}

const PAGE_SIZE = 20;

const FILTER_LABELS: Record<MediaPickerFilter, string> = {
  all: "All",
  image: "Images",
  raw: "PDFs",
  video: "Videos",
};

export default function MediaLibraryPicker({
  open,
  onClose,
  onSelect,
  mode = "single",
  filter = "all",
  title = "Select from Media Library",
}: MediaLibraryPickerProps) {
  const [items, setItems] = useState<MediaLibraryItem[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<MediaPickerFilter>(filter);
  const [folderFilter, setFolderFilter] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (open) {
      setItems(loadMediaLibrary());
      setSearch("");
      setTypeFilter(filter);
      setFolderFilter("all");
      setSelected([]);
      setPage(0);
    }
  }, [open, filter]);

  const folders = useMemo(() => ["all", ...getMediaFolders()], [open]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((m) => {
      if (typeFilter !== "all" && m.type !== typeFilter) return false;
      if (folderFilter !== "all" && m.folder !== folderFilter) return false;
      if (q && !m.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, search, typeFilter, folderFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  useEffect(() => {
    if (page >= pageCount) setPage(Math.max(0, pageCount - 1));
  }, [page, pageCount]);

  if (!open) return null;

  const toggle = (m: MediaLibraryItem) => {
    if (mode === "single") {
      setSelected([m.id]);
      return;
    }
    setSelected((prev) =>
      prev.includes(m.id) ? prev.filter((s) => s !== m.id) : [...prev, m.id]
    );
  };

  const confirm = () => {
    const urls = items
      .filter((m) => selected.includes(m.id))
      .map((m) => m.url);
    if (urls.length) onSelect(urls);
  };

  const handleDoubleClick = (m: MediaLibraryItem) => {
    if (mode === "single") {
      onSelect([m.url]);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#162032] rounded-3xl border border-zinc-200 dark:border-white/[0.08] shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-white/[0.05] shrink-0">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{title}</h2>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {filtered.length} item{filtered.length !== 1 ? "s" : ""} · {mode === "single" ? "Click to select" : "Click to select multiple"}
            </p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search + filters */}
        <div className="px-5 pt-4 space-y-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder="Search media..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-transparent text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-white/[0.05] rounded-lg p-1">
              {(["all", "image", "raw", "video"] as MediaPickerFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => { setTypeFilter(f); setPage(0); }}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors",
                    typeFilter === f
                      ? "bg-white dark:bg-[#1E293B] text-violet-600 dark:text-violet-400 shadow-sm"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white"
                  )}
                >
                  {FILTER_LABELS[f]}
                </button>
              ))}
            </div>
            <select
              value={folderFilter}
              onChange={(e) => { setFolderFilter(e.target.value); setPage(0); }}
              className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#162032] text-[11px] font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none"
            >
              {folders.map((f) => (
                <option key={f} value={f}>{f === "all" ? "All Folders" : f}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {pageItems.length === 0 ? (
            <div className="text-center py-16 text-zinc-400 dark:text-zinc-500">
              <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-bold">No media found</p>
              <p className="text-sm mt-1">Upload files in the Media Library first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {pageItems.map((m) => {
                const isSelected = selected.includes(m.id);
                const isRaw = m.type === "raw";
                const isVideo = m.type === "video";
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggle(m)}
                    onDoubleClick={() => handleDoubleClick(m)}
                    className={cn(
                      "relative rounded-2xl border overflow-hidden transition-all text-left group",
                      isSelected
                        ? "border-violet-500 ring-2 ring-violet-500/30"
                        : "border-zinc-200 dark:border-white/[0.08] hover:border-violet-300 dark:hover:border-violet-800/50"
                    )}
                  >
                    {isRaw || isVideo ? (
                      <div className="aspect-square bg-zinc-100 dark:bg-[#162032] flex flex-col items-center justify-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                          {isRaw ? <FileText className="w-5 h-5" /> : <Film className="w-5 h-5" />}
                        </div>
                        <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase px-2 truncate max-w-full">
                          {m.format || (isRaw ? "PDF" : "Video")}
                        </span>
                      </div>
                    ) : (
                      <div className="aspect-square bg-zinc-100 dark:bg-[#162032]">
                        <img src={getThumbnailUrl(m.url, 300)} alt={m.name} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    )}
                    <div className="p-2">
                      <p className="text-[11px] font-bold text-zinc-900 dark:text-white truncate">{m.name}</p>
                      <p className="text-[10px] text-zinc-400">{formatBytes(m.size)}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-100 dark:border-white/[0.05] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.05] disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              {page + 1} / {pageCount}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={page >= pageCount - 1}
              className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.05] disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {selected.length > 0 && (
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                {selected.length} selected
              </span>
            )}
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirm}
              disabled={selected.length === 0}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors disabled:opacity-40"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Select {selected.length > 0 ? `(${selected.length})` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
