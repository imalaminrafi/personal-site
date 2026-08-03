const experiences = [
    {
        company: "RangTVBD.com",
        title: "Content & SEO Manager",
        period: "Jul 2025 – Dec 2025",
        type: "Part-time",
        description: "Leading web content management and SEO strategy for a growing digital media platform.",
        responsibilities: [
            "Lead SEO strategy and WordPress content optimization, improving organic search rankings and website traffic by 150%+",
            "Manage editorial calendar and oversee content production workflow for 500k+ monthly readers",
            "Implement technical SEO improvements and monitor site performance using Google Analytics & Search Console",
            "Collaborate with the development team to ensure SEO best practices in site architecture and page speed",
        ],
    },
    {
        company: "Medi-Aid Hospital",
        title: "Digital Operations Officer",
        period: "June 2023 – December 2023",
        type: "Full-time",
        description: "Managed the hospital's complete digital presence, driving patient acquisition through web and marketing strategies.",
        responsibilities: [
            "Managed hospital's WordPress website, social media, and online patient engagement systems",
            "Developed and executed digital marketing campaigns to increase patient acquisition and brand awareness",
            "Coordinated with medical staff to create accurate, compliant healthcare web content",
            "Analyzed digital metrics and provided strategic recommendations for operational improvements",
        ],
    },
    {
        company: "Orthosongbad.com",
        title: "SEO Specialist (Contract)",
        period: "March 2023 – May 2023",
        type: "Contract",
        description: "Delivered a full SEO overhaul for a financial news portal, with measurable improvements in organic visibility.",
        responsibilities: [
            "Conducted comprehensive SEO audits and implemented technical optimization strategies",
            "Performed keyword research and competitive analysis to guide content and site planning",
            "Optimized on-page elements including meta tags, schema markup, headers, and internal linking",
            "Delivered measurable improvements in search visibility and organic traffic within 3 months",
        ],
    },
    {
        company: "Independent Projects",
        title: "Web Developer & UI/UX Designer",
        period: "2021 – 2023",
        type: "Independent",
        description: "Built websites, landing pages, and UI designs for clients across various industries.",
        responsibilities: [
            "Designed and developed custom WordPress websites and landing pages for small businesses",
            "Created UI/UX designs with Figma including wireframes, prototypes, and design systems",
            "Executed integrated digital marketing campaigns across social media and email channels",
            "Managed client relationships and delivered projects within scope, budget, and timeline",
        ],
    },
    {
        company: "Fiverr & Upwork",
        title: "Web Designer & Digital Marketer",
        period: "2020 – 2021",
        type: "Independent",
        description: "International client work serving businesses from the US, UK, and across South Asia.",
        responsibilities: [
            "Provided web design, WordPress setup, and digital marketing services to international clients",
            "Earned strong client satisfaction through quality deliverables and clear communication",
            "Managed multiple concurrent projects with varying requirements and tight deadlines",
            "Built a strong portfolio demonstrating versatility across design styles and industries",
        ],
    },
];

const typeColor: Record<string, string> = {
    "Full-time": "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
    "Part-time": "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    "Contract": "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
    "Independent": "bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400",
};

export default function ProfessionalExperience() {
    return (
        <section className="bg-white dark:bg-[#0F172A] py-24 border-t border-zinc-100 dark:border-zinc-800">
            <div className="max-w-6xl mx-auto px-6">
                <p className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">Experience</p>
                <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-16 max-w-2xl leading-snug">
                    Where I've worked &amp; what I've built
                </h2>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-violet-500 via-cyan-400 to-transparent hidden md:block ml-[11px]" />

                    <div className="space-y-12">
                        {experiences.map((exp, index) => (
                            <div key={index} className="md:pl-12 relative">
                                {/* Timeline dot */}
                                <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-2 border-violet-500 bg-white dark:bg-[#0F172A] hidden md:flex items-center justify-center">
                                    <div className="h-2 w-2 rounded-full bg-violet-500" />
                                </div>

                                <div className="bg-zinc-50 dark:bg-[#162032] rounded-2xl p-7 border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-shadow duration-300">
                                    {/* Header */}
                                    <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
                                        <div>
                                            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">{exp.title}</h3>
                                            <p className="text-violet-600 dark:text-violet-400 font-medium mt-0.5">{exp.company}</p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${typeColor[exp.type]}`}>{exp.type}</span>
                                            <span className="text-sm text-zinc-400 dark:text-zinc-500">{exp.period}</span>
                                        </div>
                                    </div>

                                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-3 mb-5 leading-relaxed">{exp.description}</p>

                                    <ul className="space-y-2">
                                        {exp.responsibilities.map((resp, idx) => (
                                            <li key={idx} className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed flex items-start gap-2.5">
                                                <span className="text-violet-500 mt-1 shrink-0">▸</span>
                                                {resp}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
