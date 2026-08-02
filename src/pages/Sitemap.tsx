import { loadPosts } from "@/data/blogData";
import { generateXmlSitemap, generateImageSitemap } from "@/utils/seoUtils";

export default function Sitemap() {
  const isImages = window.location.pathname.includes("sitemap-images");
  const posts = loadPosts().filter((p) => p.status === "published");
  const xml = isImages ? generateImageSitemap(posts) : generateXmlSitemap(posts);

  return (
    <pre className="whitespace-pre-wrap font-mono bg-white text-black dark:bg-[#0A1628] dark:text-zinc-100 p-5 text-sm leading-relaxed">
      {xml || '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>'}
    </pre>
  );
}
