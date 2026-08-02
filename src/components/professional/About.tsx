import { CheckCircle2 } from "lucide-react";

const highlights = [
    "Modern, fast & mobile-responsive websites",
    "Affordable solutions for businesses of all sizes",
    "Easy-to-manage WordPress & CMS setups",
    "Full support from design to launch",
];

export default function ProfessionalAbout() {
    return (
        <section id="about" className="bg-white dark:bg-[#0A1628] py-16 sm:py-24 border-t border-zinc-100 dark:border-zinc-800">
            <div className="max-w-6xl mx-auto px-5 sm:px-6">
                {/* Section Label */}
                <p className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">About</p>
                <h2 className="text-2xl sm:text-4xl font-semibold text-zinc-900 dark:text-white mb-8 sm:mb-14 max-w-2xl leading-snug">
                    Helping businesses build{" "}
                    <span className="text-violet-600 dark:text-violet-400">effective websites</span>{" "}
                    that work.
                </h2>

                <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-start">
                    {/* Bio */}
                    <div className="space-y-4 text-zinc-600 dark:text-zinc-300 leading-relaxed text-[16px] sm:text-[17px]">
                        {/* Mobile: single concise paragraph */}
                        <p className="sm:hidden">
                            I help businesses build modern, affordable, and effective websites. I manage projects, design direction, and ensure high-quality results with my team.
                        </p>

                        {/* Desktop: fuller paragraphs */}
                        <p className="hidden sm:block">
                            I'm <span className="font-semibold text-zinc-900 dark:text-white">Alamin Rafi</span>, a Digital Service Provider helping businesses build modern, affordable, and effective websites. I manage projects, guide design direction, and ensure high-quality results with my team.
                        </p>
                        <p className="hidden sm:block">
                            From clean landing pages to fully functional WordPress websites, I offer complete digital solutions under one roof — focused on what matters: results, clarity, and value for your business.
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
        </section>
    );
}
