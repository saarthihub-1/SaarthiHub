import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { auth } from '../firebase';
import { firestoreService } from '../services/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchases, setPurchases] = useState([]); // Store purchased product IDs

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get additional user data from Firestore
          const profile = await firestoreService.getUserProfile(firebaseUser.uid);
          const userPurchases = await firestoreService.getUserPurchases(firebaseUser.uid);

          setUser({
            ...profile,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified
            // Note: Password is NOT stored in user object here for security
          });

          setPurchases(userPurchases.map(p => p.productId));
        } catch (err) {
          console.error("Error fetching user profile", err);
          // Fallback if firestore fails
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
        }
      } else {
        setUser(null);
        setPurchases([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, name, phone) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Create Firestore profile
      const userData = {
        name,
        email,
        phone,
        emailVerified: false
      };

      await firestoreService.createUserProfile(firebaseUser.uid, userData);

      // Send verification email
      await sendEmailVerification(firebaseUser);

      return firebaseUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const refreshPurchases = async () => {
    if (user?.uid) {
      const userPurchases = await firestoreService.getUserPurchases(user.uid);
      setPurchases(userPurchases.map(p => p.productId));
    }
  };

  // Helper getters
  const hasPurchased = (itemId) => purchases.includes(itemId);

  // Note: Bookmarks/Predictor usage logic ideally moves to Firestore too.
  // We can implement simple local optimistic UI or read from user profile if we synced it.
  const isBookmarked = (itemId) => user?.bookmarks?.includes(itemId) || false;

  const FREE_PREDICTOR_USES = 3;
  const canUsePredictor = () => (user?.predictorUsage || 0) < (FREE_PREDICTOR_USES + (user?.predictorCredits || 0));
  const getRemainingPredictorUses = () => Math.max(0, (FREE_PREDICTOR_USES + (user?.predictorCredits || 0)) - (user?.predictorUsage || 0));

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    signup, // Firebase signup doesn't use the old 2-step OTP flow by default
    hasPurchased,
    isBookmarked,
    canUsePredictor,
    getRemainingPredictorUses,
    refreshPurchases,
    // Methods to be updated for Firestore usage
    usePredictor: async () => {
      if (user?.uid) {
        await firestoreService.incrementPredictorUsage(user.uid);
        // Refresh profile to update UI
        const profile = await firestoreService.getUserProfile(user.uid);
        setUser(prev => ({ ...prev, ...profile }));
      }
    },
    purchaseItem: async (productId) => {
      // Optimistic update - add productId to local purchases state
      setPurchases(prev => prev.includes(productId) ? prev : [...prev, productId]);
    },
    addPredictorCredits: (credits) => {
      // Optimistic update for credits
      setUser(prev => ({
        ...prev,
        predictorCredits: (prev?.predictorCredits || 0) + credits
      }));
    },
    // Email verification helpers
    resendVerificationEmail: async () => {
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        await sendEmailVerification(auth.currentUser);
      }
    },
    refreshUser: async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        const profile = await firestoreService.getUserProfile(auth.currentUser.uid);
        setUser(prev => ({
          ...prev,
          ...profile,
          emailVerified: auth.currentUser.emailVerified
        }));
      }
    },
    // Compatibility placeholders
    initiateSignup: async () => { throw new Error("Please use standard signup"); },
    verifyEmailOTP: async () => { /* Firebase handles verification if configured */ },
    resendOTP: async () => { /* Firebase handles verification email */ },
    cancelVerification: () => { },
    toggleBookmark: () => { },
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
