import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import {
  getAnalyticsStatus, getConsent, setAnalyticsConsent, setMeasurementId,
  trackEvent, type AnalyticsStatus,
} from "@/utils/analytics";
import {
  Activity, BarChart3, CheckCircle2, RefreshCw, Save, ShieldCheck, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, Btn, Field, Input, IconBtn, Badge, PageHeader, Spinner } from "@/components/admin/ui";

function formatTime(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

export default function AdminAnalytics() {
  const [status, setStatus] = useState<AnalyticsStatus>(() => getAnalyticsStatus());
  const [measurementId, setMeasurementIdInput] = useState(status.measurementId);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tested, setTested] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setStatus(getAnalyticsStatus()), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(t);
  }, [saved]);

  useEffect(() => {
    if (!tested) return;
    const t = setTimeout(() => setTested(false), 3000);
    return () => clearTimeout(t);
  }, [tested]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const changed = setMeasurementId(measurementId);
    setSaving(false);
    setSaved(true);
    setStatus(getAnalyticsStatus());
    // gtag.js is bound to the old ID — reload so the new ID takes effect without code changes
    if (changed) setTimeout(() => window.location.reload(), 800);
  };

  const fireTest = () => {
    trackEvent("analytics_test_event", { source: "admin_panel" });
    setTested(true);
    setTimeout(() => setStatus(getAnalyticsStatus()), 300);
  };

  const consent = getConsent();

  return (
    <AdminLayout title="Analytics">
      <PageHeader
        title="Analytics"
        description="Google Analytics 4 configuration, consent mode and live event validation."
      />

      <div className="max-w-3xl space-y-5">
        {/* Status header */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Status</p>
              <Activity className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <Badge tone={status.configured ? "emerald" : "amber"}>{status.configured ? "Configured" : "Not configured"}</Badge>
            </div>
            <p className="mt-1.5 text-[11px] text-zinc-400">Google Analytics 4</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Connection</p>
              <RefreshCw className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <Badge tone={status.connected ? "emerald" : "zinc"}>{status.connected ? "Connected" : status.configured ? "Connecting…" : "—"}</Badge>
            </div>
            <p className="mt-1.5 text-[11px] text-zinc-400">gtag.js {status.scriptLoaded ? "loaded" : "pending"}</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Last Event</p>
              <Zap className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />
            </div>
            {status.lastEvent ? (
              <>
                <p className="mt-2 truncate text-sm font-bold text-zinc-900 dark:text-white">{status.lastEvent.name}</p>
                <p className="mt-1 text-[11px] text-zinc-400">{formatTime(status.lastEvent.ts)}</p>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm font-bold text-zinc-400">None yet</p>
                <p className="mt-1 text-[11px] text-zinc-400">Fire a test event below</p>
              </>
            )}
          </Card>
        </div>

        {/* Measurement ID */}
        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <BarChart3 className="h-5 w-5 text-violet-500" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">Measurement ID</h2>
          </div>
          <form onSubmit={handleSave} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Field label="Google Analytics 4 Measurement ID">
                <Input
                  value={measurementId}
                  onChange={(e) => setMeasurementIdInput(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  spellCheck={false}
                  className="font-mono"
                />
              </Field>
              <p className="mt-1.5 text-[11px] text-zinc-400">Change this anytime — no code changes required.</p>
            </div>
            <Btn type="submit" disabled={saving}>
              {saving ? <><Spinner className="h-4 w-4" /> Saving…</> : <><Save className="h-4 w-4" /> Save</>}
            </Btn>
          </form>
          {saved && (
            <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> Measurement ID saved.
            </p>
          )}
        </Card>

        {/* Privacy & consent */}
        <Card className="p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">Privacy & Consent Mode</h2>
          </div>
          <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            Consent Mode v2 is active. Analytics is currently{" "}
            <span className={consent === "granted" ? "font-bold text-emerald-600 dark:text-emerald-400" : "font-bold text-amber-600 dark:text-amber-400"}>
              {consent === "granted" ? "granted" : "denied"}
            </span>{" "}
            for this browser. IP anonymization is enabled and advertising/ad-personalization
            storage is always denied.
          </p>
          <Btn
            type="button"
            variant="outline"
            onClick={() => { setAnalyticsConsent(consent === "granted" ? "denied" : "granted"); setStatus(getAnalyticsStatus()); }}
            className="mt-3"
          >
            {consent === "granted" ? "Deny analytics" : "Grant analytics"}
          </Btn>
        </Card>

        {/* Test + recent events */}
        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Zap className="h-5 w-5 text-amber-500" />
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">Validation</h2>
            </div>
            <Btn onClick={fireTest} disabled={!status.configured}>
              <Zap className="h-4 w-4" />
              {tested ? "Sent!" : "Fire test event"}
            </Btn>
          </div>

          {status.recentEvents.length === 0 ? (
            <p className="text-xs text-zinc-400">No events received yet in this browser session.</p>
          ) : (
            <ul className="divide-y divide-zinc-100 dark:divide-white/[0.05]">
              {status.recentEvents.slice(0, 8).map((ev, i) => (
                <li key={`${ev.ts}-${i}`} className="flex items-center justify-between py-2.5">
                  <code className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-violet-600 dark:bg-white/[0.06] dark:text-violet-300">
                    {ev.name}
                  </code>
                  <span className="text-[11px] text-zinc-400">{formatTime(ev.ts)}</span>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-4 text-[11px] leading-relaxed text-zinc-400">
            Check <span className="font-mono">Realtime → Events</span> in Google Analytics to
            confirm events arrive. Each event fired here also appears under Recent Events above.
          </p>
        </Card>
      </div>
    </AdminLayout>
  );
}