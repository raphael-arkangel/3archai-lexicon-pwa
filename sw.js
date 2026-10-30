// 3archAI lexicon — service worker.
// Bump CACHE_NAME on every release: an installed client serves this shell from cache, so a shell
// change that does not bump it never arrives.
const CACHE_NAME = 'lexicon-v1';
const SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/lexicon.mjs',
  '/lexicon.data.mjs',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon-180.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((c) => c.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  // Navigations: network first, so a release lands; fall back to the cached shell offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put('/index.html', copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('/index.html').then((r) => r || caches.match('/'))),
    );
    return;
  }

  // Static shell and lexicon module: cache first, refreshed in the background.
  event.respondWith(
    caches.match(request).then((hit) => {
      const fetching = fetch(request)
        .then((res) => {
          if (res.ok) caches.open(CACHE_NAME).then((c) => c.put(request, res.clone())).catch(() => {});
          return res;
        })
        .catch(() => hit);
      return hit || fetching;
    }),
  );
});

// A push from the daily sender. Payload: { title, body, url, tag, data } from lexicon.mjs pushPayload().
self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { title: 'Word of the day', body: event.data ? event.data.text() : '' };
  }
  const title = payload.title || 'Word of the day';
  event.waitUntil(
    self.registration.showNotification(title, {
      body: payload.body || '',
      tag: payload.tag || 'wotd',
      data: payload.data || { url: payload.url || '/' },
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      lang: 'en',
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
      for (const w of wins) {
        if (new URL(w.url).pathname === new URL(target, self.location.origin).pathname) return w.focus();
      }
      return self.clients.openWindow(target);
    }),
  );
});
