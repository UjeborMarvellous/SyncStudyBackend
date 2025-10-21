const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'syncstudy-3d850'
  });
}

const db = admin.firestore();

async function createAdminUser() {
  try {
    const bcrypt = require('bcryptjs');
    
    // Admin user data
    const adminEmail = 'marvellousujebor@gmail.com';
    const adminPassword = 'SyncStudy2025@!';
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    // Check if admin already exists
    const existingAdmin = await db.collection('adminUsers')
      .where('email', '==', adminEmail)
      .get();
    
    if (!existingAdmin.empty) {
      console.log('Admin user already exists!');
      return;
    }
    
    // Create admin user
    const adminUser = {
      email: adminEmail,
      password: hashedPassword,
      role: 'super-admin',
      createdAt: new Date(),
      lastLogin: null
    };
    
    const docRef = await db.collection('adminUsers').add(adminUser);
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('🆔 Document ID:', docRef.id);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdminUser();
