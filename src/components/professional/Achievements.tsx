const certifications = [
    { provider: "Google",           course: "Digital Marketing & E-commerce" },
    { provider: "HubSpot Academy",  course: "Content Marketing" },
    { provider: "SEMrush",          course: "SEO Fundamentals" },
    { provider: "LinkedIn Learning", course: "Advanced SEO" },
    { provider: "Coursera",         course: "Social Media Marketing" },
];

const achievements = [
    "150% organic traffic growth via SEO at RangTVBD.com",
    "Led digital transformation at Medi-Aid Hospital",
    "Content workflow serving 500,000+ monthly readers",
    "Consistently high ratings from international clients",
    "Multi-channel marketing campaigns with measurable ROI",
    "Squad Leader — National Cadet Corps (NCC)",
];

const community = [
    { org: "National Cadet Corps (NCC)", role: "Squad Leader" },
    { org: "Local Digital Marketing Community",       role: "Active Member" },
];

export default function ProfessionalAchievements() {
    return (
        <>
            {/* Key Achievements */}
            <section className="bg-white dark:bg-[#0F172A] py-14 sm:py-20 border-t border-zinc-100 dark:border-zinc-800">
                <div className="max-w-5xl mx-auto px-5 sm:px-6">
                    <p className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">Highlights</p>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-white mb-8 sm:mb-10">Key Achievements</h2>

                    <ul className="grid sm:grid-cols-2 gap-2.5 sm:gap-3">
                        {achievements.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-300 leading-snug">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Certifications */}
            <section className="bg-zinc-50 dark:bg-[#162032]/50 py-14 sm:py-20 border-t border-zinc-100 dark:border-zinc-800">
                <div className="max-w-5xl mx-auto px-5 sm:px-6">
                    <p className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">Learning</p>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-white mb-6 sm:mb-8">Certifications</h2>

                    {/* 2-column grid on all screen sizes */}
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                        {certifications.map((cert, i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-[#162032] rounded-xl p-3 sm:p-4 border border-zinc-100 dark:border-zinc-800"
                            >
                                <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-1">{cert.provider}</p>
                                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-snug">{cert.course}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Community */}
            <section className="bg-white dark:bg-[#0F172A] py-12 sm:py-16 border-t border-zinc-100 dark:border-zinc-800">
                <div className="max-w-5xl mx-auto px-5 sm:px-6">
                    <p className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">Community</p>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-white mb-6">Community Experience</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {community.map((exp, i) => (
                            <div
                                key={i}
                                className="bg-zinc-50 dark:bg-[#162032]/50 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800"
                            >
                                <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-0.5">{exp.org}</p>
                                <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">{exp.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
