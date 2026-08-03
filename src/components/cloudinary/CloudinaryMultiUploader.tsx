import { useState, useRef, useCallback } from "react";
import {
  Upload, X, Loader2, ImagePlus, CheckCircle2, Link, LibraryBig
} from "lucide-react";
import {
  uploadToCloudinary, deleteAssetByUrl, getOptimizedUrl, formatBytes
} from "@/utils/cloudinary";
import { addToMediaLibrary, fromCloudinaryAsset } from "@/data/cloudinaryMedia";
import MediaLibraryPicker, { MediaPickerFilter } from "./MediaLibraryPicker";

interface UploadQueueItem {
  name: string;
  size: number;
}

interface CloudinaryMultiUploaderProps {
  /** Newline-separated list of asset URLs */
  value: string;
  onChange: (newlineSeparatedUrls: string) => void;
  label?: string;
  folder?: string;
  max?: number;
  accept?: MediaPickerFilter;
}

export default function CloudinaryMultiUploader({
  value,
  onChange,
  label = "Images",
  folder = "alaminrafi",
  max = 12,
  accept = "image",
}: CloudinaryMultiUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const [error, setError] = useState("");
  const [copiedUrl, setCopiedUrl] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const urls = value.split("\n").map((u) => u.trim()).filter(Boolean);
  const allowPdf = accept === "all" || accept === "raw";

  const isAllowed = useCallback(
    (file: File) => {
      if (accept === "image" && file.type.startsWith("image/")) return true;
      if (allowPdf && file.type === "application/pdf") return true;
      if (accept === "all") return true;
      return false;
    },
    [accept, allowPdf]
  );

  const uploadFile = async (file: File): Promise<string> => {
    const asset = await uploadToCloudinary(file, {
      folder,
      resourceType: file.type === "application/pdf" ? "raw" : "image",
      onProgress: setProgress,
    });
    addToMediaLibrary(fromCloudinaryAsset(asset, file.name));
    return asset.secureUrl || asset.url;
  };

  const handleFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter(isAllowed);
    if (!list.length) {
      setError(`Only ${accept === "image" ? "image" : "image & PDF"} files are allowed here.`);
      return;
    }
    setError("");
    setQueue(list.map((f) => ({ name: f.name, size: f.size })));
    setUploading(true);
    setProgress(0);
    const newUrls: string[] = [];
    try {
      for (let i = 0; i < list.length; i++) {
        if (urls.length + newUrls.length >= max) {
          setError(`Maximum of ${max} files reached.`);
          break;
        }
        const url = await uploadFile(list[i]);
        newUrls.push(url);
      }
      if (newUrls.length) {
        onChange([...urls, ...newUrls].join("\n"));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setQueue([]);
      setProgress(0);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = async (url: string) => {
    onChange(urls.filter((u) => u !== url).join("\n"));
    await deleteAssetByUrl(url);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(""), 2000);
    });
  };

  return (
    <div>
      {urls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
          {urls.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-[#1E3A5F] group">
              {url.toLowerCase().endsWith(".pdf") ? (
                <div className="w-full h-full bg-zinc-100 dark:bg-[#162032] flex items-center justify-center text-red-500">
                  <div className="text-center">
                    <div className="text-[10px] font-black uppercase bg-red-500/10 text-red-500 rounded px-1.5 py-0.5 inline-block">PDF</div>
                  </div>
                </div>
              ) : (
                <img src={getOptimizedUrl(url, { width: 400 })} alt="" className="w-full h-full object-cover" loading="lazy" />
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => copyUrl(url)}
                  title="Copy URL"
                  className="p-1.5 rounded-lg bg-white/90 text-zinc-800 hover:bg-white"
                >
                  {copiedUrl === url ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Link className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  title="Remove"
                  className="p-1.5 rounded-lg bg-white/90 text-red-600 hover:bg-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload / library actions */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors"
        >
          <Upload className="w-3.5 h-3.5" /> Upload from Computer
        </button>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-200 dark:hover:bg-white/[0.1] transition-colors"
        >
          <LibraryBig className="w-3.5 h-3.5" /> Choose from Library
        </button>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files); }}
        className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
          dragOver
            ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
            : "border-zinc-200 dark:border-[#1E3A5F]"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept={allowPdf ? "image/*,application/pdf,.pdf" : "image/*"}
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
            <p className="text-xs text-zinc-500 font-medium">
              {queue[0] ? `Uploading "${queue[0].name}"...` : "Uploading to Cloudinary..."} {progress}%
            </p>
            <div className="w-full max-w-[220px] h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <ImagePlus className="w-4 h-4" />
            <span className="font-medium">Add {label.toLowerCase()}</span>
            <span className="text-zinc-400">· drag & drop {allowPdf ? "or pick PDFs" : ""}</span>
          </div>
        )}
        {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>

      <MediaLibraryPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        mode="multi"
        filter={accept}
        title="Select from Media Library"
        onSelect={(picked) => {
          const merged = [...urls, ...picked.filter((u) => !urls.includes(u))].slice(0, max);
          onChange(merged.join("\n"));
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
