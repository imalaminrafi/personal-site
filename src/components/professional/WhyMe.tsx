import { Globe, Sparkles, MessageCircle, Target, ShieldCheck, Clock } from "lucide-react";

const reasons = [
    {
        icon: <Globe className="h-5 w-5" />,
        title: "Built for a global audience",
        description: "I work with businesses across countries and time zones, so location is never a barrier.",
    },
    {
        icon: <Sparkles className="h-5 w-5" />,
        title: "AI-first, faster delivery",
        description: "Every project uses AI to move faster, keep costs down, and pack in more value.",
    },
    {
        icon: <MessageCircle className="h-5 w-5" />,
        title: "Plain language, no jargon",
        description: "Clear updates from kickoff to launch — you'll always know exactly what's happening.",
    },
    {
        icon: <Target className="h-5 w-5" />,
        title: "Designed to make you money",
        description: "Every page is built to turn visitors into customers, not just to look good.",
    },
    {
        icon: <ShieldCheck className="h-5 w-5" />,
        title: "End-to-end ownership",
        description: "Strategy, design, build, and launch under one roof — plus support after you go live.",
    },
    {
        icon: <Clock className="h-5 w-5" />,
        title: "On-time, on-scope",
        description: "Realistic timelines that I stick to, with progress you can see at every step.",
    },
];

export default function WhyMeSection() {
    return (
        <section id="why-me" className="bg-white dark:bg-[#0A1628] py-10 sm:py-14 border-t border-zinc-100 dark:border-white/[0.05]">
            <div className="max-w-5xl mx-auto px-5 sm:px-6">
                <div className="mb-10 sm:mb-12">
                    <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">
                        Why Work With Me
                    </p>
                    <h2 className="text-xl sm:text-2xl font-medium text-zinc-900 dark:text-white leading-snug">
                        A partner who's invested in{" "}
                        <span className="text-zinc-400">your growth</span>
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 max-w-xl leading-relaxed">
                        No hype, no fluff — just a clear, dependable way to grow your business online.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reasons.map((reason, i) => (
                        <div
                            key={i}
                            className="group rounded-xl p-5 bg-white dark:bg-[#0F2040] border border-zinc-200 dark:border-white/[0.08] transition-all duration-300 hover:border-[#C9A84C]/50 dark:hover:border-[#C9A84C]/40 hover:shadow-lg"
                        >
                            <div className="h-10 w-10 rounded-full bg-[#C9A84C]/12 text-[#C9A84C] dark:bg-[#C9A84C]/15 dark:text-[#E0C77E] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                {reason.icon}
                            </div>
                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1.5">{reason.title}</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">{reason.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
