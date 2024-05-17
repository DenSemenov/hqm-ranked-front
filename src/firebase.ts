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
    return getToken(messaging, { vapidKey: `BCt2tnJAppW_QHrVWZnJz1fXtmllouN6l7BFeuz-hwbKujpqrjw9taOAMa8Ms8G0Hv3YVnQ-Bq8Tf-hkEqJ_en0` })
        .then((currentToken) => {
            if (currentToken) {
                console.log('current token for client: ', currentToken);
            } else {
                console.log('No registration token available. Request permission to generate one.');
            }
        })
        .catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
        });
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });

