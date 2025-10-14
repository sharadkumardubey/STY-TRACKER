import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Result, ChartData } from '@/store/slices/resultsSlice';

const RESULTS_COLLECTION = 'results';

export const resultsService = {
  // Get results by date
  getByDate: async (date: string): Promise<Result[]> => {
    try {
      const q = query(
        collection(db, RESULTS_COLLECTION),
        where('date', '==', date),
        orderBy('completedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const results: Result[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as Result);
      });

      return results;
    } catch (error) {
      console.error('Error getting results by date:', error);
      throw error;
    }
  },

  // Get results by user
  getByUserId: async (userId: string): Promise<Result[]> => {
    try {
      const q = query(
        collection(db, RESULTS_COLLECTION),
        where('userId', '==', userId),
        orderBy('completedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const results: Result[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as Result);
      });

      return results;
    } catch (error) {
      console.error('Error getting results by user:', error);
      throw error;
    }
  },

  // Get chart data for a period
  getChartData: async (
    period: 'day' | 'week' | 'month' | 'year',
    userId?: string
  ): Promise<ChartData[]> => {
    try {
      const today = new Date();
      let startDate = new Date();

      // Calculate start date based on period
      switch (period) {
        case 'day':
          startDate = today;
          break;
        case 'week':
          startDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          startDate.setDate(today.getDate() - 30);
          break;
        case 'year':
          startDate.setDate(today.getDate() - 365);
          break;
      }

      // Build query
      let q = query(
        collection(db, RESULTS_COLLECTION),
        where('date', '>=', startDate.toISOString().split('T')[0]),
        where('date', '<=', today.toISOString().split('T')[0]),
        orderBy('date', 'asc')
      );

      if (userId) {
        q = query(q, where('userId', '==', userId));
      }

      const querySnapshot = await getDocs(q);

      // Aggregate data by date
      const dataMap = new Map<string, { totalScore: number; count: number }>();

      querySnapshot.forEach((doc) => {
        const result = doc.data() as Result;
        const existing = dataMap.get(result.date) || { totalScore: 0, count: 0 };

        dataMap.set(result.date, {
          totalScore: existing.totalScore + result.score,
          count: existing.count + 1,
        });
      });

      // Convert to ChartData array
      const chartData: ChartData[] = [];
      dataMap.forEach((value, date) => {
        chartData.push({
          date,
          score: Math.round(value.totalScore / value.count),
          count: value.count,
        });
      });

      return chartData;
    } catch (error) {
      console.error('Error getting chart data:', error);
      throw error;
    }
  },

  // Create result
  create: async (resultData: Omit<Result, 'id'>): Promise<Result> => {
    try {
      const docRef = doc(collection(db, RESULTS_COLLECTION));
      const newResult: Result = {
        id: docRef.id,
        ...resultData,
      };

      await setDoc(docRef, newResult);
      return newResult;
    } catch (error) {
      console.error('Error creating result:', error);
      throw error;
    }
  },
};
