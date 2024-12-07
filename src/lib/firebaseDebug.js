// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentSingleTabManager } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

console.log('Starting Firebase initialization...');
console.log('Environment check:', {
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
});

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

console.log('Config loaded, initializing Firebase...');

const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized');

const db = initializeFirestore(app, {
  localCache: persistentLocalCache(
    { tabManager: persistentSingleTabManager() }
  )
});
console.log('Firestore initialized');

const auth = getAuth(app);
console.log('Auth initialized');

export { db, auth };