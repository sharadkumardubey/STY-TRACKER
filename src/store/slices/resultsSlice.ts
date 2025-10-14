import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Result {
  id: string;
  userId: string;
  userName: string;
  topicId: string;
  topicTitle: string;
  score: number;
  completedAt: string;
  date: string;
}

export interface ChartData {
  date: string;
  score: number;
  count: number;
}

interface ResultsState {
  results: Result[];
  chartData: ChartData[];
  loading: boolean;
}

const initialState: ResultsState = {
  results: [],
  chartData: [],
  loading: false,
};

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    setResults: (state, action: PayloadAction<Result[]>) => {
      state.results = action.payload;
    },
    setChartData: (state, action: PayloadAction<ChartData[]>) => {
      state.chartData = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setResults, setChartData, setLoading } = resultsSlice.actions;
export default resultsSlice.reducer;
