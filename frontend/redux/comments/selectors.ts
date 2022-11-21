import { createSelector } from "@reduxjs/toolkit";
import { Comment } from "../../types";
import { RootState } from "../store";

const selectId = (_:any, id: number) => id;
const selectOrderType = (_:any,__:any, orderType: Comment['orderType']) => orderType;

const selectComments = (state: RootState) => state.comments.comments;

export const selectCommentsByPost = createSelector(
    [selectComments, selectId],
    (comments, postId) => comments.filter(comment => comment.post_id === postId)
)
export const selectCommentsByOrderType = createSelector(
    [selectCommentsByPost, selectOrderType],
    (comments, orderType) => comments.filter(comment => comment.orderType === orderType)
)
export const selectCommentIds = createSelector(
    [selectCommentsByOrderType],
    comments => comments.map(comment => comment.id)
)

export const selectCommentById = createSelector(
    [selectComments, selectId],
    (comments, commentId) => comments.find(comment => comment.id === commentId)
)

export const selectCommentMain = createSelector(
    [selectCommentById],
    comment => comment ? ({
        id: comment.id,
        content: comment.content,
        timestamp: comment.timestamp
    }) : undefined
)
export const selectCommentAuthor = createSelector(
    [selectCommentById],
    comment => comment?.author
)
export const selectCommentStats = createSelector(
    [selectCommentById],
    comment => comment ? ({
        like_count: comment.like_count,
        has_liked: comment.has_liked
    }) : undefined
)