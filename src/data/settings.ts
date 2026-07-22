export interface SiteSettings {
  logo: string;
  favicon: string;
  siteName: string;
  email: string;
  phone: string;
  whatsapp: string;
  socialLinks: { platform: string; url: string }[];
  footer: string;
  analyticsCode: string;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  keywords: string;
  robots: string;
  sitemap: string;
}

const SETTINGS_KEY = "ar_site_settings";
const SEO_KEY = "ar_seo_settings";

const defaultSettings: SiteSettings = {
  logo: "",
  favicon: "",
  siteName: "Alamin Rafi",
  email: "hello@alaminrafi.com",
  phone: "+880 1917 443 161",
  whatsapp: "+8801917443161",
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/alaminrafi" },
    { platform: "LinkedIn", url: "https://linkedin.com/in/alaminrafi" },
    { platform: "Twitter", url: "https://twitter.com/alaminrafi" },
  ],
  footer: "© 2026 Alamin Rafi. All rights reserved.",
  analyticsCode: "",
};

const defaultSEO: SEOSettings = {
  metaTitle: "Alamin Rafi — Website & Digital Services",
  metaDescription: "Modern, affordable websites for businesses. Web design, development, WordPress, UI/UX — all in one place.",
  ogImage: "https://alaminrafi.com/5.png",
  keywords: "web design, web development, wordpress, ui ux, digital services",
  robots: "index, follow",
  sitemap: "/sitemap.xml",
};

export function loadSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch { return defaultSettings; }
}

export function saveSettings(s: SiteSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export function loadSEOSettings(): SEOSettings {
  try {
    const raw = localStorage.getItem(SEO_KEY);
    return raw ? { ...defaultSEO, ...JSON.parse(raw) } : defaultSEO;
  } catch { return defaultSEO; }
}

export function saveSEOSettings(s: SEOSettings) {
  localStorage.setItem(SEO_KEY, JSON.stringify(s));
}
