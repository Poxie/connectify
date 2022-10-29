import { createSelector } from '@reduxjs/toolkit';
import { RootState } from "../store";

const selectId = (_:any, id: number) => id;
const selectCommentId = (_:any,__:any, commentId: number) => commentId;

const selectComments = (state: RootState) => state.posts.comments;

export const selectPostById = (state: RootState, postId: number) => state.posts.posts.find(post => post.id === postId);
export const selectPostHasLoadedComments = (state: RootState, postId: number) => state.posts.posts.find(post => post.id === postId)?.hasCommentsFetched
export const selectPostCommentIds = createSelector(
    [selectComments, selectId],
    (comments, postId) => 
        comments.filter(comment => comment.post_id === postId)
        .map(comment => comment.id)
)
export const selectCommentById = createSelector(
    [selectComments, selectId],
    (comments, commentId) => comments.find(comment => comment.id === commentId)
)
export const selectPostMain = createSelector(
    [selectPostById],
    post => post ? ({
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.author,
        timestamp: post.timestamp
    }) : undefined
)
export const selectPostStats = createSelector(
    [selectPostById],
    post => ({
        like_count: post?.like_count,
        has_liked: post?.has_liked,
        comment_count: post?.comment_count
    })
)
export const selectPostCommentCount = createSelector(
    [selectPostById],
    post => post?.comment_count
)