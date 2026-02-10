const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin SDK
// The service account key file should be downloaded from Firebase Console
// Project Settings -> Service Accounts -> Generate New Private Key
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

let isInitialized = false;
let db = null;
let auth = null;

// Check if service account file exists before trying to load it
if (fs.existsSync(serviceAccountPath)) {
    try {
        const serviceAccount = require(serviceAccountPath);

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        db = admin.firestore();
        auth = admin.auth();
        isInitialized = true;

        console.log('✅ Firebase Admin SDK initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
    }
} else {
    console.warn('⚠️  Firebase Admin SDK not initialized: serviceAccountKey.json not found');
    console.warn('📝 Download your service account key from Firebase Console and save as server/serviceAccountKey.json');
}

module.exports = { admin, db, auth, isInitialized };
