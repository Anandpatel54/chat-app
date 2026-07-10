import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isFirebaseConfigured = 
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  !firebaseConfig.apiKey.startsWith('your_') && 
  !firebaseConfig.projectId.startsWith('your_');

const app = typeof window !== 'undefined' && isFirebaseConfigured
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApps()[0])
  : null;

let messaging: Messaging | null = null;

const getFirebaseMessaging = (): Messaging | null => {
  if (typeof window === 'undefined' || !isFirebaseConfigured || !app) {
    return null;
  }

  if (!messaging) {
    try {
      messaging = getMessaging(app);
    } catch (error) {
      console.warn('Firebase messaging not supported or failed to initialize:', error);
      return null;
    }
  }
  return messaging;
};

export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    const fbMessaging = getFirebaseMessaging();
    if (!fbMessaging) return null;

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey || vapidKey.startsWith('your_') || vapidKey.trim() === '') {
      console.warn('FCM VAPID key is not configured. Push notifications are disabled.');
      return null;
    }

    const token = await getToken(fbMessaging, { vapidKey });
    return token;
  } catch (error: any) {
    if (error?.name === 'AbortError' || error?.message?.includes('push service error')) {
      // Suppress network/browser level push service connection blocks to keep console clean
    } else {
      console.error('Error getting FCM token:', error);
    }
    return null;
  }
};

export const onForegroundMessage = (callback: (payload: any) => void) => {
  const fbMessaging = getFirebaseMessaging();
  if (!fbMessaging) return () => {};

  return onMessage(fbMessaging, callback);
};

export default app;
