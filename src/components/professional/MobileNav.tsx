import { useState } from "react";
import { Home, MessageCircle, Mail, FolderOpen } from "lucide-react";

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    action: () => void;
    gradient?: boolean;
}

export default function MobileBottomNav() {
    const [active, setActive] = useState<string>("home");
    const [tapped, setTapped] = useState<string | null>(null);

    const handleTap = (id: string, action: () => void) => {
        setActive(id);
        setTapped(id);
        setTimeout(() => setTapped(null), 200);
        action();
    };

    const navItems: NavItem[] = [
        {
            id: "home",
            label: "Home",
            icon: <Home className="w-5 h-5" />,
            action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
        },
        {
            id: "whatsapp",
            label: "WhatsApp",
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.555 4.118 1.528 5.849L.057 23.485a.5.5 0 0 0 .612.612l5.698-1.484A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.653-.52-5.166-1.426l-.37-.22-3.826.996.984-3.763-.24-.386A9.937 9.937 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
            ),
            action: () => window.open("https://wa.me/8801917443161", "_blank"),
        },
        {
            id: "email",
            label: "Email",
            icon: <Mail className="w-5 h-5" />,
            action: () => window.location.href = "mailto:hello@alaminrafi.com",
        },
        {
            id: "portfolio",
            label: "Portfolio",
            icon: <FolderOpen className="w-5 h-5" />,
            action: () => window.location.href = "/portfolio",
        },
    ];

    return (
        /* Mobile only — hidden on sm+ */
        <div className="sm:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-[70]">
            <div className="flex items-center gap-1 px-3 py-2.5 rounded-[24px] bg-white/95 dark:bg-[#0F2040]/95 border border-zinc-200/80 dark:border-zinc-700/60 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                {navItems.map((item) => {
                    const isActive = active === item.id;
                    const isTapped = tapped === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleTap(item.id, item.action)}
                            aria-label={item.label}
                            className={`
                                relative flex flex-col items-center justify-center gap-0.5
                                w-16 h-14 rounded-2xl
                                transition-all duration-150 select-none
                                ${isTapped ? "scale-90" : "scale-100"}
                                ${isActive
                                    ? "bg-violet-50 dark:bg-violet-900/25"
                                    : "hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                                }
                            `}
                        >
                            {/* Icon */}
                            <span
                                className={`
                                    transition-colors duration-200
                                    ${isActive
                                        ? "text-transparent [&>*]:fill-none bg-gradient-to-br from-violet-600 to-cyan-500 bg-clip-text"
                                        : "text-zinc-400 dark:text-zinc-500"
                                    }
                                `}
                            >
                                {/* Wrap in a div to apply gradient to SVG stroke icons */}
                                <span className={isActive
                                    ? "[&_svg]:stroke-[url(#navGrad)] text-violet-600"
                                    : "text-zinc-400 dark:text-zinc-500"
                                }>
                                    {item.icon}
                                </span>
                            </span>

                            {/* Label */}
                            <span className={`text-[10px] font-medium leading-none transition-colors duration-200 ${
                                isActive
                                    ? "text-violet-600 dark:text-violet-400"
                                    : "text-zinc-400 dark:text-zinc-500"
                            }`}>
                                {item.label}
                            </span>

                            {/* Active dot */}
                            {isActive && (
                                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-500" />
                            )}
                        </button>
                    );
                })}

                {/* SVG gradient def (used by stroke icons) */}
                <svg width="0" height="0" className="absolute">
                    <defs>
                        <linearGradient id="navGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#C9A84C" />
                            <stop offset="100%" stopColor="#E6C97A" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
}
