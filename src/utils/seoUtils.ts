import type { BlogPost } from "@/data/blogData";
import { author, getAuthorSchema, getWebsiteSchema, getOrganizationSchema } from "@/data/author";

export function getBaseUrl() {
  return "https://alaminrafi.com";
}

export interface SEOMeta {
  title: string;
  description: string; canonical: string;
  ogType: string; ogTitle: string; ogDescription: string; ogImage: string; ogUrl: string; ogSiteName: string;
  twitterCard: string; twitterTitle: string; twitterDescription: string; twitterImage: string;
  keywords: string; robots: string;
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
    ogImage: post.ogImage || post.featuredImage || author.image,
    ogUrl: url,
    ogSiteName: "Alamin Rafi",
    twitterCard: post.twitterCard || "summary_large_image",
    twitterTitle: post.ogTitle || post.title,
    twitterDescription: post.ogDescription || post.shortDescription,
    twitterImage: post.ogImage || post.featuredImage || author.image,
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
    "@id": `${url}#article`,
    headline: post.title,
    description: post.shortDescription,
    image: post.featuredImage || post.ogImage,
    author: { "@id": `${base}/#person` },
    datePublished: post.publishedDate,
    dateModified: post.updatedDate || post.publishedDate,
    publisher: { "@id": `${base}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: [post.focusKeyword, ...post.tags].join(", "),
    wordCount: post.content ? post.content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length : 0,
    articleSection: post.category,
    inLanguage: "en-US",
    copyrightYear: new Date(post.publishedDate).getFullYear(),
    copyrightHolder: { "@id": `${base}/#person` },
  };
}

export function generateBreadcrumbSchema(slug: string, breadcrumbTitle: string, postTitle: string) {
  const base = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${base}/blog` },
      { "@type": "ListItem", position: 3, name: breadcrumbTitle || postTitle, item: `${base}/blog/${slug}` },
    ],
  };
}

export function generateFaqSchema(faq: { question: string; answer: string }[]) {
  if (!faq.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question", name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function getSitewideSchemas() {
  return [getAuthorSchema(), getWebsiteSchema(), getOrganizationSchema()];
}

export function generateImageObjectSchema(src: string, alt: string, title: string, caption: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: src.startsWith("http") ? src : `${getBaseUrl()}${src}`,
    name: title || alt || "Image",
    caption: caption || alt || "",
    description: description || alt || "",
    representativeOfPage: true,
  };
}

export function generateSiteBreadcrumbSchema(items: { name: string; path: string }[]) {
  const base = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem", position: i + 1, name: item.name, item: `${base}${item.path}`,
    })),
  };
}

export function generateXmlSitemap(posts: BlogPost[]): string {
  const base = getBaseUrl();
  const urls = [
    { loc: base, priority: "1.0", changefreq: "weekly" },
    { loc: `${base}/portfolio`, priority: "0.9", changefreq: "weekly" },
    { loc: `${base}/blog`, priority: "0.9", changefreq: "daily" },
    { loc: `${base}/about-me`, priority: "0.8", changefreq: "monthly" },
    { loc: `${base}/about-alamin-rafi`, priority: "0.9", changefreq: "monthly" },
    { loc: `${base}/professional`, priority: "0.7", changefreq: "monthly" },
    ...posts.filter((p) => p.status === "published").map((p) => ({
      loc: `${base}/blog/${p.slug}`,
      priority: "0.64",
      changefreq: "monthly" as const,
      lastmod: (p.updatedDate || p.publishedDate).split("T")[0],
    })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <priority>${u.priority}</priority>\n    <changefreq>${u.changefreq}</changefreq>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}\n  </url>`).join("\n")}
</urlset>`;
}

export function generateImageSitemap(posts: BlogPost[]): string {
  const base = getBaseUrl();
  const images: { loc: string; image: string; caption: string; title: string }[] = [];
  posts.filter((p) => p.status === "published").forEach((p) => {
    const url = `${base}/blog/${p.slug}`;
    if (p.featuredImage) {
      images.push({
        loc: url,
        image: p.featuredImage.startsWith("http") ? p.featuredImage : `${base}${p.featuredImage}`,
        caption: p.imageCaption || p.title,
        title: p.imageTitle || p.title,
      });
    }
  });
  if (!images.length) return "";
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${images.map((i) => `  <url>\n    <loc>${i.loc}</loc>\n    <image:image>\n      <image:loc>${i.image}</image:loc>\n      <image:caption>${i.caption}</image:caption>\n      <image:title>${i.title}</image:title>\n    </image:image>\n  </url>`).join("\n")}
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
Sitemap: https://alaminrafi.com/sitemap-images.xml

# Crawl delay for responsible crawling
Crawl-delay: 10

# Disallow admin routes
Disallow: /admin/
Disallow: /login
Disallow: /signup
Disallow: /dashboard`;
}

