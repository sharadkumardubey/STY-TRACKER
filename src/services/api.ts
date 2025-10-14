import { User } from '@/store/slices/usersSlice';
import { Topic, UserTopicProgress } from '@/store/slices/topicsSlice';
import { Result, ChartData } from '@/store/slices/resultsSlice';

// Dummy data
const dummyUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    role: 'user',
    createdAt: '2025-01-01',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1234567891',
    role: 'user',
    createdAt: '2025-01-02',
  },
];

const dummyTopics: Topic[] = [
  {
    id: 't1',
    userId: '1',
    topics: [
      { id: 'ti1', title: 'React Basics', url: 'https://example.com/react' },
      { id: 'ti2', title: 'TypeScript Fundamentals', url: 'https://example.com/ts' },
    ],
    createdAt: '2025-01-05',
  },
];

const dummyResults: Result[] = [
  {
    id: 'r1',
    userId: '1',
    userName: 'John Doe',
    topicId: 't1',
    topicTitle: 'React Basics',
    score: 85,
    completedAt: '2025-01-10T10:30:00',
    date: '2025-01-10',
  },
  {
    id: 'r2',
    userId: '2',
    userName: 'Jane Smith',
    topicId: 't1',
    topicTitle: 'TypeScript Fundamentals',
    score: 92,
    completedAt: '2025-01-11T14:20:00',
    date: '2025-01-11',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API
export const authAPI = {
  login: async (phoneOrEmail: string, password: string) => {
    await delay(500);

    // Dummy login - check if admin
    if (phoneOrEmail === 'admin' && password === 'admin') {
      return {
        id: 'admin',
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '+1234567899',
        role: 'admin' as const,
      };
    }

    // Check against dummy users
    const user = dummyUsers.find(u => u.email === phoneOrEmail || u.phone === phoneOrEmail);
    if (user) {
      return user;
    }

    throw new Error('Invalid credentials');
  },
};

// Users API
export const usersAPI = {
  getAll: async (): Promise<User[]> => {
    await delay(300);
    return [...dummyUsers];
  },

  getById: async (id: string): Promise<User | undefined> => {
    await delay(200);
    return dummyUsers.find(u => u.id === id);
  },

  create: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    await delay(400);
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    dummyUsers.push(newUser);
    return newUser;
  },

  update: async (id: string, userData: Partial<User>): Promise<User> => {
    await delay(400);
    const index = dummyUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');

    dummyUsers[index] = { ...dummyUsers[index], ...userData };
    return dummyUsers[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    const index = dummyUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      dummyUsers.splice(index, 1);
    }
  },
};

// Topics API
export const topicsAPI = {
  getAll: async (): Promise<Topic[]> => {
    await delay(300);
    return [...dummyTopics];
  },

  getByUserId: async (userId: string): Promise<Topic[]> => {
    await delay(300);
    return dummyTopics.filter(t => t.userId === userId);
  },

  create: async (topicData: Omit<Topic, 'id' | 'createdAt'>): Promise<Topic> => {
    await delay(400);
    const newTopic: Topic = {
      ...topicData,
      id: `topic_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    dummyTopics.push(newTopic);
    return newTopic;
  },

  getUserProgress: async (_userId: string): Promise<UserTopicProgress[]> => {
    await delay(300);
    // Return dummy progress data
    return [
      { topicId: 't1', topicItemId: 'ti1', completed: true, completedAt: '2025-01-10' },
      { topicId: 't1', topicItemId: 'ti2', completed: false },
    ];
  },

  updateProgress: async (progress: UserTopicProgress): Promise<UserTopicProgress> => {
    await delay(300);
    return progress;
  },
};

// Results API
export const resultsAPI = {
  getByDate: async (date: string): Promise<Result[]> => {
    await delay(300);
    return dummyResults.filter(r => r.date === date);
  },

  getChartData: async (period: 'day' | 'week' | 'month' | 'year'): Promise<ChartData[]> => {
    await delay(400);

    // Generate dummy chart data based on period
    const data: ChartData[] = [];
    const today = new Date();

    let days = 1;
    if (period === 'week') days = 7;
    else if (period === 'month') days = 30;
    else if (period === 'year') days = 365;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      data.push({
        date: dateStr,
        score: Math.floor(Math.random() * 100),
        count: Math.floor(Math.random() * 10),
      });
    }

    return data;
  },
};

// Calendar Progress API
export interface DailyProgress {
  date: string;
  userId: string;
  userName: string;
  totalTopics: number;
  completedTopics: number;
  completionPercentage: number;
}

export const calendarAPI = {
  getMonthProgress: async (year: number, month: number): Promise<DailyProgress[]> => {
    await delay(400);

    // Generate dummy progress data for the month
    const progress: DailyProgress[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      // Add progress for each user
      dummyUsers.forEach(user => {
        const totalTopics = 10;
        const completedTopics = Math.floor(Math.random() * (totalTopics + 1));

        progress.push({
          date,
          userId: user.id,
          userName: user.name,
          totalTopics,
          completedTopics,
          completionPercentage: Math.round((completedTopics / totalTopics) * 100),
        });
      });
    }

    return progress;
  },

  getUserMonthProgress: async (userId: string, year: number, month: number): Promise<DailyProgress[]> => {
    await delay(300);

    const progress: DailyProgress[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const user = dummyUsers.find(u => u.id === userId);

    if (!user) return [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const totalTopics = 10;
      const completedTopics = Math.floor(Math.random() * (totalTopics + 1));

      progress.push({
        date,
        userId: user.id,
        userName: user.name,
        totalTopics,
        completedTopics,
        completionPercentage: Math.round((completedTopics / totalTopics) * 100),
      });
    }

    return progress;
  },
};
