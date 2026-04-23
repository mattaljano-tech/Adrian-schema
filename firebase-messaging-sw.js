// Importera Firebase (vi använder compat-versionen för Service Workers)
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js');

// Samma inställningar som i din HTML-fil
firebase.initializeApp({
    apiKey: "AIzaSyD32139sl-MYBnStg5FsGA5tIXS9wQ15JI",
    authDomain: "adrians-schema.firebaseapp.com",
    projectId: "adrians-schema",
    storageBucket: "adrians-schema.firebasestorage.app",
    messagingSenderId: "956492068542",
    appId: "1:956492068542:web:ee1473b9c1d6ed5a1e90ef"
});

const messaging = firebase.messaging();

// Lyssnar efter notiser när appen är stängd eller i bakgrunden
messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Tog emot meddelande i bakgrunden', payload);
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon-192.png', // Samma ikon som till hemskärmen!
        vibrate: [200, 100, 200]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
