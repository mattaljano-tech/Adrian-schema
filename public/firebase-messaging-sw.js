importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js');

// --- DIN FIREBASE CONFIG ---
// Dessa MÅSTE vara exakt samma som i din index.html
firebase.initializeApp({
    apiKey: "AIzaSyD32139sl-MYBnStg5FsGA5tIXS9wQ15JI",
    authDomain: "adrians-schema.firebaseapp.com",
    projectId: "adrians-schema",
    storageBucket: "adrians-schema.firebasestorage.app",
    messagingSenderId: "956492068542",
    appId: "1:956492068542:web:ee1473b9c1d6ed5a1e90ef"
});

const messaging = firebase.messaging();

// Denna del gör att notisen visas även när appen är helt stängd
messaging.onBackgroundMessage((payload) => {
  console.log('Bakgrundsnotis mottagen:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-270.png' // Se till att sökvägen till din ikon är rätt
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});