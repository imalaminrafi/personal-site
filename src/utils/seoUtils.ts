import type { BlogPost } from "@/data/blogData";

export function getBaseUrl() {
  return "https://alaminrafi.com";
}

export interface SEOMeta {
  title: string;
  description: string;
  canonical: string;
  ogType: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogSiteName: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  keywords: string;
  robots: string;
}

export function buildPostMeta(post: BlogPost): SEOMeta {
  const base = getBaseUrl();
  const url = `${base}/blog/${post.slug}`;
  return {
    title: post.seoTitle || post.title,
    description: post.metaDescription || post.shortDescription,
    canonical: post.canonicalUrl || url,
    ogType: "article",
    ogTitle: post.ogTitle || post.title,
    ogDescription: post.ogDescription || post.shortDescription,
    ogImage: post.ogImage || post.featuredImage,
    ogUrl: url,
    ogSiteName: "Alamin Rafi",
    twitterCard: post.twitterCard || "summary_large_image",
    twitterTitle: post.ogTitle || post.title,
    twitterDescription: post.ogDescription || post.shortDescription,
    twitterImage: post.ogImage || post.featuredImage,
    keywords: [post.focusKeyword, ...post.tags].join(", "),
    robots: "index, follow, max-image-preview:large",
  };
}

export function generateArticleSchema(post: BlogPost) {
  const base = getBaseUrl();
  const url = `${base}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": post.schemaType || "Article",
    headline: post.title,
    description: post.shortDescription,
    image: post.featuredImage,
    author: {
      "@type": "Person",
      name: post.author,
      url: base,
    },
    datePublished: post.publishedDate,
    dateModified: post.updatedDate || post.publishedDate,
    publisher: {
      "@type": "Organization",
      name: "Alamin Rafi",
      logo: { "@type": "ImageObject", url: `${base}/favicon.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: [post.focusKeyword, ...post.tags].join(", "),
  };
}

export function generateBreadcrumbSchema(post: BlogPost) {
  const base = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${base}/blog` },
      { "@type": "ListItem", position: 3, name: post.breadcrumbTitle || post.title, item: `${base}/blog/${post.slug}` },
    ],
  };
}

export function generateFaqSchema(faq: { question: string; answer: string }[]) {
  if (!faq.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function generateOrganizationSchema() {
  const base = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Alamin Rafi",
    url: base,
    logo: `${base}/favicon.svg`,
    sameAs: [
      "https://facebook.com/alaminrafi.dev",
      "https://linkedin.com/in/alaminrafi",
      "https://twitter.com/alaminrafi_dev",
    ],
  };
}

export function generatePersonSchema() {
  const base = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alamin Rafi",
    url: base,
    jobTitle: "Website Developer & Designer",
    sameAs: [
      "https://facebook.com/alaminrafi.dev",
      "https://linkedin.com/in/alaminrafi",
      "https://twitter.com/alaminrafi_dev",
    ],
  };
}

export function generateXmlSitemap(posts: BlogPost[]): string {
  const base = getBaseUrl();
  const now = new Date().toISOString().split("T")[0];

  const urls = [
    { loc: base, priority: "1.0", changefreq: "weekly" },
    { loc: `${base}/portfolio`, priority: "0.8", changefreq: "weekly" },
    { loc: `${base}/blog`, priority: "0.7", changefreq: "daily" },
    { loc: `${base}/about-me`, priority: "0.7", changefreq: "monthly" },
    { loc: `${base}/professional`, priority: "0.6", changefreq: "monthly" },
    ...posts.filter((p) => p.status === "published").map((p) => ({
      loc: `${base}/blog/${p.slug}`,
      priority: "0.6",
      changefreq: "monthly" as const,
      lastmod: (p.updatedDate || p.publishedDate).split("T")[0],
    })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <priority>${u.priority}</priority>
    <changefreq>${u.changefreq}</changefreq>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}
  </url>`).join("\n")}
</urlset>`;
}

export function generateImageSitemap(posts: BlogPost[]): string {
  const base = getBaseUrl();
  const images: { loc: string; image: string; caption: string; title: string }[] = [];

  posts.filter((p) => p.status === "published").forEach((p) => {
    const url = `${base}/blog/${p.slug}`;
    if (p.featuredImage) {
      images.push({ loc: url, image: p.featuredImage.startsWith("http") ? p.featuredImage : `${base}${p.featuredImage}`, caption: p.imageCaption || p.title, title: p.imageTitle || p.title });
    }
  });

  if (!images.length) return "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${images.map((i) => `  <url>
    <loc>${i.loc}</loc>
    <image:image>
      <image:loc>${i.image}</image:loc>
      <image:caption>${i.caption}</image:caption>
      <image:title>${i.title}</image:title>
    </image:image>
  </url>`).join("\n")}
</urlset>`;
}

export function generateRobotsTxt(): string {
  return `User-agent: Googlebot
Allow: /
User-agent: Bingbot
Allow: /
User-agent: Twitterbot
Allow: /
User-agent: facebookexternalhit
Allow: /
User-agent: *
Allow: /
Sitemap: https://alaminrafi.com/sitemap.xml
Sitemap: https://alaminrafi.com/sitemap-images.xml`;
}

export function generateHreflang(slug: string) {
  const base = getBaseUrl();
  return [
    { rel: "canonical", href: `${base}/blog/${slug}` },
    { rel: "alternate", hreflang: "en", href: `${base}/blog/${slug}` },
  ];
}
