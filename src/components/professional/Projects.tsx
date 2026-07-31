import { useState } from "react";
import { Figma, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { getOptimizedUrl, getSrcSet } from "@/utils/cloudinary";

type Category = "All" | "UI/UX Design";

interface Project {
    title: string;
    description: string;
    category: Exclude<Category, "All">;
    tags: string[];
    image: string;
    featured?: boolean;
}

const projects: Project[] = [
    {
        title: "NovaTech Analytics",
        description: "A modern SaaS analytics dashboard with dark mode and sleek data visualizations.",
        category: "UI/UX Design",
        tags: ["SaaS Dashboard", "Dark Mode", "React"],
        image: "/projects/novatech_saas.png",
        featured: true,
    },
    {
        title: "UrbanShop E-Commerce",
        description: "A minimalist fashion storefront featuring large lifestyle imagery and seamless checkout.",
        category: "UI/UX Design",
        tags: ["E-Commerce", "Web Design", "Minimalist"],
        image: "/projects/urbanshop_ecommerce.png",
        featured: true,
    },
    {
        title: "ZenHealth Booking",
        description: "A clean, accessible healthcare booking system interface for patients and doctors.",
        category: "UI/UX Design",
        tags: ["Healthcare", "UI Concept", "Accessible"],
        image: "/projects/zenhealth_medical.png",
    },
    {
        title: "EstatePro Real Estate",
        description: "A premium property finder with high-end listings and an interactive map UI.",
        category: "UI/UX Design",
        tags: ["Web App", "Real Estate", "Luxury"],
        image: "/projects/estatepro_realestate.png",
    },
    {
        title: "FinFlow Mobile Banking",
        description: "A fintech app dashboard showing clean financial data visualization and transactions.",
        category: "UI/UX Design",
        tags: ["Fintech", "Mobile UI", "App Design"],
        image: "/projects/finflow_fintech.png",
    },
    {
        title: "CreativStudio Agency",
        description: "A vibrant creative agency portfolio featuring bold typography and dynamic layouts.",
        category: "UI/UX Design",
        tags: ["Agency", "Portfolio", "Awwwards Style"],
        image: "/projects/creativstudio_agency.png",
        featured: true,
    },
    {
        title: "CareerPro — Portfolio Website",
        description: "A clean personal portfolio & professional profile site built for a real client, featuring skills, education, and contact sections.",
        category: "UI/UX Design",
        tags: ["Personal Portfolio", "Web Design", "Client Work"],
        image: "/projects/careerpro_portfolio.png",
    },
    {
        title: "MediCare Pro — Doctor Website",
        description: "A professional medical portfolio website for a specialist physician with booking CTAs, experience timeline, and services section.",
        category: "UI/UX Design",
        tags: ["Medical Website", "Healthcare", "Client Work"],
        image: "/projects/medico_doctor_website.png",
        featured: true,
    },
];

const INITIAL_VISIBLE = 3;
const categories: Category[] = ["All", "UI/UX Design"];

const websiteTypes = [
    "Business Websites",
    "E-commerce Stores",
    "Portfolio Websites",
    "Landing Pages",
    "Booking & Service Websites",
    "Education & Course Websites",
    "Agency Websites",
];

/* ── Shared card component used by both layouts ── */
function ProjectCard({ project }: { project: Project }) {
    return (
        <div className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
            {/* Preview Image */}
            <div className="h-44 sm:h-56 relative overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                <img
                    src={getOptimizedUrl(project.image, { width: 800, crop: "limit", quality: "auto", format: "auto" })}
                    srcSet={getSrcSet(project.image) || undefined}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                />
                {project.featured && (
                    <span className="absolute top-3 right-3 bg-white/95 dark:bg-black/90 text-zinc-900 dark:text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-black/5 dark:border-white/10 shadow-sm">
                        Featured
                    </span>
                )}
                <span className="absolute bottom-3 left-3 bg-black/80 text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {project.category}
                </span>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 flex flex-col grow">
                <h3 className="text-base sm:text-xl font-bold text-zinc-900 dark:text-white leading-snug mb-1.5 sm:mb-2">{project.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4 grow">{project.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.map((tag, t) => (
                        <span key={t} className="px-2 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-md bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/50 flex items-center gap-1">
                            {tag.toLowerCase().includes("figma") ? <Figma className="w-2.5 h-2.5" /> : null}
                            {tag}
                        </span>
                    ))}
                </div>

                <a
                    href="#view-project"
                    className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group/btn"
                >
                    View Project
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                </a>
            </div>
        </div>
    );
}

