export interface Book {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cover: string;
  price: string;
  priceNote: string;
  buyUrl: string;
  previewUrl: string;
  category: string;
  pages: number;
  rating: number;
  featured: boolean;
  published: boolean;
  createdAt: string;
}

const STORAGE_KEY = "ar_books";

const defaults: Book[] = [
  {
    id: "b1",
    title: "Build a Profitable Web Business",
    subtitle: "From Zero to Freelance Success",
    description: "A practical roadmap to starting a freelance web design & development business — pricing, clients, portfolios, and scaling without burning out.",
    cover: "",
    price: "$9.99",
    priceNote: "One-time purchase · Instant PDF",
    buyUrl: "https://payhip.com",
    previewUrl: "",
    category: "Business",
    pages: 120,
    rating: 4.8,
    featured: true,
    published: true,
    createdAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "b2",
    title: "Modern Website Design Guide",
    subtitle: "UX, UI & Conversion Essentials",
    description: "Learn how modern, high-converting websites are designed — layouts, color, typography, mobile-first thinking, and performance.",
    cover: "",
    price: "$7.99",
    priceNote: "One-time purchase · Instant PDF",
    buyUrl: "https://payhip.com",
    previewUrl: "",
    category: "Design",
    pages: 95,
    rating: 4.9,
    featured: true,
    published: true,
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "b3",
    title: "WordPress for Small Business",
    subtitle: "Launch Your Site in a Weekend",
    description: "Step-by-step WordPress setup for small businesses — hosting, themes, plugins, speed, SEO, and keeping your site secure.",
    cover: "",
    price: "$5.99",
    priceNote: "One-time purchase · Instant PDF",
    buyUrl: "https://payhip.com",
    previewUrl: "",
    category: "WordPress",
    pages: 80,
    rating: 4.7,
    featured: false,
    published: true,
    createdAt: "2025-11-20T10:00:00Z",
  },
];

export function loadBooks(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaults;
  } catch { return defaults; }
}

export function getPublishedBooks(): Book[] {
  return loadBooks().filter((b) => b.published);
}

export function getFeaturedBooks(): Book[] {
  return loadBooks().filter((b) => b.published && b.featured);
}

export function saveBooks(list: Book[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
