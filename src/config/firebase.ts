import admin from 'firebase-admin';
import * as serviceAccount from '../../firebase-service-account.json'

// Initialize Firebase Admin SDK with project ID only
// This will work for Firestore operations but may have limitations for Auth
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID || 'syncstudy-3d850'
  });
}

export const db = admin.firestore();
export const auth = admin.auth();

export default admin;
