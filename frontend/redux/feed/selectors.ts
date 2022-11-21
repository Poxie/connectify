import { RootState } from '../store';

export const selectFeedPostIds = (state: RootState) => state.feed.postIds;