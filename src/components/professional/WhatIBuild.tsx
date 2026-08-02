const websiteTypes = [
    { label: "Business",    icon: "🏢" },
    { label: "E-commerce",  icon: "🛍️" },
    { label: "Portfolio",   icon: "🎨" },
    { label: "Landing Page",icon: "🚀" },
    { label: "Booking",     icon: "📅" },
    { label: "Education",   icon: "🎓" },
    { label: "Agency",      icon: "💼" },
];

export default function WhatIBuild() {
    return (
        <section className="bg-white dark:bg-[#0A1628] py-14 sm:py-20 border-t border-zinc-100 dark:border-zinc-800">
            <div className="max-w-5xl mx-auto px-5 sm:px-6">

                {/* Label + Headline */}
                <p className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3 text-center sm:text-left">
                    What I Build
                </p>
                <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-white leading-snug mb-2 text-center sm:text-left">
                    Websites for every type of business
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-7 sm:mb-8 text-center sm:text-left">
                    Custom solutions available based on your needs.
                </p>

                {/* Pills — horizontal scroll on mobile, wrap on desktop */}
                <div
                    className="flex gap-2.5 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0 scrollbar-none [scrollbar-width:none]"
                >
                    {websiteTypes.map(({ label, icon }, i) => (
                        <span
                            key={i}
                            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-zinc-50 dark:bg-[#14233F]/80 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:border-violet-400 dark:hover:border-violet-500 transition-colors duration-150 cursor-default"
                        >
                            <span className="text-sm leading-none">{icon}</span>
                            {label}
                        </span>
                    ))}
                </div>

            </div>
        </section>
    );
}
