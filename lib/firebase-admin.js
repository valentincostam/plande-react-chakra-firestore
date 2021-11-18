import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const options = {
  credential: cert({
    project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  }),
};

const adminApp = getApps().length === 0 ? initializeApp(options) : getApp();

export const db = getFirestore(adminApp);
export const auth = getAuth();

export default adminApp;
