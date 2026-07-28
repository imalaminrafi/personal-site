const currentYear = new Date().getFullYear();

const links = [
    { href: "#about",    label: "About" },
    { href: "#services", label: "Services" },
    { href: "#projects", label: "Projects" },
    { href: "#pricing",  label: "Pricing" },
    { href: "#contact",  label: "Contact" },
];

const socials = [
    { href: "https://www.linkedin.com/in/imalaminrafi/",   label: "LinkedIn" },
    { href: "https://github.com/imalaminrafi",             label: "GitHub" },
    { href: "https://www.facebook.com/alamin.rafiofficial", label: "Facebook" },
    { href: "https://x.com/imalaminrafi",                  label: "Twitter / X" },
    { href: "https://www.behance.net/imalaminrafi",        label: "Behance" },
    { href: "https://wa.me/8801917443161",                  label: "WhatsApp" },
    { href: "mailto:hello@alaminrafi.com",                  label: "Email" },
];

export default function ProfessionalFooter() {
    return (
        <footer className="bg-zinc-900 dark:bg-zinc-950 text-zinc-300 py-10 sm:py-14 border-t border-zinc-800">
            <div className="max-w-6xl mx-auto px-5 sm:px-6">

                {/* Main row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 mb-8">

                    {/* Brand */}
                    <div className="max-w-xs">
                        <div className="flex items-center gap-2 mb-2.5">
                            <div className="h-7 w-7 bg-gradient-to-br from-violet-600 to-cyan-500 rounded-md flex items-center justify-center text-white font-bold text-xs">
                                AR
                            </div>
                            <span className="text-white font-semibold">Alamin Rafi</span>
                        </div>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                            Digital Service Provider. Modern, affordable websites for businesses.
                        </p>
                    </div>

                    {/* Nav + Contact side by side */}
                    <div className="flex gap-10 sm:gap-16">
                        {/* Navigation */}
                        <div>
                            <p className="text-zinc-500 text-[11px] font-semibold uppercase tracking-wider mb-3">Pages</p>
                            <ul className="space-y-1.5">
                                {links.map(link => (
                                    <li key={link.href}>
                                        <a href={link.href} className="text-xs text-zinc-400 hover:text-white transition-colors">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <p className="text-zinc-500 text-[11px] font-semibold uppercase tracking-wider mb-3">Contact</p>
                            <ul className="space-y-1.5">
                                {socials.map(social => (
                                    <li key={social.href}>
                                        <a
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-zinc-400 hover:text-violet-400 transition-colors"
                                        >
                                            {social.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-2">
                    <p className="text-xs text-zinc-500">© {currentYear} Alamin Rafi. All rights reserved.</p>
                    <p className="text-xs text-zinc-600">Modern · Affordable · Scalable</p>
                </div>
            </div>
        </footer>
    );
}
