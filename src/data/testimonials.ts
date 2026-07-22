export interface Testimonial {
  id: string;
  clientName: string;
  company: string;
  country: string;
  rating: number;
  review: string;
  photo: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
}

const STORAGE_KEY = "ar_testimonials";

const defaults: Testimonial[] = [
  {
    id: "t1", clientName: "Sarah Johnson", company: "TechFlow Solutions", country: "United States",
    rating: 5, review: "Absolutely outstanding work! Alamin delivered a stunning website that exceeded our expectations. The attention to detail and modern design approach made all the difference.",
    photo: "", featured: true, published: true, createdAt: "2026-04-10T10:00:00Z",
  },
  {
    id: "t2", clientName: "Ahmed Hassan", company: "Cairo Digital Agency", country: "Egypt",
    rating: 5, review: "Professional, punctual, and incredibly talented. Our new landing page has significantly improved our conversion rates. Highly recommended!",
    photo: "", featured: true, published: true, createdAt: "2026-03-22T10:00:00Z",
  },
  {
    id: "t3", clientName: "Maria Lopez", company: "Verde Organics", country: "Spain",
    rating: 4, review: "Great experience working with Alamin. The e-commerce site looks beautiful and functions perfectly. Communication was smooth throughout the project.",
    photo: "", featured: false, published: true, createdAt: "2026-02-15T10:00:00Z",
  },
  {
    id: "t4", clientName: "James Mitchell", company: "Mitchell Realty", country: "Canada",
    rating: 5, review: "Alamin redesigned our real estate portal and the results were incredible. Modern, fast, and user-friendly. Our clients love it!",
    photo: "", featured: false, published: false, createdAt: "2026-01-28T10:00:00Z",
  },
];

export function loadTestimonials(): Testimonial[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaults;
  } catch { return defaults; }
}

export function getPublishedTestimonials(): Testimonial[] {
  return loadTestimonials().filter((t) => t.published);
}

export function getFeaturedTestimonials(): Testimonial[] {
  return loadTestimonials().filter((t) => t.published && t.featured);
}

export function saveTestimonials(list: Testimonial[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
