// Manual script to create admin user
// Run this after setting up Firebase project

const admin = require('firebase-admin');

// Initialize with project ID only (will use default credentials)
admin.initializeApp({
  projectId: 'syncstudy-3d850'
});

const db = admin.firestore();

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Create admin user document
    const adminUser = {
      email: 'marvellousujebor@gmail.com',
      role: 'super-admin',
      createdAt: new Date(),
      lastLogin: null
    };
    
    // Add to adminUsers collection
    const docRef = await db.collection('adminUsers').add(adminUser);
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: marvellousujebor@gmail.com');
    console.log('🔑 Password: SyncStudy2025@!');
    console.log('🆔 Document ID:', docRef.id);
    console.log('');
    console.log('Next steps:');
    console.log('1. Go to Firebase Console > Authentication > Users');
    console.log('2. Add user with email: marvellousujebor@gmail.com');
    console.log('3. Set password: SyncStudy2025@!');
    console.log('4. Update the document ID in Firestore to match the Firebase Auth UID');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdminUser();
