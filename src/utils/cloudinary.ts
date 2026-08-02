/**
 * Cloudinary media management layer.
 *
 * SECURITY NOTE:
 * The API secret is NEVER exposed in the frontend bundle. Uploads use an
 * unsigned upload preset, which only requires the Cloud Name + preset.
 * Deletion requires the API secret and must go through a serverless
 * function. Set VITE_CLOUDINARY_DELETE_URL to a deployed endpoint
 * (see /api/cloudinary-delete.*) to enable real deletion. Without it,
 * assets are removed from the local media library but kept on Cloudinary.
 */

export const CLOUDINARY_CONFIG = {
  cloudName: (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string) || "root",
  uploadPreset: (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string) || "alaminrafi_upload",
  folder: (import.meta.env.VITE_CLOUDINARY_FOLDER as string) || "alaminrafi",
  /** Endpoint of an optional serverless function that performs signed deletes. */
  deleteUrl: (import.meta.env.VITE_CLOUDINARY_DELETE_URL as string) || "",
};

export interface CloudinaryAsset {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  resourceType: string;
  createdAt: string;
  folder: string;
}

export interface UploadOptions {
  folder?: string;
  publicId?: string;
  resourceType?: "image" | "raw" | "video" | "auto";
  tags?: string[];
  onProgress?: (percent: number) => void;
  /** Keep true unless the preset itself already forces this behaviour. */
  eager?: boolean;
}

export const isCloudinaryUrl = (url: string): boolean =>
  /res\.cloudinary\.com\/[^/]+\/(image|video|raw)\/upload/.test(url || "");

/** Extract the public ID from a Cloudinary URL. */
export function getPublicIdFromUrl(url: string): string {
  if (!isCloudinaryUrl(url)) return "";
  const match = url.match(/\/(image|video|raw)\/upload\/(?:v\d+\/)?(.+)$/);
  if (!match) return "";
  return decodeURIComponent(match[2].replace(/\.[a-z0-9]{1,5}$/i, ""));
}

/**
 * Upload a file directly to Cloudinary using an unsigned preset.
 * The API secret is never involved in this flow.
 */
export function uploadToCloudinary(
  file: File,
  options: UploadOptions = {}
): Promise<CloudinaryAsset> {
  const { folder = CLOUDINARY_CONFIG.folder, publicId, resourceType = "auto", tags = [], onProgress, eager = true } = options;

  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
    form.append("folder", folder);
    if (publicId) form.append("public_id", publicId);
    if (tags.length) form.append("tags", tags.join(","));
    // Auto-generate WebP/AVIF + resized variants for fast delivery.
    if (eager) {
      form.append("eager", [
        "w_400,c_limit,q_auto,f_auto",
        "w_800,c_limit,q_auto,f_auto",
        "w_1200,c_limit,q_auto,f_auto",
        "w_1600,c_limit,q_auto,f_auto",
      ].join("|"));
      form.append("eager_async", "true");
    }

    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${resourceType === "auto" ? "image" : resourceType}/upload`;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(normalizeAsset(data));
        } catch (err) {
          reject(new Error("Cloudinary returned an invalid response."));
        }
      } else {
        let msg = `Cloudinary upload failed (${xhr.status}).`;
        try {
          const data = JSON.parse(xhr.responseText);
          if (data?.error?.message) msg = data.error.message;
        } catch { /* keep default */ }
        reject(new Error(msg));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload. Please try again."));
    xhr.send(form);
  });
}

interface CloudinaryUploadResponse {
  public_id?: string;
  url?: string;
  secure_url?: string;
  width?: number | string;
  height?: number | string;
  bytes?: number | string;
  format?: string;
  resource_type?: string;
  created_at?: string;
}

function normalizeAsset(data: CloudinaryUploadResponse): CloudinaryAsset {
  return {
    publicId: data.public_id || "",
    url: data.url || data.secure_url || "",
    secureUrl: data.secure_url || data.url || "",
    width: Number(data.width) || 0,
    height: Number(data.height) || 0,
    bytes: Number(data.bytes) || 0,
    format: data.format || "",
    resourceType: data.resource_type || "image",
    createdAt: data.created_at || new Date().toISOString(),
    folder: (data.public_id || "").includes("/")
      ? (data.public_id || "").split("/").slice(0, -1).join("/")
      : "",
  };
}

/**
 * Delete an asset from Cloudinary. Requires a serverless endpoint because
 * the API secret must never ship to the browser.
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!CLOUDINARY_CONFIG.deleteUrl) {
    console.warn(
      "[cloudinary] Deletion skipped: no VITE_CLOUDINARY_DELETE_URL configured. " +
      "The API secret cannot be used in the browser."
    );
    return false;
  }
  try {
    const res = await fetch(CLOUDINARY_CONFIG.deleteUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data?.result === "ok";
  } catch {
    return false;
  }
}

/** Delete an asset by its full URL (extracts the public ID first). */
export async function deleteAssetByUrl(url: string): Promise<boolean> {
  const publicId = getPublicIdFromUrl(url);
  if (!publicId) return false;
  return deleteFromCloudinary(publicId);
}

/**
 * Return the base Cloudinary delivery URL for a public ID, without
 * transformations. Safe to call for both full URLs and public IDs.
 */
export function getBaseDeliveryUrl(input: string): string {
  if (isCloudinaryUrl(input)) {
    const publicId = getPublicIdFromUrl(input);
    return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${publicId}`;
  }
  return input;
}

