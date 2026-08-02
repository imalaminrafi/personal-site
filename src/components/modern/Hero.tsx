import { Github, Linkedin, Twitter } from "lucide-react";

/* ─── Social Link ───────────────────────────────────────────────────── */
interface SocialLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

function SocialLink({ href, label, icon }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20
        flex items-center justify-center text-white hover:text-violet-400
        transition-colors"
    >
      {icon}
    </a>
  );
}

/* ─── Main Hero ─────────────────────────────────────────────────────── */
export default function ModernHeroVisual() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-zinc-900">
      
      {/* ─── Background Image with Overlay ─── */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source type="image/avif" srcSet="/5.avif" sizes="100vw" />
          <source type="image/webp" srcSet="/5-800.webp 800w, /5.webp 1536w" sizes="100vw" />
          <img
            src="/5.png"
            alt="Alamin Rafi - Digital Service Provider"
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            width={1536}
            height={1024}
          />
        </picture>
        {/* Soft light overlay (approx 25%) */}
        <div className="absolute inset-0 bg-black/25 dark:bg-black/40" />
      </div>

      {/* ─── Centered Content ─── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20 text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-bold text-white uppercase tracking-[0.2em]">
          WELCOME
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black text-white leading-[1.1] tracking-tight mb-6 drop-shadow-xl">
          I'm Alamin Rafi
        </h1>

        <h2 className="text-2xl sm:text-3xl font-bold text-violet-400 mb-8 drop-shadow-md">
          Digital Service Provider
        </h2>

        <p className="text-zinc-100 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-12 drop-shadow-sm font-medium">
          I build modern, fast, and affordable websites for businesses.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <a
            href="#contact"
            className="px-10 py-4 w-full sm:w-auto rounded-full font-bold text-white bg-violet-600 hover:bg-violet-700 transition-all text-center shadow-lg shadow-violet-600/20"
          >
            Start Project
          </a>
          <a
            href="/portfolio"
            className="px-10 py-4 w-full sm:w-auto rounded-full font-bold text-white border border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all text-center shadow-lg"
          >
            View Portfolio
          </a>
        </div>

        {/* Socials */}
        <div className="mt-16 flex items-center justify-center gap-4">
          <SocialLink href="https://github.com/imalaminrafi" label="GitHub" icon={<Github className="w-5 h-5" />} />
          <SocialLink href="https://www.linkedin.com/in/imalaminrafi/" label="LinkedIn" icon={<Linkedin className="w-5 h-5" />} />
          <SocialLink href="https://x.com/imalaminrafi" label="Twitter" icon={<Twitter className="w-5 h-5" />} />
        </div>
      </div>
    </section>
  );
}

