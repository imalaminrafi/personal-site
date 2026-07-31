import { Link } from "react-router-dom";
import { useEffect } from "react";
import { loadAboutData } from "@/data/aboutData";
import { getSitewideSchemas, generateSiteBreadcrumbSchema, getBaseUrl } from "@/utils/seoUtils";
import { getOptimizedUrl, getThumbnailUrl } from "@/utils/cloudinary";
import Header from "@/components/professional/Header";
import Footer from "@/components/professional/Footer";
import {
  ArrowRight, Mail, MessageCircle, ExternalLink, Briefcase, GraduationCap,
  Award, Code2, Target, Heart, Zap, TrendingUp, Eye, RefreshCw, Users,
  BookOpen, Monitor, Palette, Search, Globe, Layout, FileText, Building2, CheckCircle2, Quote
} from "lucide-react";

const toolIcons: Record<string, React.ReactNode> = {
  "Photoshop": <Palette className="w-5 h-5" />,
  "Illustrator": <Palette className="w-5 h-5" />,
  "WordPress": <Globe className="w-5 h-5" />,
  "Microsoft Office": <FileText className="w-5 h-5" />,
  "Google Workspace": <Layout className="w-5 h-5" />,
  "VS Code": <Code2 className="w-5 h-5" />,
  "GitHub": <Code2 className="w-5 h-5" />,
  "Canva": <Palette className="w-5 h-5" />,
  "Adobe Creative Cloud": <Palette className="w-5 h-5" />,
  "Figma": <Layout className="w-5 h-5" />,
  "Semrush": <Search className="w-5 h-5" />,
  "Google Analytics": <TrendingUp className="w-5 h-5" />,
  "Google Search Console": <Search className="w-5 h-5" />,
  "Trello": <Layout className="w-5 h-5" />,
  "Slack": <MessageCircle className="w-5 h-5" />,
};

const valueIcons: Record<string, React.ReactNode> = {
  "Continuous Learning": <BookOpen className="w-5 h-5" />,
  "Attention to Detail": <Eye className="w-5 h-5" />,
  "Client Communication": <MessageCircle className="w-5 h-5" />,
  "Problem Solving": <Zap className="w-5 h-5" />,
  "Reliable Delivery": <Target className="w-5 h-5" />,
  "Professional Ethics": <Heart className="w-5 h-5" />,
  "Team Collaboration": <Users className="w-5 h-5" />,
  "Adaptability": <RefreshCw className="w-5 h-5" />,
};

const focusIcons: Record<string, React.ReactNode> = {
  "Professional Website Development": <Monitor className="w-5 h-5" />,
  "SEO & Content Strategy": <Search className="w-5 h-5" />,
  "Digital Marketing": <TrendingUp className="w-5 h-5" />,
  "Graphic Design": <Palette className="w-5 h-5" />,
  "Business Growth Solutions": <Target className="w-5 h-5" />,
};

function getIcon(title: string, fallback: React.ReactNode = <CheckCircle2 className="w-5 h-5" />) {
  return focusIcons[title] || toolIcons[title] || valueIcons[title] || fallback;
}

