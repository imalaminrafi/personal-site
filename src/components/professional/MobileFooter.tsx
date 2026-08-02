import {
  Home, Briefcase, BookOpen, DollarSign, PenLine, User, Mail, LayoutGrid
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/#services", label: "Services", icon: Briefcase },
  { href: "/books", label: "Books", icon: BookOpen },
  { href: "/pricing", label: "Pricing", icon: DollarSign },
  { href: "/blog", label: "Blog", icon: PenLine },
  { href: "/portfolio", label: "Work", icon: LayoutGrid },
  { href: "/about-alamin-rafi", label: "About", icon: User },
  { href: "/contact", label: "Contact", icon: Mail },
];

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/imalaminrafi/",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
  },
  {
    label: "GitHub",
    href: "https://github.com/imalaminrafi",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/alamin.rafiofficial",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>,
  },
  {
    label: "X",
    href: "https://x.com/imalaminrafi",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>,
  },
  {
    label: "Fiverr",
    href: "https://www.fiverr.com/alaminseller",
    icon: <Briefcase className="h-6 w-6" />,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/8801917443161",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.555 4.118 1.528 5.849L.057 23.485a.5.5 0 0 0 .612.612l5.698-1.484A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.653-.52-5.166-1.426l-.37-.22-3.826.996.984-3.763-.24-.386A9.937 9.937 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>,
  },
];

export default function MobileFooter() {
  return (
    <footer className="sm:hidden">
      <div className="px-4 pb-8 pt-2">
        <div className="rounded-3xl border border-white/[0.08] bg-[#060E1A] px-5 pb-6 pt-6">
          {/* Brand */}
          <div className="flex items-center justify-center gap-2.5">
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#E6C97A] text-sm font-black text-[#0A1628] shadow-lg shadow-[#C9A84C]/20">
              AR
            </div>
            <span className="text-[15px] font-bold tracking-tight text-white">Alamin Rafi</span>
          </div>

          {/* Link grid */}
          <nav className="mt-5 grid grid-cols-4 gap-1" aria-label="Footer">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex min-h-11 flex-col items-center justify-center gap-1.5 rounded-2xl py-2 text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white active:bg-white/[0.09]"
              >
                <link.icon className="h-5 w-5" />
                <span className="text-[13px] font-medium leading-none">{link.label}</span>
              </a>
            ))}
          </nav>

          {/* Socials — single row, equal spacing */}
          <div className="mt-6 flex items-center justify-center gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C] transition-colors hover:bg-[#C9A84C]/20 hover:text-[#E6C97A]"
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="mt-6 border-t border-white/[0.06] pt-4 text-center">
            <p className="text-[13px] font-medium text-zinc-500">© 2027 Alamin Rafi. All rights reserved.</p>
            <p className="mt-0.5 text-[13px] text-zinc-500">Building smarter businesses with AI.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
