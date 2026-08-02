import { Brain, Globe, TrendingUp, Rocket, ArrowRight } from "lucide-react";

const services = [
    {
        icon: <Brain className="h-8 w-8" />,
        title: "AI Business Strategy",
        description: "Practical AI plans to automate busywork, save time, and grow revenue.",
        color: "violet",
    },
    {
        icon: <Globe className="h-8 w-8" />,
        title: "Professional Website",
        description: "Fast, modern, mobile-first websites built to win customers.",
        color: "cyan",
    },
    {
        icon: <TrendingUp className="h-8 w-8" />,
        title: "Digital Growth Consulting",
        description: "Clear advice on SEO, content, and marketing that actually converts.",
        color: "emerald",
    },
    {
        icon: <Rocket className="h-8 w-8" />,
        title: "Online Business Setup",
        description: "From idea to online store — launched ready to sell globally.",
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
                            <div className={`h-14 w-14 rounded-full flex items-center justify-center mb-3 ${colorMap[service.color]}`}>
                                {service.icon}
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1.5">{service.title}</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-2">{service.description}</p>
                            <a
                                href="#contact"
                                className="mt-auto pt-3 inline-flex items-center gap-1 text-[#C9A84C] font-semibold text-sm group-hover:gap-2 transition-all"
                            >
                                Learn More <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
