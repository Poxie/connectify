import { Comment } from "../../types";
import { ADD_COMMENT, ADD_COMMENTS, ADD_COMMENT_LIKE, REMOVE_COMMENT, REMOVE_COMMENT_LIKE } from "./constants";

export const addComments = (comments: Comment[], orderType: Comment['orderType']) => ({
    type: ADD_COMMENTS,
    payload: { comments, orderType }
})
export const addComment = (comment: Comment) => ({
    type: ADD_COMMENT,
    payload: comment
})
export const removeComment = (commentId: number) => ({
    type: REMOVE_COMMENT,
    payload: commentId
})
export const addCommentLike = (commentId: number) => ({
    type: ADD_COMMENT_LIKE,
    payload: commentId
})
export const removeCommentLike = (commentId: number) => ({
    type: REMOVE_COMMENT_LIKE,
    payload: commentId
})