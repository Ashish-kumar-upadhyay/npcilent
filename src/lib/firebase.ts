import { initializeApp, getApps } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA87VXCvO0mG32Mfcioe7kGLBuMCWO5oIs",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "nomani-perfume.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nomani-perfume",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "nomani-perfume.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "919528146054",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:919528146054:web:7c1ada6dd7ac4bbfc13d07"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier };
