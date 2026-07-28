export interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string;
  galleryImages: string[];
  author: string;
  publishedDate: string;
  updatedDate: string;
  readingTime: number;
  status: "draft" | "published" | "scheduled";
  scheduledDate: string;
  seoTitle: string;
  metaDescription: string;
  focusKeyword: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: "summary" | "summary_large_image" | "app" | "player";
  schemaType: "Article" | "BlogPosting" | "NewsArticle";
  breadcrumbTitle: string;
  relatedSlugs: string[];
  faq: FAQItem[];
  imageAlt: string;
  imageTitle: string;
  imageCaption: string;
  imageDescription: string;
}

export const CATEGORIES = [
  "Web Development",
  "UI/UX Design",
  "WordPress",
  "SEO",
  "Digital Marketing",
  "Business Tips",
  "Portfolio Tips",
  "Career",
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

interface StoredPost extends Omit<BlogPost, "publishedDate" | "updatedDate" | "scheduledDate"> {
  publishedDate: string;
  updatedDate: string;
  scheduledDate: string;
}

const STORAGE_KEY = "ar_blog_posts";

const defaults: StoredPost[] = [
  {
    id: "1",
    slug: "who-is-alamin-rafi",
    title: "Who is Alamin Rafi?",
    shortDescription: "Learn more about Alamin Rafi — a passionate website developer, designer, and digital entrepreneur helping small businesses build their online presence.",
    content: `<p>Alamin Rafi is a professional website developer and designer helping businesses worldwide build modern, responsive, and SEO-optimized websites. From WordPress sites to custom-coded landing pages, Alamin specializes in creating digital experiences that are not only visually stunning but also fast, accessible, and built to rank on Google.</p><p>His expertise spans across UI/UX design, front-end development, SEO, and digital marketing — making him a one-stop solution for anyone looking to grow their brand online.</p>`,
    category: "Portfolio Tips",
    tags: ["Personal", "Professional", "Alamin Rafi"],
    featuredImage: "/4.png",
    galleryImages: [],
    author: "Alamin Rafi",
    publishedDate: "2026-05-05T10:00:00Z",
    updatedDate: "2026-05-05T10:00:00Z",
    readingTime: 3,
    status: "published",
    scheduledDate: "",
    seoTitle: "Who is Alamin Rafi? — Website Developer & Designer",
    metaDescription: "Learn about Alamin Rafi, a professional website developer and designer helping small businesses build modern, SEO-optimized websites.",
    focusKeyword: "Alamin Rafi",
    canonicalUrl: "https://alaminrafi.com/blog/who-is-alamin-rafi",
    ogTitle: "Who is Alamin Rafi? — Website Developer & Designer",
    ogDescription: "Learn about Alamin Rafi, a professional website developer and designer helping small businesses build modern, SEO-optimized websites.",
    ogImage: "/4.png",
    twitterCard: "summary_large_image",
    schemaType: "Article",
    breadcrumbTitle: "Who is Alamin Rafi?",
    relatedSlugs: [],
    faq: [
      { question: "What does Alamin Rafi do?", answer: "Alamin Rafi is a professional website developer and designer who helps businesses build modern, SEO-optimized websites and grow their online presence." },
      { question: "Does Alamin Rafi work with international clients?", answer: "Yes, Alamin works with clients worldwide through remote collaboration, delivering high-quality websites and digital solutions." },
    ],
    imageAlt: "Alamin Rafi profile picture",
    imageTitle: "Alamin Rafi — Professional Website Developer",
    imageCaption: "Alamin Rafi working on a modern website project",
    imageDescription: "A professional portrait of Alamin Rafi, website developer and designer",
  },
];

export function loadPosts(): StoredPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaults;
  } catch {
    return defaults;
  }
}

export function savePosts(posts: StoredPost[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function getPostBySlug(slug: string): StoredPost | undefined {
  return loadPosts().find((p) => p.slug === slug);
}

export function getPublishedPosts(): StoredPost[] {
  return loadPosts().filter((p) => p.status === "published");
}

export function getRelatedPosts(post: StoredPost): StoredPost[] {
  const all = getPublishedPosts();
  const related = all.filter((p) => p.id !== post.id && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))));
  return related.slice(0, 4);
}
