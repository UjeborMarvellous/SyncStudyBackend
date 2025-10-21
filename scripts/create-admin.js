const bcrypt = require('bcryptjs');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../firebase-service-account.json');

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
