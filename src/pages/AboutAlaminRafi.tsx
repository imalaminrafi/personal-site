import { Link } from "react-router-dom";
import { useEffect } from "react";
import { author, contentClusterIdeas } from "@/data/author";
import { getPostBySlug } from "@/data/blogData";
import {
  Code2, Palette, Layout, Globe, Search, Megaphone,
  Smartphone, ShoppingCart, FileText, Building2,
  Mail, Phone, MapPin, Languages, User,
  ArrowRight, ExternalLink, MessageCircle
} from "lucide-react";
import Header from "@/components/professional/Header";
import Footer from "@/components/professional/Footer";
import { getAuthorSchema, getWebsiteSchema, getOrganizationSchema, getSitewideSchemas, generateSiteBreadcrumbSchema, getBaseUrl } from "@/utils/seoUtils";

const skillIcons: Record<string, React.ReactNode> = {
  "Web Development": <Code2 className="w-5 h-5" />,
  "Website Design": <Palette className="w-5 h-5" />,
  "UI/UX Design": <Layout className="w-5 h-5" />,
  "WordPress": <Globe className="w-5 h-5" />,
  "SEO": <Search className="w-5 h-5" />,
  "Digital Marketing": <Megaphone className="w-5 h-5" />,
  "Front-End Development": <Code2 className="w-5 h-5" />,
  "Responsive Design": <Smartphone className="w-5 h-5" />,
  "E-Commerce": <ShoppingCart className="w-5 h-5" />,
  "Landing Page Design": <FileText className="w-5 h-5" />,
  "Business Website": <Building2 className="w-5 h-5" />,
  "Portfolio Website": <FileText className="w-5 h-5" />,
};

const services = [
  { title: "Website Design", description: "Custom website design tailored to your brand identity and business goals." },
  { title: "Web Development", description: "Modern, responsive websites built with the latest technologies and best practices." },
  { title: "WordPress", description: "Professional WordPress development, customization, and optimization services." },
  { title: "UI/UX Design", description: "User-centered design that enhances engagement, usability, and conversions." },
  { title: "SEO", description: "Search engine optimization to improve rankings and drive organic traffic." },
  { title: "Digital Marketing", description: "Strategic digital marketing to grow your online presence and reach." },
];

export default function AboutAlaminRafi() {
  const baseUrl = getBaseUrl();

  useEffect(() => {
    document.title = "Alamin Rafi — Website Developer & Designer | Bangladesh";

    const metaDescription =
      "Learn all about Alamin Rafi — a professional website developer and designer from Bangladesh. Discover his expertise in web development, UI/UX design, WordPress, SEO, and digital marketing.";

    setMeta("description", metaDescription);
    setMeta("keywords", "Alamin Rafi, Alamin Rafi website developer, Alamin Rafi Bangladesh, Web developer Bangladesh, Website designer, Alamin Rafi portfolio, Alamin Rafi SEO");
    setMeta("robots", "index, follow, max-image-preview:large");
    setMeta("og:type", "profile");
    setMeta("og:title", "Alamin Rafi — Website Developer & Designer | Bangladesh");
    setMeta("og:description", metaDescription);
    setMeta("og:image", `${baseUrl}${author.image}`);
    setMeta("og:url", `${baseUrl}/about-alamin-rafi`);
    setMeta("og:site_name", "Alamin Rafi");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", "Alamin Rafi — Website Developer & Designer | Bangladesh");
    setMeta("twitter:description", metaDescription);
    setMeta("twitter:image", `${baseUrl}${author.image}`);
    setLink("canonical", `${baseUrl}/about-alamin-rafi`);

    const schemas = [
      ...getSitewideSchemas(),
      generateSiteBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "About Alamin Rafi", path: "/about-alamin-rafi" },
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
      document.title = "Alamin Rafi — Website Developer & Designer";
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

  function setMeta(name: string, content: string) {
    const sel = `meta[property="${name}"], meta[name="${name}"]`;
    let el = document.querySelector(sel) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement("meta");
      if (name.startsWith("og:")) el.setAttribute("property", name);
      else el.setAttribute("name", name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function setLink(rel: string, href: string) {
    let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!el) {
      el = document.createElement("link");
      el.setAttribute("rel", rel);
      document.head.appendChild(el);
    }
    el.setAttribute("href", href);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#070711]">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-600/10 via-transparent to-cyan-500/10 dark:from-violet-600/5 dark:to-cyan-500/5 pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 inline-block">
              <img
                src={author.image}
                alt={author.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-xl shadow-violet-500/10"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-zinc-900 dark:text-white mb-4 leading-tight">
              {author.name}
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-violet-600 dark:text-violet-400 mb-6">
              {author.jobTitle} | {author.address.country}
            </p>
            <p className="text-zinc-600 dark:text-zinc-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              {author.description.slice(0, 200)}...
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {author.sameAs.map((social) => (
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

        {/* About Me Section */}
        <section className="max-w-4xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-[1fr_280px] gap-12 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mb-6">About Me</h2>
              <div className="text-zinc-600 dark:text-zinc-300 text-base leading-relaxed space-y-4">
                <p>{author.description}</p>
                <p>
                  With a deep understanding of both design and development, Alamin bridges the gap between aesthetics
                  and functionality. Every project he takes on is built with performance, accessibility, and search
                  engine visibility in mind. He believes that a great website is not just about looking good — it should
                  also load fast, be easy to navigate, and convert visitors into customers.
                </p>
                <p>
                  Based in Bangladesh, Alamin works with clients worldwide, offering end-to-end web solutions from
                  concept to launch. Whether you need a simple landing page, a full business website, or an e-commerce
                  store, Alamin delivers results that exceed expectations.
                </p>
              </div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-100 dark:border-white/[0.05] p-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-5 pb-4 border-b border-zinc-100 dark:border-white/[0.05]">Personal Info</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Name</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">{author.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Email</p>
                    <a href={`mailto:${author.email}`} className="text-sm font-bold text-zinc-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{author.email}</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Phone</p>
                    <a href={`tel:${author.telephone}`} className="text-sm font-bold text-zinc-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{author.telephone}</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Location</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">{author.address.locality}, {author.address.country}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Nationality</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">{author.nationality}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Languages className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Languages</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">English, Bengali</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        <section className="bg-zinc-50 dark:bg-zinc-900/20 px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mb-4 text-center">What I Do</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-center max-w-lg mx-auto mb-12">
              Specialized services to help your business grow online with modern web solutions.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {author.knowsAbout.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-white/[0.05] hover:border-violet-200 dark:hover:border-violet-800/40 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform shrink-0">
                    {skillIcons[skill] || <Code2 className="w-5 h-5" />}
                  </div>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Content Cluster Section */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mb-4">Articles by Alamin Rafi</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-10 max-w-lg">
            In-depth guides, tips, and resources written to help you build a better online presence.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentClusterIdeas.map((item) => {
              const post = getPostBySlug(item.slug);
              const isPublished = post && post.status === "published";
              return (
                <div
                  key={item.slug}
                  className={`rounded-2xl border ${isPublished ? "border-zinc-100 dark:border-white/[0.05] bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-violet-200 dark:hover:border-violet-800/40" : "border-zinc-100 dark:border-white/[0.05] bg-zinc-50/30 dark:bg-zinc-900/20 opacity-60"} transition-all p-5`}
                >
                  {isPublished ? (
                    <Link to={`/blog/${item.slug}`} className="block group">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">{item.keyword}</p>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{item.title}</h3>
                      <div className="mt-3 flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 font-bold">
                        Read Article <ArrowRight className="w-3 h-3" />
                      </div>
                    </Link>
                  ) : (
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-2">{item.keyword}</span>
                      <h3 className="text-sm font-bold text-zinc-500 dark:text-zinc-500">{item.title}</h3>
                      <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-600 font-medium">Coming Soon</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Services Summary */}
        <section className="bg-zinc-50 dark:bg-zinc-900/20 px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mb-4 text-center">Services</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-center max-w-lg mx-auto mb-12">
              Everything you need to establish a powerful online presence.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-white/[0.05]"
                >
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">{service.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20"
              >
                Get a Free Consultation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white mb-4">Let's Work Together</h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-10">
            Have a project in mind? Let's build something great together.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a
              href={`mailto:${author.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20"
            >
              <Mail className="w-4 h-4" /> Email Me
            </a>
            <a
              href={author.sameAs.find((s) => s.platform === "WhatsApp")?.url || "https://wa.me/8801917443161"}
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
        </section>
      </main>

      <Footer />
    </div>
  );
}
