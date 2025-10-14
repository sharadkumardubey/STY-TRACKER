import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';
import topicsReducer from './slices/topicsSlice';
import resultsReducer from './slices/resultsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    topics: topicsReducer,
    results: resultsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
