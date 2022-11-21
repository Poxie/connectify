import { createSelector } from '@reduxjs/toolkit';
import { Comment } from '../../types';
import { RootState } from "../store";

const selectId = (_:any, id?: number) => id;
const selectPosts = (state: RootState) => state.posts.posts;

export const selectPostById = createSelector(
    [selectPosts, selectId],
    (posts, id) => posts.find(post => post.id === id)
)

export const selectPostMain = createSelector(
    [selectPostById],
    post => post ? ({
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.author,
        timestamp: post.timestamp,
        privacy: post.privacy
    }) : undefined
)
export const selectPostStats = createSelector(
    [selectPostById],
    post => post ? ({
        like_count: post.like_count,
        has_liked: post.has_liked,
        comment_count: post.comment_count
    }) : undefined
)
export const selectPostCommentCount = createSelector(
    [selectPostById],
    post => post?.comment_count
)
export const selectPostAttachments = createSelector(
    [selectPostById],
    post => post?.attachments
)