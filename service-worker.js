
// SW with version + instant activation + cache cleanup
const CACHE = 'busqr-v3'; // bump this when you deploy
const ASSETS = [
  './','./index.html','./dashboard.html','./manifest.json',
  './icons/icon-192.png','./icons/icon-512.png',
  'https://unpkg.com/@zxing/library@0.18.6',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c)=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  } else {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
  }
});
