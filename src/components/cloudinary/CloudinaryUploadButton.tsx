import { useRef, useState } from "react";
import {
  Upload, Loader2, X, CheckCircle2, RefreshCw, CloudUpload, FileText,
  Download, LibraryBig
} from "lucide-react";
import {
  uploadToCloudinary, deleteAssetByUrl, getOptimizedUrl, formatBytes
} from "@/utils/cloudinary";
import { addToMediaLibrary, fromCloudinaryAsset } from "@/data/cloudinaryMedia";
import MediaLibraryPicker, { MediaPickerFilter } from "./MediaLibraryPicker";

interface CloudinaryUploadButtonProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  className?: string;
  acceptType?: MediaPickerFilter;
}

/**
 * WordPress-style single asset uploader. Uploads straight to Cloudinary,
 * saves the secure URL, and (when replacing/removing) deletes the old
 * asset from Cloudinary. Pass acceptType="raw" to upload PDFs.
 */
export default function CloudinaryUploadButton({
  value,
  onChange,
  label = "Upload Image",
  folder = "alaminrafi",
  acceptType = "image",
}: CloudinaryUploadButtonProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isRaw = acceptType === "raw";

  const upload = async (file: File) => {
    if (isRaw && file.type !== "application/pdf") {
      setError("Please choose a PDF file.");
      return;
    }
    if (!isRaw && !file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setError("");
    setUploading(true);
    setProgress(0);
    try {
      const asset = await uploadToCloudinary(file, {
        folder,
        resourceType: isRaw ? "raw" : "image",
        onProgress: setProgress,
      });
      addToMediaLibrary(fromCloudinaryAsset(asset, file.name));
      // Replacing: remove the old asset from Cloudinary automatically.
      if (value && value !== asset.secureUrl) {
        await deleteAssetByUrl(value);
      }
      onChange(asset.secureUrl || asset.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const remove = async () => {
    const old = value;
    onChange("");
    if (old) await deleteAssetByUrl(old);
  };

  const acceptAttr = isRaw ? "application/pdf,.pdf" : "image/*";

  return (
    <div className="space-y-3">
      {value ? (
        isRaw ? (
          /* PDF / raw file card */
          <div className="flex items-center gap-4">
            <div className="relative w-36 h-24 rounded-xl border border-zinc-200 dark:border-white/[0.08] shrink-0 bg-zinc-100 dark:bg-[#162032] flex items-center justify-center">
              <FileText className="w-10 h-10 text-red-500" />
              <button
                type="button"
                onClick={remove}
                title="Remove PDF"
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Stored in Cloudinary
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 truncate">{value}</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Replace PDF
                </button>
                <a
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-200 dark:hover:bg-white/[0.1] transition-colors"
                >
                  <Download className="w-3 h-3" /> Download
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Image preview */
          <div className="flex items-center gap-4">
            <div className="relative w-36 h-24 rounded-xl overflow-hidden border border-zinc-200 dark:border-white/[0.08] shrink-0 bg-zinc-100 dark:bg-[#162032]">
              <img
                src={getOptimizedUrl(value, { width: 400 })}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={remove}
                title="Remove image"
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
                  <RefreshCw className="w-3 h-3" /> Replace Image
                </button>
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-200 dark:hover:bg-white/[0.1] transition-colors"
                >
                  <LibraryBig className="w-3 h-3" /> From Library
                </button>
              </div>
            </div>
          </div>
        )
      ) : (
        <>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) upload(file);
            }}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
              dragOver
                ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                : "border-zinc-200 dark:border-white/[0.08] hover:border-violet-300 dark:hover:border-violet-800/40"
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept={acceptAttr}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) upload(file);
              }}
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
                <p className="text-xs text-zinc-500 font-medium">Uploading to Cloudinary... {progress}%</p>
                <div className="w-full max-w-[160px] h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <CloudUpload className="w-4 h-4" />
                <span className="font-medium">{label}</span>
                <span className="text-zinc-400">· drag & drop or click</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-200 dark:hover:bg-white/[0.1] transition-colors"
          >
            <LibraryBig className="w-3.5 h-3.5" /> Choose from Media Library
          </button>
        </>
      )}
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

      <MediaLibraryPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        mode="single"
        filter={isRaw ? "raw" : "image"}
        title={`Select ${isRaw ? "PDF" : "Image"} from Media Library`}
        onSelect={(urls) => {
          if (value && urls[0] !== value) deleteAssetByUrl(value);
          onChange(urls[0]);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
