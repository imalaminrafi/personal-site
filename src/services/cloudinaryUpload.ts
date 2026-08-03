/**
 * Reusable Cloudinary Upload Service.
 *
 * SECURITY NOTE:
 * The API secret is NEVER exposed in the frontend bundle. Uploads use an
 * unsigned upload preset, which only requires the Cloud Name + preset —
 * both read from environment variables. The preset is never hardcoded.
 *
 * Deletion requires the API secret and must go through a serverless
 * function. Set VITE_CLOUDINARY_DELETE_URL to a deployed endpoint
 * (see /api/cloudinary-delete.mjs) to enable real deletion. Without it,
 * assets are removed from the local media library but kept on Cloudinary.
 *
 * Environment variables used:
 *   VITE_CLOUDINARY_CLOUD_NAME     (required)
 *   VITE_CLOUDINARY_UPLOAD_PRESET  (required, must be unsigned)
 *   VITE_CLOUDINARY_DELETE_URL     (optional, serverless delete endpoint)
 */

import { isCloudinaryUrl, getPublicIdFromUrl } from "@/utils/cloudinary";

export interface CloudinaryUploadResult {
  secure_url: string;
  url: string;
  public_id: string;
  resource_type: "image" | "raw" | "video";
  format: string;
  bytes: number;
  width: number;
  height: number;
  created_at: string;
  folder: string;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  resourceType?: "image" | "raw" | "video" | "auto";
  onProgress?: (percent: number) => void;
}

const MISSING_CONFIG_MESSAGE =
  "Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and " +
  "VITE_CLOUDINARY_UPLOAD_PRESET to your .env file, then restart the dev " +
  "server.";

/**
 * Read Cloudinary config from environment variables.
 * Throws a friendly error (instead of "Upload preset not found") when a
 * required variable is missing.
 */
export function getCloudinaryConfig(): { cloudName: string; uploadPreset: string } {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const missing: string[] = [];
  if (!cloudName) missing.push("VITE_CLOUDINARY_CLOUD_NAME");
  if (!uploadPreset) missing.push("VITE_CLOUDINARY_UPLOAD_PRESET");

  if (missing.length) {
    throw new Error(
      `Cloudinary is not configured. Missing: ${missing.join(", ")}. ` +
      `Add them to your .env file, then restart the dev server.`
    );
  }

  return { cloudName, uploadPreset };
}

/** Detect the Cloudinary resource type from a file's MIME type. */
export function detectResourceType(file: File): "image" | "raw" | "video" {
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("image/")) return "image";
  return "raw";
}

/**
 * Upload a file directly to Cloudinary using an unsigned preset.
 * Supports images, PDFs (raw) and videos.
 *
 * Resolves with the asset metadata returned by Cloudinary:
 *   secure_url, public_id, resource_type, format, bytes (+ extras)
 *
 * If Cloudinary returns an error, the exact Cloudinary error message is
 * surfaced instead of a generic "Upload preset not found".
 */
export function uploadToCloudinary(
  file: File,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> {
  const { cloudName, uploadPreset } = getCloudinaryConfig();
  const { folder = "", onProgress } = options;

  const resourceType =
    !options.resourceType || options.resourceType === "auto"
      ? detectResourceType(file)
      : options.resourceType;

  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", uploadPreset);
    if (folder) form.append("folder", folder);

    // Auto-generate WebP/AVIF + resized variants for fast delivery (images only).
    if (resourceType === "image") {
      form.append("eager", [
        "w_400,c_limit,q_auto,f_auto",
        "w_800,c_limit,q_auto,f_auto",
        "w_1200,c_limit,q_auto,f_auto",
        "w_1600,c_limit,q_auto,f_auto",
      ].join("|"));
      form.append("eager_async", "true");
    }

    const endpoint =
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

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
          resolve(normalizeResult(JSON.parse(xhr.responseText)));
        } catch {
          reject(new Error("Cloudinary returned an invalid response."));
        }
      } else {
        reject(new Error(readCloudinaryError(xhr.responseText, xhr.status)));
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

function normalizeResult(data: CloudinaryUploadResponse): CloudinaryUploadResult {
  const publicId = data.public_id || "";
  return {
    public_id: publicId,
    url: data.url || data.secure_url || "",
    secure_url: data.secure_url || data.url || "",
    width: Number(data.width) || 0,
    height: Number(data.height) || 0,
    bytes: Number(data.bytes) || 0,
    format: data.format || "",
    resource_type: (data.resource_type as CloudinaryUploadResult["resource_type"]) || "image",
    created_at: data.created_at || new Date().toISOString(),
    folder: publicId.includes("/")
      ? publicId.split("/").slice(0, -1).join("/")
      : "",
  };
}

/** Extract the actual Cloudinary error message from an upload response. */
function readCloudinaryError(responseText: string, status: number): string {
  try {
    const data = JSON.parse(responseText);
    if (data?.error?.message) {
      return String(data.error.message);
    }
  } catch {
    /* non-JSON response, fall through to generic message */
  }
  return `Cloudinary upload failed (${status}). Please try again.`;
}

/**
 * Delete an asset from Cloudinary. Requires a serverless endpoint because
 * the API secret must never ship to the browser.
 */
export async function deleteCloudinaryAsset(publicId: string): Promise<boolean> {
  const deleteUrl = import.meta.env.VITE_CLOUDINARY_DELETE_URL;
  if (!deleteUrl) {
    console.warn(
      "[cloudinary] Deletion skipped: no VITE_CLOUDINARY_DELETE_URL configured. " +
      "The API secret cannot be used in the browser."
    );
    return false;
  }
  try {
    const res = await fetch(deleteUrl, {
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
export async function deleteCloudinaryAssetByUrl(url: string): Promise<boolean> {
  const publicId = getPublicIdFromUrl(url);
  if (!publicId || !isCloudinaryUrl(url)) return false;
  return deleteCloudinaryAsset(publicId);
}
