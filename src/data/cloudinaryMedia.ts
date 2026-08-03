import type { CloudinaryUploadResult } from "@/services/cloudinaryUpload";
import { isCloudinaryUrl } from "@/utils/cloudinary";

export interface MediaLibraryItem {
  id: string;
  name: string;
  url: string;
  publicId: string;
  folder: string;
  type: "image" | "raw" | "video";
  size: number;
  width: number;
  height: number;
  format: string;
  createdAt: string;
}

const STORAGE_KEY = "ar_cloudinary_media";

const defaultItems: MediaLibraryItem[] = [];

export function loadMediaLibrary(): MediaLibraryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [...defaultItems];
  } catch {
    return [...defaultItems];
  }
}

export function saveMediaLibrary(items: MediaLibraryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addToMediaLibrary(item: MediaLibraryItem) {
  const current = loadMediaLibrary();
  if (current.some((i) => i.publicId === item.publicId && i.publicId)) return;
  saveMediaLibrary([item, ...current]);
}

export function fromCloudinaryAsset(asset: CloudinaryUploadResult, fallbackName = ""): MediaLibraryItem {
  return {
    id: asset.public_id || `m${Date.now()}`,
    name: fallbackName || asset.public_id.split("/").pop() || asset.public_id || "Untitled",
    url: asset.secure_url || asset.url,
    publicId: asset.public_id,
    folder: asset.folder || "",
    type: asset.resource_type || "image",
    size: asset.bytes,
    width: asset.width,
    height: asset.height,
    format: asset.format,
    createdAt: asset.created_at,
  };
}

export function getMediaFolders(): string[] {
  const items = loadMediaLibrary();
  const folders = new Set<string>();
  items.forEach((i) => {
    if (i.folder) folders.add(i.folder);
    const parts = (i.publicId || "").split("/");
    if (parts.length > 1) folders.add(parts.slice(0, -1).join("/"));
  });
  return [...folders].sort();
}

export function findInMediaLibrary(url: string): MediaLibraryItem | undefined {
  const items = loadMediaLibrary();
  return items.find((i) => i.url === url || (isCloudinaryUrl(url) && i.publicId === getPublicIdFrom(url)));
}

function getPublicIdFrom(url: string): string {
  const match = url.match(/\/(image|video|raw)\/upload\/(?:v\d+\/)?(.+)$/);
  return match ? decodeURIComponent(match[2].replace(/\.[a-z0-9]{1,5}$/i, "")) : "";
}
