import { configureStore } from '@reduxjs/toolkit';
import domainReducer from './domainSlice';
import xpostReducer from './xpostSlice';
import summarizeReducer from './summarizeSlice';

export default configureStore({
  reducer: {
    domains: domainReducer,
    xposts: xpostReducer,
    summaries: summarizeReducer,
  },
});