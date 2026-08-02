import { useState, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/#about", label: "About" },
    { href: "/#services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/blog", label: "Blog" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/#contact", label: "Contact" },
];

export default function ModernHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
            const sections = navLinks.map(link => link.href.substring(1));
            let current = "";
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element && window.scrollY >= element.offsetTop - 100) {
                    current = section;
                }
            }
            setActiveSection(current);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (!href.includes("#")) {
            // It's a standard page route, let the browser or Link handle it.
            return;
        }
        
        // If it's a hash link, try to scroll
        const targetId = href.split("#")[1];
        const element = document.getElementById(targetId);
        
        if (element) {
            e.preventDefault();
            const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            setIsMenuOpen(false);
        } else if (window.location.pathname !== "/") {
            e.preventDefault();
            navigate("/");
            setIsMenuOpen(false);
            setTimeout(() => {
                const el = document.getElementById(targetId);
                if (el) {
                    const offset = el.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top: offset, behavior: "smooth" });
                }
            }, 100);
        }
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                isScrolled
                    ? "py-3 bg-white/95 dark:bg-[#070711]/95 border-b border-zinc-200 dark:border-white/[0.06] shadow-sm"
                    : "py-5 bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white flex items-center gap-2.5"
                >
                    <div className="bg-brand-gradient h-8 w-8 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md">
                        AR
                    </div>
                    <span className="hidden sm:block bg-gradient-to-r from-violet-600 to-cyan-500 dark:from-violet-400 dark:to-cyan-400 bg-clip-text text-transparent">Alamin Rafi</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
                    <ul className="flex items-center gap-1 mr-4">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    to={link.href}
                                    onClick={(e) => scrollToSection(e, link.href)}
                                    className={cn(
                                        "px-4 py-2 text-sm font-medium transition-all rounded-full hover:bg-zinc-100 dark:hover:bg-white/[0.08]",
                                        (activeSection === link.href.split("#")[1] && link.href.includes("#")) || window.location.pathname === link.href
                                            ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10"
                                            : "text-zinc-500 dark:text-white/60 hover:text-zinc-900 dark:hover:text-white"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Auth / CTA area */}
                    {user ? (
                        <div className="flex items-center gap-2 mr-3">
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors"
                            >
                                <User className="w-4 h-4" />
                                {user.name.split(" ")[0]}
                            </Link>
                            <button
                                onClick={() => { logout(); navigate("/"); }}
                                title="Logout"
                                aria-label="Logout"
                                className="p-2 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 mr-3">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
                            >
                                Login
                            </Link>
                            <a
                                href="#contact"
                                onClick={(e) => scrollToSection(e, "#contact")}
                                className="bg-brand-gradient px-5 py-2 text-sm font-semibold rounded-full text-white transition-all hover:scale-105"
                            >
                                Hire Me
                            </a>
                        </div>
                    )}

                    <div className="pl-3 border-l border-zinc-200 dark:border-zinc-800">
                        <ThemeToggle />
                    </div>
                </nav>

                {/* Mobile Toggle */}
                <div className="flex items-center gap-3 lg:hidden">
                    <ThemeToggle />
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-navigation"
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-[#0d0b1f]/95 border-b border-zinc-200 dark:border-white/[0.08] shadow-lg">
                    <nav id="mobile-navigation" className="flex flex-col p-6 space-y-1" aria-label="Mobile navigation">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                onClick={(e) => scrollToSection(e, link.href)}
                                className={cn(
                                    "px-4 py-3 rounded-xl text-base font-medium transition-colors",
                                    (activeSection === link.href.split("#")[1] && link.href.includes("#")) || window.location.pathname === link.href
                                        ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10"
                                        : "text-zinc-500 dark:text-white/60 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/[0.06]"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-semibold text-violet-600 dark:text-violet-400"
                                >
                                    <User className="w-4 h-4" /> My Dashboard
                                </Link>
                                <button
                                    onClick={() => { logout(); navigate("/"); setIsMenuOpen(false); }}
                                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 w-full transition-colors"
                                >
                                    <LogOut className="w-4 h-4" /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="px-4 py-3 rounded-xl text-base font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-white/[0.06] transition-colors"
                                >
                                    Login
                                </Link>
                                <a
                                    href="#contact"
                                    onClick={(e) => scrollToSection(e, "#contact")}
                                    className="bg-brand-gradient mt-2 px-4 py-3 rounded-xl text-base font-semibold text-white text-center"
                                >
                                    Hire Me
                                </a>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
