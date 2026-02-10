// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAriA72aPceamcyvTL94ULHUh8cnGBN8JI",
    authDomain: "saarthihub-6e985.firebaseapp.com",
    projectId: "saarthihub-6e985",
    storageBucket: "saarthihub-6e985.firebasestorage.app",
    messagingSenderId: "392286255691",
    appId: "1:392286255691:web:18c196630595cff4db6bce",
    measurementId: "G-M2SKH1VQS5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
