// Firebase configuration for Pothik App
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDybZIO87Hm9Lekjebz5zFecwdnrVnT9a8",
    authDomain: "pothik-app-f2c14.firebaseapp.com",
    projectId: "pothik-app-f2c14",
    storageBucket: "pothik-app-f2c14.firebasestorage.app",
    messagingSenderId: "233353517916",
    appId: "1:233353517916:web:ace034e300b9ca5ecb3f99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Optional: Add additional scopes for Google provider
googleProvider.addScope('email');
googleProvider.addScope('profile');

export default app;
