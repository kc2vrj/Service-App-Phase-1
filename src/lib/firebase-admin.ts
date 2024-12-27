// src/lib/firebase-admin.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let app;

try {
  // Check if any Firebase Admin apps have been initialized
  if (!getApps().length) {
    console.log('Initializing Firebase Admin...');
    
    if (!process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error('FIREBASE_PRIVATE_KEY is not set');
    }
    
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    
    console.log('Firebase Admin initialized successfully');
  } else {
    app = getApps()[0];
    console.log('Using existing Firebase Admin instance');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  throw error;
}

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);