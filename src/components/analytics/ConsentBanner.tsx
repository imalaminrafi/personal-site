import { useState } from "react";
import { X } from "lucide-react";
import {
  getConsent, hasStoredConsent, setAnalyticsConsent, getMeasurementId,
} from "@/utils/analytics";

/**
 * Lightweight consent banner (Consent Mode v2).
 * Shows once; the visitor can accept or decline analytics.
 */
export default function ConsentBanner() {
  const [dismissed, setDismissed] = useState(false);
  const configured = Boolean(getMeasurementId());

  if (!configured || dismissed || hasStoredConsent()) return null;

  const choose = (granted: boolean) => {
    setAnalyticsConsent(granted ? "granted" : "denied");
    setDismissed(true);
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-[calc(84px+env(safe-area-inset-bottom))] z-[75] lg:bottom-6 lg:left-auto lg:right-6 lg:w-[400px]"
    >
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl shadow-zinc-900/15 dark:border-white/10 dark:bg-zinc-900 dark:shadow-black/50">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-bold text-zinc-900 dark:text-white">We value your privacy</p>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss consent notice"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          Analytics currently {getConsent() === "granted" ? "enabled" : "disabled"}. We use
          Google Analytics to understand how visitors use this site. You can change this
          anytime.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => choose(true)}
            className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-violet-600 px-4 text-sm font-bold text-white transition-colors hover:bg-violet-700"
          >
            Accept
          </button>
          <button
            onClick={() => choose(false)}
            className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-zinc-100 px-4 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-300 dark:hover:bg-white/15"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
