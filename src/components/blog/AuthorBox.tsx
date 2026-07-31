import { author } from "@/data/author";
import { Link } from "react-router-dom";
import { useState } from "react";
import { User, Linkedin, MessageCircle, ExternalLink, Globe, Github, Bird, Palette } from "lucide-react";
import { getOptimizedUrl } from "@/utils/cloudinary";

const platformConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  LinkedIn: { icon: Linkedin, color: "#0A66C2" },
  Facebook: { icon: MessageCircle, color: "#1877F2" },
  GitHub: { icon: Github, color: "#333" },
  Twitter: { icon: Bird, color: "#000" },
  Behance: { icon: Palette, color: "#1769FF" },
  WhatsApp: { icon: MessageCircle, color: "#25D366" },
};

export default function AuthorBox() {
  const [imgError, setImgError] = useState(false);
  const showFallback = !author.image || imgError;

  return (
    <div className="rounded-2xl border border-zinc-100 dark:border-white/[0.05] bg-zinc-50 dark:bg-zinc-900/40 p-6">
      <div className="flex items-start gap-4">
        {showFallback ? (
          <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
            <span className="text-xl font-bold text-zinc-500 dark:text-zinc-400">
              {author.name.charAt(0)}
            </span>
          </div>
        ) : (
          <img
            src={getOptimizedUrl(author.image, { width: 200, crop: "fill", quality: "auto", format: "auto" })}
            alt={author.name}
            className="w-16 h-16 rounded-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {author.name}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {author.jobTitle}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
        {author.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {author.sameAs.map((link) => {
          const Icon = platformConfig[link.platform]?.icon ?? Globe;
          const color = platformConfig[link.platform]?.color ?? "#555";
          return (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              title={link.platform}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white transition-all hover:opacity-80"
              style={{ backgroundColor: color }}
            >
              <Icon className="w-3.5 h-3.5" />
              {link.platform}
            </a>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
        <Link
          to="/about-alamin-rafi"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
        >
          Learn More About Me
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
