import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { User } from '@/store/slices/usersSlice';

const USERS_COLLECTION = 'users';

export const usersService = {
  // Get all users
  getAll: async (): Promise<User[]> => {
    try {
      const q = query(collection(db, USERS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() } as User);
      });

      return users;
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  },

  // Get user by ID
  getById: async (id: string): Promise<User | null> => {
    try {
      const docRef = doc(db, USERS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as User;
      }

      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  // Get users by role
  getByRole: async (role: string): Promise<User[]> => {
    try {
      const q = query(
        collection(db, USERS_COLLECTION),
        where('role', '==', role),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() } as User);
      });

      return users;
    } catch (error) {
      console.error('Error getting users by role:', error);
      throw error;
    }
  },

  // Create user
  create: async (userData: Omit<User, 'id'>): Promise<User> => {
    try {
      const docRef = doc(collection(db, USERS_COLLECTION));
      const newUser: User = {
        id: docRef.id,
        ...userData,
        createdAt: new Date().toISOString().split('T')[0],
      };

      await setDoc(docRef, newUser);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  update: async (id: string, userData: Partial<User>): Promise<User> => {
    try {
      const docRef = doc(db, USERS_COLLECTION, id);
      await updateDoc(docRef, userData as any);

      const updatedDoc = await getDoc(docRef);
      return { id: updatedDoc.id, ...updatedDoc.data() } as User;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  delete: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, USERS_COLLECTION, id));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};
