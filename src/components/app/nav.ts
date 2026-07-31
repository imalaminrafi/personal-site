import { Home, Layers, Briefcase, Newspaper } from "lucide-react";

export interface AppNavItem {
  id: string;
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

/** Items shown in the fixed bottom navigation (mobile / tablet). */
export const bottomNavItems: AppNavItem[] = [
  { id: "home", label: "Home", to: "/", icon: Home },
  { id: "services", label: "Services", to: "/services", icon: Layers },
  { id: "portfolio", label: "Portfolio", to: "/portfolio", icon: Briefcase },
  { id: "blog", label: "Blog", to: "/blog", icon: Newspaper },
];

export interface MenuLink {
  id: string;
  label: string;
  to: string;
  description: string;
}

/** Items shown inside the full-screen Menu drawer. */
export const menuLinks: MenuLink[] = [
  { id: "about", label: "About", to: "/about-alamin-rafi", description: "My story, skills & experience" },
  { id: "gallery", label: "Gallery", to: "/gallery", description: "Workspace, events & moments" },
  { id: "books", label: "Books / Digital Products", to: "/books", description: "Guides, e-books & templates" },
  { id: "pricing", label: "Pricing", to: "/pricing", description: "Plans & package details" },
  { id: "testimonials", label: "Testimonials", to: "/testimonials", description: "What clients say about me" },
  { id: "contact", label: "Contact", to: "/contact", description: "Email, WhatsApp & form" },
  { id: "faq", label: "FAQ", to: "/faq", description: "Answers to common questions" },
  { id: "privacy", label: "Privacy Policy", to: "/privacy", description: "How your data is handled" },
  { id: "terms", label: "Terms", to: "/terms", description: "Terms of service" },
];