export interface TransformOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "limit" | "crop" | "pad" | "scale";
  quality?: "auto" | number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png" | string;
  fetchFormat?: boolean;
  radius?: number;
  flags?: string[];
  dpr?: number;
}

const TRANSFORM_WHITELIST = /^(https?:\/\/|data:|blob:|\/)/;

/**
 * Build an optimized Cloudinary URL from any supported input
 * (Cloudinary URL, public ID, or any absolute/local URL).
 * Non-Cloudinary sources are passed through untouched so the rest of the
 * site keeps working even before assets are migrated.
 */
export function getOptimizedUrl(input: string, opts: TransformOptions = {}): string {
  if (!input) return input;
  if (!isCloudinaryUrl(input)) return input;
  if (!TRANSFORM_WHITELIST.test(input)) return input;

  const parts: string[] = [];

  if (opts.width) parts.push(`w_${Math.round(opts.width)}`);
  if (opts.height) parts.push(`h_${Math.round(opts.height)}`);
  if (opts.crop) parts.push(`c_${opts.crop}`);
  if (opts.dpr) parts.push(`dpr_${opts.dpr}`);
  if (opts.radius) parts.push(`r_${opts.radius}`);

  const quality = opts.quality === "auto" ? "q_auto" : typeof opts.quality === "number" ? `q_${opts.quality}` : "q_auto";
  parts.push(quality);

  const format = opts.format === "auto" || (!opts.format && opts.fetchFormat) ? "f_auto" : opts.format ? `f_${opts.format}` : "f_auto";
  parts.push(format);

  if (opts.flags?.length) parts.push(...opts.flags.map((f) => `fl_${f}`));

  if (!parts.length) return input;

  const base = getBaseDeliveryUrl(input);
  const [prefix, publicId] = base.split(/\/image\/upload\//);
  return `${prefix}/image/upload/${parts.join(",")}/${publicId}`;
}

/** Shortcut for square-cropped thumbnails. */
export function getThumbnailUrl(input: string, size = 300): string {
  return getOptimizedUrl(input, { width: size, height: size, crop: "fill", quality: "auto", format: "auto" });
}

/** Shortcut for constrained-width delivery (retains aspect ratio). */
export function getResizedUrl(input: string, width: number): string {
  return getOptimizedUrl(input, { width, crop: "limit", quality: "auto", format: "auto" });
}

const SRC_SIZES = [400, 800, 1200, 1600];

/** Build a responsive `srcSet` string from a Cloudinary URL. */
export function getSrcSet(input: string): string {
  if (!isCloudinaryUrl(input)) return "";
  return SRC_SIZES
    .map((w) => `${getOptimizedUrl(input, { width: w, crop: "limit", quality: "auto", format: "auto" })} ${w}w`)
    .join(", ");
}

/** Build a `sizes` attribute for the given breakpoints. */
export function getSizes(defaultSize = "100vw"): string {
  return defaultSize;
}

/** Future-ready: video delivery URL with automatic optimization. */
export function getVideoUrl(publicId: string, opts: { width?: number } = {}): string {
  const parts = ["q_auto", "f_auto"];
  if (opts.width) parts.unshift(`w_${opts.width}`);
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/video/upload/${parts.join(",")}/${publicId}`;
}

/** Future-ready: raw asset (PDF, ebook, course file) delivery URL. */
export function getRawUrl(publicId: string): string {
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/raw/upload/${publicId}`;
}

/**
 * Build a Cloudinary URL that forces download (Content-Disposition
 * attachment) for images and raw files. Falls back to the input URL.
 */
export function getDownloadUrl(input: string): string {
  if (!isCloudinaryUrl(input)) return input;
  const [before, rest] = input.split(/\/upload\//);
  const isRaw = /\/raw\//.test(before + "/");
  return `${before}/upload/fl_attachment/${rest}`;
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}
