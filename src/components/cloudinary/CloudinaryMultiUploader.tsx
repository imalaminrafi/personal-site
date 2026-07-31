import { useState, useRef } from "react";
import { Upload, X, Loader2, ImagePlus, CheckCircle2 } from "lucide-react";
import { uploadToCloudinary, deleteAssetByUrl, getOptimizedUrl } from "@/utils/cloudinary";
import { addToMediaLibrary, fromCloudinaryAsset } from "@/data/cloudinaryMedia";

interface CloudinaryMultiUploaderProps {
  /** Newline-separated list of image URLs */
  value: string;
  onChange: (newlineSeparatedUrls: string) => void;
  label?: string;
  folder?: string;
  max?: number;
}

export default function CloudinaryMultiUploader({
  value,
  onChange,
  label = "Images",
  folder = "alaminrafi",
  max = 12,
}: CloudinaryMultiUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const urls = value.split("\n").map((u) => u.trim()).filter(Boolean);

  const handleFiles = async (files: FileList | File[]) => {
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (urls.length + newUrls.length >= max) break;
      try {
        const asset = await uploadToCloudinary(file, { folder });
        addToMediaLibrary(fromCloudinaryAsset(asset, file.name));
        newUrls.push(asset.secureUrl || asset.url);
      } catch {
        /* skip failed uploads */
      }
    }
    if (newUrls.length) {
      onChange([...urls, ...newUrls].join("\n"));
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = async (url: string) => {
    onChange(urls.filter((u) => u !== url).join("\n"));
    await deleteAssetByUrl(url);
  };

  return (
    <div>
      {urls.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
          {urls.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-white/[0.08] group">
              <img src={getOptimizedUrl(url, { width: 400 })} alt="" className="w-full h-full object-cover" loading="lazy" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files); }}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
          dragOver
            ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
            : "border-zinc-200 dark:border-white/[0.08] hover:border-violet-300 dark:hover:border-violet-800/40"
        }`}
      >
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
            <Loader2 className="w-4 h-4 animate-spin text-violet-500" /> Uploading to Cloudinary...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <ImagePlus className="w-4 h-4" />
            <span className="font-medium">Add {label.toLowerCase()}</span>
            <span className="text-zinc-400">· drag & drop or click</span>
          </div>
        )}
      </div>
    </div>
  );
}
