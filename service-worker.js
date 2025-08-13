// ---- Service Worker for Bus Scanner PWA ----
const CACHE_VERSION = "bus-scanner-v3";
const APP_SHELL = [
  "./",                 // important for GitHub Pages scope
  "./index.html",
  "./dashboard.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  // Third-party libs (opaque responses are fine to cache)
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js",
  "https://unpkg.com/html5-qrcode"
];

// Install: pre-cache core files (app shell)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting(); // activate new SW immediately
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_VERSION)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first for navigations (fresh HTML), fallback to cache
//         cache-first for other static assets (fast + offline)
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // For page navigations (HTML)
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("./index.html"))
    );
    return;
  }

  // For other requests, try cache first, then network
  event.respondWith(
    caches.match(req).then((cached) => {
      return (
        cached ||
        fetch(req).then((res) => {
          // Optionally cache new GET responses
          if (req.method === "GET") {
            const resClone = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, resClone));
          }
          return res;
        })
      );
    })
  );
});
