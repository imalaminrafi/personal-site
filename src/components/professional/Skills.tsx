/* ─── Skill Categories ───────────────────────────────────────────────── */
const skillGroups = [
    {
        category: "Frontend Development",
        icon: "🌐",
        accent: "violet",
        skills: [
            "Responsive Web Design",
            "Modern UI Implementation",
            "Mobile-First Design",
            "Cross-Device Compatibility",
            "Website Performance Optimization",
        ],
    },
    {
        category: "Website Development",
        icon: "💻",
        accent: "cyan",
        skills: [
            "Custom Website Creation",
            "Landing Page Development",
            "Website Customization",
            "Multi-Page Websites",
            "Contact & Booking Forms",
            "Speed & SEO Optimization",
        ],
    },
    {
        category: "CMS & Website Builders",
        icon: "⚙️",
        accent: "indigo",
        skills: [
            "WordPress Development",
            "Elementor / Page Builders",
            "Theme Customization",
            "Plugin Integration",
            "WooCommerce Setup",
            "Website Management",
        ],
    },
    {
        category: "UI/UX Design",
        icon: "🎨",
        accent: "pink",
        skills: [
            "User Interface Design",
            "Wireframing & Prototyping",
            "Design Systems",
            "Visual Layout & Typography",
            "Brand-Consistent Design",
        ],
    },
    {
        category: "Tools & Workflow",
        icon: "🛠️",
        accent: "emerald",
        skills: [
            "VS Code",
            "Git & GitHub (Basic)",
            "Vercel / Netlify Deployment",
            "cPanel & Web Hosting",
            "Browser DevTools",
        ],
    },
    {
        category: "Client & Project Skills",
        icon: "🤝",
        accent: "amber",
        skills: [
            "Client Communication",
            "Project Planning",
            "Requirement Analysis",
            "Timely Delivery",
            "Revision Management",
            "Problem Solving",
        ],
    },
] as const;

/* ─── Accent colour maps ─────────────────────────────────────────────── */
type Accent = (typeof skillGroups)[number]["accent"];

const iconBg: Record<Accent, string> = {
    violet: "bg-[#C9A84C]/12 text-[#C9A84C] dark:bg-[#C9A84C]/15 dark:text-[#E0C77E]",
    cyan:   "bg-slate-100 text-slate-600 dark:bg-slate-400/10 dark:text-slate-300",
    indigo: "bg-blue-100 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
    pink:   "bg-rose-100 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300",
    emerald:"bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
    amber:  "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
};

const badgeHover: Record<Accent, string> = {
    violet: "hover:bg-[#C9A84C]/15 hover:text-[#B08C36] dark:hover:bg-[#C9A84C]/20 dark:hover:text-[#E0C77E]",
    cyan:   "hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-400/20 dark:hover:text-slate-200",
    indigo: "hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-400/20 dark:hover:text-blue-200",
    pink:   "hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-400/20 dark:hover:text-rose-200",
    emerald:"hover:bg-emerald-100 hover:text-emerald-800 dark:hover:bg-emerald-400/20 dark:hover:text-emerald-200",
    amber:  "hover:bg-amber-100 hover:text-amber-800 dark:hover:bg-amber-400/20 dark:hover:text-amber-200",
};

const borderAccent: Record<Accent, string> = {
    violet: "hover:border-[#C9A84C]/50 dark:hover:border-[#C9A84C]/40",
    cyan:   "hover:border-slate-200 dark:hover:border-slate-500/50",
    indigo: "hover:border-blue-200 dark:hover:border-blue-500/50",
    pink:   "hover:border-rose-200 dark:hover:border-rose-500/50",
    emerald:"hover:border-emerald-200 dark:hover:border-emerald-500/50",
    amber:  "hover:border-amber-200 dark:hover:border-amber-500/50",
};

/* ─── Component ──────────────────────────────────────────────────────── */
export default function ProfessionalSkills() {
    return (
        <section className="bg-zinc-50 dark:bg-[#1E293B] py-16 sm:py-24 border-t border-zinc-100 dark:border-[#1E3A5F]">

            {/* Section header */}
            <div className="max-w-6xl mx-auto px-5 sm:px-6">
                <p className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">
                    Skills
                </p>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-16">
                    <h2 className="text-2xl sm:text-4xl font-bold text-zinc-900 dark:text-white max-w-lg leading-snug">
                        Tools &amp; expertise{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500">
                            in every project
                        </span>
                    </h2>
                    <p className="hidden sm:block text-zinc-500 dark:text-zinc-400 text-sm max-w-xs leading-relaxed sm:text-right">
                        A small, dedicated team focused on modern, high-performing websites.
                    </p>
                </div>
            </div>

            {/* ════════════════════════════════════════
                MOBILE: Horizontal swipe carousel
            ════════════════════════════════════════ */}
            <div className="sm:hidden relative">
                {/* Swipe hint */}
                <div className="flex items-center justify-between px-5 mb-3">
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                        {skillGroups.length} skill areas
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-violet-500 dark:text-violet-400">
                        Swipe
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>

                {/* Scroll track */}
                <div
                    className="flex gap-3 overflow-x-auto px-5 pb-5 snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [-webkit-overflow-scrolling:touch]"
                >
                    {skillGroups.map((group, index) => (
                        <div
                            key={index}
                            className="shrink-0 snap-start bg-white dark:bg-[#162032] rounded-2xl p-4 border border-zinc-100 dark:border-[#1E3A5F] flex flex-col w-[78vw]"
                        >
                            {/* Card header */}
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${iconBg[group.accent]}`}>
                                    {group.icon}
                                </div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight">
                                    {group.category}
                                </h3>
                            </div>

                            {/* Skill badges */}
                            <div className="flex flex-wrap gap-1.5">
                                {group.skills.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-zinc-100 dark:bg-[#1E293B] text-zinc-600 dark:text-zinc-400"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right fade */}
                <div className="pointer-events-none absolute right-0 top-8 bottom-5 w-12 bg-gradient-to-l from-zinc-50 dark:from-zinc-900 to-transparent" />
            </div>

            {/* ════════════════════════════════════════
                DESKTOP: Original grid layout
            ════════════════════════════════════════ */}
            <div className="hidden sm:block max-w-6xl mx-auto px-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skillGroups.map((group, index) => (
                        <div
                            key={index}
                            className={`group bg-white dark:bg-[#162032] rounded-2xl p-6 border border-zinc-100 dark:border-[#1E3A5F]
                                shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300
                                ${borderAccent[group.accent]}`}
                        >
                            {/* Card header */}
                            <div className="flex items-center gap-3 mb-5">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 transition-all duration-300 ${iconBg[group.accent]}`}>
                                    {group.icon}
                                </div>
                                <h3 className="text-[15px] font-semibold text-zinc-900 dark:text-white leading-tight">
                                    {group.category}
                                </h3>
                            </div>

                            {/* Skill badges */}
                            <div className="flex flex-wrap gap-2">
                                {group.skills.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className={`px-3 py-1 text-xs font-medium rounded-full
                                            bg-zinc-100 dark:bg-[#1E293B]
                                            text-zinc-600 dark:text-zinc-400
                                            transition-colors duration-200 cursor-default
                                            ${badgeHover[group.accent]}`}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom note */}
                <p className="text-center text-zinc-400 dark:text-zinc-500 text-sm mt-12">
                    Always improving and refining our process.{" "}
                    <a href="#contact" className="text-violet-600 dark:text-violet-400 hover:underline font-medium">
                        Let's build something great together. →
                    </a>
                </p>
            </div>
        </section>
    );
}
