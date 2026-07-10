import admin from 'firebase-admin';

let isFirebaseInitialized = false;

const configureFirebase = (): void => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  const isConfigured =
    projectId &&
    privateKey &&
    clientEmail &&
    !projectId.startsWith('your_') &&
    !privateKey.startsWith('your_') &&
    !clientEmail.startsWith('your_');

  if (!isConfigured) {
    console.warn('⚠️ Firebase Admin is not configured. Push notifications will be disabled.');
    return;
  }

  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          privateKey: privateKey.replace(/\\n/g, '\n'),
          clientEmail,
        }),
      });
      isFirebaseInitialized = true;
      console.log('✅ Firebase Admin initialized successfully.');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error);
  }
};

export const getFirebaseMessaging = (): admin.messaging.Messaging | null => {
  if (!isFirebaseInitialized) {
    return null;
  }
  return admin.messaging();
};

export default configureFirebase;
