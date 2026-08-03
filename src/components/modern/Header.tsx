import { useState, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#services", label: "Services" },
    { href: "/books", label: "Books" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
    { href: "/#about", label: "About" },
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

    /* Lock body scroll while the mobile menu is open */
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isMenuOpen]);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
        if (!href.includes("#")) {
            return;
        }
        const targetId = href.split("#")[1];
        const element = document.getElementById(targetId);

        if (element) {
            e.preventDefault();
            const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 72;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            setIsMenuOpen(false);
        } else if (window.location.pathname !== "/") {
            e.preventDefault();
            navigate("/");
            setIsMenuOpen(false);
            setTimeout(() => {
                const el = document.getElementById(targetId);
                if (el) {
                    const offset = el.getBoundingClientRect().top + window.pageYOffset - 72;
                    window.scrollTo({ top: offset, behavior: "smooth" });
                }
            }, 100);
        }
    };

    const handleMenuLink = (e: React.MouseEvent<HTMLButtonElement>, href: string) => {
        if (href.includes("#")) {
            scrollToSection(e, href);
        } else {
            navigate(href);
            setIsMenuOpen(false);
        }
    };

    const handleMenuCta = (e: React.MouseEvent<HTMLAnchorElement>) => {
        scrollToSection(e, "#contact");
        setIsMenuOpen(false);
    };

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    isScrolled
                        ? "py-2 sm:py-3 bg-white/95 dark:bg-[#0A1628]/95 border-b border-zinc-200 dark:border-white/[0.06] shadow-sm backdrop-blur-sm"
                        : "py-2 sm:py-3 bg-transparent"
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-10 sm:h-12">
                    {/* Logo */}
                    <Link
                        to="/"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2.5 text-lg font-black tracking-tighter text-zinc-900 dark:text-white"
                    >
                        <div className="bg-brand-gradient h-8 w-8 rounded-lg flex items-center justify-center text-[#0A1628] font-black text-sm shadow-md">
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
                                    className="btn-gold"
                                >
                                    Book a Call
                                </a>
                            </div>
                        )}

                        <div className="pl-3 border-l border-zinc-200 dark:border-zinc-800">
                            <ThemeToggle />
                        </div>
                    </nav>

                    {/* Mobile Controls */}
                    <div className="flex items-center gap-1.5 lg:hidden">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            aria-label="Open menu"
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-navigation"
                            className="p-2.5 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.08] rounded-lg transition-colors"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Full-Screen Menu */}
            {isMenuOpen && (
                <div
                    id="mobile-navigation"
                    className="lg:hidden fixed inset-0 z-[80] bg-[#0A1628] flex flex-col"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Menu"
                >
                    {/* Top bar with close */}
                    <div className="flex items-center justify-between h-14 px-4 sm:px-6 border-b border-white/[0.08]">
                        <div className="flex items-center gap-2.5">
                            <div className="bg-brand-gradient h-8 w-8 rounded-lg flex items-center justify-center text-[#0A1628] font-black text-sm">
                                AR
                            </div>
                            <span className="text-white font-black tracking-tighter">Alamin Rafi</span>
                        </div>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            aria-label="Close menu"
                            className="p-2.5 rounded-lg text-white hover:bg-white/[0.08] transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Menu items */}
                    <nav className="flex-1 overflow-y-auto px-5 pt-4" aria-label="Mobile navigation">
                        {navLinks.map((link) => (
                            <button
                                key={link.href}
                                onClick={(e) => handleMenuLink(e, link.href)}
                                className={cn(
                                    "w-full text-left py-4 px-2 rounded-xl text-xl font-semibold text-white hover:bg-white/[0.06] transition-colors border-b border-white/[0.06]",
                                    activeSection === link.href.split("#")[1] && link.href.includes("#")
                                        ? "text-[#E0C77E]"
                                        : ""
                                )}
                            >
                                {link.label}
                            </button>
                        ))}
                    </nav>

                    {/* Book a Call — always visible */}
                    <div className="px-5 pb-10 pt-4 border-t border-white/[0.08] bg-[#0A1628]">
                        {user && (
                            <div className="mb-3 flex items-center gap-2">
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/[0.12] px-4 py-3 text-sm font-semibold text-white"
                                >
                                    <User className="w-4 h-4" /> My Dashboard
                                </Link>
                                <button
                                    onClick={() => { logout(); navigate("/"); setIsMenuOpen(false); }}
                                    className="px-4 py-3 rounded-xl border border-white/[0.12] text-zinc-300"
                                    aria-label="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        <a
                            href="#contact"
                            onClick={handleMenuCta}
                            className="btn-gold w-full py-4 text-base rounded-xl"
                        >
                            Book a Call
                        </a>
                        <Link
                            to="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="mt-3 block w-full text-center text-sm font-medium text-zinc-400 hover:text-white transition-colors py-2"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}
