// Retire the former broad Workbox worker and remove only its known caches.
const legacyCaches = new Set([
  "start-url", "google-fonts-webfonts", "google-fonts-stylesheets", "static-font-assets",
  "static-image-assets", "next-image", "static-js-assets", "static-style-assets",
  "next-data", "static-data-assets", "apis", "others", "cross-origin",
]);
self.addEventListener("install", (event) => event.waitUntil(self.skipWaiting()));
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) =>
      legacyCaches.has(name) || name.startsWith("workbox-precache-v2-")
    ).map((name) => caches.delete(name)));
    await self.clients.claim();
    await self.registration.unregister();
  })());
});
