import { Brain, BadgeCheck, Globe, Bot } from "lucide-react";

const reasons = [
    {
        icon: <Brain className="h-7 w-7" />,
        title: "Simple Approach",
        description: "Plain language, no confusion",
    },
    {
        icon: <BadgeCheck className="h-7 w-7" />,
        title: "Tested Strategies",
        description: "Used with real clients",
    },
    {
        icon: <Globe className="h-7 w-7" />,
        title: "International Standard",
        description: "Global quality work",
    },
    {
        icon: <Bot className="h-7 w-7" />,
        title: "AI-First Methods",
        description: "Latest tools, less time wasted",
    },
];

export default function WhyMeSection() {
    return (
        <section id="why-me" className="bg-white dark:bg-[#0F172A] py-12 sm:py-14 border-t border-zinc-100 dark:border-white/[0.05]">
            <div className="max-w-5xl mx-auto px-5 sm:px-6">
                <div className="mb-8 sm:mb-12">
                    <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">
                        Why Work With Me
                    </p>
                    <h2 className="text-xl sm:text-2xl font-medium text-zinc-900 dark:text-white leading-snug">
                        A partner who's invested in{" "}
                        <span className="text-zinc-400">your growth</span>
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    {reasons.map((reason, i) => (
                        <div
                            key={i}
                            className="group rounded-xl p-4 sm:p-5 bg-white dark:bg-[#162032] border border-zinc-200 dark:border-white/[0.08] transition-all duration-300 hover:border-[#C9A84C]/50 dark:hover:border-[#C9A84C]/40 hover:shadow-lg"
                        >
                            <div className="h-12 w-12 rounded-full bg-[#C9A84C]/12 text-[#C9A84C] dark:bg-[#C9A84C]/15 dark:text-[#E0C77E] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                {reason.icon}
                            </div>
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">{reason.title}</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">{reason.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
