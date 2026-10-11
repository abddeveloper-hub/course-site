// NEXVION AI Course — Service Worker
const CACHE_NAME = 'nexvion-ai-v1';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './course.html',
  './register.html',
  './dashboard.html',
  './checkout.html',
  './manifest.json',
  './css/style.css',
  './css/synthetic-systems.css',
  './css/motion.css',
  './js/app.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Precache asset fetch failure:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Only handle GET requests and http/https schemes
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;

  // API calls & webhook transactions always go straight to network
  if (req.url.includes('/api/')) {
    event.respondWith(fetch(req));
    return;
  }

  // Stale-while-revalidate for static assets, network-first for navigation
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
