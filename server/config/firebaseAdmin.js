const admin = require("firebase-admin");

let isInitialized = false;
let db = null;
let auth = null;

try {
    const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT
    );

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });

    db = admin.firestore();
    auth = admin.auth();
    isInitialized = true;

    console.log("✅ Firebase Admin SDK initialized successfully (from env)");
} catch (error) {
    console.error("❌ Firebase Admin SDK init failed:", error.message);
    console.warn("⚠️ Make sure FIREBASE_SERVICE_ACCOUNT is set in Railway Variables");
}

module.exports = { admin, db, auth, isInitialized };
