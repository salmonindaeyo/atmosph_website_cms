import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
import "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "meetme-1815f.firebaseapp.com",
  projectId: "meetme-1815f",
  storageBucket: "meetme-1815f.appspot.com",
  messagingSenderId: "734564304755",
  appId: "1:734564304755:web:bc75138db8281848136706",
  measurementId: "G-T5W30RVM6P",
};

// Initialize Firebase only if API key exists
if (!process.env.FIREBASE_API_KEY) {
  console.error('Firebase API key is missing. Please check your environment variables.');
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);