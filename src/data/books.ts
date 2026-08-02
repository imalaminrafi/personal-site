export interface BookReview {
  id: string;
  name: string;
  country: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

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
  /** Base rating, used only as a fallback when no reviews exist. */
  rating: number;
  reviews: BookReview[];
  featured: boolean;
  published: boolean;
  createdAt: string;
}

const STORAGE_KEY = "ar_books";

/** Temporary placeholder reviews from European clients (first name + last name). */
const seedReviews: BookReview[] = [
  { id: "br1", name: "Lucas Schneider", country: "Germany", rating: 5, text: "Very practical and easy to follow. Helped me build my first client website.", date: "2026-02-14", verified: true },
  { id: "br2", name: "Emma Johansson", country: "Sweden", rating: 5, text: "Excellent resource. Clean explanations and modern workflow.", date: "2026-01-28", verified: true },
  { id: "br3", name: "Daniel Fischer", country: "Austria", rating: 5, text: "Perfect for beginners.", date: "2026-01-10", verified: true },
  { id: "br4", name: "Sophie Dubois", country: "France", rating: 5, text: "Clear, concise, and genuinely useful. I recommended it to my whole team.", date: "2025-12-19", verified: true },
  { id: "br5", name: "Lars Andersen", country: "Denmark", rating: 5, text: "Great structure. I finished the whole guide in a weekend and launched a site for a local shop.", date: "2025-12-02", verified: true },
  { id: "br6", name: "Olivia Vermeulen", country: "Netherlands", rating: 5, text: "Exactly what I needed. The pricing section alone paid for the book.", date: "2025-11-15", verified: true },
  { id: "br7", name: "Mikkel Berg", country: "Norway", rating: 5, text: "Well written with real examples. My first freelance client came from following this guide.", date: "2025-10-30", verified: true },
  { id: "br8", name: "Nina Virtanen", country: "Finland", rating: 5, text: "Comprehensive yet easy to digest. Saved me weeks of trial and error.", date: "2025-10-08", verified: true },
  { id: "br9", name: "Thomas Meier", country: "Switzerland", rating: 5, text: "High-quality content. The templates are a real time saver.", date: "2025-09-21", verified: true },
  { id: "br10", name: "Aoife O'Brien", country: "Ireland", rating: 5, text: "Brilliant read. Practical advice that actually works in the real world.", date: "2025-09-05", verified: true },
  { id: "br11", name: "Tom Janssen", country: "Belgium", rating: 5, text: "Straight to the point. I've already recommended it to two colleagues.", date: "2025-08-17", verified: true },
  { id: "br12", name: "Hannah Müller", country: "Germany", rating: 5, text: "The step-by-step approach made everything click. Highly recommended.", date: "2025-08-02", verified: true },
];

function withReviews(book: Omit<Book, "reviews">, reviews: BookReview[] = seedReviews): Book {
  return { ...book, reviews: reviews.map((r) => ({ ...r, id: `${book.id}-${r.id}` })) };
}

const defaults: Book[] = [
  withReviews({
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
  }),
  withReviews({
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
  }),
  withReviews({
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
  }),
];

function migrate(raw: Book[]): Book[] {
  return raw.map((b, i) => ({
    id: b.id,
    title: b.title,
    subtitle: b.subtitle || "",
    description: b.description || "",
    cover: b.cover || "",
    price: b.price || "",
    priceNote: b.priceNote || "",
    buyUrl: b.buyUrl || "",
    previewUrl: b.previewUrl || "",
    category: b.category || "Business",
    pages: Number(b.pages) || 0,
    rating: Number(b.rating) || 0,
    reviews: Array.isArray(b.reviews) ? b.reviews : seedReviews.map((r) => ({ ...r, id: `${b.id}-${r.id}` })),
    featured: !!b.featured,
    published: !!b.published,
    createdAt: b.createdAt || "",
  }));
}

export function loadBooks(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : defaults;
    return migrate(Array.isArray(parsed) ? parsed : defaults);
  } catch {
    return migrate(defaults);
  }
}

export function getPublishedBooks(): Book[] {
  return loadBooks().filter((b) => b.published);
}

export function getFeaturedBooks(): Book[] {
  return loadBooks().filter((b) => b.published && b.featured);
}

export function getBookById(id: string): Book | undefined {
  return loadBooks().find((b) => b.id === id);
}

export function getBookAverageRating(book: Book): number {
  if (book.reviews.length) {
    const sum = book.reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return Math.round((sum / book.reviews.length) * 10) / 10;
  }
  return book.rating || 0;
}

export function getBookReviewCount(book: Book): number {
  return book.reviews.length;
}

export function saveBooks(list: Book[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
