// NEXVION AI Course — Unified Service Worker (PWA Caching + Firebase Cloud Messaging Push)
const CACHE_NAME = 'nexvion-ai-v5';
const PRECACHE_ASSETS = [
  './manifest.json',
  './manifest.webmanifest',
  './css/style.css',
  './css/synthetic-systems.css',
  './css/motion.css',
  './js/app.js',
  './js/cloud-sync.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// ---------------------------------------------------------------------------
// 1. PWA LIFECYCLE: INSTALL & ACTIVATE
// ---------------------------------------------------------------------------
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Precache asset fetch failure:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ---------------------------------------------------------------------------
// 2. FETCH PROXY & CACHING STRATEGY
// ---------------------------------------------------------------------------
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;

  // API calls & Firebase/Firestore always bypass Service Worker
  if (req.url.includes('/api/') || req.url.includes('firestore.googleapis.com') || req.url.includes('firebase')) {
    return;
  }

  // HTML / Navigation pages: STRICT NETWORK-FIRST
  if (req.mode === 'navigate' || req.destination === 'document' || (req.headers.get('accept') && req.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Static assets: Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// ---------------------------------------------------------------------------
// 3. FIREBASE CLOUD MESSAGING (WEB PUSH)
// ---------------------------------------------------------------------------
try {
  importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

  const firebaseConfig = {
    apiKey: "AIzaSyCT5ieblE-Uj_fvBfeodPackWJ38M_RuF4",
    authDomain: "nexvion-ai.firebaseapp.com",
    projectId: "nexvion-ai",
    storageBucket: "nexvion-ai.firebasestorage.app",
    messagingSenderId: "916097030104",
    appId: "1:916097030104:web:e9b393b7fa8c89a84b84ad"
  };

  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[SW] FCM onBackgroundMessage triggered:', payload);
    const title = (payload.notification && payload.notification.title) ||
                  (payload.data && payload.data.title) ||
                  'NEXVION AI';

    const body = (payload.notification && payload.notification.body) ||
                 (payload.data && payload.data.body) ||
                 (payload.data && payload.data.message) ||
                 'You have a new update from NEXVION AI.';

    const rawUrl = (payload.data && (payload.data.url || payload.data.deepLink)) ||
                   (payload.notification && payload.notification.click_action) ||
                   './dashboard.html';

    const iconUrl = self.location.origin ? new URL('icons/icon-192.png', self.location.origin).href : './icons/icon-192.png';

    return self.registration.showNotification(title, {
      body: body,
      icon: iconUrl,
      badge: iconUrl,
      tag: (payload.data && payload.data.tag) || 'nexvion-fcm-' + Date.now(),
      renotify: true,
      requireInteraction: true,
      data: {
        url: rawUrl,
        timestamp: Date.now()
      }
    });
  });
} catch (fbErr) {
  console.warn('[SW] Firebase messaging compat script load notice:', fbErr.message);
}

// ---------------------------------------------------------------------------
// 4. NATIVE WEB PUSH FALLBACK LISTENER
// Guarantees system/desktop toast is displayed even if SDK hooks vary
// ---------------------------------------------------------------------------
self.addEventListener('push', (event) => {
  console.log('[SW] Native push event received:', event);

  let title = 'NEXVION AI';
  let body = 'You have a new update from NEXVION AI.';
  let targetUrl = './dashboard.html';

  if (event.data) {
    try {
      const payload = event.data.json();
      console.log('[SW] Native push payload JSON:', payload);

      if (payload.notification) {
        title = payload.notification.title || title;
        body = payload.notification.body || body;
      }
      if (payload.data) {
        title = payload.data.title || title;
        body = payload.data.body || payload.data.message || body;
        targetUrl = payload.data.url || payload.data.deepLink || targetUrl;
      }
    } catch (e) {
      body = event.data.text() || body;
    }
  }

  const options = {
    body: body,
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    tag: 'nexvion-push-' + Date.now(),
    renotify: true,
    requireInteraction: true,
    data: {
      url: targetUrl,
      timestamp: Date.now()
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// ---------------------------------------------------------------------------
// 5. NOTIFICATION CLICK LISTENER
// ---------------------------------------------------------------------------
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetPath = (event.notification.data && event.notification.data.url) || './dashboard.html';
  const target = new URL(targetPath, self.location.href);

  if (target.origin !== self.location.origin) return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === target.href && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(target.href);
      }
    })
  );
});

// ---------------------------------------------------------------------------
// 6. DIRECT TEST MESSAGE LISTENER
// ---------------------------------------------------------------------------
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TEST_PUSH') {
    self.registration.showNotification(event.data.title || 'NEXVION AI', {
      body: event.data.body || 'Desktop notification active outside the app!',
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      requireInteraction: true,
      tag: 'nexvion-test-' + Date.now(),
      data: { url: './dashboard.html' }
    });
  }
});
