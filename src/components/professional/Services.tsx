import { Sparkles, Code2, Figma, BarChart3 } from "lucide-react";

const services = [
    {
        icon: <Sparkles className="h-6 w-6" />,
        title: "AI Growth Strategy",
        description: "Use AI to work smarter and scale",
        color: "violet",
    },
    {
        icon: <Code2 className="h-6 w-6" />,
        title: "Web Design & Development",
        description: "Fast, modern, conversion-ready websites",
        color: "cyan",
    },
    {
        icon: <BarChart3 className="h-6 w-6" />,
        title: "SEO & Digital Marketing",
        description: "Get found and grow your customers",
        color: "emerald",
    },
    {
        icon: <Figma className="h-6 w-6" />,
        title: "UI/UX & Brand Design",
        description: "Designs your customers trust",
        color: "pink",
    },
];

const colorMap: Record<string, string> = {
    violet: "bg-[#C9A84C]/12 text-[#C9A84C] dark:bg-[#C9A84C]/15 dark:text-[#E0C77E]",
    cyan: "bg-[#C9A84C]/12 text-[#C9A84C] dark:bg-[#C9A84C]/15 dark:text-[#E0C77E]",
    indigo: "bg-[#C9A84C]/12 text-[#C9A84C] dark:bg-[#C9A84C]/15 dark:text-[#E0C77E]",
    pink: "bg-[#C9A84C]/12 text-[#C9A84C] dark:bg-[#C9A84C]/15 dark:text-[#E0C77E]",
    emerald: "bg-[#C9A84C]/12 text-[#C9A84C] dark:bg-[#C9A84C]/15 dark:text-[#E0C77E]",
};

export default function ServicesSection() {
    return (
        <section id="services" className="bg-white dark:bg-[#0A1628] py-10 sm:py-14 border-t border-zinc-100 dark:border-zinc-800">
            <div className="max-w-5xl mx-auto px-5 sm:px-6">
                <div className="mb-8 sm:mb-12">
                    <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">Services</p>
                    <h2 className="text-xl sm:text-2xl font-medium text-zinc-900 dark:text-white leading-snug">
                        Services to grow <span className="text-zinc-400">your business</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {services.map((service, i) => (
                        <div
                            key={i}
                            className="group bg-white dark:bg-[#0F2040] rounded-xl p-5 border border-zinc-200 dark:border-white/[0.08] transition-all duration-300 hover:border-[#C9A84C]/50 dark:hover:border-[#C9A84C]/40 hover:shadow-lg flex flex-col items-center text-center"
                        >
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-3 ${colorMap[service.color]}`}>
                                {service.icon}
                            </div>
                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">{service.title}</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed line-clamp-1">{service.description}</p>
                        </div>
                    ))}
                    
                    {/* Simple CTA card */}
                    <div className="bg-brand-gradient rounded-xl p-5 flex flex-col items-center justify-center text-center text-[#0A1628]">
                        <p className="text-xs font-bold mb-3">Custom Project?</p>
                        <a
                            href="#contact"
                            className="bg-[#0A1628] text-[#C9A84C] font-bold text-[10px] px-4 py-2 rounded-full hover:bg-[#0A1628]/90 transition-colors uppercase tracking-wider"
                        >
                            Contact Me
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
