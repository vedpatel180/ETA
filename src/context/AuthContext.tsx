import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  auth, 
  db, 
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut,
  signInAnonymously,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  User
} from '../lib/firebase';
import { emitToast } from '../utils/notifications';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'passenger' | 'irctc_agent' | 'railway_official' | 'guest';
  createdAt?: string;
  lastLoginAt?: string;
  isAnonymous?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, role?: UserProfile['role']) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync profile from Firestore or create initial doc
  const syncUserProfile = async (firebaseUser: User, customName?: string, customRole?: UserProfile['role']) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();
        setProfile({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: data.displayName || firebaseUser.displayName || 'Passenger',
          role: data.role || 'passenger',
          createdAt: data.createdAt,
          lastLoginAt: new Date().toISOString(),
          isAnonymous: firebaseUser.isAnonymous
        });
        // Update last login
        await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
      } else {
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: customName || firebaseUser.displayName || (firebaseUser.isAnonymous ? 'Guest Passenger' : 'Rail Passenger'),
          role: customRole || (firebaseUser.isAnonymous ? 'guest' : 'passenger'),
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          isAnonymous: firebaseUser.isAnonymous
        };
        await setDoc(userRef, {
          ...newProfile,
          serverCreated: serverTimestamp(),
          lastLoginAt: serverTimestamp()
        });
        setProfile(newProfile);
      }
    } catch (err) {
      console.warn('Firestore profile sync note (fallback to local auth object):', err);
      setProfile({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: customName || firebaseUser.displayName || (firebaseUser.isAnonymous ? 'Guest Passenger' : 'Passenger'),
        role: customRole || (firebaseUser.isAnonymous ? 'guest' : 'passenger'),
        isAnonymous: firebaseUser.isAnonymous
      });
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      await syncUserProfile(res.user);
      emitToast({
        title: 'Signed In Successfully',
        body: `Welcome back to RailETA, ${res.user.displayName || email}!`,
        type: 'arrival'
      });
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string, role: UserProfile['role'] = 'passenger') => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (name) {
        await updateProfile(res.user, { displayName: name });
      }
      await syncUserProfile(res.user, name, role);
      emitToast({
        title: 'Account Created',
        body: `Welcome to RailETA, ${name}! Your train tracking dashboard is ready.`,
        type: 'arrival'
      });
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await syncUserProfile(res.user);
      emitToast({
        title: 'Google Sign In Successful',
        body: `Signed in as ${res.user.displayName || res.user.email}.`,
        type: 'arrival'
      });
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const signInAsGuest = async () => {
    setLoading(true);
    try {
      const res = await signInAnonymously(auth);
      await syncUserProfile(res.user, 'Guest Passenger', 'guest');
      emitToast({
        title: 'Guest Access Granted',
        body: 'You are viewing RailETA in quick guest mode.',
        type: 'info'
      });
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setProfile(null);
      emitToast({
        title: 'Signed Out',
        body: 'You have been signed out from RailETA.',
        type: 'info'
      });
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInAsGuest,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
