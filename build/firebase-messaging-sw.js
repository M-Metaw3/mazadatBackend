
import firebase from 'firebase/compat/app';
import 'firebase/compat/messaging';

importScripts('https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyCHHzM0Rj5CDPIorgPBdOx5Qq7o5CJoe5I",
  authDomain: "pushnotificationsmazadat.firebaseapp.com",
  projectId: "pushnotificationsmazadat",
  storageBucket: "pushnotificationsmazadat.appspot.com",
  messagingSenderId: "615745377208",
  appId: "1:615745377208:web:f2f09e35497282338eb54d",
  measurementId: "G-ZG4JTNPXQR"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});
