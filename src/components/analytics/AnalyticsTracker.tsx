import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initAnalytics, setupGlobalTrackers, trackPageView, resetScrollTracking } from "@/utils/analytics";

/**
 * Global GA4 wiring:
 *  - Initializes gtag.js once (async, non-blocking)
 *  - Fires SPA page views on every route change
 *  - Installs automatic trackers (scroll depth, outbound links, downloads, button clicks)
 */
export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
    setupGlobalTrackers();
  }, []);

  useEffect(() => {
    resetScrollTracking();
    const path = location.pathname + location.search;
    // small delay so document.title is updated by page-level effects
    const t = setTimeout(() => trackPageView(path, document.title), 50);
    return () => clearTimeout(t);
  }, [location.pathname, location.search]);

  return null;
}
