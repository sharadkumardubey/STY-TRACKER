// Firebase API - Use this file for Firebase integration
// This file replaces the dummy API in api.ts

import { authService, UserProfile } from './firebase/auth.service';
import { usersService } from './firebase/users.service';
import { topicsService } from './firebase/topics.service';
import { resultsService } from './firebase/results.service';
import { calendarService, DailyProgress } from './firebase/calendar.service';
import { User } from '@/store/slices/usersSlice';
import { Topic, UserTopicProgress } from '@/store/slices/topicsSlice';
import { Result, ChartData } from '@/store/slices/resultsSlice';

// Auth API
export const authAPI = {
  login: async (emailOrPhone: string, password: string): Promise<UserProfile> => {
    // For now, we'll use email authentication
    // TODO: Implement phone authentication if needed
    return await authService.signIn(emailOrPhone, password);
  },

  signUp: async (
    email: string,
    password: string,
    name: string,
    phone: string,
    role: 'admin' | 'user' = 'user'
  ): Promise<UserProfile> => {
    return await authService.signUp(email, password, name, phone, role);
  },

  logout: async (): Promise<void> => {
    return await authService.signOut();
  },

  getCurrentUser: () => {
    return authService.getCurrentUser();
  },

  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    return await authService.getUserProfile(uid);
  },
};

// Users API
export const usersAPI = {
  getAll: async (): Promise<User[]> => {
    return await usersService.getAll();
  },

  getById: async (id: string): Promise<User | undefined> => {
    const user = await usersService.getById(id);
    return user || undefined;
  },

  getByRole: async (role: 'admin' | 'user'): Promise<User[]> => {
    return await usersService.getByRole(role);
  },

  create: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    return await usersService.create({ ...userData, createdAt: '' });
  },

  update: async (id: string, userData: Partial<User>): Promise<User> => {
    return await usersService.update(id, userData);
  },

  delete: async (id: string): Promise<void> => {
    return await usersService.delete(id);
  },
};

// Topics API
export const topicsAPI = {
  getAll: async (): Promise<Topic[]> => {
    return await topicsService.getAll();
  },

  getByUserId: async (userId: string): Promise<Topic[]> => {
    return await topicsService.getByUserId(userId);
  },

  create: async (topicData: Omit<Topic, 'id' | 'createdAt'>): Promise<Topic> => {
    return await topicsService.create({ ...topicData, createdAt: '' });
  },

  update: async (id: string, topicData: Partial<Topic>): Promise<Topic> => {
    return await topicsService.update(id, topicData);
  },

  delete: async (id: string): Promise<void> => {
    return await topicsService.delete(id);
  },

  getUserProgress: async (userId: string): Promise<UserTopicProgress[]> => {
    return await topicsService.getUserProgress(userId);
  },

  updateProgress: async (
    userId: string,
    progress: UserTopicProgress
  ): Promise<UserTopicProgress> => {
    return await topicsService.updateProgress(userId, progress);
  },
};

// Results API
export const resultsAPI = {
  getByDate: async (date: string): Promise<Result[]> => {
    return await resultsService.getByDate(date);
  },

  getByUserId: async (userId: string): Promise<Result[]> => {
    return await resultsService.getByUserId(userId);
  },

  getChartData: async (
    period: 'day' | 'week' | 'month' | 'year',
    userId?: string
  ): Promise<ChartData[]> => {
    return await resultsService.getChartData(period, userId);
  },

  create: async (resultData: Omit<Result, 'id'>): Promise<Result> => {
    return await resultsService.create(resultData);
  },
};

// Calendar API
export const calendarAPI = {
  getMonthProgress: async (year: number, month: number): Promise<DailyProgress[]> => {
    return await calendarService.getMonthProgress(year, month);
  },

  getUserMonthProgress: async (
    userId: string,
    year: number,
    month: number
  ): Promise<DailyProgress[]> => {
    return await calendarService.getUserMonthProgress(userId, year, month);
  },
};

// Re-export types
export type { DailyProgress };
