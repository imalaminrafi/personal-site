import { Home, Layers, Briefcase } from "lucide-react";

export interface AppNavItem {
  id: string;
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

/** Route-based items shown in the compact floating bottom navigation. */
export const bottomNavItems: AppNavItem[] = [
  { id: "home", label: "Home", to: "/", icon: Home },
  { id: "services", label: "Services", to: "/services", icon: Layers },
  { id: "portfolio", label: "Portfolio", to: "/portfolio", icon: Briefcase },
];

export interface MenuLink {
  id: string;
  label: string;
  to: string;
  description: string;
}

/** Primary quick links in the "More" bottom sheet. */
export const moreSheetLinks: MenuLink[] = [
  { id: "about", label: "About", to: "/about-alamin-rafi", description: "My story, skills & experience" },
  { id: "blog", label: "Blog", to: "/blog", description: "Articles & guides" },
  { id: "gallery", label: "Gallery", to: "/gallery", description: "Workspace, events & moments" },
  { id: "books", label: "Books / Digital Products", to: "/books", description: "Guides, e-books & templates" },
  { id: "tracking", label: "Project Tracking", to: "/dashboard", description: "Follow your project status" },
  { id: "contact", label: "Contact", to: "/contact", description: "Email, WhatsApp & form" },
  { id: "login", label: "Login", to: "/login", description: "Client login & signup" },
];

/** Secondary links shown at the bottom of the "More" sheet. */
export const moreSheetSecondaryLinks: MenuLink[] = [
  { id: "pricing", label: "Pricing", to: "/pricing", description: "Plans & package details" },
  { id: "testimonials", label: "Testimonials", to: "/testimonials", description: "What clients say" },
  { id: "faq", label: "FAQ", to: "/faq", description: "Answers to common questions" },
  { id: "privacy", label: "Privacy Policy", to: "/privacy", description: "How your data is handled" },
  { id: "terms", label: "Terms", to: "/terms", description: "Terms of service" },
];