export default function AboutAlaminRafi() {
  const data = loadAboutData();
  const baseUrl = getBaseUrl();

  useEffect(() => {
    document.title = `${data.hero.name} — ${data.hero.title}`;

    const metaDescription = data.hero.paragraphs[0]?.slice(0, 160) || `Learn all about ${data.hero.name}.`;

    const setMeta = (name: string, content: string) => {
      const sel = `meta[property="${name}"], meta[name="${name}"]`;
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        if (name.startsWith("og:")) el.setAttribute("property", name);
        else el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    setMeta("description", metaDescription);
    setMeta("keywords", `${data.hero.name}, ${data.hero.name} portfolio, ${data.hero.name} web developer, web project manager, digital specialist`);
    setMeta("robots", "index, follow, max-image-preview:large");
    setMeta("og:type", "profile");
    setMeta("og:title", `${data.hero.name} — ${data.hero.title}`);
    setMeta("og:description", metaDescription);
    setMeta("og:image", `${baseUrl}${data.hero.image}`);
    setMeta("og:url", `${baseUrl}/about-alamin-rafi`);
    setMeta("og:site_name", data.hero.name);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", `${data.hero.name} — ${data.hero.title}`);
    setMeta("twitter:description", metaDescription);
    setMeta("twitter:image", `${baseUrl}${data.hero.image}`);
    setLink("canonical", `${baseUrl}/about-alamin-rafi`);

    const schemas = [
      ...getSitewideSchemas(),
      generateSiteBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: `About ${data.hero.name}`, path: "/about-alamin-rafi" },
      ]),
    ].filter(Boolean);

    const container = document.head;
    schemas.forEach((schema, i) => {
      const id = `schema-${i}`;
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement("script");
        el.id = id;
        el.setAttribute("type", "application/ld+json");
        container.appendChild(el);
      }
      el.textContent = JSON.stringify(schema, null, 2);
    });

    return () => {
      document.title = `${data.hero.name} — Website Developer & Designer`;
      setMeta("description", "Professional website developer and designer crafting modern, SEO-optimized digital experiences.");
      setMeta("keywords", "");
      setMeta("robots", "index, follow");
      [
        "og:type", "og:title", "og:description", "og:image", "og:url",
        "og:site_name", "twitter:card", "twitter:title", "twitter:description", "twitter:image",
      ].forEach((n) => {
        const el = document.querySelector(`meta[property="${n}"], meta[name="${n}"]`);
        if (el) el.remove();
      });
      setLink("canonical", baseUrl);
      for (let i = 0; i < 10; i++) {
        const el = document.getElementById(`schema-${i}`);
        if (el) el.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#070711]">
      <Header />

      <main>
        {/* ===== SECTION 1: HERO ===== */}
        {data.visibility.hero && (
          <section className="relative overflow-hidden bg-gradient-to-br from-violet-600/10 via-transparent to-cyan-500/10 dark:from-violet-600/5 dark:to-cyan-500/5 pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8 inline-block">
                <img
                  src={getOptimizedUrl(data.hero.image, { width: 400, crop: "fill", quality: "auto", format: "auto" })}
                  alt={data.hero.name}
                  loading="lazy"
                  decoding="async"
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-xl shadow-violet-500/10"
                />
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-zinc-900 dark:text-white mb-4 leading-tight">
                {data.hero.name}
              </h1>
              <p className="text-xl sm:text-2xl font-medium text-violet-600 dark:text-violet-400 mb-8">
                {data.hero.title}
              </p>
              <div className="max-w-2xl mx-auto space-y-4 text-left mb-8">
                {data.hero.paragraphs.map((p, i) => (
                  <p key={i} className="text-zinc-600 dark:text-zinc-300 text-base sm:text-lg leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {data.hero.socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white/80 dark:bg-white/[0.05] border border-zinc-100 dark:border-white/[0.08] text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-200 dark:hover:border-violet-800/40 transition-all"
                  >
                    {social.platform}
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== SECTION 2: PROFESSIONAL SUMMARY ===== */}
        {data.visibility.summary && (
          <section className="max-w-4xl mx-auto px-6 py-20">
            <div className="relative">
              <div className="absolute -top-6 -left-6 text-violet-200 dark:text-violet-900/40">
                <Quote className="w-16 h-16" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mb-8 relative">
                {data.summary.heading}
              </h2>
              <div className="space-y-5 text-zinc-600 dark:text-zinc-300 text-base sm:text-lg leading-relaxed">
                {data.summary.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== SECTION 3: CURRENT FOCUS ===== */}
        {data.visibility.focus && (
          <section className="bg-zinc-50 dark:bg-zinc-900/20 px-6 py-20">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mb-4 text-center">
                {data.focus.heading}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-center max-w-2xl mx-auto mb-12 text-base sm:text-lg">
                {data.focus.subheading}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {data.focus.items.map((item, i) => (
                  <div
                    key={i}
                    className="group p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-white/[0.05] hover:border-violet-200 dark:hover:border-violet-800/40 hover:shadow-lg hover:shadow-violet-500/5 transition-all"
                  >
                    <div className="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                      {getIcon(item.title, <Target className="w-5 h-5" />)}
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== SECTION 4: PROFESSIONAL EXPERIENCE ===== */}
        {data.visibility.experience && (
          <section className="max-w-4xl mx-auto px-6 py-20">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mb-12">
              {data.experience.heading}
            </h2>
            <div className="relative">
              <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-violet-500 via-cyan-500 to-violet-500 hidden sm:block" />
              <div className="space-y-8">
                {data.experience.items.map((item, i) => (
                  <div key={i} className="relative sm:pl-14">
                    <div className="hidden sm:flex absolute left-2.5 top-1.5 w-5 h-5 rounded-full bg-white dark:bg-zinc-900 border-2 border-violet-500 items-center justify-center z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    </div>
                    <div className="sm:hidden flex items-center gap-3 mb-3">
                      <div className="w-3 h-3 rounded-full bg-violet-500 shrink-0" />
                      <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">{item.period}</span>
                    </div>
                    <div className="bg-white dark:bg-zinc-900/40 rounded-2xl border border-zinc-100 dark:border-white/[0.05] p-6 hover:border-violet-200 dark:hover:border-violet-800/40 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{item.title}</h3>
                          <p className="text-violet-600 dark:text-violet-400 font-medium text-sm">{item.company}</p>
                        </div>
                        <span className="hidden sm:block text-xs font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg shrink-0">{item.period}</span>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== SECTION 5: SKILLS ===== */}
        {data.visibility.skills && (
          <section className="bg-zinc-50 dark:bg-zinc-900/20 px-6 py-20">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mb-12 text-center">
                {data.skills.heading}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.skills.categories.map((cat, i) => (
                  <div key={i} className="bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-100 dark:border-white/[0.05] p-6">
                    <h3 className="text-sm font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-4">
                      {cat.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map((skill, j) => (
                        <span
                          key={j}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/[0.06]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== SECTION 6: EDUCATION ===== */}
        {data.visibility.education && (
          <section className="max-w-4xl mx-auto px-6 py-20">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mb-12 text-center">
              {data.education.heading}
            </h2>
            <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
              {data.education.items.map((item, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900/40 rounded-2xl border border-zinc-100 dark:border-white/[0.05] p-6 text-center hover:border-violet-200 dark:hover:border-violet-800/40 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">{item.degree}</h3>
                  <p className="text-sm text-violet-600 dark:text-violet-400 font-medium mb-2">{item.institution}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.period}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== SECTION 7: CERTIFICATIONS ===== */}
        {data.visibility.certifications && (
          <section className="bg-zinc-50 dark:bg-zinc-900/20 px-6 py-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mb-12 text-center">
                {data.certifications.heading}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-3xl mx-auto">
                {data.certifications.items.map((item, i) => (
                  <div key={i} className="bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-100 dark:border-white/[0.05] p-6 hover:border-violet-200 dark:hover:border-violet-800/40 transition-all group">
                    <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1 leading-snug">{item.name}</h3>
                    <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">{item.issuer}</p>
                    {item.year && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">{item.year}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== SECTION 8: SOFTWARE & TOOLS ===== */}
        {data.visibility.tools && (
          <section className="max-w-4xl mx-auto px-6 py-20">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mb-12 text-center">
              {data.tools.heading}
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {data.tools.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-100 dark:border-white/[0.05] hover:border-violet-200 dark:hover:border-violet-800/40 hover:bg-violet-50/50 dark:hover:bg-violet-900/20 transition-all group"
                >
                  <span className="text-violet-500 dark:text-violet-400 group-hover:scale-110 transition-transform">
                    {toolIcons[item.name] || <Code2 className="w-4 h-4" />}
                  </span>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{item.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== SECTION 9: PERSONAL VALUES ===== */}
        {data.visibility.values && (
          <section className="bg-zinc-50 dark:bg-zinc-900/20 px-6 py-20">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mb-4 text-center">
                {data.values.heading}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-center max-w-lg mx-auto mb-12">
                {data.values.subheading}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.values.items.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-100 dark:border-white/[0.05] p-5 hover:border-violet-200 dark:hover:border-violet-800/40 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-3 group-hover:scale-110 transition-transform">
                      {getIcon(item.title, <Heart className="w-5 h-5" />)}
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1.5">{item.title}</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== SECTION 10: CALL TO ACTION ===== */}
        {data.visibility.cta && (
          <section className="relative overflow-hidden px-6 py-20">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-transparent to-cyan-500/5 dark:from-violet-600/10 dark:to-cyan-500/10" />
            <div className="relative max-w-2xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white mb-4">
                {data.cta.heading}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-10 max-w-md mx-auto">
                {data.cta.subheading}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to={data.cta.buttonLink}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20"
                >
                  {data.cta.buttonText} <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={`mailto:hello@alaminrafi.com`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20"
                >
                  <Mail className="w-4 h-4" /> Email Me
                </a>
                <a
                  href="https://wa.me/8801917443161"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-zinc-200 dark:border-white/[0.08] text-zinc-900 dark:text-white font-bold text-sm hover:border-violet-200 dark:hover:border-violet-800/40 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
                >
                  <ExternalLink className="w-4 h-4" /> View Portfolio
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
