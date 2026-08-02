import { loadPosts } from "@/data/blogData";
import { generateRssFeed } from "@/utils/seoUtils";

export default function RssFeed() {
  const posts = loadPosts();
  const xml = generateRssFeed(posts);

  return (
    <pre className="whitespace-pre-wrap font-mono bg-white text-black dark:bg-[#0A1628] dark:text-zinc-100 p-5 text-sm leading-relaxed">
      {xml}
    </pre>
  );
}
