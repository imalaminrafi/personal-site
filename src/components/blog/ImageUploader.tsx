import { useState, useRef } from "react";
import { Upload, Link, HardDrive, Trash2, Image as ImageIcon } from "lucide-react";
import { readFileAsDataURL, getGoogleDriveDirectUrl, isGoogleDriveLink } from "@/utils/imageOptimizer";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ value, onChange, label = "Image" }: ImageUploaderProps) {
  const [tab, setTab] = useState<"upload" | "url" | "drive">("upload");
  const [preview, setPreview] = useState(value);
  const [urlInput, setUrlInput] = useState("");
  const [driveInput, setDriveInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    readFileAsDataURL(file).then(onChange);
  }

  function handleUrl() {
    if (urlInput.trim()) onChange(urlInput.trim());
  }

  function handleDrive() {
    if (driveInput.trim()) {
      const direct = getGoogleDriveDirectUrl(driveInput.trim());
      onChange(direct);
    }
  }

  function handleRemove() {
    onChange("");
    setUrlInput("");
    setDriveInput("");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1 bg-zinc-100 dark:bg-[#1E293B] rounded-lg p-0.5 w-fit">
        {(["upload", "url", "drive"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors capitalize ${
              tab === t ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {t === "upload" && <Upload className="w-3 h-3" />}
            {t === "url" && <Link className="w-3 h-3" />}
            {t === "drive" && <HardDrive className="w-3 h-3" />}
            {t}
          </button>
        ))}
      </div>

      {tab === "upload" && (
        <div className="border-2 border-dashed border-zinc-200 dark:border-[#1E3A5F] rounded-xl p-6 text-center">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <ImageIcon className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">Drop an image or click to browse</p>
          <button type="button" onClick={() => fileRef.current?.click()} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors">Choose File</button>
        </div>
      )}

      {tab === "url" && (
        <div className="flex gap-2">
          <input type="text" placeholder="Paste image URL..." value={urlInput} onChange={(e) => setUrlInput(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none" />
          <button type="button" onClick={handleUrl} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors">Set</button>
        </div>
      )}

      {tab === "drive" && (
        <div className="flex gap-2">
          <input type="text" placeholder="Paste Google Drive share link..." value={driveInput} onChange={(e) => setDriveInput(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] text-sm focus:outline-none" />
          <button type="button" onClick={handleDrive} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors">Convert</button>
        </div>
      )}

      {value && (
        <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-zinc-200 dark:border-[#1E3A5F]">
          {isGoogleDriveLink(value) ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          ) : (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          )}
          <button type="button" onClick={handleRemove} className="absolute top-1 right-1 w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center"><Trash2 className="w-3 h-3" /></button>
        </div>
      )}
    </div>
  );
}
