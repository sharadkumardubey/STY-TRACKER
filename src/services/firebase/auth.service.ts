import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { UserRole } from '@/store/slices/authSlice';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export const authService = {
  // Sign in with email and password
  signIn: async (email: string, password: string): Promise<UserProfile> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userProfile = await authService.getUserProfile(userCredential.user.uid);

      if (!userProfile) {
        throw new Error('User profile not found');
      }

      return userProfile;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  },

  // Sign in with phone (for this implementation, we'll use email as identifier)
  signInWithPhone: async (_phone: string, _password: string): Promise<UserProfile> => {
    // For simplicity, we'll find user by phone in Firestore and use their email
    // In production, use Firebase Phone Authentication
    throw new Error('Phone authentication not implemented yet. Please use email login.');
  },

  // Sign up new user
  signUp: async (
    email: string,
    password: string,
    name: string,
    phone: string,
    role: UserRole = 'user'
  ): Promise<UserProfile> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const userProfile: UserProfile = {
        id: userCredential.user.uid,
        name,
        email,
        phone,
        role,
        createdAt: new Date().toISOString(),
      };

      // Store user profile in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);

      return userProfile;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  },

  // Sign out
  signOut: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  },

  // Get user profile from Firestore
  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }

      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },
};
