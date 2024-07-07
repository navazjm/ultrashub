import { initializeApp } from "firebase/app";
import {
    browserLocalPersistence,
    getAuth,
    GoogleAuthProvider,
    setPersistence,
    signInWithPopup,
    signOut,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
const firebaseGoogleAuthProvider = new GoogleAuthProvider();

// Set persistence
setPersistence(firebaseAuth, browserLocalPersistence).catch((error) => {
    console.error("Error setting persistence:", error);
});

export const signInWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, firebaseGoogleAuthProvider);
};

export const signOutUser = async () => {
    await signOut(firebaseAuth);
};
