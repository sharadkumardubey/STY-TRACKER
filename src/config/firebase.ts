import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your Firebase project configuration
// Get these values from Firebase Console > Project Settings > General
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
//   appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID",
//   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "YOUR_MEASUREMENT_ID"
// };

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDY8yjlZCgia2ayvd6SpeUa7Tod8SE7c5k",
  authDomain: "std-track.firebaseapp.com",
  projectId: "std-track",
  storageBucket: "std-track.firebasestorage.app",
  messagingSenderId: "852863895635",
  appId: "1:852863895635:web:cc265111eed81961af1ea6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
