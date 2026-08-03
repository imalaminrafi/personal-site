import { useState, useRef, useCallback } from "react";
import {
  Loader2, X, CheckCircle2, RefreshCw, CloudUpload, FileText,
  Download, LibraryBig, Link, Film
} from "lucide-react";
import {
  uploadToCloudinary, deleteCloudinaryAssetByUrl, detectResourceType,
  type CloudinaryUploadResult
} from "@/services/cloudinaryUpload";
import { getOptimizedUrl, getDownloadUrl } from "@/utils/cloudinary";
import { addToMediaLibrary, fromCloudinaryAsset } from "@/data/cloudinaryMedia";
import MediaLibraryPicker, { MediaPickerFilter } from "./MediaLibraryPicker";
import { cn } from "@/lib/utils";

type AcceptFilter = MediaPickerFilter;

interface CloudinaryUploaderProps {
  /** Single mode: a URL string. Multi mode: newline-separated URLs. */
  value: string;
  onChange: (value: string) => void;
  label?: string;
  folder?: string;
  /** Which file types to accept: "image" | "raw" | "video" | "all". */
  accept?: AcceptFilter;
  /** Multi mode: upload several files at once (value is newline-separated). */
  multiple?: boolean;
  max?: number;
  className?: string;
}

interface QueueItem {
  name: string;
  size: number;
}

/**
 * Shared WordPress-style uploader used across every admin page.
 * Uploads straight to Cloudinary via the reusable service, stores the
 * returned metadata in the media library, and saves the secure URL back
 * through onChange. Supports images, PDFs (raw) and videos, with loading
 * state, upload progress, success feedback and detailed error messages
 * (the actual Cloudinary error is surfaced instead of a generic message).
 */
