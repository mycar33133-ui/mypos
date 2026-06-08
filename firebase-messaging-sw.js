importScripts("https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js");

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
    data: { url: payload.data?.url || "https://mycar33133-ui.github.io/mypos/?v=push-order#onlineOrders" },
    vibrate: [300, 150, 300],
    requireInteraction: true
  };
  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "https://mycar33133-ui.github.io/mypos/?v=push-order#onlineOrders";
  event.waitUntil(clients.openWindow(url));
});
