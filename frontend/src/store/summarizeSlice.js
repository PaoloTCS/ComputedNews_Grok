import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { summarizeXPosts as summarizeXPostsApi } from '../services/apiService';

export const summarizeXPosts = createAsyncThunk(
  'summaries/summarizeXPosts',
  async ({ domainId, posts }, { rejectWithValue }) => {
    try {
      const data = await summarizeXPostsApi(domainId, posts);
      return data.summary;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const summarizeSlice = createSlice({
  name: 'summaries',
  initialState: {
    summary: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(summarizeXPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(summarizeXPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(summarizeXPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Failed to summarize X posts. Please try again.';
      });
  },
});

export default summarizeSlice.reducer;