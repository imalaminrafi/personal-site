export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  createdAt: string;
}

const STORAGE_KEY = "ar_gallery";
const CATEGORIES = ["Seminar", "Office", "Client Work", "Events", "Certificates"];

export { CATEGORIES };

const defaults: GalleryItem[] = [
  { id: "g1", src: "", alt: "Office workspace", category: "Office", createdAt: "2026-04-01T10:00:00Z" },
  { id: "g2", src: "", alt: "Web development seminar", category: "Seminar", createdAt: "2026-03-15T10:00:00Z" },
  { id: "g3", src: "", alt: "Client project showcase", category: "Client Work", createdAt: "2026-02-20T10:00:00Z" },
  { id: "g4", src: "", alt: "Team event", category: "Events", createdAt: "2026-01-10T10:00:00Z" },
];

export function loadGallery(): GalleryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaults;
  } catch { return defaults; }
}

export function saveGallery(list: GalleryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
