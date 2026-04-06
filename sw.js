const CACHE = 'oseys-carte-v3';
const ASSETS = [
  './carte_interactive.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './leaflet.css',
  './leaflet.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Tiles & labels: network only (require internet)
  if (e.request.url.includes('cartocdn.com') || e.request.url.includes('tile')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
