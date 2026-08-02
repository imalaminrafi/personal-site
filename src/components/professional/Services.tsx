import { Brain, Globe, TrendingUp, Rocket, Palette, ArrowRight } from "lucide-react";

const services = [
    {
        icon: <Brain className="h-7 w-7" />,
        title: "AI Business Strategy",
        description: "Practical AI plans to automate busywork, save time, and grow revenue.",
        cta: "Learn More",
    },
    {
        icon: <Globe className="h-7 w-7" />,
        title: "Professional Website",
        description: "Fast, modern, mobile-first websites built to win customers.",
        cta: "Learn More",
    },
    {
        icon: <TrendingUp className="h-7 w-7" />,
        title: "Digital Growth Consulting",
        description: "Clear advice on SEO, content, and marketing that actually converts.",
        cta: "Learn More",
    },
    {
        icon: <Rocket className="h-7 w-7" />,
        title: "Online Business Setup",
        description: "From idea to online store — launched ready to sell globally.",
        cta: "Learn More",
    },
    {
        icon: <Palette className="h-7 w-7" />,
        title: "Graphic Design",
        description: "Professional flyers, banners, social media graphics, brand materials, and visual content — designed to impress your audience and represent your business with style.",
        cta: "Get a Design",
    },
];

export default function ServicesSection() {
    return (
        <section id="services" className="bg-white dark:bg-[#0A1628] py-12 sm:py-14 border-t border-zinc-100 dark:border-zinc-800">
            <div className="max-w-5xl mx-auto px-5 sm:px-6">
                <div className="mb-8 sm:mb-12">
                    <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">Services</p>
                    <h2 className="text-xl sm:text-2xl font-medium text-zinc-900 dark:text-white leading-snug">
                        Services to grow <span className="text-zinc-400">your business</span>
                    </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {services.map((service, i) => (
                        <div
                            key={i}
                            className="group bg-[#0F2040] rounded-xl p-4 border border-white/[0.06] transition-all duration-300 hover:border-[#C9A84C]/50 hover:shadow-lg flex flex-col items-start text-left"
                        >
                            <div className="text-[#C9A84C] mb-3 group-hover:scale-110 transition-transform">
                                {service.icon}
                            </div>
                            <h3 className="text-[15px] font-bold text-white mb-1.5">{service.title}</h3>
                            <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">{service.description}</p>
                            <a
                                href="#contact"
                                className="mt-auto pt-3 inline-flex items-center gap-1 text-[#C9A84C] font-semibold text-xs group-hover:gap-2 transition-all"
                            >
                                {service.cta} <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
