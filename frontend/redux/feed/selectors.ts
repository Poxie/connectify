import { RootState } from '../store';
import { createSelector } from '@reduxjs/toolkit';

export const selectFeedPostsLoading = (state: RootState) => state.feed.loading;
export const selectFeedPostIds = (state: RootState) => state.feed.postIds;