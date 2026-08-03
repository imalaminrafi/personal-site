import { useState, useEffect, useRef, useCallback } from "react";
import {
  MonitorPlay, ExternalLink, RefreshCw, ShieldOff, Loader2
} from "lucide-react";

interface ProjectViewerProps {
  url: string;
  title: string;
}

const DETECT_TIMEOUT = 8000;

/**
 * Embeds a live project inside the portfolio page so the browser address
 * stays on this website. External sites that block iframing (via
 * X-Frame-Options / CSP frame-ancestors) never fire the iframe `load`
 * event, so we fall back to a timeout and automatically open the project
 * in a new tab instead.
 */
export default function ProjectViewer({ url, title }: ProjectViewerProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "blocked">("loading");
  const [autoOpened, setAutoOpened] = useState(false);
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setStatus("loading");
    timerRef.current = window.setTimeout(() => {
      setStatus("blocked");
      // Auto-open in a new tab since embedding is blocked.
      const win = window.open(url, "_blank", "noopener");
      setAutoOpened(!!win);
    }, DETECT_TIMEOUT);
  }, [clearTimer, url]);

  useEffect(() => {
    reset();
    return clearTimer;
  }, [reset, clearTimer]);

  const handleLoad = () => {
    clearTimer();
    setStatus("loaded");
  };

  const openNewTab = () => {
    const win = window.open(url, "_blank", "noopener");
    setAutoOpened(!!win);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-[#1E3A5F] bg-white dark:bg-[#162032] shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-zinc-100 dark:border-[#1E3A5F]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1 min-w-0 bg-zinc-100 dark:bg-white/[0.05] rounded-lg px-3 py-1.5 flex items-center gap-2">
            <span className="text-emerald-500 w-3 h-3 shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </span>
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 truncate">
              {typeof window !== "undefined" ? window.location.origin : ""}/portfolio/{title}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={openNewTab}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors"
            title="Open in a new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" /> New Tab
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors"
            title="Reload preview"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="relative bg-zinc-100 dark:bg-[#162032]" style={{ height: "min(70vh, 640px)" }}>
        {status === "blocked" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4">
              {autoOpened ? <ExternalLink className="w-7 h-7" /> : <ShieldOff className="w-7 h-7" />}
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              This site blocks embedded previews
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm">
              {autoOpened
                ? "We opened the live project in a new tab for you."
                : "The project prevents being shown inside a frame, so we opened it in a new tab instead."}
            </p>
            {!autoOpened && (
              <button
                onClick={openNewTab}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors"
              >
                <MonitorPlay className="w-4 h-4" /> Open Live Preview
              </button>
            )}
            <button
              onClick={reset}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Try Again
            </button>
          </div>
        ) : (
          <>
            <iframe
              src={url}
              title={`Live preview of ${title}`}
              onLoad={handleLoad}
              className="absolute inset-0 w-full h-full border-0 bg-white"
              referrerPolicy="no-referrer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            />
            {status === "loading" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-100 dark:bg-[#162032] pointer-events-none">
                <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Loading live preview…</p>
              </div>
            )}
            {status === "loaded" && (
              <div className="absolute top-2 left-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Live
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
