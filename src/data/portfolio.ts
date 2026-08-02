export interface ProjectReview {
  id: string;
  clientName: string;
  platform: string;
  country?: string;
  rating: number;
  text: string;
  projectDate: string;
  verified: boolean;
}

export interface CaseStudy {
  challenge: string;
  approach: string;
  results: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  gallery: string[];
  category: string;
  tags: string[];
  /** Original deployment URL (Vercel etc.). Kept private — embedded via iframe, never shown in the address bar. */
  liveUrl: string;
  caseStudy: CaseStudy;
  reviews: ProjectReview[];
  featured: boolean;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: string;
}

const STORAGE_KEY = "ar_portfolio";
const CATEGORIES = ["All", "Website Design", "UI/UX Design", "WordPress", "Landing Page", "E-Commerce", "Web App", "Mobile App"];

export { CATEGORIES };

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

const defaults: PortfolioItem[] = [
  {
    id: "p1",
    title: "E-Commerce Platform",
    slug: "e-commerce-platform",
    description: "A full-featured online store with inventory management, payment integration, and a fully responsive shopping experience.",
    image: "/projects/project1.jpg",
    gallery: ["/projects/project1.jpg", "/projects/project3.jpg"],
    category: "E-Commerce",
    tags: ["React", "Node.js", "MongoDB"],
    liveUrl: "https://example.com",
    caseStudy: {
      challenge: "The client needed a scalable storefront with real-time inventory and seamless checkout across devices.",
      approach: "Built a headless frontend on React with a Node.js API, integrating Stripe payments and admin dashboards.",
      results: ["3x faster page loads after optimization", "Checkout completion up by 38%", "Handles 10k+ monthly orders"],
    },
    reviews: [
      {
        id: "r1",
        clientName: "Sarah Johnson",
        platform: "Upwork",
        country: "United States",
        rating: 5,
        text: "Outstanding work. The store launched ahead of schedule and conversion rates improved within the first month.",
        projectDate: "2026-05-01",
        verified: true,
      },
    ],
    featured: true,
    order: 0,
    seoTitle: "E-Commerce Platform | Alamin Rafi",
    seoDescription: "A scalable e-commerce platform built with React, Node.js and MongoDB.",
    seoKeywords: "ecommerce, online store, react",
    createdAt: "2026-05-01T10:00:00Z",
  },
  {
    id: "p2",
    title: "Business Dashboard",
    slug: "business-dashboard",
    description: "Analytics dashboard with real-time data visualization, user management, and reporting tools.",
    image: "/projects/project2.jpg",
    gallery: ["/projects/project2.jpg"],
    category: "Web App",
    tags: ["React", "D3.js", "Firebase"],
    liveUrl: "https://example.com",
    caseStudy: {
      challenge: "Raw data was drowning the client's team — they needed a single pane of glass for daily decisions.",
      approach: "Designed a modular dashboard with D3 charts, role-based access, and scheduled report exports.",
      results: ["Reporting time reduced from hours to minutes", "Adopted by 40+ internal users"],
    },
    reviews: [
      {
        id: "r2",
        clientName: "Michael Chen",
        platform: "Fiverr",
        rating: 5,
        text: "Very professional. Clean code, great communication, and the dashboard looks incredible.",
        projectDate: "2026-04-15",
        verified: true,
      },
    ],
    featured: true,
    order: 1,
    seoTitle: "Business Dashboard | Alamin Rafi",
    seoDescription: "Real-time analytics dashboard with data visualization and reporting.",
    createdAt: "2026-04-15T10:00:00Z",
  },
  {
    id: "p3",
    title: "Restaurant Website",
    slug: "restaurant-website",
    description: "Modern restaurant site with online ordering, reservation system, and menu management.",
    image: "/projects/project3.jpg",
    gallery: ["/projects/project3.jpg"],
    category: "WordPress",
    tags: ["WordPress", "WooCommerce", "SEO"],
    liveUrl: "https://example.com",
    caseStudy: {
      challenge: "The restaurant had no online presence and wanted table bookings plus takeaway orders.",
      approach: "Built a WordPress site with a WooCommerce takeaway flow and a custom reservation plugin.",
      results: ["Online bookings reached 200+/week", "Google ranking for local keywords in top 3"],
    },
    reviews: [
      {
        id: "r3",
        clientName: "Anna Petrova",
        platform: "Direct Client",
        country: "Germany",
        rating: 5,
        text: "Delivered exactly what we needed. Menu updates are now effortless and bookings come in daily.",
        projectDate: "2026-03-20",
        verified: true,
      },
    ],
    featured: true,
    order: 2,
    seoTitle: "Restaurant Website | Alamin Rafi",
    seoDescription: "A modern restaurant website with online ordering and reservations.",
    createdAt: "2026-03-20T10:00:00Z",
  },
  {
    id: "p4",
    title: "Portfolio Landing Page",
    slug: "portfolio-landing-page",
    description: "Clean, fast landing page for a creative professional with animation and optimized performance.",
    image: "/projects/project4.jpg",
    gallery: ["/projects/project4.jpg"],
    category: "Landing Page",
    tags: ["Next.js", "Tailwind CSS"],
    liveUrl: "https://example.com",
    caseStudy: {
      challenge: "Needed a high-converting single page that loads almost instantly on mobile.",
      approach: "Static generation with Next.js, image optimization, and micro-animations for polish.",
      results: ["100/100 Lighthouse performance", "Bounce rate cut by 25%"],
    },
    reviews: [],
    featured: false,
    order: 3,
    seoTitle: "Portfolio Landing Page | Alamin Rafi",
    seoDescription: "A fast, animated landing page built with Next.js and Tailwind CSS.",
    createdAt: "2026-02-10T10:00:00Z",
  },
  {
    id: "p5",
    title: "SaaS Application",
    slug: "saas-application",
    description: "Subscription-based SaaS platform with user authentication, payment processing, and analytics.",
    image: "/projects/project5.jpg",
    gallery: ["/projects/project5.jpg"],
    category: "Web App",
    tags: ["React", "Stripe", "PostgreSQL"],
    liveUrl: "https://example.com",
    caseStudy: {
      challenge: "From idea to revenue — needed auth, billing, and usage analytics in one product.",
      approach: "Rapid MVP with React + Stripe Billing, then layered analytics and a public API.",
      results: ["MVP shipped in 6 weeks", "Payments live with Stripe", "Self-serve signup flow"],
    },
    reviews: [],
    featured: false,
    order: 4,
    seoTitle: "SaaS Application | Alamin Rafi",
    seoDescription: "A subscription SaaS platform with auth, payments and analytics.",
    createdAt: "2026-01-05T10:00:00Z",
  },
  {
    id: "p6",
    title: "Real Estate Portal",
    slug: "real-estate-portal",
    description: "Property listing website with advanced search, virtual tours, and agent management system.",
    image: "/projects/project6.jpg",
    gallery: ["/projects/project6.jpg"],
    category: "WordPress",
    tags: ["WordPress", "Custom Theme", "API"],
    liveUrl: "https://example.com",
    caseStudy: {
      challenge: "Agencies needed a searchable listing portal with lead capture for each property.",
      approach: "Custom WordPress theme with a REST API layer and map-based property search.",
      results: ["300+ listings imported", "Lead form submissions tripled"],
    },
    reviews: [],
    featured: false,
    order: 5,
    seoTitle: "Real Estate Portal | Alamin Rafi",
    seoDescription: "A property listing portal with advanced search and agent management.",
    createdAt: "2025-12-01T10:00:00Z",
  },
];

