import { CheckCircle2 } from "lucide-react";

const highlights = [
    "AI-first strategy that saves you time and money",
    "High-performance websites built to convert visitors into customers",
    "SEO & digital marketing that attracts the right audience",
    "Clear communication and on-time delivery, worldwide",
];

export default function ProfessionalAbout() {
    return (
        <section id="about" className="bg-white dark:bg-[#0A1628] py-12 sm:py-24 border-t border-zinc-100 dark:border-zinc-800">
            <div className="max-w-6xl mx-auto px-5 sm:px-6">
                {/* Section Label */}
                <p className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">About</p>

                {/* ─── Mobile layout: photo, name, short bio, CTA ─── */}
                <div className="sm:hidden flex flex-col items-center text-center">
                    <img
                        src="/Profile.webp"
                        alt="Alamin Rafi — AI Business Consultant"
                        loading="lazy"
                        decoding="async"
                        className="h-28 w-28 rounded-full object-cover border-4 border-white/[0.08] shadow-xl shadow-black/30"
                    />
                    <h3 className="mt-5 text-xl font-bold text-zinc-900 dark:text-white">
                        Alamin Rafi — AI Business Consultant
                    </h3>
                    <p className="mt-3 text-zinc-600 dark:text-zinc-300 text-[15px] leading-[1.6] max-w-xs">
                        I help small business owners and entrepreneurs grow faster using AI tools, smart strategy, and professional websites. No jargon. Just real results.
                    </p>
                    <a
                        href="/about-alamin-rafi"
                        className="mt-5 inline-flex items-center gap-1 text-[#C9A84C] font-semibold text-[15px]"
                    >
                        Learn More About Me <span aria-hidden="true">→</span>
                    </a>
                </div>

                {/* ─── Desktop layout ─── */}
                <div className="hidden sm:block">
                <h2 className="text-2xl sm:text-4xl font-semibold text-zinc-900 dark:text-white mb-8 sm:mb-14 max-w-2xl leading-snug">
                    Helping businesses grow with{" "}
                    <span className="text-violet-600 dark:text-violet-400">AI and websites</span>{" "}
                    that work.
                </h2>

                <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-start">
                    {/* Bio */}
                    <div className="space-y-4 text-zinc-600 dark:text-zinc-300 leading-relaxed text-[16px] sm:text-[17px]">
                        {/* Desktop: fuller paragraphs */}
                        <p className="hidden sm:block">
                            I'm <span className="font-semibold text-zinc-900 dark:text-white">Alamin Rafi</span>, and I help small businesses grow smarter online — combining AI strategy, high-performance web design, and digital marketing that actually converts visitors into customers.
                        </p>
                        <p className="hidden sm:block">
                            From your first landing page to a complete growth system, I handle strategy, design, and build under one roof — focused on what matters: results, clarity, and value for your business.
                        </p>
                    </div>

                    {/* Highlights */}
                    <div>
                        <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-white mb-3 sm:mb-5">What I deliver:</h3>
                        <ul className="space-y-2.5 sm:space-y-4">
                            {highlights.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                                    <span className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                </div>
            </div>
        </section>
    );
}
