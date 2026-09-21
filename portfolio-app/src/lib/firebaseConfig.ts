import { getApp, getApps, initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

function createApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth {
  if (!isFirebaseConfigured) throw new Error("Firebase belum dikonfigurasi.");
  return getAuth(createApp());
}

export function getFirebaseDb(): Firestore {
  if (!isFirebaseConfigured) throw new Error("Firebase belum dikonfigurasi.");
  return getFirestore(createApp());
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!isFirebaseConfigured) throw new Error("Firebase belum dikonfigurasi.");
  return getStorage(createApp());
}