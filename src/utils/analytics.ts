import { loadSettings, saveSettings } from "@/data/settings";

declare global {
  interface Window {
    dataLayer: unknown[][];
    gtag: (...args: unknown[]) => void;
  }
}

export type AnalyticsConsent = "granted" | "denied";

const CONSENT_KEY = "ar_ga_consent";
const LAST_EVENT_KEY = "ar_ga_last_event";
const RECENT_EVENTS_KEY = "ar_ga_recent_events";
const SCRIPT_ID = "ga-gtag-script";
const MAX_RECENT = 12;

let measurementId: string | null = null;
let initialized = false;
let consent: AnalyticsConsent = resolveInitialConsent();

/* ─── Consent ──────────────────────────────────────────────────────── */

function resolveInitialConsent(): AnalyticsConsent {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === "granted" || stored === "denied") return stored;
  } catch { /* ignore */ }
  // Respect browser privacy signals (Do Not Track)
  const dnt =
    navigator.doNotTrack === "1" ||
    (navigator as Navigator & { msDoNotTrack?: string }).msDoNotTrack === "1";
  return dnt ? "denied" : "granted";
}

export function getConsent(): AnalyticsConsent {
  return consent;
}

export function setAnalyticsConsent(next: AnalyticsConsent) {
  consent = next;
  try { localStorage.setItem(CONSENT_KEY, next); } catch { /* ignore */ }
  if (window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: next,
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }
}

export function hasStoredConsent(): boolean {
  try { return localStorage.getItem(CONSENT_KEY) !== null; } catch { return false; }
}

/* ─── Measurement ID (editable from Admin Settings) ────────────────── */

export function getMeasurementId(): string {
  try { return loadSettings().analyticsMeasurementId.trim(); } catch { return ""; }
}

/** Persist a new Measurement ID. Returns true when a reload is required. */
export function setMeasurementId(id: string): boolean {
  const s = loadSettings();
  const changed = s.analyticsMeasurementId !== id.trim();
  saveSettings({ ...s, analyticsMeasurementId: id.trim() });
  if (changed) {
    measurementId = null;
    initialized = false;
  }
  return changed;
}

/* ─── Initialization ───────────────────────────────────────────────── */

