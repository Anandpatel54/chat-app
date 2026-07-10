// Firebase Cloud Messaging background service worker script
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

// Initialize Firebase App in service worker
// Note: These credentials will be initialized correctly by the browser when client configuration matches
firebase.initializeApp({
  apiKey: "AIzaSyCIdLJfo0KAshYBHkpcnsD8woSn6bzOnyU",
  authDomain: "chatapp-285be.firebaseapp.com",
  projectId: "chatapp-285be",
  storageBucket: "chatapp-285be.firebasestorage.app",
  messagingSenderId: "185807745607",
  appId: "1:185807745607:web:a323384fa82877f213f762"
});

const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'New Message';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification.',
    icon: payload.notification?.image || '/icons/default-avatar.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Click action handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const conversationId = event.notification.data?.conversationId;
  const targetUrl = conversationId ? `/chat/${conversationId}` : '/home';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window open with this app
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.navigate(targetUrl).then(focusedClient => focusedClient.focus());
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
