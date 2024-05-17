// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyDqE4sROVG_9XTECfeWtNwTuzuoFSJ8_E4",
    authDomain: "hqmpush.firebaseapp.com",
    projectId: "hqmpush",
    storageBucket: "hqmpush.appspot.com",
    messagingSenderId: "272129312927",
    appId: "1:272129312927:web:e07460fde203120b453aaa",
    measurementId: "G-PPDZN7J39L"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});