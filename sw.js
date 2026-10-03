// NEXVION AI ACADEMY - High Performance Progressive Service Worker
const CACHE_NAME = 'nexvion-cache-v8.0';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './learn.html',
  './ai-lab.html',
  './achievements.html',
  './css/style.css',
  './css/components.css',
  './css/mobile.css',
  './css/learn.css',
  './js/data.js',
  './js/currency-manager.js',
  './js/sound-fx.js',
  './js/theme-manager.js',
  './js/app.js',
  './images/icon-512.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        console.warn('[SW] Pre-caching warning (non-fatal):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Only handle GET requests, ignore external analytics or chrome extensions
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Skip Firebase/Google analytics or external APIs from aggressive caching
  if (url.origin !== self.location.origin && !url.hostname.includes('cdnjs.cloudflare.com') && !url.hostname.includes('fonts.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Fetch fresh copy in background (Stale-While-Revalidate)
        fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
        return networkResponse;
      });
    }).catch(() => {
      // Offline fallback
      const acceptHeader = event.request.headers.get('accept') || '';
      if (acceptHeader.includes('text/html')) {
        return caches.match('./index.html');
      }
      return new Response('Network error', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});
