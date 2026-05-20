const CACHE_NAME = "biosinergia-pwa-v1-2-0";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-maskable.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(
      STATIC_ASSETS.map(async (asset) => {
        try {
          await cache.add(asset);
        } catch (error) {
          console.warn("No se pudo cachear:", asset, error);
        }
      })
    );
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
  })());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const requestUrl = new URL(request.url);

  if (requestUrl.hostname.includes("firebaseio.com")) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.method !== "GET") {
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const networkResponse = await fetch(request);
      const sameOrigin = requestUrl.origin === self.location.origin;
      if (sameOrigin && STATIC_ASSETS.some((asset) => requestUrl.pathname.endsWith(asset.replace("./", "")))) {
        cache.put(request, networkResponse.clone()).catch(() => {});
      }
      return networkResponse;
    } catch (error) {
      return cached || Response.error();
    }
  })());
});