function queue(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

function loadGtagScript(id: string) {
  if (window.gtag || document.getElementById(SCRIPT_ID)) return;
  const s = document.createElement("script");
  s.id = SCRIPT_ID;
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  s.setAttribute("data-consent", consent);
  document.head.appendChild(s);
}

/** Loads gtag.js asynchronously (non-blocking) and applies Consent Mode defaults. */
export function initAnalytics() {
  if (initialized) return;
  initialized = true;
  const id = getMeasurementId();
  if (!id) return;
  measurementId = id;

  window.gtag = queue;
  window.gtag("consent", "default", {
    analytics_storage: consent,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
  loadGtagScript(id);
}

/* ─── Diagnostics ──────────────────────────────────────────────────── */

interface StoredEvent {
  name: string;
  ts: number;
}

function recordDiagnostic(name: string) {
  try {
    const now = Date.now();
    localStorage.setItem(LAST_EVENT_KEY, JSON.stringify({ name, ts: now } satisfies StoredEvent));
    const raw = localStorage.getItem(RECENT_EVENTS_KEY);
    const list: StoredEvent[] = raw ? JSON.parse(raw) : [];
    list.unshift({ name, ts: now });
    localStorage.setItem(RECENT_EVENTS_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
  } catch { /* ignore */ }
}

export interface AnalyticsStatus {
  measurementId: string;
  configured: boolean;
  connected: boolean;
  consent: AnalyticsConsent;
  lastEvent: StoredEvent | null;
  recentEvents: StoredEvent[];
  scriptLoaded: boolean;
}

export function getAnalyticsStatus(): AnalyticsStatus {
  let lastEvent: StoredEvent | null = null;
  let recentEvents: StoredEvent[] = [];
  try {
    const rawLast = localStorage.getItem(LAST_EVENT_KEY);
    lastEvent = rawLast ? JSON.parse(rawLast) : null;
    const rawRecent = localStorage.getItem(RECENT_EVENTS_KEY);
    recentEvents = rawRecent ? JSON.parse(rawRecent) : [];
  } catch { /* ignore */ }

  const id = measurementId || getMeasurementId();
  const scriptLoaded = Boolean(document.getElementById(SCRIPT_ID)) || typeof window.gtag === "function";
  const connected =
    scriptLoaded &&
    Boolean(id) &&
    Array.isArray(window.dataLayer) &&
    window.dataLayer.some((entry) => entry && (entry[0] as string | undefined) === "config" && entry[1] === id);

  return {
    measurementId: id,
    configured: Boolean(id),
    connected,
    consent,
    lastEvent,
    recentEvents,
    scriptLoaded,
  };
}

/* ─── Core event API ───────────────────────────────────────────────── */

/** Low-level GA4 event. Skipped when analytics consent is denied or no ID configured. */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (consent === "denied") return;
  const id = measurementId || getMeasurementId();
  if (!id) return;
  if (!window.gtag) return;
  window.gtag("event", name, params);
  recordDiagnostic(name);
}

/** SPA page view — use on every route change. */
export function trackPageView(path: string, title?: string) {
  if (consent === "denied") return;
  const id = measurementId || getMeasurementId();
  if (!id) return;
  if (!window.gtag) return;
  window.gtag("config", id, { page_path: path, page_title: title || document.title });
  recordDiagnostic("page_view");
}

/* ─── Semantic events (requirements list) ──────────────────────────── */

export function trackScrollDepth(percent: number) {
  trackEvent("scroll_depth", { percent, page_path: window.location.pathname });
}

export function trackOutboundLink(url: string, text = "") {
  trackEvent("outbound_link_click", { url, link_text: text.slice(0, 120) });
}

export function trackFileDownload(url: string) {
  const path = url.split(/[?#]/)[0];
  const parts = path.split("/");
  const fileName = parts[parts.length - 1] || url;
  const ext = fileName.includes(".") ? fileName.split(".").pop()!.toLowerCase() : "";
  trackEvent("file_download", { url, file_name: fileName, file_extension: ext });
}

export function trackSearch(term: string, resultsCount: number) {
  trackEvent("search", { search_term: term, results_count: resultsCount });
}

export function trackFormSubmit(formName: string) {
  trackEvent("form_submit", { form_name: formName });
}

export function trackContactForm() {
  trackEvent("contact_form_submit", { form_name: "contact" });
}

export function trackWhatsAppClick(location = "page") {
  trackEvent("whatsapp_click", { location });
}

export function trackEmailClick(location = "page") {
  trackEvent("email_click", { location });
}

export function trackButtonClick(label: string, location = "page") {
  trackEvent("button_click", { button_label: label.slice(0, 120), location });
}

export function trackPortfolioView(section = "all") {
  trackEvent("portfolio_view", { section });
}

export function trackPortfolioButton(project: string, action = "visit") {
  trackEvent("portfolio_button_click", { project_title: project, action });
}

export function trackBlogView(title: string, category = "") {
  trackEvent("blog_view", { post_title: title, category });
}

export function trackBlogReadTime(title: string, seconds: number) {
  trackEvent("blog_read_time", { post_title: title, seconds: Math.round(seconds) });
}

export function trackBookView(title: string) {
  trackEvent("book_view", { book_title: title });
}

export function trackBuyButton(book: string, price = "") {
  trackEvent("buy_button_click", { book_title: book, price });
}

export function trackProjectTracker(projectId: string, title = "") {
  trackEvent("project_tracker_visit", { project_id: projectId, project_title: title });
}

/* ─── Global automatic trackers (scroll depth, links, downloads, buttons) ── */

const SCROLL_THRESHOLDS = [25, 50, 75, 100];
let sentThresholds = new Set<number>();
let maxScrollPct = 0;

export function resetScrollTracking() {
  sentThresholds = new Set<number>();
  maxScrollPct = 0;
}

function onScrollDepth() {
  const doc = document.documentElement;
  const total = doc.scrollHeight - window.innerHeight;
  if (total <= 0) return;
  const pct = Math.min(100, Math.round((window.scrollY / total) * 100));
  maxScrollPct = Math.max(maxScrollPct, pct);
  for (const t of SCROLL_THRESHOLDS) {
    if (maxScrollPct >= t && !sentThresholds.has(t)) {
      sentThresholds.add(t);
      trackScrollDepth(t);
    }
  }
}

const DOWNLOAD_EXT = /\.(pdf|zip|rar|doc|docx|xls|xlsx|ppt|pptx|mp3|mp4|mov|csv|txt)(\?|#|$)/i;

function currentSection(el: Element): string {
  const sec = el.closest("[data-section]");
  return sec ? (sec.getAttribute("data-section") || "page") : window.location.pathname;
}

function onClickGlobal(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!(target instanceof Element)) return;

  // 1) Explicit semantic tracking via data-ga attributes
  const tagged = target.closest<HTMLElement>("[data-ga]");
  if (tagged) {
    const name = tagged.getAttribute("data-ga") || "";
    const location = tagged.getAttribute("data-ga-location") || currentSection(tagged);
    const label = (tagged.getAttribute("aria-label") || tagged.textContent || "").trim().slice(0, 120);
    if (name) {
      const url = tagged instanceof HTMLAnchorElement ? tagged.href : undefined;
      if (name === "whatsapp_click") trackWhatsAppClick(location);
      else if (name === "email_click") trackEmailClick(location);
      else trackEvent(name, { label, location, ...(url ? { url } : {}) });
      return;
    }
  }

  // 2) Anchor-level automatic tracking
  const a = target.closest<HTMLAnchorElement>("a");
  if (a && a.href) {
    const href = a.href;
    if (href.startsWith("mailto:")) { trackEmailClick(currentSection(a)); return; }
    if (href.startsWith("tel:")) { trackEvent("tel_click", { url: href }); return; }
    if (/wa\.me|whatsapp\.com\//.test(href)) { trackWhatsAppClick(currentSection(a)); return; }
    if (a.hasAttribute("download") || DOWNLOAD_EXT.test(href)) { trackFileDownload(href); return; }
    try {
      const isOut = new URL(href).hostname !== window.location.hostname;
      if (isOut) { trackOutboundLink(href, (a.textContent || "").trim()); return; }
    } catch { /* ignore malformed */ }
  }

  // 3) Generic button clicks (skip anything already handled)
  const b = target.closest<HTMLElement>("button");
  if (b) {
    trackButtonClick(b.getAttribute("aria-label") || b.textContent || "button", currentSection(b));
  }
}

let globalTrackersReady = false;

export function setupGlobalTrackers() {
  if (globalTrackersReady) return;
  globalTrackersReady = true;
  window.addEventListener("scroll", onScrollDepth, { passive: true });
  document.addEventListener("click", onClickGlobal, true);
}
