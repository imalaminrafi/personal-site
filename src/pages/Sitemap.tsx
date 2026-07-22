import { loadPosts } from "@/data/blogData";
import { generateXmlSitemap, generateImageSitemap } from "@/utils/seoUtils";

export default function Sitemap() {
  const isImages = window.location.pathname.includes("sitemap-images");
  const posts = loadPosts().filter((p) => p.status === "published");
  const xml = isImages ? generateImageSitemap(posts) : generateXmlSitemap(posts);

  return (
    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "monospace", background: "#fff", color: "#000", padding: 20, fontSize: 14, lineHeight: 1.5 }}>
      {xml || '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>'}
    </pre>
  );
}
