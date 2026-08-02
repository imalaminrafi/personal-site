export interface PricingPlan {
  id: string;
  name: string;
  iconName: 'Zap' | 'Star' | 'Crown';
  priceLabel: string;
  priceNote: string;
  delivery: string;
  highlighted: boolean;
  features: string[];
  ctaLabel: string;
  accentFrom: string;
  accentTo: string;
  iconBg: string;
}

export interface AddonOption {
  id: string;
  name: string;
  priceLabel: string;
}

export const plans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    iconName: "Zap",
    priceLabel: "Custom quote",
    priceNote: "Small business site",
    delivery: "5–7 days",
    highlighted: false,
    features: ["1–3 pages website", "Responsive design", "Contact form", "Standard SEO"],
    ctaLabel: "Get a Quote",
    accentFrom: "from-blue-500",
    accentTo: "to-cyan-500",
    iconBg: "bg-blue-50/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  },
  {
    id: "standard",
    name: "Standard",
    iconName: "Star",
    priceLabel: "Custom quote",
    priceNote: "Business site",
    delivery: "7–10 days",
    highlighted: true,
    features: ["4–7 pages website", "SEO setup", "Speed optimization", "Social integration"],
    ctaLabel: "Get a Quote",
    accentFrom: "from-violet-500",
    accentTo: "to-fuchsia-500",
    iconBg: "bg-violet-50/50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  },
  {
    id: "premium",
    name: "Premium",
    iconName: "Crown",
    priceLabel: "Custom quote",
    priceNote: "Advanced solution",
    delivery: "10–14 days",
    highlighted: false,
    features: ["8+ pages website", "Custom design", "Advanced features", "Priority support"],
    ctaLabel: "Get a Quote",
    accentFrom: "from-amber-500",
    accentTo: "to-orange-500",
    iconBg: "bg-amber-50/50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  },
];

export const addons: AddonOption[] = [
  { id: "extra-page", name: "Extra Page", priceLabel: "Quote on request" },
  { id: "custom-ui", name: "Custom UI Design", priceLabel: "Quote on request" },
  { id: "logo-design", name: "Logo Design", priceLabel: "Quote on request" },
  { id: "ecommerce", name: "E-commerce", priceLabel: "Quote on request" },
  { id: "booking", name: "Booking System", priceLabel: "Quote on request" },
  { id: "fast-delivery", name: "Fast Delivery", priceLabel: "Quote on request" },
];

export const maintenanceOption = {
  id: "maintenance",
  name: "Website Update / Maintenance",
  priceLabel: "Contact for pricing",
};