function migrate(raw: any[]): PortfolioItem[] {
  return raw.map((item, i) => ({
    id: item.id,
    title: item.title,
    slug: item.slug || slugify(item.title || "project"),
    description: item.description || "",
    image: item.image || "",
    gallery: Array.isArray(item.gallery) ? item.gallery : (item.gallery ? String(item.gallery).split("\n").map((u: string) => u.trim()).filter(Boolean) : []),
    category: item.category || "Website Design",
    tags: Array.isArray(item.tags) ? item.tags : (item.tags ? String(item.tags).split(",").map((t: string) => t.trim()).filter(Boolean) : []),
    liveUrl: item.liveUrl || item.demoLink || "",
    caseStudy: {
      challenge: item.caseStudy?.challenge || "",
      approach: item.caseStudy?.approach || "",
      results: Array.isArray(item.caseStudy?.results) ? item.caseStudy.results : [],
    },
    reviews: Array.isArray(item.reviews) ? item.reviews : [],
    featured: !!item.featured,
    order: typeof item.order === "number" ? item.order : i,
    seoTitle: item.seoTitle || "",
    seoDescription: item.seoDescription || "",
    seoKeywords: item.seoKeywords || "",
    createdAt: item.createdAt || "",
  }));
}

export function loadPortfolio(): PortfolioItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : defaults;
    return migrate(Array.isArray(parsed) ? parsed : defaults).sort((a, b) => a.order - b.order);
  } catch {
    return migrate(defaults);
  }
}

export function savePortfolio(list: PortfolioItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getProjectBySlug(slug: string): PortfolioItem | undefined {
  return loadPortfolio().find((p) => p.slug === slug);
}

export function getFeaturedProjects(count = 3): PortfolioItem[] {
  return loadPortfolio().filter((p) => p.featured).slice(0, count);
}

export function getAverageRating(item: PortfolioItem): number {
  if (!item.reviews.length) return 0;
  return item.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / item.reviews.length;
}
