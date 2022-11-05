import { createSelector } from '@reduxjs/toolkit';
import { Comment } from '../../types';
import { RootState } from "../store";

const selectId = (_:any, id: number) => id;
const selectCommentId = (_:any,__:any, commentId: number) => commentId;
const selectOrderType = (_:any,__:any, orderType: Comment['orderType']) => orderType;

const selectComments = (state: RootState) => state.posts.comments;
const selectPosts = (state: RootState) => state.posts.posts;

export const selectPostById = createSelector(
    [selectPosts, selectId],
    (posts, id) => posts.find(post => post.id === id)
)
export const selectPostIsFetched = createSelector(
    [selectPostById],
    post => post !== undefined
)

export const selectCommentIds = createSelector(
    [selectComments, selectId, selectOrderType],
    (comments, postId, orderType) => 
        comments.filter(comment => comment.post_id === postId && comment.orderType === orderType)
        .map(comment => comment.id)
)
export const selectCommentById = createSelector(
    [selectComments, selectId],
    (comments, commentId) => comments.find(comment => comment.id === commentId)
)
export const selectCommentAuthor = createSelector(
    [selectCommentById],
    comment => comment?.author
)
export const selectCommentMain = createSelector(
    [selectCommentById],
    comment => comment ? ({
        content: comment.content,
        timestamp: comment.timestamp
    }) : undefined
)
export const selectCommentStats = createSelector(
    [selectCommentById],
    comment => comment ? ({
        has_liked: comment.has_liked,
        like_count: comment.like_count
    }) : undefined
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