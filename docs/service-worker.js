const APP_VERSION = "biosinergia-pwa-v1-8-0";
const CACHE_NAME = APP_VERSION;
const STATIC_ASSETS = [
  "/biosinergia-modulo-portatil/",
  "/biosinergia-modulo-portatil/index.html",
  "/biosinergia-modulo-portatil/graficos.html",
  "/biosinergia-modulo-portatil/calibracion.html",
  "/biosinergia-modulo-portatil/configuracion.html",
  "/biosinergia-modulo-portatil/admin.html",
  "/biosinergia-modulo-portatil/login.html",
  "/biosinergia-modulo-portatil/style.css",
  "/biosinergia-modulo-portatil/app.js",
  "/biosinergia-modulo-portatil/auth.js",
  "/biosinergia-modulo-portatil/auth-guard.js",
  "/biosinergia-modulo-portatil/firebase-config.js",
  "/biosinergia-modulo-portatil/manifest.webmanifest",
  "/biosinergia-modulo-portatil/icons/icon.svg",
  "/biosinergia-modulo-portatil/icons/icon-192.png",
  "/biosinergia-modulo-portatil/icons/icon-512.png",
  "/biosinergia-modulo-portatil/icons/icon-maskable-512.png"
];

const NETWORK_FIRST_PATHS = new Set([
  "/biosinergia-modulo-portatil/",
  "/biosinergia-modulo-portatil/index.html",
  "/biosinergia-modulo-portatil/graficos.html",
  "/biosinergia-modulo-portatil/calibracion.html",
  "/biosinergia-modulo-portatil/configuracion.html",
  "/biosinergia-modulo-portatil/admin.html",
  "/biosinergia-modulo-portatil/login.html",
  "/biosinergia-modulo-portatil/app.js",
  "/biosinergia-modulo-portatil/auth.js",
  "/biosinergia-modulo-portatil/auth-guard.js",
  "/biosinergia-modulo-portatil/firebase-config.js",
  "/biosinergia-modulo-portatil/style.css",
  "/biosinergia-modulo-portatil/manifest.webmanifest"
]);

function isFirebaseRequest(url) {
  return url.hostname.includes("firebaseio.com")
    || url.hostname.includes("identitytoolkit.googleapis.com")
    || url.hostname.includes("securetoken.googleapis.com");
}

function isNetworkFirstRequest(request, url) {
  const acceptsHtml = request.headers.get("accept")?.includes("text/html");
  return request.mode === "navigate"
    || acceptsHtml
    || NETWORK_FIRST_PATHS.has(url.pathname)
    || url.pathname.endsWith("/app.js")
    || url.pathname.endsWith("/style.css");
}

async function fetchAndUpdateCache(request) {
  const cache = await caches.open(CACHE_NAME);
  const freshRequest = new Request(request, { cache: "no-store" });
  const response = await fetch(freshRequest);
  if (response && (response.ok || response.type === "opaque")) {
    cache.put(request, response.clone()).catch(() => {});
  }
  return response;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    return await fetchAndUpdateCache(request);
  } catch (error) {
    const cached = await cache.match(request);
    return cached || Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    return await fetchAndUpdateCache(request);
  } catch (error) {
    return Response.error();
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.allSettled(STATIC_ASSETS.map((asset) => cache.add(asset)));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    await clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const requestUrl = new URL(request.url);

  // Datos, Authentication y refresh-token siempre deben venir de la red.
  // Nunca cachear respuestas privadas de Firebase.
  if (isFirebaseRequest(requestUrl)) {
    const liveRequest = new Request(event.request, { cache: "no-store" });
    event.respondWith(fetch(liveRequest));
    return;
  }

  if (request.method !== "GET") {
    return;
  }

  if (isNetworkFirstRequest(request, requestUrl)) {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});
