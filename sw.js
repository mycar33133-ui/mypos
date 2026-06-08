importScripts("https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js");

const CACHE_NAME = "mypos-cache-v43";
const firebaseConfig = {
  apiKey: "AIzaSyDLcvigi3ZlI-GHPlDrb3-BWlIxZS9Rqmw",
  authDomain: "mypos-dewi.firebaseapp.com",
  projectId: "mypos-dewi",
  storageBucket: "mypos-dewi.firebasestorage.app",
  messagingSenderId: "856817367032",
  appId: "1:856817367032:web:a494d5546833fa4dfbc80d",
  measurementId: "G-G0XGJXCK4Z"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "New MyPOS Online Order";
  const options = {
    body: payload.notification?.body || payload.data?.body || "You have a new online order.",
    icon: "https://mycar33133-ui.github.io/mypos/icon-192.png",
    badge: "https://mycar33133-ui.github.io/mypos/icon-192.png",
    data: { url: payload.data?.url || "./?v=push-order#onlineOrders" },
    vibrate: [300, 150, 300]
  };
  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "./?v=push-order#onlineOrders";
  event.waitUntil(clients.openWindow(url));
});

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./firebase-messaging-sw.js",
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
