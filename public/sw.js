/* ─────────────────────────────────────────────────────────────
   Service Worker — Alamin Rafi Portfolio PWA
   Strategy: Cache-first for static assets, Network-first for HTML
   ───────────────────────────────────────────────────────────── */

/* Bump these versions to force all clients to purge stale/corrupt caches. */
const CACHE_NAME = "ar-pwa-v2";
const STATIC_CACHE = "ar-static-v2";

/* Assets to pre-cache on install */
const PRECACHE_URLS = [
  "/",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/favicon.svg",
];

/* Only cache successful responses — never poison the cache with errors. */
function isOk(res) {
  return res && res.ok && res.status === 200 && res.type !== "opaque";
}

/* ── Install: pre-cache shell ─────────────────────────────── */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => Promise.allSettled(PRECACHE_URLS.map((u) => cache.add(u))))
      .then(() => self.skipWaiting())
  );
});

/* ── Activate: clean old caches ───────────────────────────── */
self.addEventListener("activate", (event) => {
  const validCaches = [CACHE_NAME, STATIC_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !validCaches.includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

/* ── Fetch: smart caching strategy ────────────────────────── */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* Skip cross-origin, API calls, and non-GET */
  if (
    request.method !== "GET" ||
    !url.origin.includes(self.location.origin) ||
    url.pathname.startsWith("/api/")
  ) {
    return;
  }

  /* HTML navigation: Network-first, fallback to cache */
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (isOk(res)) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          }
          return res;
        })
        .catch(() =>
          caches.match(request).then((r) => r || caches.match("/"))
        )
    );
    return;
  }

  /* Static assets (JS, CSS, images, fonts): Cache-first with background refresh */
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|webp|woff2?|ttf|ico)$/)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const refresh = fetch(request)
          .then((res) => {
            if (isOk(res)) {
              const clone = res.clone();
              caches.open(STATIC_CACHE).then((c) => c.put(request, clone));
            }
            return res;
          })
          .catch(() => cached);
        return cached || refresh;
      })
    );
    return;
  }

  /* Everything else: Network-first */
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (isOk(res)) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
        }
        return res;
      })
      .catch(() => caches.match(request))
  );
});