interface ProjectsSectionProps {
    isLanding?: boolean;
}

export default function ProjectsSection({ isLanding = false }: ProjectsSectionProps) {
    const [activeCategory, setActiveCategory] = useState<Category>("All");
    const [showAll, setShowAll] = useState(false);

    const filtered = activeCategory === "All" ? projects : projects.filter(p => p.category === activeCategory);
    
    // On landing page, we only show 3 items max. On the full page, we use the 'See More' logic.
    const visibleCount = isLanding ? 3 : (showAll ? filtered.length : INITIAL_VISIBLE);
    const visible = filtered.slice(0, visibleCount);
    const hasMore = !isLanding && filtered.length > INITIAL_VISIBLE;

    return (
        <section id="projects" className={`bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 ${isLanding ? "py-14 sm:py-20" : "py-16 sm:py-24"}`}>

            {/* ── Section header ── */}
            <div className="max-w-6xl mx-auto px-5 sm:px-6">
                <p className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">
                    {isLanding ? "Portfolio Preview" : "Full Portfolio"}
                </p>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 sm:mb-5">
                    <h2 className="text-2xl sm:text-4xl font-bold text-zinc-900 dark:text-white max-w-lg leading-snug">
                        {isLanding ? "Selected Projects" : (
                            <>
                                Selected Work &{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500">
                                    Case Studies
                                </span>
                            </>
                        )}
                    </h2>
                    
                    {isLanding && (
                        <a 
                            href="/portfolio" 
                            className="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 font-bold hover:gap-3 transition-all"
                        >
                            View All Projects <ArrowRight className="w-5 h-5" />
                        </a>
                    )}
                </div>

                {!isLanding && (
                    <>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base mb-5 sm:mb-6 max-w-2xl leading-relaxed">
                            I design and build modern, high-quality websites tailored to different business needs.
                        </p>

                        {/* Website type pills */}
                        <div className="flex gap-2 mb-6 sm:mb-10 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible scrollbar-none">
                            {websiteTypes.map((type, i) => (
                                <span
                                    key={i}
                                    className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-full bg-white dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 shadow-sm"
                                >
                                    {type}
                                </span>
                            ))}
                        </div>

                        {/* Filter tabs */}
                        <div className="hidden sm:flex flex-wrap gap-2 mb-10">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => { setActiveCategory(cat); setShowAll(false); }}
                                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === cat
                                            ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm"
                                            : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700"
                                        }`}
                                >
                                    {cat === "UI/UX Design" ? "🎨 UI/UX Design" : "✦ All"}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visible.map((project, i) => (
                        <div
                            key={`${isLanding ? 'landing' : 'full'}-${activeCategory}-${i}`}
                        >
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>

                {/* See More / Show Less (Full page only) */}
                {!isLanding && hasMore && (
                    <div className="flex flex-col items-center gap-3 mt-12">
                        <button
                            onClick={() => setShowAll(prev => !prev)}
                            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                        >
                            {showAll ? (
                                <>Show Less <ChevronUp className="w-4 h-4" /></>
                            ) : (
                                <>See More Projects <ChevronDown className="w-4 h-4" /></>
                            )}
                        </button>
                    </div>
                )}

                {isLanding && (
                    <div className="mt-12 flex justify-center sm:hidden">
                         <a 
                            href="/portfolio" 
                            className="px-8 py-3 rounded-full bg-violet-600 text-white font-bold shadow-lg shadow-violet-600/20"
                        >
                            View All Projects
                        </a>
                    </div>
                )}

                {/* Bottom note */}
                {!isLanding && (
                    <p className="text-center text-zinc-400 dark:text-zinc-500 text-sm mt-14">
                        Selected works created for diverse clients across multiple industries.
                    </p>
                )}
            </div>

            <style>{`
                .scrollbar-none::-webkit-scrollbar { display: none; }
            `}</style>
        </section>
    );
}

