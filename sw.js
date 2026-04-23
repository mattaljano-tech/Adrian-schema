// --- 1. VANLIG PWA SERVICE WORKER (För att appen ska funka offline/utan adressrad) ---
const CACHE_NAME = 'adrian-app-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// --- 2. FIREBASE PUSH NOTIFICATIONS I BAKGRUNDEN ---
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyD32139sl-MYBnStg5FsGA5tIXS9wQ15JI",
    authDomain: "adrians-schema.firebaseapp.com",
    projectId: "adrians-schema",
    storageBucket: "adrians-schema.firebasestorage.app",
    messagingSenderId: "956492068542",
    appId: "1:956492068542:web:ee1473b9c1d6ed5a1e90ef"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('[sw.js] Tog emot meddelande i bakgrunden', payload);
    
    const notificationTitle = payload.notification.title || "Nytt i Schemat!";
    const notificationOptions = {
        body: payload.notification.body || "Gå in i appen och kolla!",
        icon: '/icon-270.png', // Använder din fina ikon
        vibrate: [200, 100, 200]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
