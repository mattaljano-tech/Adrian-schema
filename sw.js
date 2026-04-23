const CACHE_NAME = 'adrian-app-v1';

// Installera service worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Aktivera
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Nätverksanrop (fetch) - Gör att appen inte kraschar om wifi dör en sekund
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