export function generateRssFeed(posts: BlogPost[]): string {
  const base = getBaseUrl();
  const now = new Date().toISOString();
  const published = posts.filter((p) => p.status === "published").slice(0, 50);

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/" xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
  <channel>
    <title>Alamin Rafi — Blog</title>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml"/>
    <link>${base}/blog</link>
    <description>Insights, tutorials, and stories about web development, design, SEO, and digital marketing from Alamin Rafi.</description>
    <lastBuildDate>${now}</lastBuildDate>
    <language>en-US</language>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <generator>Alamin Rafi Website</generator>
    <image>
      <url>${base}${author.image}</url>
      <title>Alamin Rafi</title>
      <link>${base}</link>
    </image>
    <managingEditor>${author.email} (${author.name})</managingEditor>
    <webMaster>${author.email} (${author.name})</webMaster>
${published.map((p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${base}/blog/${p.slug}</link>
      <guid isPermaLink="true">${base}/blog/${p.slug}</guid>
      <dc:creator><![CDATA[${author.name}]]></dc:creator>
      <pubDate>${new Date(p.publishedDate || p.updatedDate).toUTCString()}</pubDate>
      <category>${escapeXml(p.category)}</category>
      ${p.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("\n      ")}
      <description><![CDATA[${p.shortDescription || ""}]]></description>
      <content:encoded><![CDATA[${p.content || ""}]]></content:encoded>
      ${p.featuredImage ? `<enclosure url="${p.featuredImage.startsWith("http") ? p.featuredImage : base + p.featuredImage}" type="image/webp"/>` : ""}
    </item>`).join("\n")}
  </channel>
</rss>`;
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export function calculateSeoScore(post: BlogPost): { score: number; checks: { label: string; pass: boolean }[] } {
  const checks = [
    { label: "Title length (30-60 chars)", pass: (post.seoTitle || post.title).length >= 30 && (post.seoTitle || post.title).length <= 60 },
    { label: "Meta description (120-160 chars)", pass: (post.metaDescription || post.shortDescription).length >= 120 && (post.metaDescription || post.shortDescription).length <= 160 },
    { label: "Focus keyword in title", pass: post.focusKeyword ? (post.seoTitle || post.title).toLowerCase().includes(post.focusKeyword.toLowerCase()) : false },
    { label: "Focus keyword in first paragraph", pass: post.focusKeyword && post.content ? post.content.toLowerCase().includes(post.focusKeyword.toLowerCase()) : false },
    { label: "Featured image set", pass: !!post.featuredImage },
    { label: "Image alt text set", pass: !!post.imageAlt },
    { label: "Slug is clean (no special chars)", pass: /^[a-z0-9-]+$/.test(post.slug) },
    { label: "Canonical URL set", pass: !!post.canonicalUrl },
    { label: "OG title set", pass: !!post.ogTitle },
    { label: "OG description set", pass: !!post.ogDescription },
    { label: "Tags added (>=3 recommended)", pass: (post.tags || []).length >= 3 },
    { label: "Content length (>=600 words)", pass: (post.content || "").replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length >= 600 },
    { label: "FAQ section added", pass: (post.faq || []).length > 0 },
    { label: "Internal links present", pass: (post.content || "").includes("/blog/") },
    { label: "Category assigned", pass: !!post.category },
  ];
  const passed = checks.filter((c) => c.pass).length;
  const score = Math.round((passed / checks.length) * 100);
  return { score, checks };
}

export function generatePrevNextPosts(currentSlug: string, posts: BlogPost[]) {
  const published = posts.filter((p) => p.status === "published").sort(
    (a, b) => new Date(b.publishedDate || b.updatedDate).getTime() - new Date(a.publishedDate || a.updatedDate).getTime()
  );
  const idx = published.findIndex((p) => p.slug === currentSlug);
  return {
    prev: idx < published.length - 1 ? published[idx + 1] : null,
    next: idx > 0 ? published[idx - 1] : null,
  };
}
