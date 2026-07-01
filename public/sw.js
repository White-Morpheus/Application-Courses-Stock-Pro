const CACHE_NAME = "pantrypal-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon.svg",
  "/icon-maskable.svg"
];

// Install Event: Cache critical static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching app shell assets...");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Sweep and clear outdated caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Purging old cache storage:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Handle requests with custom PWA caching strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // We only intercept GET requests
  if (request.method !== "GET") return;

  // Let API database endpoints bypass the service worker directly
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // Network-First strategy for HTML navigation requests to prevent stale index.html 404 issues
  if (request.mode === "navigate" || (request.headers.get("accept") && request.headers.get("accept").includes("text/html"))) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => {
          // Fall back to cache if offline
          return caches.match("/") || caches.match("/index.html");
        })
    );
    return;
  }

  // Stale-While-Revalidate caching strategy for application assets (JS, CSS, images, icons, etc.)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch updated version in the background to keep cache fresh
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {
            // Ignore background fetch errors (device is offline)
          });
        return cachedResponse;
      }

      // If asset is not in cache, fetch it from network, and cache it dynamically
      return fetch(request)
        .then((networkResponse) => {
          // Verify valid response before caching
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return networkResponse;
        });
    })
  );
});
