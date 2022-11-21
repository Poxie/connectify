import { Post, Comment } from "../../types";
import { ADD_COMMENT_LIKE, ADD_POST_COMMENT, ADD_POST_LIKE, REMOVE_COMMENT, REMOVE_COMMENT_LIKE, REMOVE_POST, REMOVE_POST_LIKE, SET_POST, SET_POSTS, SET_POST_COMMENTS, UPDATE_POST } from "./constants";

export const setPost = (post: Post) => ({
    type: SET_POST,
    payload: post
})
export const removePost = (postId: number) => ({
    type: REMOVE_POST,
    payload: postId
})
export const setPostComments = (postId: number, comments: Comment[], orderType: Comment['orderType']) => ({
    type: SET_POST_COMMENTS,
    payload: { postId, comments, orderType }
})
export const addPostComment = (comment: Comment) => ({
    type: ADD_POST_COMMENT,
    payload: comment
})
export const removeComment = (commentId: number) => ({
    type: REMOVE_COMMENT,
    payload: commentId
})
export const setPosts = (posts: Post[]) => ({
    type: SET_POSTS,
    payload: posts
})
export const addPostLike = (id: number) => ({
    type: ADD_POST_LIKE,
    payload: id
})
export const removePostLike = (id: number) => ({
    type: REMOVE_POST_LIKE,
    payload: id
})
export const addCommentLike = (id: number) => ({
    type: ADD_COMMENT_LIKE,
    payload: id
})
export const removeCommentLike = (id: number) => ({
    type: REMOVE_COMMENT_LIKE,
    payload: id
})
export const updatePost = (id: number, properties: Partial<Post>) => ({
    type: UPDATE_POST,
    payload: { id, properties }
})