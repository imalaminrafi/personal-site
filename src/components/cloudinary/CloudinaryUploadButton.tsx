import { useRef, useState } from "react";
import { Upload, Loader2, X, CheckCircle2, RefreshCw, CloudUpload } from "lucide-react";
import { uploadToCloudinary, deleteAssetByUrl, getOptimizedUrl, isCloudinaryUrl } from "@/utils/cloudinary";
import { addToMediaLibrary, fromCloudinaryAsset } from "@/data/cloudinaryMedia";

interface CloudinaryUploadButtonProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  className?: string;
}

/**
 * WordPress-style single image uploader. Uploads straight to Cloudinary,
 * saves the secure URL, and (when replacing/removing) deletes the old
 * asset from Cloudinary.
 */
export default function CloudinaryUploadButton({
  value,
  onChange,
  label = "Upload Image",
  folder = "alaminrafi",
}: CloudinaryUploadButtonProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const isCloudinary = isCloudinaryUrl(value);

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setError("");
    setUploading(true);
    setProgress(0);
    try {
      const asset = await uploadToCloudinary(file, { folder, onProgress: setProgress });
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

  return (
    <div className="space-y-3">
      {value ? (
        <div className="flex items-center gap-4">
          <div className="relative w-36 h-24 rounded-xl overflow-hidden border border-zinc-200 dark:border-white/[0.08] shrink-0 bg-zinc-100 dark:bg-zinc-900">
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
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Replace Image
            </button>
          </div>
        </div>
      ) : (
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
            accept="image/*"
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
      )}
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