export default function CloudinaryUploader({
  value,
  onChange,
  label = "Upload File",
  folder = "alaminrafi",
  accept = "image",
  multiple = false,
  max = 12,
  className,
}: CloudinaryUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [copiedUrl, setCopiedUrl] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isMulti = multiple;
  const urls = isMulti
    ? value.split("\n").map((u) => u.trim()).filter(Boolean)
    : [value].filter(Boolean);
  const allowPdf = accept === "all" || accept === "raw";
  const allowVideo = accept === "all" || accept === "video";

  const isAllowed = useCallback(
    (file: File) => {
      if (accept === "image") return file.type.startsWith("image/");
      if (accept === "raw") return file.type === "application/pdf";
      if (accept === "video") return file.type.startsWith("video/");
      if (accept === "all") return true;
      return false;
    },
    [accept]
  );

  const uploadFile = async (file: File): Promise<CloudinaryUploadResult> => {
    const asset = await uploadToCloudinary(file, {
      folder,
      resourceType: detectResourceType(file),
      onProgress: setProgress,
    });
    addToMediaLibrary(fromCloudinaryAsset(asset, file.name));
    return asset;
  };

  const upload = async (file: File) => {
    if (!isAllowed(file)) {
      const expected =
        accept === "image" ? "an image" :
        accept === "raw" ? "a PDF" :
        accept === "video" ? "a video" :
        "an image, PDF or video";
      setError(`Please choose ${expected} file.`);
      return;
    }
    setError("");
    setSuccess("");
    setUploading(true);
    setProgress(0);
    try {
      const asset = await uploadFile(file);
      // Single mode: replacing removes the old asset from Cloudinary.
      if (!isMulti && value && value !== asset.secure_url) {
        await deleteCloudinaryAssetByUrl(value);
      }
      onChange(asset.secure_url || asset.url);
      setSuccess("Uploaded successfully.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter(isAllowed);
    if (!list.length) {
      setError(
        accept === "image" ? "Only image files are allowed here." :
        accept === "raw" ? "Only PDF files are allowed here." :
        accept === "video" ? "Only video files are allowed here." :
        "Only image, PDF or video files are allowed here."
      );
      return;
    }
    setError("");
    setSuccess("");
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
        const asset = await uploadFile(list[i]);
        newUrls.push(asset.secure_url || asset.url);
      }
      if (newUrls.length) {
        onChange([...urls, ...newUrls].join("\n"));
        setSuccess(`${newUrls.length} file${newUrls.length !== 1 ? "s" : ""} uploaded successfully.`);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (!files?.length) return;
    if (isMulti) handleFiles(files);
    else upload(files[0]);
  };

  const remove = async (url?: string) => {
    if (isMulti) {
      const target = url;
      if (target) {
        onChange(urls.filter((u) => u !== target).join("\n"));
        await deleteCloudinaryAssetByUrl(target);
      }
      return;
    }
    const old = value;
    onChange("");
    if (old) await deleteCloudinaryAssetByUrl(old);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(""), 2000);
    });
  };

  const acceptAttr = allowVideo
    ? "image/*,application/pdf,.pdf,video/*"
    : allowPdf
      ? "image/*,application/pdf,.pdf"
      : accept === "video"
        ? "video/*"
        : "image/*";

  const fileLabel = accept === "raw" ? "PDF" : accept === "video" ? "video" : "image";

  const renderThumb = (url: string) => {
    const isPdf = url.toLowerCase().endsWith(".pdf") || /\/raw\/upload\//.test(url);
    const isVideo = /\/video\/upload\//.test(url);
    if (isPdf) {
      return (
        <div className="w-full h-full bg-zinc-100 dark:bg-[#162032] flex items-center justify-center text-red-500">
          <FileText className="w-8 h-8" />
        </div>
      );
    }
    if (isVideo) {
      return (
        <div className="w-full h-full bg-zinc-100 dark:bg-[#162032] flex items-center justify-center text-violet-500">
          <Film className="w-8 h-8" />
        </div>
      );
    }
    return <img src={getOptimizedUrl(url, { width: 400 })} alt="" className="w-full h-full object-cover" loading="lazy" />;
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Existing asset(s) */}
      {urls.length > 0 && (
        isMulti ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-1">
            {urls.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-white/[0.08] group">
                {renderThumb(url)}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  <button type="button" onClick={() => copyUrl(url)} title="Copy URL" className="p-1.5 rounded-lg bg-white/90 text-zinc-800 hover:bg-white">
                    {copiedUrl === url ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Link className="w-3.5 h-3.5" />}
                  </button>
                  <a href={getDownloadUrl(url)} target="_blank" rel="noreferrer" title="Download" className="p-1.5 rounded-lg bg-white/90 text-zinc-800 hover:bg-white">
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  <button type="button" onClick={() => remove(url)} title="Remove" className="p-1.5 rounded-lg bg-white/90 text-red-600 hover:bg-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="relative w-36 h-24 rounded-xl overflow-hidden border border-zinc-200 dark:border-white/[0.08] shrink-0 bg-zinc-100 dark:bg-[#162032]">
              {accept === "raw" || /\/raw\/upload\//.test(value) ? (
                <div className="w-full h-full flex items-center justify-center text-red-500">
                  <FileText className="w-10 h-10" />
                </div>
              ) : (
                <img src={getOptimizedUrl(value, { width: 400 })} alt="" className="w-full h-full object-cover" />
              )}
              <button
                type="button"
                onClick={() => remove()}
                title={`Remove ${fileLabel}`}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded to Cloudinary
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 truncate">{value}</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Replace {fileLabel === "image" ? "Image" : fileLabel === "PDF" ? "PDF" : "Video"}
                </button>
                <a
                  href={getDownloadUrl(value)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-200 dark:hover:bg-white/[0.1] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-200 dark:hover:bg-white/[0.1] transition-colors"
                >
                  <LibraryBig className="w-3.5 h-3.5" /> From Library
                </button>
              </div>
            </div>
          </div>
        )
      )}

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all",
          dragOver
            ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
            : "border-zinc-200 dark:border-white/[0.08] hover:border-violet-300 dark:hover:border-violet-800/40"
        )}
      >
        <input
          ref={fileRef}
          type="file"
          accept={acceptAttr}
          multiple={isMulti}
          className="hidden"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length) {
              if (isMulti) handleFiles(files);
              else upload(files[0]);
            }
          }}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              {queue[0] ? `Uploading "${queue[0].name}"...` : `Uploading ${fileLabel} to Cloudinary...`} {progress}%
            </p>
            <div className="w-full max-w-[200px] h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <CloudUpload className="w-4 h-4" />
            <span className="font-medium">{urls.length > 0 && !isMulti ? `Replace ${label.toLowerCase()}` : label}</span>
            <span className="text-zinc-400">· drag & drop or click</span>
          </div>
        )}
      </div>

      {/* Success message */}
      {success && !uploading && (
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" /> {success}
        </div>
      )}

      {/* Detailed error message (surfaces the actual Cloudinary error) */}
      {error && !uploading && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}

      {!isMulti && urls.length === 0 && (
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-200 dark:hover:bg-white/[0.1] transition-colors"
        >
          <LibraryBig className="w-3.5 h-3.5" /> Choose from Media Library
        </button>
      )}

      <MediaLibraryPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        mode={isMulti ? "multi" : "single"}
        filter={accept}
        title={`Select ${fileLabel}${isMulti ? "(s)" : ""} from Media Library`}
        onSelect={(picked) => {
          if (isMulti) {
            const merged = [...urls, ...picked.filter((u) => !urls.includes(u))].slice(0, max);
            onChange(merged.join("\n"));
          } else {
            if (value && picked[0] !== value) deleteCloudinaryAssetByUrl(value);
            onChange(picked[0]);
          }
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
