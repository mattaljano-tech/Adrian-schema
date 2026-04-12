
// Importera Firebase (Compat-versionen krävs för Service Workers)
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js');

// Samma config som i din app
firebase.initializeApp({
    apiKey: "AIzaSyD32139sl-MYBnStg5FsGA5tIXS9wQ15JI",
    authDomain: "adrians-schema.firebaseapp.com",
    projectId: "adrians-schema",
    storageBucket: "adrians-schema.firebasestorage.app",
    messagingSenderId: "956492068542",
    appId: "1:956492068542:web:ee1473b9c1d6ed5a1e90ef"
});

const messaging = firebase.messaging();

// Lyssnar efter notiser när appen är stängd
messaging.onBackgroundMessage((payload) => {
    console.log('Mottog bakgrundsnotis: ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon.png', // Lägg till en ikon om du har
        badge: '/icon.png',
        vibrate: [200, 100, 200, 100, 200, 100, 200] // Tvingar fram vibration
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
