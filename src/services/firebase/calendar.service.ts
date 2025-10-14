import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

const PROGRESS_COLLECTION = 'topicProgress';
const TOPICS_COLLECTION = 'topics';

export interface DailyProgress {
  date: string;
  userId: string;
  userName: string;
  totalTopics: number;
  completedTopics: number;
  completionPercentage: number;
}

export const calendarService = {
  // Get monthly progress for all users
  getMonthProgress: async (year: number, month: number): Promise<DailyProgress[]> => {
    try {
      // Get start and end dates
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      const startStr = startDate.toISOString().split('T')[0];
      const endStr = endDate.toISOString().split('T')[0];

      // Get all progress records for the month
      const progressQuery = query(
        collection(db, PROGRESS_COLLECTION),
        where('completedAt', '>=', startStr),
        where('completedAt', '<=', endStr)
      );

      const progressSnapshot = await getDocs(progressQuery);

      // Get all topics
      const topicsSnapshot = await getDocs(collection(db, TOPICS_COLLECTION));

      // Build user-date-topic map
      const progressMap = new Map<string, Set<string>>();
      const totalTopicsMap = new Map<string, number>();

      // Count total topics per user
      topicsSnapshot.forEach((doc) => {
        const topic = doc.data();
        const userId = topic.userId;
        const topicCount = topic.topics?.length || 0;

        totalTopicsMap.set(
          userId,
          (totalTopicsMap.get(userId) || 0) + topicCount
        );
      });

      // Count completed topics per user per date
      progressSnapshot.forEach((doc) => {
        const progress = doc.data();
        if (progress.completed && progress.completedAt) {
          const date = progress.completedAt.split('T')[0];
          const key = `${progress.userId}_${date}`;

          if (!progressMap.has(key)) {
            progressMap.set(key, new Set());
          }

          progressMap.get(key)!.add(progress.topicItemId);
        }
      });

      // Generate daily progress data
      const dailyProgress: DailyProgress[] = [];
      const daysInMonth = endDate.getDate();

      // Get user names (simplified - in production, query users collection)
      const userNames = new Map<string, string>();
      topicsSnapshot.forEach((doc) => {
        const userId = doc.data().userId;
        if (!userNames.has(userId)) {
          userNames.set(userId, `User ${userId.substring(0, 8)}`);
        }
      });

      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        totalTopicsMap.forEach((totalTopics, userId) => {
          const key = `${userId}_${date}`;
          const completedTopics = progressMap.get(key)?.size || 0;

          dailyProgress.push({
            date,
            userId,
            userName: userNames.get(userId) || 'Unknown User',
            totalTopics,
            completedTopics,
            completionPercentage: Math.round((completedTopics / totalTopics) * 100),
          });
        });
      }

      return dailyProgress;
    } catch (error) {
      console.error('Error getting month progress:', error);
      throw error;
    }
  },

  // Get monthly progress for a specific user
  getUserMonthProgress: async (
    userId: string,
    year: number,
    month: number
  ): Promise<DailyProgress[]> => {
    try {
      const allProgress = await calendarService.getMonthProgress(year, month);
      return allProgress.filter((p) => p.userId === userId);
    } catch (error) {
      console.error('Error getting user month progress:', error);
      throw error;
    }
  },
};
