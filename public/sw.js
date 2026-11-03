// Kill switch del service worker del portafolio anterior (next-pwa registraba /sw.js).
// Los navegadores que lo tengan instalado bajan esta versión al revisar actualizaciones: borra las
// cachés viejas, se desregistra y recarga las pestañas abiertas para que carguen el sitio nuevo.
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) client.navigate(client.url);
    })(),
  );
});
