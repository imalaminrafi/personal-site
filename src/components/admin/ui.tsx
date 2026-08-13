import {
  X, Search, Loader2, type LucideIcon, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useState,
  type ReactNode, type ButtonHTMLAttributes,
  type InputHTMLAttributes, type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
} from "react";

/* ─── Surfaces ─────────────────────────────────────────────────── */

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-xl border border-zinc-200/70 bg-white shadow-sm dark:border-white/[0.07] dark:bg-[#162032]", className)}>
      {children}
    </div>
  );
}

export function CardHeader({
  icon: Icon, title, description, action,
}: {
  icon?: LucideIcon; title: string; description?: string; action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-zinc-100 px-5 py-4 dark:border-white/[0.05]">
      <div className="flex items-start gap-2.5 min-w-0">
        {Icon && (
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ─── Page header ──────────────────────────────────────────────── */

export function PageHeader({
  title, description, actions,
}: {
  title: string; description?: string; actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-[22px] font-bold leading-tight tracking-tight text-zinc-900 dark:text-white">
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ─── Buttons ──────────────────────────────────────────────────── */

const btnPrimary = "bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50";
const btnSecondary = "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-white/[0.06] dark:text-zinc-200 dark:hover:bg-white/[0.1]";
const btnOutline = "border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:border-white/[0.1] dark:text-zinc-300 dark:hover:bg-white/[0.05] dark:hover:text-white";
const btnGhost = "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/[0.06] dark:hover:text-white";
const btnDanger = "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10";
const btnDangerSolid = "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50";

const btnStyles: Record<string, string> = {
  primary: btnPrimary,
  secondary: btnSecondary,
  outline: btnOutline,
  ghost: btnGhost,
  danger: btnDanger,
  dangerSolid: btnDangerSolid,
};

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof btnStyles;
  size?: "sm" | "md";
}

export function Btn({ variant = "primary", size = "md", className, ...props }: BtnProps) {
  return (
    <button
      className={cn(
        "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3.5 text-[13px] font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
        size === "sm" ? "h-8 px-2.5 text-xs" : "h-9 px-3.5 text-[13px]",
        btnStyles[variant],
        className
      )}
      {...props}
    />
  );
}

interface IconBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: "default" | "violet" | "danger";
  label: string;
}

export function IconBtn({ tone = "default", label, className, ...props }: IconBtnProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
        tone === "default" && "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-white/[0.06] dark:hover:text-white",
        tone === "violet" && "text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-500/10",
        tone === "danger" && "text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400",
        className
      )}
      {...props}
    />
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-4 w-4 animate-spin", className)} />;
}

/* ─── Form controls ────────────────────────────────────────────── */

export const inputCls =
  "w-full h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-white/[0.08] dark:bg-[#162032] dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-violet-500/60";

export const textareaCls = inputCls + " h-auto py-2 leading-relaxed resize-none";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputCls, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(textareaCls, className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(inputCls, "appearance-none pr-8 bg-no-repeat bg-[right_0.6rem_center] bg-[length:14px]", className)}
    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E\")" }}
    {...props} />;
}

export function Field({
  label, hint, required, children, className,
}: {
  label: string; hint?: ReactNode; required?: boolean; children: ReactNode; className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold text-zinc-600 dark:text-zinc-300">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">{hint}</p>}
    </div>
  );
}

export function SearchInput({
  value, onChange, placeholder = "Search...", className,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(inputCls, "pl-9")}
      />
    </div>
  );
}

/* ─── Badges / status ──────────────────────────────────────────── */

type Tone = "violet" | "emerald" | "amber" | "red" | "zinc" | "blue";

const toneCls: Record<Tone, string> = {
  violet: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  red: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
  zinc: "bg-zinc-100 text-zinc-600 dark:bg-white/[0.06] dark:text-zinc-400",
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
};

export function Badge({ tone = "zinc", icon: Icon, className, children }: {
  tone?: Tone; icon?: LucideIcon; className?: string; children: ReactNode;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap", toneCls[tone], className)}>
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  );
}

/* ─── Empty state ──────────────────────────────────────────────── */

export function EmptyState({
  icon: Icon, title, description, action,
}: {
  icon: LucideIcon; title: string; description?: string; action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-white/[0.05] dark:text-zinc-500">
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">{title}</p>
      {description && <p className="mt-1 max-w-sm text-xs text-zinc-400">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ─── Modal ────────────────────────────────────────────────────── */

export function Modal({
  title, description, onClose, children, footer, size = "lg",
}: {
  title: string; description?: string; onClose: () => void;
  children: ReactNode; footer?: ReactNode; size?: "sm" | "md" | "lg" | "xl";
}) {
  const widths = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className={cn("flex max-h-[90vh] w-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-white/[0.08] dark:bg-[#162032]", widths[size])}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-zinc-100 px-5 py-4 dark:border-white/[0.05]">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">{title}</h2>
            {description && <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>}
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/[0.06] dark:hover:text-zinc-200">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-zinc-100 bg-zinc-50/60 px-5 py-3 dark:border-white/[0.05] dark:bg-white/[0.02]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Collapsible section ──────────────────────────────────────── */

export function AccordionSection({
  title, icon: Icon, defaultOpen = true, badge, children,
}: {
  title: string; icon?: LucideIcon; defaultOpen?: boolean; badge?: ReactNode; children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 px-5 py-3.5 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-white/[0.02]"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white">
          {Icon && <Icon className="h-4 w-4 text-violet-500 dark:text-violet-400" />}
          {title}
          {badge}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-zinc-400 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="border-t border-zinc-100 px-5 py-4 dark:border-white/[0.05]">{children}</div>}
    </Card>
  );
}