import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchXPosts as fetchXPostsApi } from '../services/apiService';

export const fetchXPosts = createAsyncThunk(
  'xposts/fetchXPosts',
  async (domainId, { rejectWithValue }) => {
    try {
      const data = await fetchXPostsApi(domainId);
      return data.posts || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const xpostSlice = createSlice({
  name: 'xposts',
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchXPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchXPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchXPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Failed to fetch X posts. Please try again.';
      });
  },
});

export default xpostSlice.reducer;