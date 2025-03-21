import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDomains as fetchDomainsApi, fetchDomainPath, addDomain as addDomainApi, deleteDomain as deleteDomainApi, updateDomainPositions } from '../services/apiService';

export const fetchDomains = createAsyncThunk(
  'domains/fetchDomains',
  async ({ parentId }, { rejectWithValue }) => {
    try {
      const data = await fetchDomainsApi(parentId);
      const path = parentId ? await fetchDomainPath(parentId) : [];
      return { ...data, path };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addDomain = createAsyncThunk(
  'domains/addDomain',
  async ({ name, parentId, description }, { rejectWithValue, dispatch }) => {
    try {
      const newDomain = await addDomainApi(name, parentId, description);
      dispatch(fetchDomains({ parentId }));
      return newDomain;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteDomain = createAsyncThunk(
  'domains/deleteDomain',
  async (domainId, { rejectWithValue, dispatch, getState }) => {
    try {
      await deleteDomainApi(domainId);
      const { currentDomainId } = getState().domains;
      if (currentDomainId === domainId) {
        dispatch(setCurrentDomainId(null));
      }
      dispatch(fetchDomains({ parentId: null }));
      return domainId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const domainSlice = createSlice({
  name: 'domains',
  initialState: {
    domains: [],
    semanticDistances: {},
    currentDomainId: null,
    path: [],
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentDomainId: (state, action) => {
      state.currentDomainId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDomains.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDomains.fulfilled, (state, action) => {
        state.loading = false;
        state.domains = action.payload.domains || [];
        state.semanticDistances = action.payload.semanticDistances || {};
        state.path = action.payload.path || [];
      })
      .addCase(fetchDomains.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Failed to fetch news topics. Please try again.';
      })
      .addCase(addDomain.rejected, (state, action) => {
        state.error = 'Failed to add news topic. Please try again.';
      })
      .addCase(deleteDomain.rejected, (state, action) => {
        state.error = 'Failed to delete news topic. Please try again.';
      });
  },
});

export const { setCurrentDomainId } = domainSlice.actions;
export default domainSlice.reducer;
