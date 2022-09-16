import { createSelector } from '@reduxjs/toolkit';
import { RootState } from "../store";

const selectCommentId = (_:any,__:any, commentId: number) => commentId;

export const selectPostById = (state: RootState, postId: number) => state.posts.posts[postId];
export const selectCommentIds = createSelector(
    [selectPostById],
    post => post?.comments?.map(comment => comment.id)
)
export const selectCommentById = createSelector(
    [selectPostById, selectCommentId],
    (post, commentId) => post?.comments?.find(comment => comment.id === commentId)
)
export const selectPostHasLoadedComments = createSelector(
    [selectPostById],
    post => post?.comments !== undefined
)