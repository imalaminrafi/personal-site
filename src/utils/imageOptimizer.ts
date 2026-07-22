export interface OptimizedImage {
  dataUrl: string;
  width: number;
  height: number;
  size: number;
  type: string;
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function optimizeImage(
  file: File,
  options: { maxWidth?: number; maxHeight?: number; quality?: number; format?: "image/webp" | "image/jpeg" | "image/png" } = {}
): Promise<OptimizedImage> {
  const { maxWidth = 1920, maxHeight = 1920, quality = 0.8, format = "image/webp" } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      if (w > maxWidth) { h = Math.round((h * maxWidth) / w); w = maxWidth; }
      if (h > maxHeight) { w = Math.round((w * maxHeight) / h); h = maxHeight; }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error("Canvas toBlob failed")); return; }
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              dataUrl: reader.result as string,
              width: w,
              height: h,
              size: blob.size,
              type: blob.type,
            });
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        },
        format,
        quality
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function createThumbnail(file: File, size = 150): Promise<OptimizedImage> {
  return optimizeImage(file, { maxWidth: size, maxHeight: size, quality: 0.6, format: "image/webp" });
}

export function createMediumImage(file: File): Promise<OptimizedImage> {
  return optimizeImage(file, { maxWidth: 768, maxHeight: 768, quality: 0.75, format: "image/webp" });
}

export function createLargeImage(file: File): Promise<OptimizedImage> {
  return optimizeImage(file, { maxWidth: 1920, maxHeight: 1920, quality: 0.85, format: "image/webp" });
}

export function humanFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0) + " " + units[i];
}

export function getGoogleDriveDirectUrl(shareLink: string): string {
  const match = shareLink.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  return shareLink;
}

export function isGoogleDriveLink(url: string): boolean {
  return url.includes("drive.google.com");
}

export function generateLazyLoadingAttributes() {
  return { loading: "lazy" as const, decoding: "async" as const };
}
