import { loadPosts } from "@/data/blogData";
import { generateRssFeed } from "@/utils/seoUtils";

export default function RssFeed() {
  const posts = loadPosts();
  const xml = generateRssFeed(posts);

  return (
    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "monospace", background: "#fff", color: "#000", padding: 20, fontSize: 14, lineHeight: 1.5 }}>
      {xml}
    </pre>
  );
}
