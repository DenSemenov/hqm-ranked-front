import firebase from 'firebase/compat/app';
import 'firebase/compat/messaging';
import firebaseConfig from './firebaseConfig';

const initializeFirebase = () => {
    firebase.initializeApp(firebaseConfig);
}

const requestNotificationPermission = async () => {
    const messaging = firebase.messaging();

    try {
        const token = await messaging.getToken();
        return token;

    } catch (error) {
        console.error('Error getting notification permission:', error);
    }
}

export { initializeFirebase, requestNotificationPermission };