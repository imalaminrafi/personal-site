export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  demoLink: string;
  featured: boolean;
  tags: string[];
  createdAt: string;
}

const STORAGE_KEY = "ar_portfolio";
const CATEGORIES = ["All", "UI/UX Design", "Website Design", "WordPress", "Landing Page"];

export { CATEGORIES };

const defaults: PortfolioItem[] = [
  { id: "p1", title: "E-Commerce Platform", description: "A full-featured online store with inventory management, payment integration, and responsive design.", image: "/projects/project1.jpg", category: "Website Design", demoLink: "https://example.com", featured: true, tags: ["React", "Node.js", "MongoDB"], createdAt: "2026-05-01T10:00:00Z" },
  { id: "p2", title: "Business Dashboard", description: "Analytics dashboard with real-time data visualization, user management, and reporting tools.", image: "/projects/project2.jpg", category: "UI/UX Design", demoLink: "https://example.com", featured: true, tags: ["React", "D3.js", "Firebase"], createdAt: "2026-04-15T10:00:00Z" },
  { id: "p3", title: "Restaurant Website", description: "Modern restaurant site with online ordering, reservation system, and menu management.", image: "/projects/project3.jpg", category: "WordPress", demoLink: "https://example.com", featured: true, tags: ["WordPress", "WooCommerce", "SEO"], createdAt: "2026-03-20T10:00:00Z" },
  { id: "p4", title: "Portfolio Landing Page", description: "Clean, fast landing page for a creative professional with animation and optimized performance.", image: "/projects/project4.jpg", category: "Landing Page", demoLink: "https://example.com", featured: false, tags: ["Next.js", "Tailwind CSS"], createdAt: "2026-02-10T10:00:00Z" },
  { id: "p5", title: "SaaS Application", description: "Subscription-based SaaS platform with user authentication, payment processing, and analytics.", image: "/projects/project5.jpg", category: "Website Design", demoLink: "https://example.com", featured: false, tags: ["React", "Stripe", "PostgreSQL"], createdAt: "2026-01-05T10:00:00Z" },
  { id: "p6", title: "Real Estate Portal", description: "Property listing website with advanced search, virtual tours, and agent management system.", image: "/projects/project6.jpg", category: "WordPress", demoLink: "https://example.com", featured: false, tags: ["WordPress", "Custom Theme", "API"], createdAt: "2025-12-01T10:00:00Z" },
  { id: "p7", title: "Mobile App UI Design", description: "Complete mobile app interface design for a fitness tracking application with modern UX patterns.", image: "/projects/project7.jpg", category: "UI/UX Design", demoLink: "https://example.com", featured: false, tags: ["Figma", "Prototype", "Design System"], createdAt: "2025-11-15T10:00:00Z" },
  { id: "p8", title: "Marketing Landing Page", description: "High-converting landing page for a digital marketing agency with A/B testing and analytics.", image: "/projects/project8.jpg", category: "Landing Page", demoLink: "https://example.com", featured: false, tags: ["HTML/CSS", "JavaScript", "GSAP"], createdAt: "2025-10-20T10:00:00Z" },
];

export function loadPortfolio(): PortfolioItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaults;
  } catch { return defaults; }
}

export function savePortfolio(list: PortfolioItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
