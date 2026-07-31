import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const STORAGE_KEY = "ar_scroll_positions";

function readPositions(): Record<string, number> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

/**
 * Remembers each route's scroll position in sessionStorage and restores it
 * when the user navigates back to the same page (e.g. back button from a
 * blog post to the blog list).
 */
export function useScrollRestoration() {
  const location = useLocation();
  const skipRestore = useRef(false);

  useEffect(() => {
    const key = location.pathname;
    const positions = readPositions();

    // Save position of the page we are leaving
    const prevKey = sessionStorage.getItem("ar_last_path") || "";
    if (prevKey && prevKey !== key && prevKey !== window.location.pathname) {
      positions[prevKey] = window.scrollY;
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions)); } catch { /* ignore */ }
    }

    sessionStorage.setItem("ar_last_path", key);

    // Restore position for the page we are entering (only for back/forward nav)
    if (!skipRestore.current && positions[key] != null && window.history.state?.idx) {
      window.scrollTo(0, positions[key]);
    } else if (window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }

    skipRestore.current = false;
    return () => { skipRestore.current = true; };
  }, [location.pathname, location.key]);
}
