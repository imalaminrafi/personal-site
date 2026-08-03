/**
 * Cloudinary media delivery helpers.
 *
 * These functions ONLY build/optimize delivery URLs for assets that are
 * already stored in Cloudinary. Uploads are handled by the dedicated
 * service in `src/services/cloudinaryUpload.ts`.
 *
 * Delivery only needs the public Cloud Name (never the API secret), read
 * from VITE_CLOUDINARY_CLOUD_NAME. The upload preset is only used by the
 * upload service and is never hardcoded here.
 */

/** Public Cloud Name for delivery URL building, or "" when unconfigured. */
export function getCloudinaryCloudName(): string {
  return (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string) || "";
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
 * Return the base Cloudinary delivery URL for a public ID, without
 * transformations. Safe to call for both full URLs and public IDs.
 */
export function getBaseDeliveryUrl(input: string): string {
  if (isCloudinaryUrl(input)) {
    const publicId = getPublicIdFromUrl(input);
    const cloudName =
      input.match(/res\.cloudinary\.com\/([^/]+)\//)?.[1] ||
      getCloudinaryCloudName();
    return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
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
  return `https://res.cloudinary.com/${getCloudinaryCloudName()}/video/upload/${parts.join(",")}/${publicId}`;
}

/** Future-ready: raw asset (PDF, ebook, course file) delivery URL. */
export function getRawUrl(publicId: string): string {
  return `https://res.cloudinary.com/${getCloudinaryCloudName()}/raw/upload/${publicId}`;
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
