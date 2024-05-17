import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

var firebaseConfig = {
    apiKey: "AIzaSyDqE4sROVG_9XTECfeWtNwTuzuoFSJ8_E4",
    authDomain: "hqmpush.firebaseapp.com",
    projectId: "hqmpush",
    storageBucket: "hqmpush.appspot.com",
    messagingSenderId: "272129312927",
    appId: "1:272129312927:web:e07460fde203120b453aaa",
    measurementId: "G-PPDZN7J39L"
};

initializeApp(firebaseConfig);

const messaging = getMessaging();

export const requestForToken = () => {
    return getToken(messaging, { vapidKey: "BJ7WPfdVj_6F7Qki3B6ghrUhDx5HSzbNnOtc90gtzmGHbmZ7rJtTQswU_SS_xS5GlE_yGtQ5dhedW-tVGE1b9X0" })
};

