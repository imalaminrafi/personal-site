export interface AuthorProfile {
  name: string;
  givenName: string;
  familyName: string;
  alternateName: string[];
  jobTitle: string;
  description: string;
  image: string;
  url: string;
  sameAs: { platform: string; url: string; icon: string }[];
  email: string;
  telephone: string;
  knowsAbout: string[];
}

export const author: AuthorProfile = {
  name: "Alamin Rafi",
  givenName: "Alamin",
  familyName: "Rafi",
  alternateName: ["Al Amin Rafi", "Alaminrafi", "Md Alamin Rafi"],
  jobTitle: "Website Developer & Designer",
  description:
    "Professional website developer and designer building modern, responsive, and SEO-optimized websites for businesses worldwide. Specializes in WordPress development, UI/UX design, front-end development, SEO, and digital marketing. Serving clients globally with remote collaboration.",
  image: "/Profile.png",
  url: "https://alaminrafi.com",
  sameAs: [
    { platform: "LinkedIn", url: "https://www.linkedin.com/in/imalaminrafi/", icon: "linkedin" },
    { platform: "Facebook", url: "https://www.facebook.com/alamin.rafiofficial", icon: "facebook" },
    { platform: "GitHub", url: "https://github.com/imalaminrafi", icon: "github" },
    { platform: "Twitter", url: "https://x.com/imalaminrafi", icon: "twitter" },
    { platform: "Behance", url: "https://www.behance.net/imalaminrafi", icon: "behance" },
    { platform: "WhatsApp", url: "https://wa.me/8801917443161", icon: "whatsapp" },
  ],
  email: "hello@alaminrafi.com",
  telephone: "+8801917443161",
  knowsAbout: [
    "Web Development", "Website Design", "UI/UX Design", "WordPress",
    "SEO", "Digital Marketing", "Front-End Development", "Responsive Design",
    "E-Commerce", "Landing Page Design", "Business Website", "Portfolio Website",
  ],
};

export function getAuthorSchema() {
  const base = author.url;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${base}/#person`,
    name: author.name,
    givenName: author.givenName,
    familyName: author.familyName,
    alternateName: author.alternateName,
    description: author.description,
    image: `${base}${author.image}`,
    url: base,
    jobTitle: author.jobTitle,
    email: `mailto:${author.email}`,
    telephone: author.telephone,
    knowsAbout: author.knowsAbout.map((k) => ({ "@type": "Thing", name: k })),
    sameAs: author.sameAs.map((s) => s.url),
  };
}

export function getWebsiteSchema() {
  const base = author.url;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    name: "Alamin Rafi — Website Developer & Designer",
    alternateName: author.alternateName,
    url: base,
    description: author.description,
    image: `${base}${author.image}`,
    publisher: { "@id": `${base}/#person` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${base}/blog?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getOrganizationSchema() {
  const base = author.url;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base}/#organization`,
    name: "Alamin Rafi",
    alternateName: author.alternateName,
    url: base,
    logo: `${base}/favicon.svg`,
    image: `${base}${author.image}`,
    description: author.description,
    email: `mailto:${author.email}`,
    telephone: author.telephone,
    founder: { "@id": `${base}/#person` },
    sameAs: author.sameAs.map((s) => s.url),
  };
}

export function getImageObjectSchema(src: string, alt: string, title: string, caption: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: src.startsWith("http") ? src : `https://alaminrafi.com${src}`,
    name: title || alt,
    caption: caption || alt,
    description: description || alt,
    representativeOfPage: true,
  };
}

export const contentClusterIdeas = [
  { title: "Who is Alamin Rafi?", slug: "who-is-alamin-rafi", keyword: "Alamin Rafi" },
  { title: "Alamin Rafi Portfolio — Websites I've Built", slug: "alamin-rafi-portfolio", keyword: "Alamin Rafi Portfolio" },
  { title: "Alamin Rafi Web Design Services", slug: "alamin-rafi-web-design", keyword: "Alamin Rafi Web Designer" },
  { title: "Alamin Rafi Digital Marketing Services", slug: "alamin-rafi-digital-marketing", keyword: "Alamin Rafi Digital Marketing" },
  { title: "Alamin Rafi SEO — How I Optimize Websites", slug: "alamin-rafi-seo", keyword: "Alamin Rafi SEO Expert" },
  { title: "How Alamin Rafi Builds Business Websites", slug: "how-alamin-rafi-builds-business-websites", keyword: "Alamin Rafi Website Developer" },
  { title: "Website Design Tips by Alamin Rafi", slug: "website-design-tips-by-alamin-rafi", keyword: "Website Design" },
  { title: "Landing Page Guide by Alamin Rafi", slug: "landing-page-guide-by-alamin-rafi", keyword: "Landing Page" },
  { title: "Best Portfolio Website Examples", slug: "best-portfolio-website-examples", keyword: "Portfolio Website" },
  { title: "Small Business Website Guide", slug: "small-business-website-guide", keyword: "Small Business Website" },
];
