const admin = require('firebase-admin');

// This script helps you set up Firebase Admin SDK credentials
// Run this with: node scripts/setup-firebase-admin.js

console.log('🔧 Firebase Admin SDK Setup Helper');
console.log('=====================================');
console.log('');

console.log('To fix the 403 Forbidden errors, you need to:');
console.log('');
console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
console.log('2. Select your project: syncstudy-3d850');
console.log('3. Go to Project Settings → Service Accounts');
console.log('4. Click "Generate new private key"');
console.log('5. Download the JSON file');
console.log('');

console.log('6. Set these environment variables in your production environment:');
console.log('   FIREBASE_PROJECT_ID=syncstudy-3d850');
console.log('   FIREBASE_PRIVATE_KEY_ID=your_private_key_id');
console.log('   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYour_private_key_here\\n-----END PRIVATE KEY-----\\n"');
console.log('   FIREBASE_CLIENT_EMAIL=your_service_account_email');
console.log('   FIREBASE_CLIENT_ID=your_client_id');
console.log('');

console.log('7. For local development, you can also:');
console.log('   - Place the service account JSON file in backend/');
console.log('   - Rename it to "serviceAccountKey.json"');
console.log('   - Update backend/src/config/firebase.ts to use the file directly');
console.log('');

console.log('8. After setting up credentials, run:');
console.log('   node scripts/setup-admin.js');
console.log('');

console.log('Current environment variables:');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID || '❌ Not set');
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL || '❌ Not set');
console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✅ Set' : '❌ Not set');
console.log('');

// Test if we can initialize Firebase Admin
try {
  if (!admin.apps.length) {
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
    
    console.log('✅ Firebase Admin SDK initialized successfully!');
  } else {
    console.log('✅ Firebase Admin SDK already initialized!');
  }
} catch (error) {
  console.log('❌ Firebase Admin SDK initialization failed:');
  console.log('   Error:', error.message);
  console.log('');
  console.log('   This is expected if environment variables are not set.');
  console.log('   Follow the steps above to set up your credentials.');
}

process.exit(0);






