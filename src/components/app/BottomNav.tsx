import { useLocation, useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { bottomNavItems } from "./nav";
import { useAppUi } from "./app-ui-context";
import { trackWhatsAppClick } from "@/utils/analytics";
import { cn } from "@/lib/utils";

const WHATSAPP_URL = "https://wa.me/8801917443161";

function useActiveNav(pathname: string) {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/services")) return "services";
  if (pathname.startsWith("/portfolio")) return "portfolio";
  return "";
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.77-1.65-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.1 4.48.7.3 1.26.48 1.7.62.71.22 1.36.19 1.87.11.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
      <path d="M12 21.5a9.5 9.5 0 0 0 8.2-4.74A9.5 9.5 0 0 0 8.7 3.1a9.5 9.5 0 0 0-5.86 11.16L3 21.5l7.25-1.9a9.4 9.4 0 0 0 1.75.16z" />
    </svg>
  );
}

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { openMenu, menuOpen } = useAppUi();
  const routeActive = useActiveNav(pathname);
  const active = menuOpen ? "more" : routeActive;

  const Item = ({ id, label, icon, onClick }: {
    id: string;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }) => {
    const isActive = active === id;
    return (
      <button
        onClick={onClick}
        aria-current={isActive ? "page" : undefined}
        aria-label={label}
        className="group relative flex h-full flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-1 transition-colors duration-200"
      >
        <span
          className={cn(
            "flex h-8 w-10 items-center justify-center rounded-full transition-colors duration-200",
            isActive && "bg-violet-100/70 dark:bg-violet-500/15"
          )}
        >
          <span
            className={cn(
              "transition-colors duration-200",
              isActive ? "text-violet-600 dark:text-violet-400" : "text-zinc-400 group-active:text-zinc-600 dark:text-zinc-500"
            )}
          >
            {icon}
          </span>
        </span>
        <span
          className={cn(
            "text-[10px] font-medium leading-none transition-colors duration-200",
            isActive ? "text-violet-600 dark:text-violet-400" : "text-zinc-400 dark:text-zinc-500"
          )}
        >
          {label}
        </span>
        {/* Active indicator dot */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute bottom-0.5 h-1 w-1 rounded-full bg-violet-500 transition-all duration-200",
            isActive ? "scale-100 opacity-100" : "scale-0 opacity-0"
          )}
        />
      </button>
    );
  };

  return (
    <>
      {/* Compact floating bar — mobile & tablet only */}
      <nav
        aria-label="Primary mobile navigation"
        className="lg:hidden fixed inset-x-0 z-50 bottom-[max(0.6rem,env(safe-area-inset-bottom))] flex justify-center px-3 pointer-events-none"
      >
        <div
          className="pointer-events-auto flex h-[54px] w-[85%] max-w-sm items-stretch rounded-[22px] border border-black/[0.04] bg-white/90 shadow-[0_6px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/85 dark:shadow-[0_6px_24px_rgba(0,0,0,0.35)]"
        >
          {bottomNavItems.map((item) => (
            <Item
              key={item.id}
              id={item.id}
              label={item.label}
              icon={<item.icon className="h-5 w-5" />}
              onClick={() => navigate(item.to)}
            />
          ))}

          <Item
            id="whatsapp"
            label="WhatsApp"
            icon={<WhatsAppIcon className="h-5 w-5" />}
            onClick={() => {
              trackWhatsAppClick("bottom_nav");
              window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
            }}
          />

          <Item
            id="more"
            label="More"
            icon={<MoreHorizontal className="h-5 w-5" />}
            onClick={openMenu}
          />
        </div>
      </nav>

      {/* "More" sheet is driven by the shared UI context (header hamburger too) */}
    </>
  );
}
