import { RootState } from '../store';
import { createSelector } from '@reduxjs/toolkit';

export const selectFeedPostsLoading = (state: RootState) => state.feed.loading;

const selectFeedPosts = (state: RootState) => state.feed.posts;
const selectId = (_: any, id: number) => id;

export const selectFeedPostIds = createSelector(
    [selectFeedPosts],
    posts => posts.map(post => post.id)
)
export const selectFeedPost = createSelector(
    [selectFeedPosts, selectId],
    (posts, postId) => posts.find(post => post.id === postId)
)