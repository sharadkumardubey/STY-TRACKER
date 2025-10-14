import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TopicItem {
  id: string;
  title: string;
  url: string;
}

export interface Topic {
  id: string;
  userId: string;
  topics: TopicItem[];
  createdAt: string;
}

export interface UserTopicProgress {
  topicId: string;
  topicItemId: string;
  completed: boolean;
  completedAt?: string;
}

interface TopicsState {
  topics: Topic[];
  userProgress: UserTopicProgress[];
  loading: boolean;
}

const initialState: TopicsState = {
  topics: [],
  userProgress: [],
  loading: false,
};

const topicsSlice = createSlice({
  name: 'topics',
  initialState,
  reducers: {
    setTopics: (state, action: PayloadAction<Topic[]>) => {
      state.topics = action.payload;
    },
    addTopic: (state, action: PayloadAction<Topic>) => {
      state.topics.push(action.payload);
    },
    setUserProgress: (state, action: PayloadAction<UserTopicProgress[]>) => {
      state.userProgress = action.payload;
    },
    updateTopicProgress: (state, action: PayloadAction<UserTopicProgress>) => {
      const index = state.userProgress.findIndex(
        p => p.topicId === action.payload.topicId && p.topicItemId === action.payload.topicItemId
      );
      if (index !== -1) {
        state.userProgress[index] = action.payload;
      } else {
        state.userProgress.push(action.payload);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setTopics, addTopic, setUserProgress, updateTopicProgress, setLoading } = topicsSlice.actions;
export default topicsSlice.reducer;
