const CACHE_NAME = "boca-players-pwa-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async (cache) => {
        const response = await fetch(OFFLINE_URL, { cache: "reload" });

        if (!response.ok) {
          throw new Error(
            `No se pudo precargar la pagina offline: HTTP ${response.status}.`,
          );
        }

        await cache.put(OFFLINE_URL, response);
        await self.skipWaiting();
      })
      .catch((error) => {
        console.error("No se pudo instalar el Service Worker.", error);
        throw error;
      }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName.startsWith("boca-players-pwa-") &&
                cacheName !== CACHE_NAME,
            )
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (
    request.method !== "GET" ||
    request.mode !== "navigate" ||
    new URL(request.url).origin !== self.location.origin
  ) {
    return;
  }

  event.respondWith(
    fetch(request).catch(async () => {
      const offlinePage = await caches.match(OFFLINE_URL);

      if (offlinePage) {
        return offlinePage;
      }

      return new Response("No hay conexion a internet.", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }),
  );
});
