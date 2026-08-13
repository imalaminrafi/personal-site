import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import AdminLayout from "./AdminLayout";
import {
  Search, Image as ImageIcon, Trash2, X, CheckCircle2, Link, Upload,
  Grid3X3, List, Loader2, FolderOpen, FileText, Download, Film
} from "lucide-react";
import {
  uploadToCloudinary, deleteCloudinaryAsset, detectResourceType
} from "@/services/cloudinaryUpload";
import {
  getThumbnailUrl, getOptimizedUrl, formatBytes, isCloudinaryUrl, getDownloadUrl
} from "@/utils/cloudinary";
import {
  MediaLibraryItem, loadMediaLibrary, saveMediaLibrary, fromCloudinaryAsset,
  getMediaFolders
} from "@/data/cloudinaryMedia";
import { cn } from "@/lib/utils";
import {
  Card, Btn, IconBtn, Input, Select, SearchInput, Modal, EmptyState, PageHeader, Badge,
} from "@/components/admin/ui";

interface PreviewModal {
  item: MediaLibraryItem;
}

type TypeFilter = "all" | "image" | "raw";

const PAGE_SIZE = 24;

export default function AdminMedia() {
  const [list, setList] = useState<MediaLibraryItem[]>([]);
  const [search, setSearch] = useState("");
  const [folderFilter, setFolderFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [preview, setPreview] = useState<PreviewModal | null>(null);
  const [copiedId, setCopiedId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [page, setPage] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setList(loadMediaLibrary());
  }, []);

  const folders = useMemo(() => ["all", ...getMediaFolders()], [list.length]);

  const handleUploadFiles = useCallback(async (files: FileList | File[]) => {
    setUploadError("");
    const listOf = Array.from(files);
    for (const file of listOf) {
      const resourceType = detectResourceType(file);
      const isImage = resourceType === "image";
      const isPdf = resourceType === "raw";
      const isVideo = resourceType === "video";
      if (!isImage && !isPdf && !isVideo) {
        setUploadError(`"${file.name}" is not an image, PDF or video and was skipped.`);
        continue;
      }
      setUploading(true);
      setProgress(0);
      try {
        const asset = await uploadToCloudinary(file, {
          folder: "alaminrafi",
          resourceType,
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
      await deleteCloudinaryAsset(item.publicId);
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
        await deleteCloudinaryAsset(item.publicId);
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

  const filtered = useMemo(() => list.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchFolder = folderFilter === "all" || m.folder === folderFilter;
    const matchType = typeFilter === "all" || m.type === typeFilter;
    return matchSearch && matchFolder && matchType;
  }), [list, search, folderFilter, typeFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  useEffect(() => {
    if (page >= pageCount) setPage(Math.max(0, pageCount - 1));
  }, [page, pageCount]);

  const totalSize = list.reduce((acc, i) => acc + (i.size || 0), 0);
  const cloudinaryCount = list.filter((i) => isCloudinaryUrl(i.url)).length;
  const pdfCount = list.filter((i) => i.type === "raw").length;

  const AssetThumb = ({ item, size }: { item: MediaLibraryItem; size: number }) => {
    if (item.type === "raw") {
      return (
        <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-[#162032]">
          <div className="text-center">
            <FileText className={cn("mx-auto text-red-500", size >= 200 ? "h-8 w-8" : "h-5 w-5")} />
            <span className="mt-1 inline-block rounded bg-red-500/10 px-1.5 py-0.5 text-[9px] font-black uppercase text-red-500">
              {item.format?.toUpperCase() || "PDF"}
            </span>
          </div>
        </div>
      );
    }
    if (item.type === "video") {
      return (
        <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-[#162032]">
          <Film className="h-8 w-8 text-violet-400" />
        </div>
      );
    }
    return <img src={getThumbnailUrl(item.url, size)} alt={item.name} className="h-full w-full object-cover" loading="lazy" />;
  };

  return (
    <AdminLayout title="Media Library">
      <PageHeader
        title="Media Library"
        description="Upload and manage images, PDFs and videos stored in Cloudinary."
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {[
          { label: "Total Files", value: list.length },
          { label: "Cloudinary Assets", value: cloudinaryCount },
          { label: "PDFs", value: pdfCount },
          { label: "Total Size", value: formatBytes(totalSize) },
          { label: "Folders", value: folders.length - 1 },
        ].map((stat) => (
          <Card key={stat.label} className="p-4">
            <p className="text-2xl font-black text-zinc-900 dark:text-white">{stat.value}</p>
            <p className="mt-0.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Upload drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "mb-6 rounded-xl border-2 border-dashed p-8 text-center transition-all",
          dragOver
            ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
            : "border-zinc-200 bg-white dark:border-white/[0.08] dark:bg-[#162032]"
        )}
      >
        <input ref={fileRef} type="file" accept="image/*,.pdf,application/pdf,video/*" multiple className="hidden" onChange={(e) => e.target.files && handleUploadFiles(e.target.files)} />
        {uploading ? (
          <div>
            <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-violet-500" />
            <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Uploading to Cloudinary...</p>
            <div className="mx-auto mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-zinc-200 dark:bg-white/[0.08]">
              <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1.5 text-[11px] text-zinc-400">{progress}%</p>
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()} className="w-full">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-zinc-900 dark:text-white">Upload to Cloudinary</p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Drag & drop images, PDFs or videos here or click to browse</p>
          </button>
        )}
        {uploadError && <p className="mt-3 text-xs text-red-600 dark:text-red-400">{uploadError}</p>}
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); setPage(0); }}
            placeholder="Search media..."
            className="w-full sm:flex-1"
          />
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-white/[0.05]">
              {(["all", "image", "raw"] as TypeFilter[]).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTypeFilter(t); setPage(0); }}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[11px] font-bold transition-colors",
                    typeFilter === t
                      ? "bg-white text-violet-600 shadow-sm dark:bg-white/[0.1] dark:text-violet-300"
                      : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white"
                  )}
                >
                  {t === "all" ? "All" : t === "image" ? "Images" : "PDFs"}
                </button>
              ))}
            </div>
            <Select
              value={folderFilter}
              onChange={(e) => { setFolderFilter(e.target.value); setPage(0); }}
              className="h-9 w-auto min-w-[130px] text-sm"
            >
              {folders.map((f) => (
                <option key={f} value={f}>{f === "all" ? "All Folders" : f}</option>
              ))}
            </Select>
            <div className="flex items-center rounded-lg border border-zinc-200 dark:border-white/[0.08]">
              <IconBtn
                label="Grid view"
                tone={viewMode === "grid" ? "violet" : "default"}
                onClick={() => setViewMode("grid")}
                className="rounded-none rounded-l-lg"
              >
                <Grid3X3 className="h-4 w-4" />
              </IconBtn>
              <IconBtn
                label="List view"
                tone={viewMode === "list" ? "violet" : "default"}
                onClick={() => setViewMode("list")}
                className="rounded-none rounded-r-lg"
              >
                <List className="h-4 w-4" />
              </IconBtn>
            </div>
            {selected.length > 0 && (
              <Btn variant="dangerSolid" size="sm" onClick={handleDeleteSelected}>
                <Trash2 className="h-3.5 w-3.5" /> Delete {selected.length}
              </Btn>
            )}
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {pageItems.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "overflow-hidden rounded-xl border bg-white transition-all dark:bg-[#162032]",
                  selected.includes(m.id)
                    ? "border-violet-500 ring-2 ring-violet-500/20"
                    : "border-zinc-200/70 hover:border-violet-200 dark:border-white/[0.07] dark:hover:border-violet-800/40"
                )}
              >
                <div
                  className="relative aspect-square cursor-pointer bg-zinc-100 dark:bg-[#162032]"
                  onClick={() => toggleSelect(m.id)}
                >
                  <AssetThumb item={m} size={300} />
                  <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/0 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/30 hover:opacity-100">
                    <button onClick={(e) => { e.stopPropagation(); copyLink(m.id, m.url); }} className="rounded-lg bg-white/90 p-1.5 text-blue-600 hover:bg-white" title="Copy URL">
                      {copiedId === m.id ? <CheckCircle2 className="h-4 w-4" /> : <Link className="h-4 w-4" />}
                    </button>
                    {m.type === "raw" && (
                      <a href={getDownloadUrl(m.url)} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="rounded-lg bg-white/90 p-1.5 text-zinc-800 hover:bg-white" title="Download">
                        <Download className="h-4 w-4" />
                      </a>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); setPreview({ item: m }); }} className="rounded-lg bg-white/90 p-1.5 text-zinc-800 hover:bg-white" title="Info">
                      <FolderOpen className="h-4 w-4" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }} disabled={deletingId === m.id} className="rounded-lg bg-white/90 p-1.5 text-red-600 hover:bg-white" title="Delete">
                      {deletingId === m.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                  {selected.includes(m.id) && (
                    <div className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-3" onClick={() => toggleSelect(m.id)}>
                  <p className="truncate text-xs font-bold text-zinc-900 dark:text-white">{m.name}</p>
                  <p className="mt-0.5 text-[10px] text-zinc-400">{formatDate(m.createdAt)}</p>
                </div>
              </div>
            ))}
            {pageItems.length === 0 && (
              <Card className="col-span-full">
                <EmptyState
                  icon={ImageIcon}
                  title="No media found"
                  description="Drag & drop images or PDFs above to upload to Cloudinary."
                />
              </Card>
            )}
          </div>
          {pageCount > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <Btn variant="outline" size="sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>Prev</Btn>
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Page {page + 1} of {pageCount}</span>
              <Btn variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} disabled={page >= pageCount - 1}>Next</Btn>
            </div>
          )}
        </>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card className="overflow-hidden">
          <div className="divide-y divide-zinc-100 dark:divide-white/[0.05]">
            {pageItems.map((m) => (
              <div key={m.id} className={cn("flex items-center gap-4 p-3 transition-colors hover:bg-zinc-50 dark:hover:bg-white/[0.02]", selected.includes(m.id) && "bg-violet-50/50 dark:bg-violet-500/5")}>
                <input type="checkbox" checked={selected.includes(m.id)} onChange={() => toggleSelect(m.id)} className="rounded border-zinc-300 dark:border-zinc-600" />
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-[#162032]">
                  <AssetThumb item={m} size={100} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-zinc-900 dark:text-white">{m.name}</p>
                  <p className="text-[10px] text-zinc-400">{formatDate(m.createdAt)}</p>
                </div>
                <Badge tone={m.type === "raw" ? "red" : "violet"}>
                  {m.type === "raw" ? m.format?.toUpperCase() || "PDF" : m.type}
                </Badge>
                {m.width > 0 && (
                  <span className="hidden shrink-0 text-[11px] text-zinc-500 sm:block">{m.width}×{m.height}</span>
                )}
                <span className="shrink-0 text-[11px] text-zinc-500">{formatBytes(m.size)}</span>
                <div className="flex shrink-0 items-center gap-1">
                  <IconBtn label="Copy URL" onClick={() => copyLink(m.id, m.url)}>
                    {copiedId === m.id ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Link className="h-3.5 w-3.5" />}
                  </IconBtn>
                  {m.type === "raw" && (
                    <a href={getDownloadUrl(m.url)} target="_blank" rel="noreferrer" aria-label="Download" title="Download" className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-white/[0.06] dark:hover:text-white">
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  )}
                  <IconBtn label="Info" onClick={() => setPreview({ item: m })}>
                    <FolderOpen className="h-3.5 w-3.5" />
                  </IconBtn>
                  <IconBtn label="Delete" tone="danger" onClick={() => handleDelete(m.id)}>
                    {deletingId === m.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  </IconBtn>
                </div>
              </div>
            ))}
          </div>
          {pageCount > 1 && (
            <div className="flex items-center justify-center gap-4 border-t border-zinc-100 py-3 dark:border-white/[0.05]">
              <Btn variant="outline" size="sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>Prev</Btn>
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Page {page + 1} of {pageCount}</span>
              <Btn variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} disabled={page >= pageCount - 1}>Next</Btn>
            </div>
          )}
        </Card>
      )}

      {/* Preview / Info modal */}
      {preview && (
        <Modal
          title="File Information"
          onClose={() => setPreview(null)}
          size="md"
          footer={
            <>
              <Btn variant="secondary" size="sm" onClick={() => copyLink(preview.item.id, preview.item.url)}>
                {copiedId === preview.item.id ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Link className="h-3.5 w-3.5" />}
                {copiedId === preview.item.id ? "Copied!" : "Copy URL"}
              </Btn>
              {preview.item.type === "raw" && (
                <a href={getDownloadUrl(preview.item.url)} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-zinc-100 px-3.5 text-[13px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-white/[0.06] dark:text-zinc-200 dark:hover:bg-white/[0.1]">
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
              )}
              <Btn variant="dangerSolid" size="sm" onClick={() => { const id = preview.item.id; setPreview(null); handleDelete(id); }}>
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Btn>
            </>
          }
        >
          <div className="space-y-3">
            <div className="flex items-center justify-center rounded-xl bg-zinc-50 p-4 dark:bg-white/[0.03]">
              {preview.item.type === "raw" ? (
                <div className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-200 py-8 dark:border-white/[0.1]">
                  <FileText className="h-14 w-14 text-red-500" />
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{preview.item.name}</p>
                  <p className="text-[11px] text-zinc-500">{formatBytes(preview.item.size)} · {preview.item.format?.toUpperCase() || "PDF"}</p>
                </div>
              ) : (
                <img src={getOptimizedUrl(preview.item.url, { width: 900 })} alt={preview.item.name} className="max-h-64 rounded-xl object-contain" />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Name</p>
                <p className="break-all text-sm font-semibold text-zinc-900 dark:text-white">{preview.item.name}</p>
              </div>
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
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{preview.item.width > 0 ? `${preview.item.width} × ${preview.item.height}px` : "—"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Type</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white uppercase">{preview.item.type || "image"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Folder</p>
                <p className="flex items-center gap-1 text-sm font-semibold text-zinc-900 dark:text-white"><FolderOpen className="h-3.5 w-3.5 text-violet-500" /> {preview.item.folder || "—"}</p>
              </div>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Cloudinary Public ID</p>
              <p className="break-all rounded-lg bg-zinc-100 px-2.5 py-1.5 font-mono text-[11px] text-zinc-600 dark:bg-white/[0.05] dark:text-zinc-300">{preview.item.publicId}</p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Secure URL</p>
              <p className="break-all rounded-lg bg-zinc-100 px-2.5 py-1.5 font-mono text-[11px] text-zinc-600 dark:bg-white/[0.05] dark:text-zinc-300">{preview.item.url}</p>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}