const CACHE_NAME = "bus-scanner-cache-v1";
const urlsToCache = [
  "/bus-scanner/",
  "/bus-scanner/index.html",
  "/bus-scanner/dashboard.html",
  "/bus-scanner/manifest.json",
  "/bus-scanner/icons/icon-192.png",
  "/bus-scanner/icons/icon-512.png",
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js",
  "https://unpkg.com/html5-qrcode"
];

// Install SW
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caching files");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch requests
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Activate SW and clear old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});
