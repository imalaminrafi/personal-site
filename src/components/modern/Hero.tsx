import { Github, Linkedin, Twitter, Sparkles } from "lucide-react";

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
      className="w-10 h-10 rounded-xl bg-white/[0.06] backdrop-blur-md border border-white/10
        flex items-center justify-center text-white hover:text-[#C9A84C] hover:border-[#C9A84C]/40
        transition-colors"
    >
      {icon}
    </a>
  );
}

/* ─── Floating particles (subtle, deterministic) ────────────────────── */
const particles = [
  { left: "6%",  size: 3, duration: "12s", delay: "0s",    drift: "14px" },
  { left: "14%", size: 4, duration: "15s", delay: "1.6s",  drift: "-16px" },
  { left: "23%", size: 3, duration: "11s", delay: "3.1s",  drift: "10px" },
  { left: "31%", size: 2, duration: "14s", delay: "0.9s",  drift: "-12px" },
  { left: "40%", size: 3, duration: "13s", delay: "4.4s",  drift: "18px" },
  { left: "48%", size: 4, duration: "16s", delay: "2.2s",  drift: "-10px" },
  { left: "56%", size: 2, duration: "12s", delay: "5.5s",  drift: "12px" },
  { left: "64%", size: 3, duration: "15s", delay: "1.1s",  drift: "-18px" },
  { left: "72%", size: 4, duration: "13s", delay: "3.8s",  drift: "10px" },
  { left: "79%", size: 3, duration: "14s", delay: "0.4s",  drift: "-14px" },
  { left: "86%", size: 2, duration: "12s", delay: "2.9s",  drift: "16px" },
  { left: "93%", size: 3, duration: "16s", delay: "4.9s",  drift: "-8px" },
];

/* ─── Main Hero ─────────────────────────────────────────────────────── */
export default function ModernHeroVisual() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-[#0A1628]">

      {/* ─── Subdued background image (kept as subtle texture) ─── */}
      <div className="absolute inset-0 z-0 opacity-[0.14]">
        <picture>
          <source type="image/avif" srcSet="/5.avif" sizes="100vw" />
          <source type="image/webp" srcSet="/5-800.webp 800w, /5.webp 1536w" sizes="100vw" />
          <img
            src="/5.png"
            alt="Alamin Rafi - AI & Digital Strategy"
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            width={1536}
            height={1024}
          />
        </picture>
      </div>

      {/* Navy overlay + subtle grid */}
      <div className="absolute inset-0 z-0 bg-[#0A1628]/70" />
      <div className="absolute inset-0 z-0 hero-grid-texture opacity-50" />

      {/* Soft gold glow orbs */}
      <div className="hero-glow-orb w-[28rem] h-[28rem] -top-32 left-1/2 -translate-x-1/2" />
      <div className="hero-glow-orb w-80 h-80 bottom-0 right-8" style={{ animationDelay: "2.2s" }} />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <span
          key={i}
          className="hero-particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            "--duration": p.duration,
            "--delay": p.delay,
            "--drift": p.drift,
          } as React.CSSProperties}
        />
      ))}

      {/* ─── Centered Content ─── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20 text-center">

        <div className="gold-eyebrow mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          AI &amp; Digital Strategy
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.08] tracking-tight mb-6 drop-shadow-xl">
          From Small Business to{" "}
          <span className="bg-gradient-to-r from-[#C9A84C] to-[#E6C97A] bg-clip-text text-transparent">
            Smart Business
          </span>{" "}
          — with AI
        </h1>

        <p className="text-zinc-200 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-12 drop-shadow-sm font-medium">
          I help small businesses worldwide grow smarter with AI-driven strategy, high-performance websites, and digital marketing that turns visitors into customers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <a href="#contact" className="btn-gold w-full sm:w-auto px-10 py-4 text-base rounded-lg">
            Work With Me
          </a>
          <a href="#services" className="btn-gold-outline w-full sm:w-auto px-10 py-4 text-base rounded-lg">
            See My Services
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
