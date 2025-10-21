const bcrypt = require('bcryptjs');
const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK using environment variables
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function createAdminUser() {
  try {
    const email = process.argv[2];
    const password = process.argv[3];
    const role = process.argv[4] || 'admin';

    if (!email || !password) {
      console.error('Usage: node create-admin.js <email> <password> [role]');
      console.error('Example: node create-admin.js admin@studyconnect.com mypassword123 super-admin');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await db.collection('adminUsers')
      .where('email', '==', email)
      .get();

    if (!existingAdmin.empty) {
      console.error('Admin user already exists with this email');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const adminUser = {
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
      lastLogin: null
    };

    const docRef = await db.collection('adminUsers').add(adminUser);

    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Role: ${role}`);
    console.log(`🆔 Document ID: ${docRef.id}`);
    console.log('\n🚀 You can now login to the admin panel with these credentials.');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdminUser();
