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
import { Topic, UserTopicProgress } from '@/store/slices/topicsSlice';

const TOPICS_COLLECTION = 'topics';
const PROGRESS_COLLECTION = 'topicProgress';

export const topicsService = {
  // Get all topics
  getAll: async (): Promise<Topic[]> => {
    try {
      const q = query(collection(db, TOPICS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const topics: Topic[] = [];
      querySnapshot.forEach((doc) => {
        topics.push({ id: doc.id, ...doc.data() } as Topic);
      });

      return topics;
    } catch (error) {
      console.error('Error getting topics:', error);
      throw error;
    }
  },

  // Get topics by user ID
  getByUserId: async (userId: string): Promise<Topic[]> => {
    try {
      const q = query(
        collection(db, TOPICS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const topics: Topic[] = [];
      querySnapshot.forEach((doc) => {
        topics.push({ id: doc.id, ...doc.data() } as Topic);
      });

      return topics;
    } catch (error) {
      console.error('Error getting topics by user:', error);
      throw error;
    }
  },

  // Create topic
  create: async (topicData: Omit<Topic, 'id'>): Promise<Topic> => {
    try {
      const docRef = doc(collection(db, TOPICS_COLLECTION));
      const newTopic: Topic = {
        id: docRef.id,
        ...topicData,
        createdAt: new Date().toISOString(),
      };

      await setDoc(docRef, newTopic);
      return newTopic;
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  },

  // Update topic
  update: async (id: string, topicData: Partial<Topic>): Promise<Topic> => {
    try {
      const docRef = doc(db, TOPICS_COLLECTION, id);
      await updateDoc(docRef, topicData as any);

      const updatedDoc = await getDoc(docRef);
      return { id: updatedDoc.id, ...updatedDoc.data() } as Topic;
    } catch (error) {
      console.error('Error updating topic:', error);
      throw error;
    }
  },

  // Delete topic
  delete: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, TOPICS_COLLECTION, id));
    } catch (error) {
      console.error('Error deleting topic:', error);
      throw error;
    }
  },

  // Get user progress
  getUserProgress: async (userId: string): Promise<UserTopicProgress[]> => {
    try {
      const q = query(
        collection(db, PROGRESS_COLLECTION),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);

      const progress: UserTopicProgress[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        progress.push({
          topicId: data.topicId,
          topicItemId: data.topicItemId,
          completed: data.completed,
          completedAt: data.completedAt,
        });
      });

      return progress;
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error;
    }
  },

  // Update progress
  updateProgress: async (
    userId: string,
    progress: UserTopicProgress
  ): Promise<UserTopicProgress> => {
    try {
      // Use composite key as document ID
      const progressId = `${userId}_${progress.topicId}_${progress.topicItemId}`;
      const docRef = doc(db, PROGRESS_COLLECTION, progressId);

      const progressData = {
        userId,
        ...progress,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(docRef, progressData, { merge: true });
      return progress;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  },
};
