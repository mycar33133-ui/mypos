const CACHE_NAME = "mypos-cache-v6";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached || fetch(event.request).catch(() => caches.match("./index.html"))
    )
  );
});

self.addEventListener("sync", (event) => {
  if (event.tag === "mypos-background-sync") {
    event.waitUntil(syncMyPOSData());
  }
});

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "mypos-periodic-backup") {
    event.waitUntil(syncMyPOSData());
  }
});

async function syncMyPOSData() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(ASSETS);
}
