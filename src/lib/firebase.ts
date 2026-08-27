import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  signInAnonymously,
  updateProfile,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

// Initialize Firebase App
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth
export const auth: Auth = getAuth(app);

// Initialize Firestore (support named custom database or default)
export const db: Firestore = firebaseConfigData.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut,
  signInAnonymously,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
};

export type { User };
