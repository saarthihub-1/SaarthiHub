import { db } from '../firebase';
import {
    doc,
    getDoc,
    setDoc,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp,
    updateDoc,
    increment
} from 'firebase/firestore';

export const firestoreService = {
    // User Profile
    createUserProfile: async (uid, userData) => {
        const userRef = doc(db, 'users', uid);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) {
            const { password, ...safeData } = userData; // Don't store password in Firestore
            await setDoc(userRef, {
                ...safeData,
                createdAt: serverTimestamp(),
                predictorUsage: 0,
                role: 'user'
            });
        }
    },

    getUserProfile: async (uid) => {
        const userRef = doc(db, 'users', uid);
        const snapshot = await getDoc(userRef);
        return snapshot.exists() ? snapshot.data() : null;
    },

    // Purchases
    // Collection: purchases
    // Document: Simply auto-ID or {uid}_{productId} if we want to enforce uniqueness easily
    // Fields: userId, productId, purchasedAt

    hasPurchased: async (uid, productId) => {
        const q = query(
            collection(db, 'purchases'),
            where('userId', '==', uid),
            where('productId', '==', productId)
        );
        const snapshot = await getDocs(q);
        return !snapshot.empty;
    },

    recordPurchase: async (uid, productId, orderDetails = {}) => {
        // In real app, this should be server-side verification
        // Check if already exists to avoid duplicates
        const existing = await firestoreService.hasPurchased(uid, productId);
        if (existing) return;

        await addDoc(collection(db, 'purchases'), {
            userId: uid,
            productId,
            purchasedAt: serverTimestamp(),
            ...orderDetails
        });
    },

    // Predictor
    // We can store usage count in user profile for simple quota management
    getPredictorUsage: async (uid) => {
        const profile = await firestoreService.getUserProfile(uid);
        return profile?.predictorUsage || 0;
    },

    incrementPredictorUsage: async (uid) => {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            predictorUsage: increment(1)
        });
    },

    // Get all purchases for a user (to hydrate state)
    getUserPurchases: async (uid) => {
        const q = query(collection(db, 'purchases'), where('userId', '==', uid));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data());
    }
};
